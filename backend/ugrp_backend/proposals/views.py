from django.db import transaction
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsStudent, IsMentor
from .models import Proposal
from .serializers import (
    ProposalCreateSerializer,
    ProposalListSerializer,
    ProposalStatusUpdateSerializer,
)


class SubmitProposalView(generics.CreateAPIView):
    """
    POST /api/proposals/
    Students only — submit a proposal for an open project.
    Returns a clear error if the student already has an active proposal.
    """
    serializer_class   = ProposalCreateSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        proposal = serializer.save()
        return Response(
            ProposalCreateSerializer(proposal, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class StudentProposalListView(generics.ListAPIView):
    """
    GET /api/proposals/list/
    Students only — list ALL their own proposals across all projects.
    Optional filter: ?status=pending|accepted|rejected
    """
    serializer_class   = ProposalCreateSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        qs = (
            Proposal.objects
            .filter(student=self.request.user)
            .select_related('project', 'project__mentor')
            .order_by('-created_at')
        )
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def get_serializer_class(self):
        return ProposalCreateSerializer


class MentorProposalListView(generics.ListAPIView):
    """
    GET /api/mentor/proposals/
    Mentors only — list all proposals for their projects.
    Optional filters: ?project=<id>  ?status=pending|accepted|rejected
    """
    serializer_class   = ProposalListSerializer
    permission_classes = [IsAuthenticated, IsMentor]

    def get_queryset(self):
        qs = (
            Proposal.objects
            .filter(project__mentor=self.request.user)
            .select_related('student', 'student__student_profile', 'project')
        )
        project_id      = self.request.query_params.get('project')
        proposal_status = self.request.query_params.get('status')
        if project_id:
            qs = qs.filter(project_id=project_id)
        if proposal_status:
            qs = qs.filter(status=proposal_status)
        return qs


class ProposalStatusUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/proposals/<id>/
    Mentors only — accept or reject a pending proposal.
    On acceptance, Enrollment is created atomically.
    """
    serializer_class   = ProposalStatusUpdateSerializer
    permission_classes = [IsAuthenticated, IsMentor]
    http_method_names  = ['patch']

    def get_queryset(self):
        return Proposal.objects.filter(
            project__mentor=self.request.user
        ).select_related('project', 'student')

    def get_object(self):
        obj = super().get_object()
        if obj.project.mentor != self.request.user:
            raise PermissionDenied('You can only manage proposals for your own projects.')
        return obj

    @transaction.atomic
    def patch(self, request, *args, **kwargs):
        proposal   = self.get_object()
        serializer = self.get_serializer(proposal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated    = serializer.save()

        response_data = dict(serializer.data)

        if updated.status == Proposal.Status.ACCEPTED:
            from enrollments.models import Enrollment
            enrollment, created = Enrollment.objects.get_or_create(
                student = updated.student,
                project = updated.project,
            )
            response_data['enrollment_id']      = enrollment.id
            response_data['enrollment_created'] = created

        return Response(response_data, status=status.HTTP_200_OK)