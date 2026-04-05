from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from enrollments.models import Enrollment
from proposals.models import Proposal
from projects.models import Project
from accounts.permissions import IsStudent, IsMentor

from .models import Task, Review, Remark
from .serializers import (
    TaskSerializer,
    TaskCreateSerializer,
    TaskStatusUpdateSerializer,
    ReviewSerializer,
    ReviewCreateSerializer,
    ReviewUpdateSerializer,
    RemarkSerializer,
    RemarkCreateSerializer,
    StudentDashboardSerializer,
    MentorDashboardSerializer,
    MentorProjectStatsSerializer,
)


# =============================================================================
#  TASK VIEWS
# =============================================================================

class TaskCreateView(generics.CreateAPIView):
    """
    POST /api/tasks/
    Mentor creates a task and assigns it to an enrolled student.
    """
    serializer_class   = TaskCreateSerializer
    permission_classes = [IsAuthenticated, IsMentor]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response(
            TaskSerializer(task).data,
            status=status.HTTP_201_CREATED,
        )


class TaskListView(generics.ListAPIView):
    """
    GET /api/tasks/?project=<id>
    - Mentor: sees all tasks for their project
    - Student: sees only tasks assigned to them (optionally filtered by project)
    """
    serializer_class   = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user       = self.request.user
        project_id = self.request.query_params.get('project')
        status_val = self.request.query_params.get('status')

        if user.is_mentor:
            qs = Task.objects.filter(
                project__mentor=user
            ).select_related('assigned_to', 'assigned_to__student_profile', 'project')
        else:
            qs = Task.objects.filter(
                assigned_to=user
            ).select_related('assigned_to', 'assigned_to__student_profile', 'project')

        if project_id:
            qs = qs.filter(project_id=project_id)
        if status_val:
            qs = qs.filter(status=status_val)

        return qs


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/tasks/<id>/  — both roles (must be mentor-owner or assigned student)
    PATCH  /api/tasks/<id>/  — mentor updates anything; student updates status only
    DELETE /api/tasks/<id>/  — mentor only
    """
    permission_classes = [IsAuthenticated]
    http_method_names  = ['get', 'patch', 'delete']

    def get_queryset(self):
        user = self.request.user
        if user.is_mentor:
            return Task.objects.filter(project__mentor=user)
        return Task.objects.filter(assigned_to=user)

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            if self.request.user.is_student:
                return TaskStatusUpdateSerializer
            return TaskCreateSerializer
        return TaskSerializer

    def destroy(self, request, *args, **kwargs):
        if request.user.is_student:
            raise PermissionDenied('Only mentors can delete tasks.')
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


# =============================================================================
#  REVIEW VIEWS
# =============================================================================

class ReviewCreateView(generics.CreateAPIView):
    """
    POST /api/reviews/
    Mentor writes a review for an enrolled student on their project.
    """
    serializer_class   = ReviewCreateSerializer
    permission_classes = [IsAuthenticated, IsMentor]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED,
        )


class ReviewListView(generics.ListAPIView):
    """
    GET /api/reviews/?project=<id>
    - Mentor: all reviews they have written (optionally filtered by project)
    - Student: all reviews they have received (optionally filtered by project)
    """
    serializer_class   = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user       = self.request.user
        project_id = self.request.query_params.get('project')

        if user.is_mentor:
            qs = Review.objects.filter(mentor=user)
        else:
            qs = Review.objects.filter(student=user)

        if project_id:
            qs = qs.filter(project_id=project_id)

        return qs.select_related('mentor', 'student', 'student__student_profile', 'project')


class ReviewDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/reviews/<id>/  — both roles (mentor who wrote it or student it's about)
    PATCH /api/reviews/<id>/  — mentor who wrote it only
    """
    permission_classes = [IsAuthenticated]
    http_method_names  = ['get', 'patch']

    def get_queryset(self):
        user = self.request.user
        if user.is_mentor:
            return Review.objects.filter(mentor=user)
        return Review.objects.filter(student=user)

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return ReviewUpdateSerializer
        return ReviewSerializer

    def update(self, request, *args, **kwargs):
        if request.user.is_student:
            raise PermissionDenied('Students cannot edit reviews.')
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


# =============================================================================
#  REMARK VIEWS
# =============================================================================

class RemarkCreateView(generics.CreateAPIView):
    """
    POST /api/remarks/
    Either an owning mentor or an enrolled student can post a remark.
    """
    serializer_class   = RemarkCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        remark = serializer.save()
        return Response(
            RemarkSerializer(remark).data,
            status=status.HTTP_201_CREATED,
        )


