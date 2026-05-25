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
    Students only — list ALL their own proposals (including those where they are team members).
    Optional filter: ?status=pending|accepted|rejected
    """
    serializer_class   = ProposalCreateSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        user = self.request.user
        from django.db.models import Q
        qs = (
            Proposal.objects
            .filter(Q(student=user) | Q(team__members__user=user) | Q(team__members__email__iexact=user.email))
            .select_related('student', 'project', 'project__mentor', 'team')
            .prefetch_related('team__members')
            .distinct()
            .order_by('-created_at')
        )
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


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
            .select_related('student', 'student__student_profile', 'project', 'team')
            .prefetch_related('team__members')
        )
        project_id      = self.request.query_params.get('project')
        proposal_status = self.request.query_params.get('status')
        if project_id:
            qs = qs.filter(project_id=project_id)
        if proposal_status:
            qs = qs.filter(status=proposal_status)
        return qs


class ProposalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/proposals/<id>/ — view proposal details (mentor, lead, or team members).
    PATCH/PUT /api/proposals/<id>/ — update draft/finalize (lead) OR accept/reject (mentor).
    DELETE /api/proposals/<id>/ — delete draft proposal (lead).
    """
    queryset = Proposal.objects.all()

    def get_permissions(self):
        from .permissions import IsTeamLeadOrIndividual, IsProposalParticipant
        if self.request.method == 'GET':
            return [IsAuthenticated(), IsProposalParticipant()]
        elif self.request.method in ['PUT', 'PATCH']:
            # Either the team lead or the project mentor can update the proposal
            return [IsAuthenticated(), IsTeamLeadOrIndividual() | IsMentor()]
        elif self.request.method == 'DELETE':
            return [IsAuthenticated(), IsTeamLeadOrIndividual()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH'] and self.request.user.role == 'mentor':
            return ProposalStatusUpdateSerializer
        return ProposalCreateSerializer

    @transaction.atomic
    def perform_update(self, serializer):
        user = self.request.user
        proposal = self.get_object()

        if user.role == 'mentor':
            if proposal.project.mentor != user:
                raise PermissionDenied('You can only manage proposals for your own projects.')
            
            updated = serializer.save()

            if updated.status == Proposal.Status.ACCEPTED:
                from enrollments.models import Enrollment
                # Enroll lead
                enrollment, created = Enrollment.objects.get_or_create(
                    student = updated.student,
                    project = updated.project,
                )
                
                # Enroll all team members who have registered user profiles
                if updated.application_type == 'team' and updated.team:
                    for member in updated.team.members.all():
                        if member.user:
                            Enrollment.objects.get_or_create(
                                student = member.user,
                                project = updated.project
                            )
                
                # Emit status change signal
                from proposals.signals import proposal_status_changed
                proposal_status_changed.send(
                    sender=Proposal,
                    proposal=updated,
                    old_status=Proposal.Status.PENDING,
                    new_status=updated.status
                )
        else:
            if proposal.student != user:
                raise PermissionDenied('Only the team lead/individual applicant can edit this proposal.')
            if proposal.status != Proposal.Status.PENDING and not proposal.is_draft:
                raise ValidationError('You cannot edit a proposal that is not a draft.')
            
            serializer.save()

    def perform_destroy(self, instance):
        if instance.student != self.request.user:
            raise PermissionDenied('Only the team lead/individual applicant can delete this proposal.')
        if not instance.is_draft:
            raise ValidationError('Only draft proposals can be deleted.')
        
        # If team application, also delete the associated Team object
        if instance.application_type == 'team' and instance.team:
            team = instance.team
            instance.team = None
            instance.save()
            team.delete()
            
        instance.delete()