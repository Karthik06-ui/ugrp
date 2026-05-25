from django.urls import path
from .views import StudentEnrollmentListView

urlpatterns = [
    path('student/enrollments/', StudentEnrollmentListView.as_view(), name='student-enrollments'),
    path('my-enrollments/',      StudentEnrollmentListView.as_view(), name='my-enrollments'),
]