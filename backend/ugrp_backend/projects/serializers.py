from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    mentor_email      = serializers.EmailField(source='mentor.email', read_only=True)
    project_type_label = serializers.CharField(
        source='get_project_type_display', read_only=True
    )
    document          = serializers.FileField(required=False, allow_null=True)
    document_url      = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = Project
        fields = (
            'id', 'title', 'description',
            'mentor', 'mentor_email',
            'status',
            'project_type', 'project_type_label',
            'industry_name', 'deadline',
            'document', 'document_url',
            'created_at',
        )
        read_only_fields = (
            'id', 'mentor', 'mentor_email',
            'project_type_label', 'created_at',
            'document_url',
        )

    def get_document_url(self, obj):
        if obj.document:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.document.url) if request else obj.document.url
        return None

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