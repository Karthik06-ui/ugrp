from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    mentor_email      = serializers.EmailField(source='mentor.email', read_only=True)
    project_type_label = serializers.CharField(
        source='get_project_type_display', read_only=True
    )

    class Meta:
        model  = Project
        fields = (
            'id', 'title', 'description',
            'mentor', 'mentor_email',
            'status',
            'project_type', 'project_type_label',
            'industry_name', 'deadline',
            'created_at',
        )
        read_only_fields = (
            'id', 'mentor', 'mentor_email',
            'project_type_label', 'created_at',
        )

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