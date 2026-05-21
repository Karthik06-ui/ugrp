from rest_framework import serializers
from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    """
    Read-only serializer — enrollments are created by the system,
    never directly by the user.
    """
    student_email = serializers.EmailField(source='student.email',   read_only=True)
    project_title = serializers.CharField(source='project.title',    read_only=True)
    project_status = serializers.CharField(source='project.status',  read_only=True)
    mentor_email   = serializers.EmailField(source='project.mentor.email', read_only=True)

    class Meta:
        model  = Enrollment
        fields = (
            'id',
            'student', 'student_email',
            'project', 'project_title', 'project_status', 'mentor_email',
            'joined_at',
        )
        read_only_fields = fields