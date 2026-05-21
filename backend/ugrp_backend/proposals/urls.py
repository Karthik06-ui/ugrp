from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import StudentProposalListView, SubmitProposalView, MentorProposalListView, ProposalStatusUpdateView

urlpatterns = [
    # Student: submit a new proposal
    path('proposals/',              SubmitProposalView.as_view(),       name='proposal-submit'),
 
    # Student: list ALL their own proposals (filterable by status)
    path('proposals/list/',         StudentProposalListView.as_view(),  name='student-proposals-list'),
 
    # Mentor: view incoming proposals for their projects
    path('mentor/proposals/',       MentorProposalListView.as_view(),   name='mentor-proposals'),
 
    # Mentor: accept or reject a specific proposal
    path('proposals/<int:pk>/',     ProposalStatusUpdateView.as_view(), name='proposal-status-update'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)