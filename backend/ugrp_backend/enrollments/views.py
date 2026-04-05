from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsStudent
from .models import Enrollment
from .serializers import EnrollmentSerializer


class StudentEnrollmentListView(generics.ListAPIView):
    """
    GET /api/student/enrollments/
    Students only — returns all projects the authenticated student
    has been enrolled in (i.e. proposals that were accepted).
    """
    serializer_class   = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return (
            Enrollment.objects
            .filter(student=self.request.user)
            .select_related('student', 'project', 'project__mentor')
        )