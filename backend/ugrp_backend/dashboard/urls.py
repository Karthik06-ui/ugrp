from django.urls import path
from .views import (
    # Tasks
    TaskCreateView,
    TaskListView,
    TaskDetailView,
    # Reviews
    ReviewCreateView,
    ReviewListView,
    ReviewDetailView,
    # Remarks
    RemarkCreateView,
    RemarkListView,
    RemarkDeleteView,
    # Dashboards
    StudentDashboardView,
    MentorDashboardView,
)

urlpatterns = [
    # ── Tasks ─────────────────────────────────────────────────────────────────
    path('tasks/',          TaskCreateView.as_view(),   name='task-create'),
    path('tasks/list/',     TaskListView.as_view(),     name='task-list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(),   name='task-detail'),

    # ── Reviews ───────────────────────────────────────────────────────────────
    path('reviews/',          ReviewCreateView.as_view(), name='review-create'),
    path('reviews/list/',     ReviewListView.as_view(),   name='review-list'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),

    # ── Remarks ───────────────────────────────────────────────────────────────
    path('remarks/',          RemarkCreateView.as_view(), name='remark-create'),
    path('remarks/list/',     RemarkListView.as_view(),   name='remark-list'),
    path('remarks/<int:pk>/', RemarkDeleteView.as_view(), name='remark-delete'),

    # ── Consolidated dashboards ───────────────────────────────────────────────
    path('student/dashboard/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('mentor/dashboard/',  MentorDashboardView.as_view(),  name='mentor-dashboard'),
]