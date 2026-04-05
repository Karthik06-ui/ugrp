from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    mentor_email = serializers.EmailField(source='mentor.email', read_only=True)

    class Meta:
        model  = Project
        fields = (
            'id', 'title', 'description',
            'mentor', 'mentor_email',
            'domain',       
            'status', 'created_at',
        )
        read_only_fields = ('id', 'mentor', 'mentor_email', 'created_at')

    def validate_status(self, value):
        if value not in (Project.Status.OPEN, Project.Status.CLOSED):
            raise serializers.ValidationError('status must be "open" or "closed".')
        return value