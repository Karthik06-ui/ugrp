from django.conf import settings
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Blog
from .serializers import BlogListSerializer, BlogDetailSerializer, BlogCreateSerializer


class BlogListView(generics.ListAPIView):
    """GET /api/blogs/ — public"""
    serializer_class   = BlogListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs       = Blog.objects.filter(is_published=True)
        category = self.request.query_params.get('category')
        search   = self.request.query_params.get('search')
        if category:
            qs = qs.filter(category__icontains=category)
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(content__icontains=search)
        return qs


class BlogDetailView(generics.RetrieveAPIView):
    """GET /api/blogs/<id>/ — public"""
    queryset           = Blog.objects.filter(is_published=True)
    serializer_class   = BlogDetailSerializer
    permission_classes = [AllowAny]


class BlogCreateView(generics.CreateAPIView):
    """POST /api/blogs/create/ — public, multipart"""
    serializer_class   = BlogCreateSerializer
    permission_classes = [AllowAny]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save()
        return Response(
            BlogListSerializer(blog, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class ContactFormView(APIView):
    """
    POST /api/contact/
    Public — forwards the contact form submission to CONTACT_RECIPIENT_EMAILS
    via SMTP. Nothing is stored in the database.

    Payload: { name, email, topic, message }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data    = request.data
        name    = str(data.get('name',    '')).strip()
        email   = str(data.get('email',   '')).strip()
        topic   = str(data.get('topic',   '')).strip()
        message = str(data.get('message', '')).strip()

        # ── Basic validation ─────────────────────────────────────────────────
        errors = {}
        if not name:
            errors['name'] = 'Name is required.'
        if not email:
            errors['email'] = 'Email is required.'
        else:
            try:
                validate_email(email)
            except ValidationError:
                errors['email'] = 'Enter a valid email address.'
        if not message:
            errors['message'] = 'Message cannot be empty.'
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        # ── Build the email ──────────────────────────────────────────────────
        subject = f'[UGRP Contact] {topic or "General enquiry"} — from {name}'

        body = f"""
New contact form submission from the UGRP website.

───────────────────────────────────────
Name    : {name}
Email   : {email}
Topic   : {topic or '—'}
───────────────────────────────────────

{message}

───────────────────────────────────────
Reply directly to {email} to respond.
        """.strip()

        recipients = getattr(settings, 'CONTACT_RECIPIENT_EMAILS', [])
        from_name  = getattr(settings, 'CONTACT_FROM_NAME', 'UGRP Contact Form')
        from_email = f'{from_name} <{settings.EMAIL_HOST_USER}>'

        if not recipients:
            return Response(
                {'detail': 'Contact email is not configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            send_mail(
                subject      = subject,
                message      = body,
                from_email   = from_email,
                recipient_list = recipients,
                fail_silently  = False,
                # Reply-To so you can reply directly to the sender
                # headers      = {'Reply-To': f'{name} <{email}>'},
            )
        except Exception as exc:
            return Response(
                {'detail': f'Failed to send email: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {'detail': 'Message sent successfully.'},
            status=status.HTTP_200_OK,
        )