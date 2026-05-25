from rest_framework import serializers
from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    """
    Read-only serializer — enrollments are created by the system,
    never directly by the user.
    """
    student_email = serializers.EmailField(source='student.email',   read_only=True)
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    student_department = serializers.SerializerMethodField(read_only=True)
    project_title = serializers.CharField(source='project.title',    read_only=True)
    project_status = serializers.CharField(source='project.status',  read_only=True)
    mentor_email   = serializers.EmailField(source='project.mentor.email', read_only=True)
    is_team = serializers.SerializerMethodField(read_only=True)
    team_name      = serializers.SerializerMethodField(read_only=True)
    team_leader_email = serializers.SerializerMethodField(read_only=True)
    team_leader_name = serializers.SerializerMethodField(read_only=True)
    team_leader_roll_number = serializers.SerializerMethodField(read_only=True)
    team_leader_department = serializers.SerializerMethodField(read_only=True)
    proposal_status = serializers.SerializerMethodField(read_only=True)
    member_roles   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = Enrollment
        fields = (
            'id',
            'student', 'student_email', 'student_name', 'student_roll_number', 'student_department',
            'project', 'project_title', 'project_status', 'mentor_email',
            'is_team', 'team_name',
            'team_leader_email', 'team_leader_name',
            'team_leader_roll_number', 'team_leader_department',
            'proposal_status', 'member_roles',
            'joined_at',
        )
        read_only_fields = fields

    def _get_proposal(self, obj):
        if not hasattr(self, '_proposal_cache'):
            self._proposal_cache = {}
        key = (obj.student_id, obj.project_id)
        if key not in self._proposal_cache:
            from proposals.models import Proposal
            from django.db.models import Q
            proposal = Proposal.objects.filter(
                project=obj.project,
                status='accepted'
            ).filter(
                Q(student=obj.student) | Q(team__members__user=obj.student) | Q(team__members__email__iexact=obj.student.email)
            ).select_related('team').prefetch_related('team__members').first()
            self._proposal_cache[key] = proposal
        return self._proposal_cache[key]

    def get_student_name(self, obj):
        prop = self._get_proposal(obj)
        if prop:
            if prop.application_type == 'team' and prop.team:
                if prop.student_id == obj.student_id:
                    return prop.applicant_name or (obj.student.student_profile.name if hasattr(obj.student, 'student_profile') else '')
                member = prop.team.members.filter(user=obj.student).first()
                if not member:
                    member = prop.team.members.filter(email__iexact=obj.student.email).first()
                if member:
                    return member.name
            return prop.applicant_name or (obj.student.student_profile.name if hasattr(obj.student, 'student_profile') else '')
        return obj.student.student_profile.name if hasattr(obj.student, 'student_profile') else ''

    def get_student_roll_number(self, obj):
        prop = self._get_proposal(obj)
        if prop:
            if prop.application_type == 'team' and prop.team:
                if prop.student_id == obj.student_id:
                    return prop.applicant_roll_no or (obj.student.student_profile.roll_number if hasattr(obj.student, 'student_profile') else '')
                member = prop.team.members.filter(user=obj.student).first()
                if not member:
                    member = prop.team.members.filter(email__iexact=obj.student.email).first()
                if member:
                    return member.roll_number
            return prop.applicant_roll_no or (obj.student.student_profile.roll_number if hasattr(obj.student, 'student_profile') else '')
        return obj.student.student_profile.roll_number if hasattr(obj.student, 'student_profile') else ''

    def get_student_department(self, obj):
        prop = self._get_proposal(obj)
        if prop:
            if prop.application_type == 'team' and prop.team:
                if prop.student_id == obj.student_id:
                    return prop.applicant_department or (obj.student.student_profile.department if hasattr(obj.student, 'student_profile') else '')
                member = prop.team.members.filter(user=obj.student).first()
                if not member:
                    member = prop.team.members.filter(email__iexact=obj.student.email).first()
                if member:
                    return member.department
            return prop.applicant_department or (obj.student.student_profile.department if hasattr(obj.student, 'student_profile') else '')
        return obj.student.student_profile.department if hasattr(obj.student, 'student_profile') else ''

    def get_is_team(self, obj):
        prop = self._get_proposal(obj)
        return (prop.application_type == 'team') if prop else False

    def get_team_name(self, obj):
        prop = self._get_proposal(obj)
        if prop and prop.application_type == 'team' and prop.team:
            return prop.team.name
        return None

    def get_team_leader_email(self, obj):
        prop = self._get_proposal(obj)
        return prop.student.email if prop and prop.student else None

    def get_team_leader_name(self, obj):
        prop = self._get_proposal(obj)
        if prop:
            return prop.applicant_name or (prop.student.student_profile.name if prop.student and hasattr(prop.student, 'student_profile') else '')
        return None

    def get_team_leader_roll_number(self, obj):
        prop = self._get_proposal(obj)
        if prop:
            return prop.applicant_roll_no or (prop.student.student_profile.roll_number if prop.student and hasattr(prop.student, 'student_profile') else '')
        return None

    def get_team_leader_department(self, obj):
        prop = self._get_proposal(obj)
        if prop:
            return prop.applicant_department or (prop.student.student_profile.department if prop.student and hasattr(prop.student, 'student_profile') else '')
        return None

    def get_proposal_status(self, obj):
        prop = self._get_proposal(obj)
        return prop.status if prop else None

    def get_member_roles(self, obj):
        prop = self._get_proposal(obj)
        if prop and prop.application_type == 'team' and prop.team:
            return [
                {
                    'name': member.name,
                    'email': member.email,
                    'role': member.role,
                    'role_label': member.get_role_display(),
                    'joined': member.user_id is not None,
                    'roll_number': member.roll_number,
                    'department': member.department,
                }
                for member in prop.team.members.all()
            ]
        return None