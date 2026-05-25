from rest_framework import serializers
from .models import Project, Team, TeamMember
from enrollments.serializers import EnrollmentSerializer


class ProjectSerializer(serializers.ModelSerializer):
    mentor_email      = serializers.EmailField(source='mentor.email', read_only=True)
    project_type_label = serializers.CharField(
        source='get_project_type_display', read_only=True
    )
    document          = serializers.FileField(required=False, allow_null=True)
    document_url      = serializers.SerializerMethodField(read_only=True)
    enrollments       = EnrollmentSerializer(many=True, read_only=True)

    class Meta:
        model  = Project
        fields = (
            'id', 'title', 'description',
            'mentor', 'mentor_email',
            'status',
            'project_type', 'project_type_label',
            'industry_name', 'deadline',
            'document', 'document_url',
            'enrollments',
            'created_at',
        )
        read_only_fields = (
            'id', 'mentor', 'mentor_email',
            'project_type_label', 'created_at',
            'document_url', 'enrollments',
        )

    def get_document_url(self, obj):
        if obj.document:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.document.url) if request else obj.document.url
        return None

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            rep.pop('enrollments', None)
            return rep

        is_mentor = request.user == instance.mentor
        is_enrolled = instance.enrollments.filter(student=request.user).exists()
        if not (is_mentor or is_enrolled):
            rep.pop('enrollments', None)
        return rep

    def validate_document(self, file):
        if not file:
            return file
        
        # If it is a string (e.g. empty string or "null" from frontend to clear the file)
        if isinstance(file, str):
            if file.lower() in ('', 'null', 'none'):
                return None
            return file

        name = file.name.lower()
        ext  = name.rsplit('.', 1)[-1] if '.' in name else ''
        allowed_extensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f'Unsupported file type ".{ext}". Allowed: {", ".join(allowed_extensions)}.'
            )
        max_file_size_mb = 20
        if file.size > max_file_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f'File too large. Maximum allowed: {max_file_size_mb} MB.'
            )
        return file

    def validate(self, attrs):
        project_type  = attrs.get('project_type',  self.instance.project_type  if self.instance else Project.ProjectType.ACADEMIC)
        industry_name = attrs.get('industry_name', self.instance.industry_name if self.instance else '')

        # Industry projects must have a company name
        if project_type == Project.ProjectType.INDUSTRY and not industry_name.strip():
            raise serializers.ValidationError(
                {'industry_name': 'Industry name is required for industry projects.'}
            )

        # Academic projects should not have an industry name
        if project_type == Project.ProjectType.ACADEMIC:
            attrs['industry_name'] = ''

        return attrs

    def validate_status(self, value):
        if value not in (Project.Status.OPEN, Project.Status.CLOSED):
            raise serializers.ValidationError('status must be "open" or "closed".')
        return value


class TeamMemberSerializer(serializers.ModelSerializer):
    role_label = serializers.CharField(source='get_role_display', read_only=True)
    invitation_status_label = serializers.CharField(source='get_invitation_status_display', read_only=True)

    class Meta:
        model = TeamMember
        fields = (
            'id', 'team', 'user', 'name', 'email', 'roll_number', 
            'department', 'role', 'role_label', 'invitation_status', 
            'invitation_status_label', 'joined_at'
        )
        read_only_fields = ('id', 'team', 'user', 'role_label', 'invitation_status_label', 'joined_at')

    def validate_role(self, value):
        if value not in TeamMember.Role.values:
            raise serializers.ValidationError(f"Invalid role choices. Allowed: {TeamMember.Role.values}")
        return value


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)
    leader_email = serializers.EmailField(source='leader.email', read_only=True)

    class Meta:
        model = Team
        fields = ('id', 'name', 'leader', 'leader_email', 'members', 'created_at', 'updated_at')
        read_only_fields = ('id', 'leader', 'leader_email', 'created_at', 'updated_at')