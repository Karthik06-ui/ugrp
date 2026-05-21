from django.urls import path
from .views import BlogListView, BlogDetailView, BlogCreateView, ContactFormView

urlpatterns = [
    path('blogs/',          BlogListView.as_view(),   name='blog-list'),
    path('blogs/create/',   BlogCreateView.as_view(), name='blog-create'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),

    # Contact form — forwards to email, no DB storage
    path('contact/',        ContactFormView.as_view(), name='contact-form'),
]