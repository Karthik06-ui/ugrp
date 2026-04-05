from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from accounts.permissions import IsMentor
from .models import Project
from .serializers import ProjectSerializer


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