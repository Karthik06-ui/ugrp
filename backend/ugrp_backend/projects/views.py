from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q

from accounts.permissions import IsMentor, IsStudent
from .models import Project, Team
from .serializers import ProjectSerializer, TeamSerializer
from proposals.serializers import ProposalCreateSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """
    list     → GET  /api/projects/        PUBLIC  (no login needed)
    retrieve → GET  /api/projects/<id>/   PUBLIC  (no login needed)
    create   → POST /api/projects/        mentor only
    update   → PATCH /api/projects/<id>/  owning mentor only
    destroy  → DELETE /api/projects/<id>/ owning mentor only
    """
    queryset         = Project.objects.select_related('mentor').all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            # Public: anyone can browse projects without logging in
            return [permissions.AllowAny()]
        if self.action == 'create':
            # Must be a logged-in mentor
            return [permissions.IsAuthenticated(), IsMentor()]
        # update / partial_update / destroy — logged in, ownership checked below
        return [permissions.IsAuthenticated()]

    def get_object(self):
        obj = super().get_object()
        if self.action in ('update', 'partial_update', 'destroy'):
            if obj.mentor != self.request.user:
                raise PermissionDenied('You can only modify your own projects.')
        return obj

    def perform_create(self, serializer):
        serializer.save(mentor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsStudent])
    def apply(self, request, pk=None):
        project = self.get_object()
        
        # Enforce copy or new dict to add project id
        if hasattr(request.data, 'copy'):
            data = request.data.copy()
        else:
            data = dict(request.data)
            
        data['project'] = project.id
        serializer = ProposalCreateSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        proposal = serializer.save()
        return Response(
            ProposalCreateSerializer(proposal, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class TeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Teams.
    POST   /api/teams/        → Create a team (leads only)
    GET    /api/teams/        → List teams user is part of
    GET    /api/teams/<id>/   → Retrieve specific team
    DELETE /api/teams/<id>/   → Dissolve team (leader only)
    """
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'mentor':
            return Team.objects.filter(proposals__project__mentor=user).distinct().prefetch_related('members')
        return Team.objects.filter(
            Q(leader=user) | Q(members__user=user) | Q(members__email__iexact=user.email)
        ).distinct().prefetch_related('members')

    def perform_create(self, serializer):
        serializer.save(leader=self.request.user)

    def destroy(self, request, *args, **kwargs):
        team = self.get_object()
        if team.leader != request.user:
            raise PermissionDenied('Only the team leader can dissolve this team.')
        return super().destroy(request, *args, **kwargs)