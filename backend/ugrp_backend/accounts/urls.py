from django.urls import path
from .views import RegisterView, LoginView, StudentProfileDetailView, MentorProfileDetailView

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────────
    path('register/', RegisterView.as_view(),  name='auth-register'),
    path('login/',    LoginView.as_view(),     name='auth-login'),

    # ── Profiles (each user sees only their own) ──────────────────────────────
    path('profile/student/', StudentProfileDetailView.as_view(), name='student-profile'),
    path('profile/mentor/',  MentorProfileDetailView.as_view(),  name='mentor-profile'),
]