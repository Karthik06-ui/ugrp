from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, TeamViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'teams', TeamViewSet, basename='team')

urlpatterns = [
    path('teams/create/', TeamViewSet.as_view({'post': 'create'}), name='team-create'),
    path('', include(router.urls)),
]