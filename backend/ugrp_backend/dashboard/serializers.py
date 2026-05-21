from rest_framework import serializers

from enrollments.models import Enrollment
from enrollments.serializers import EnrollmentSerializer
from proposals.models import Proposal
from proposals.serializers import ProposalCreateSerializer, ProposalListSerializer
from projects.models import Project
from projects.serializers import ProjectSerializer
from .models import Task, Review, Remark


# ─────────────────────────────────────────────────────────────────────────────
#  Task serializers
# ─────────────────────────────────────────────────────────────────────────────

class TaskSerializer(serializers.ModelSerializer):
    """Full task representation — used for list and detail views."""
    assigned_to_email = serializers.EmailField(source='assigned_to.email',  read_only=True)
    assigned_to_name  = serializers.CharField(
        source='assigned_to.student_profile.name', read_only=True, default=''
    )
    created_by_email  = serializers.EmailField(source='created_by.email',   read_only=True)
    project_title     = serializers.CharField(source='project.title',        read_only=True)

    class Meta:
        model  = Task
        fields = (
            'id', 'project', 'project_title',
            'assigned_to', 'assigned_to_email', 'assigned_to_name',
            'created_by',  'created_by_email',
            'title', 'description', 'status', 'due_date',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_by', 'created_by_email', 'created_at', 'updated_at')


class TaskCreateSerializer(serializers.ModelSerializer):
    """Used by mentors to create tasks. Validates enrollment."""

    class Meta:
        model  = Task
        fields = ('id', 'project', 'assigned_to', 'title', 'description', 'status', 'due_date')
        read_only_fields = ('id',)

    def validate(self, attrs):
        project     = attrs['project']
        assigned_to = attrs['assigned_to']
        mentor      = self.context['request'].user

        # Mentor must own the project
        if project.mentor != mentor:
            raise serializers.ValidationError(
                {'project': 'You can only create tasks for your own projects.'}
            )

        # Assigned student must be enrolled in the project
        if not Enrollment.objects.filter(student=assigned_to, project=project).exists():
            raise serializers.ValidationError(
                {'assigned_to': 'This student is not enrolled in the selected project.'}
            )

        return attrs

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    """Used by students to update only the status of their assigned task."""

    class Meta:
        model  = Task
        fields = ('id', 'status', 'updated_at')
        read_only_fields = ('id', 'updated_at')

    def validate_status(self, value):
        allowed = (Task.Status.TODO, Task.Status.IN_PROGRESS, Task.Status.DONE)
        if value not in allowed:
            raise serializers.ValidationError(
                f'status must be one of: todo, in_progress, done. Got: "{value}".'
            )
        return value


# ─────────────────────────────────────────────────────────────────────────────
#  Review serializers
# ─────────────────────────────────────────────────────────────────────────────

class ReviewSerializer(serializers.ModelSerializer):
    """Full review — used for list/retrieve."""
    mentor_email  = serializers.EmailField(source='mentor.email',  read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)
    student_name  = serializers.CharField(
        source='student.student_profile.name', read_only=True, default=''
    )
    project_title = serializers.CharField(source='project.title',  read_only=True)

    class Meta:
        model  = Review
        fields = (
            'id',
            'project', 'project_title',
            'student', 'student_email', 'student_name',
            'mentor',  'mentor_email',
            'rating', 'comment',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'mentor', 'mentor_email', 'created_at', 'updated_at')


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Used by mentors to create/update a review."""

    class Meta:
        model  = Review
        fields = ('id', 'project', 'student', 'rating', 'comment')
        read_only_fields = ('id',)

    def validate(self, attrs):
        project = attrs['project']
        student = attrs['student']
        mentor  = self.context['request'].user

        # Mentor must own the project
        if project.mentor != mentor:
            raise serializers.ValidationError(
                {'project': 'You can only review students in your own projects.'}
            )

        # Student must be enrolled in the project
        if not Enrollment.objects.filter(student=student, project=project).exists():
            raise serializers.ValidationError(
                {'student': 'This student is not enrolled in the selected project.'}
            )

        return attrs

    def create(self, validated_data):
        validated_data['mentor'] = self.context['request'].user
        return super().create(validated_data)


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """Mentor edits rating/comment on an existing review."""

    class Meta:
        model  = Review
        fields = ('id', 'rating', 'comment', 'updated_at')
        read_only_fields = ('id', 'updated_at')


# ─────────────────────────────────────────────────────────────────────────────
#  Remark serializers
# ─────────────────────────────────────────────────────────────────────────────

class RemarkSerializer(serializers.ModelSerializer):
    """Full remark — used for list/retrieve."""
    author_email = serializers.EmailField(source='author.email', read_only=True)
    author_role  = serializers.CharField(source='author.role',   read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model  = Remark
        fields = (
            'id', 'project', 'project_title',
            'author', 'author_email', 'author_role',
            'content', 'created_at',
        )
        read_only_fields = ('id', 'author', 'author_email', 'author_role', 'created_at')


class RemarkCreateSerializer(serializers.ModelSerializer):
    """Used by mentors or enrolled students to post a remark."""

    class Meta:
        model  = Remark
        fields = ('id', 'project', 'content')
        read_only_fields = ('id',)

    def validate(self, attrs):
        project = attrs['project']
        user    = self.context['request'].user

        if user.is_mentor:
            # Mentor must own the project
            if project.mentor != user:
                raise serializers.ValidationError(
                    {'project': 'You can only add remarks to your own projects.'}
                )
        else:
            # Student must be enrolled in the project
            if not Enrollment.objects.filter(student=user, project=project).exists():
                raise serializers.ValidationError(
                    {'project': 'You are not enrolled in this project.'}
                )

        return attrs

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


# ─────────────────────────────────────────────────────────────────────────────
#  Dashboard serializers  (consolidated views)
# ─────────────────────────────────────────────────────────────────────────────

class StudentDashboardSerializer(serializers.Serializer):
    """
    Aggregated read-only view for the student dashboard.
    Assembled in the view — no writable fields.
    """
    # Summary counts
    total_enrollments    = serializers.IntegerField()
    pending_proposals    = serializers.IntegerField()
    tasks_todo           = serializers.IntegerField()
    tasks_in_progress    = serializers.IntegerField()
    tasks_done           = serializers.IntegerField()

    # Detail lists
    enrollments          = EnrollmentSerializer(many=True)
    pending_proposal_list = ProposalCreateSerializer(many=True)
    assigned_tasks       = TaskSerializer(many=True)
    recent_remarks       = RemarkSerializer(many=True)
    reviews_received     = ReviewSerializer(many=True)


class MentorProjectStatsSerializer(serializers.ModelSerializer):
    """Per-project stats row used inside the mentor dashboard."""
    enrolled_students   = serializers.SerializerMethodField()
    pending_proposals   = serializers.SerializerMethodField()
    tasks_total         = serializers.SerializerMethodField()
    tasks_done          = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = (
            'id', 'title', 'status', 'created_at',
            'enrolled_students', 'pending_proposals',
            'tasks_total', 'tasks_done',
        )

    def get_enrolled_students(self, obj):
        return obj.enrollments.count()

    def get_pending_proposals(self, obj):
        return obj.proposals.filter(status=Proposal.Status.PENDING).count()

    def get_tasks_total(self, obj):
        return obj.tasks.count()

    def get_tasks_done(self, obj):
        return obj.tasks.filter(status=Task.Status.DONE).count()


class MentorDashboardSerializer(serializers.Serializer):
    """
    Aggregated read-only view for the mentor dashboard.
    """
    # Summary counts
    total_projects       = serializers.IntegerField()
    open_projects        = serializers.IntegerField()
    total_pending_proposals = serializers.IntegerField()
    total_enrolled_students = serializers.IntegerField()

    # Detail lists
    projects             = MentorProjectStatsSerializer(many=True)
    recent_proposals     = ProposalListSerializer(many=True)
    recent_remarks       = RemarkSerializer(many=True)