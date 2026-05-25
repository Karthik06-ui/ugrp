from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import Proposal
from projects.serializers import TeamSerializer

ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
MAX_FILE_SIZE_MB   = 5


class ProposalCreateSerializer(serializers.ModelSerializer):
    """
    Used by students to submit a new proposal.
    Accepts multipart/form-data when an attachment is included.
    Includes all applicant detail fields.
    """
    attachment     = serializers.FileField(required=False, allow_null=True)
    attachment_url = serializers.SerializerMethodField(read_only=True)
    project_title  = serializers.CharField(source='project.title', read_only=True)
    team           = TeamSerializer(read_only=True)
    team_name      = serializers.CharField(write_only=True, required=False, allow_blank=True)
    members        = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model  = Proposal
        fields = (
            'id', 'project', 'project_title',
            # Applicant details
            'applicant_name', 'applicant_roll_no', 'applicant_contact',
            'applicant_email', 'applicant_department', 'applicant_year',
            # Proposal content
            'message', 'attachment', 'attachment_url',
            'status', 'mentor_feedback', 'is_draft',
            'application_type', 'team', 'team_name', 'members',
            'created_at', 'updated_at',
        )
        read_only_fields = (
            'id', 'project_title', 'status', 'mentor_feedback',
            'created_at', 'updated_at', 'attachment_url', 'team',
        )

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.attachment.url) if request else obj.attachment.url
        return None

    def validate_attachment(self, file):
        if not file:
            return file
        name = file.name.lower()
        ext  = name.rsplit('.', 1)[-1] if '.' in name else ''
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f'Unsupported file type ".{ext}". Allowed: {", ".join(ALLOWED_EXTENSIONS)}.'
            )
        if file.size > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise serializers.ValidationError(
                f'File too large. Maximum allowed: {MAX_FILE_SIZE_MB} MB.'
            )
        return file

    def validate_applicant_contact(self, value):
        if value:
            digits = ''.join(filter(str.isdigit, value))
            if len(digits) < 10:
                raise serializers.ValidationError(
                    'Enter a valid contact number (minimum 10 digits).'
                )
        return value

    def validate(self, attrs):
        student = self.context['request'].user
        project = attrs.get('project', self.instance.project if self.instance else None)
        is_draft = attrs.get('is_draft', self.instance.is_draft if self.instance else False)
        application_type = attrs.get('application_type', self.instance.application_type if self.instance else 'individual')

        if not project:
            raise serializers.ValidationError({'project': 'This field is required.'})

        if project.status != 'open':
            raise serializers.ValidationError(
                {'project': 'This project is not accepting proposals right now.'}
            )

        # Require attachment if it is not a draft
        attachment = attrs.get('attachment', self.instance.attachment if self.instance else None)
        if not is_draft and not attachment:
            raise serializers.ValidationError({'attachment': 'No file was submitted.'})

        active_query = Proposal.objects.filter(
            student=student,
            project=project,
            status__in=[Proposal.Status.PENDING, Proposal.Status.ACCEPTED]
        )
        if self.instance:
            active_query = active_query.exclude(pk=self.instance.pk)
        
        if active_query.exists():
            raise serializers.ValidationError(
                {'non_field_errors': 'You already have an active proposal for this project.'}
            )

        # Team validation
        if application_type == 'team':
            team_name = attrs.get('team_name', '')
            members_data = attrs.get('members', [])

            if isinstance(members_data, str):
                import json
                try:
                    members_data = json.loads(members_data)
                except Exception:
                    raise serializers.ValidationError({'members': 'Invalid JSON format.'})

            if not is_draft:
                if not team_name or not team_name.strip():
                    raise serializers.ValidationError({'team_name': 'Team name is required.'})
                
                total_size = 1 + len(members_data)
                if total_size < 2 or total_size > 10:
                    raise serializers.ValidationError(
                        {'members': f'Team size must be between 2 and 10 members. Current size: {total_size}.'}
                    )

            leader_email = student.email.strip().lower()
            emails = [leader_email]
            for idx, member in enumerate(members_data):
                email = member.get('email', '').strip().lower()
                if not email:
                    if not is_draft:
                        raise serializers.ValidationError({'members': f'Email is required for member at index {idx}.'})
                else:
                    if email in emails:
                        raise serializers.ValidationError(
                            {'members': f'Duplicate email found: {email}. Each team member must have a unique email.'}
                        )
                    emails.append(email)

            User = get_user_model()
            for email in emails:
                try:
                    user_obj = User.objects.get(email__iexact=email)
                    
                    lead_active = Proposal.objects.filter(
                        student=user_obj,
                        project=project,
                        status__in=[Proposal.Status.PENDING, Proposal.Status.ACCEPTED]
                    )
                    if self.instance:
                        lead_active = lead_active.exclude(pk=self.instance.pk)
                    
                    if lead_active.exists():
                        raise serializers.ValidationError(
                            {'non_field_errors': f'User with email {email} already has an active proposal on this project.'}
                        )
                    
                    member_active = Proposal.objects.filter(
                        project=project,
                        status__in=[Proposal.Status.PENDING, Proposal.Status.ACCEPTED],
                        team__members__email__iexact=email
                    )
                    if self.instance:
                        member_active = member_active.exclude(pk=self.instance.pk)
                        
                    if member_active.exists():
                        raise serializers.ValidationError(
                            {'non_field_errors': f'User with email {email} is already a member of a team with an active proposal on this project.'}
                        )
                except User.DoesNotExist:
                    member_active = Proposal.objects.filter(
                        project=project,
                        status__in=[Proposal.Status.PENDING, Proposal.Status.ACCEPTED],
                        team__members__email__iexact=email
                    )
                    if self.instance:
                        member_active = member_active.exclude(pk=self.instance.pk)
                        
                    if member_active.exists():
                        raise serializers.ValidationError(
                            {'non_field_errors': f'Email {email} is already registered in an active proposal for this project.'}
                        )

            attrs['members'] = members_data
            attrs['team_name'] = team_name

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        student = self.context['request'].user
        application_type = validated_data.get('application_type', 'individual')
        is_draft = validated_data.get('is_draft', False)
        
        team_name = validated_data.pop('team_name', '')
        members_data = validated_data.pop('members', [])
        
        proposal = Proposal(**validated_data)
        proposal.student = student
        
        if application_type == 'team':
            from projects.models import Team, TeamMember
            team = Team.objects.create(name=team_name, leader=student)
            
            for m in members_data:
                User = get_user_model()
                email = m.get('email', '').strip().lower()
                user = None
                try:
                    user = User.objects.get(email__iexact=email)
                except User.DoesNotExist:
                    pass
                
                TeamMember.objects.create(
                    team=team,
                    user=user,
                    name=m.get('name', ''),
                    email=email,
                    roll_number=m.get('roll_number', ''),
                    department=m.get('department', ''),
                    role=m.get('role', 'other'),
                    invitation_status='accepted'
                )
            proposal.team = team
            
        proposal.save()
        
        if not is_draft:
            from proposals.signals import proposal_submitted
            proposal_submitted.send(sender=Proposal, proposal=proposal)
            
        return proposal

    @transaction.atomic
    def update(self, instance, validated_data):
        application_type = validated_data.get('application_type', instance.application_type)
        is_draft = validated_data.get('is_draft', instance.is_draft)
        
        team_name = validated_data.pop('team_name', '')
        members_data = validated_data.pop('members', None)
        
        proposal = super().update(instance, validated_data)
        
        if application_type == 'team':
            from projects.models import Team, TeamMember
            if not proposal.team:
                proposal.team = Team.objects.create(name=team_name, leader=proposal.student)
                proposal.save()
            else:
                proposal.team.name = team_name
                proposal.team.save()
                
            if members_data is not None:
                proposal.team.members.all().delete()
                for m in members_data:
                    User = get_user_model()
                    email = m.get('email', '').strip().lower()
                    user = None
                    try:
                        user = User.objects.get(email__iexact=email)
                    except User.DoesNotExist:
                        pass
                    
                    TeamMember.objects.create(
                        team=proposal.team,
                        user=user,
                        name=m.get('name', ''),
                        email=email,
                        roll_number=m.get('roll_number', ''),
                        department=m.get('department', ''),
                        role=m.get('role', 'other'),
                        invitation_status='accepted'
                    )
        elif application_type == 'individual' and proposal.team:
            team_to_delete = proposal.team
            proposal.team = None
            proposal.save()
            team_to_delete.delete()
            
        if not is_draft:
            from proposals.signals import proposal_submitted
            proposal_submitted.send(sender=Proposal, proposal=proposal)
            
        return proposal


class ProposalListSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for mentors — shows full applicant details
    so mentors can evaluate without visiting the student profile.
    """
    student_email        = serializers.EmailField(source='student.email',  read_only=True)
    project_title        = serializers.CharField(source='project.title',   read_only=True)
    attachment_url       = serializers.SerializerMethodField(read_only=True)
    applicant_year_label = serializers.CharField(
        source='get_applicant_year_display', read_only=True
    )
    team                 = TeamSerializer(read_only=True)

    class Meta:
        model  = Proposal
        fields = (
            'id',
            'student', 'student_email',
            'project', 'project_title',
            # Applicant details
            'applicant_name', 'applicant_roll_no', 'applicant_contact',
            'applicant_email', 'applicant_department',
            'applicant_year', 'applicant_year_label',
            # Proposal content
            'message', 'attachment', 'attachment_url',
            'status', 'mentor_feedback', 'is_draft',
            'application_type', 'team',
            'created_at', 'updated_at',
        )
        read_only_fields = fields

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.attachment.url) if request else obj.attachment.url
        return None


class ProposalStatusUpdateSerializer(serializers.ModelSerializer):
    """Mentor accept / reject — status only."""

    class Meta:
        model  = Proposal
        fields = ('id', 'status', 'mentor_feedback', 'updated_at')
        read_only_fields = ('id', 'updated_at')

    def validate_status(self, value):
        if value not in (Proposal.Status.ACCEPTED, Proposal.Status.REJECTED):
            raise serializers.ValidationError(
                f'Status can only be "accepted" or "rejected". Got: "{value}".'
            )
        return value

    def validate(self, attrs):
        if self.instance and self.instance.status != Proposal.Status.PENDING:
            raise serializers.ValidationError(
                f'This proposal is already "{self.instance.status}" and cannot be changed.'
            )
        return attrs