class RemarkListView(generics.ListAPIView):
    """
    GET /api/remarks/?project=<id>
    List all remarks on projects accessible to the caller.
    Filtering by project is strongly recommended.
    """
    serializer_class   = RemarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user       = self.request.user
        project_id = self.request.query_params.get('project')

        if user.is_mentor:
            qs = Remark.objects.filter(project__mentor=user)
        else:
            enrolled_project_ids = Enrollment.objects.filter(
                student=user
            ).values_list('project_id', flat=True)
            qs = Remark.objects.filter(project_id__in=enrolled_project_ids)

        if project_id:
            qs = qs.filter(project_id=project_id)

        return qs.select_related('author', 'project')


class RemarkDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/remarks/<id>/
    Only the author of the remark can delete it.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only delete their own remarks
        return Remark.objects.filter(author=self.request.user)


# =============================================================================
#  DASHBOARD VIEWS  (consolidated)
# =============================================================================

class StudentDashboardView(APIView):
    """
    GET /api/student/dashboard/
    Returns a complete snapshot of everything relevant to the logged-in student:
      - Summary counts
      - Active enrollments
      - Pending proposals
      - Assigned tasks (grouped by status)
      - Recent remarks on enrolled projects
      - Reviews received
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        user = request.user

        # ── Data fetching ────────────────────────────────────────────────────
        enrollments = (
            Enrollment.objects
            .filter(student=user)
            .select_related('project', 'project__mentor')
        )

        enrolled_project_ids = enrollments.values_list('project_id', flat=True)

        pending_proposals = (
            Proposal.objects
            .filter(student=user, status=Proposal.Status.PENDING)
            .select_related('project')
        )

        assigned_tasks = (
            Task.objects
            .filter(assigned_to=user)
            .select_related('project', 'assigned_to__student_profile')
        )

        recent_remarks = (
            Remark.objects
            .filter(project_id__in=enrolled_project_ids)
            .select_related('author', 'project')
            .order_by('-created_at')[:20]
        )

        reviews_received = (
            Review.objects
            .filter(student=user)
            .select_related('mentor', 'project')
        )

        # ── Payload assembly ─────────────────────────────────────────────────
        ctx = {'request': request}
        data = {
            # Summary counts
            'total_enrollments':     enrollments.count(),
            'pending_proposals':     pending_proposals.count(),
            'tasks_todo':            assigned_tasks.filter(status=Task.Status.TODO).count(),
            'tasks_in_progress':     assigned_tasks.filter(status=Task.Status.IN_PROGRESS).count(),
            'tasks_done':            assigned_tasks.filter(status=Task.Status.DONE).count(),

            # Detail lists
            'enrollments':           enrollments,
            'pending_proposal_list': pending_proposals,
            'assigned_tasks':        assigned_tasks,
            'recent_remarks':        recent_remarks,
            'reviews_received':      reviews_received,
        }

        serializer = StudentDashboardSerializer(data, context=ctx)
        return Response(serializer.data)


class MentorDashboardView(APIView):
    """
    GET /api/mentor/dashboard/
    Returns a complete snapshot for the logged-in mentor:
      - Summary counts (projects, open projects, pending proposals, enrolled students)
      - Per-project stats (enrollment count, pending proposals, task progress)
      - Recent pending proposals (across all projects)
      - Recent remarks (across all projects)
    """
    permission_classes = [IsAuthenticated, IsMentor]

    def get(self, request):
        user = request.user

        # ── Data fetching ────────────────────────────────────────────────────
        projects = (
            Project.objects
            .filter(mentor=user)
            .prefetch_related('enrollments', 'proposals', 'tasks')
        )

        project_ids = projects.values_list('id', flat=True)

        total_pending = (
            Proposal.objects
            .filter(project_id__in=project_ids, status=Proposal.Status.PENDING)
            .count()
        )

        total_enrolled = (
            Enrollment.objects
            .filter(project_id__in=project_ids)
            .count()
        )

        recent_proposals = (
            Proposal.objects
            .filter(project_id__in=project_ids, status=Proposal.Status.PENDING)
            .select_related('student', 'student__student_profile', 'project')
            .order_by('-created_at')[:10]
        )

        recent_remarks = (
            Remark.objects
            .filter(project_id__in=project_ids)
            .select_related('author', 'project')
            .order_by('-created_at')[:20]
        )

        # ── Payload assembly ─────────────────────────────────────────────────
        ctx = {'request': request}
        data = {
            # Summary counts
            'total_projects':            projects.count(),
            'open_projects':             projects.filter(status=Project.Status.OPEN).count(),
            'total_pending_proposals':   total_pending,
            'total_enrolled_students':   total_enrolled,

            # Detail lists
            'projects':          projects,
            'recent_proposals':  recent_proposals,
            'recent_remarks':    recent_remarks,
        }

        serializer = MentorDashboardSerializer(data, context=ctx)
        return Response(serializer.data)