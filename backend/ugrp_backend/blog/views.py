from django.conf import settings
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
    Public — sends contact form via Resend API (HTTPS, not SMTP).
    Render free plan blocks SMTP ports — Resend uses port 443 which is always open.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data    = request.data
        name    = str(data.get('name',    '')).strip()
        email   = str(data.get('email',   '')).strip()
        topic   = str(data.get('topic',   '')).strip()
        message = str(data.get('message', '')).strip()

        # ── Validation ───────────────────────────────────────────────────────
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

        # ── Send via Resend API ───────────────────────────────────────────────
        api_key    = getattr(settings, 'RESEND_API_KEY', '')
        recipients = getattr(settings, 'CONTACT_RECIPIENT_EMAILS', [])
        from_email = getattr(settings, 'CONTACT_FROM_EMAIL', 'onboarding@resend.dev')

        if not api_key:
            return Response(
                {'detail': 'Email service is not configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if not recipients:
            return Response(
                {'detail': 'No recipient email configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        html_body = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #534AB7;">New UGRP Contact Message</h2>
            <table style="width:100%; border-collapse: collapse;">
                <tr><td style="padding:8px; color:#666; width:120px;">Name</td>
                    <td style="padding:8px; font-weight:600;">{name}</td></tr>
                <tr style="background:#f9f9f9;">
                    <td style="padding:8px; color:#666;">Email</td>
                    <td style="padding:8px;"><a href="mailto:{email}">{email}</a></td></tr>
                <tr><td style="padding:8px; color:#666;">Topic</td>
                    <td style="padding:8px;">{topic or '—'}</td></tr>
            </table>
            <div style="margin-top:20px; padding:16px; background:#f5f5f5; border-radius:8px;">
                <p style="margin:0; white-space:pre-wrap; color:#333;">{message}</p>
            </div>
            <p style="margin-top:16px; color:#999; font-size:12px;">
                Reply directly to <a href="mailto:{email}">{email}</a> to respond.
            </p>
        </div>
        """

        try:
            import resend
            resend.api_key = api_key

            resend.Emails.send({
                'from':     from_email,
                'to':       recipients,
                'reply_to': email,
                'subject':  f'[UGRP Contact] {topic or "General enquiry"} — from {name}',
                'html':     html_body,
            })
        except Exception as exc:
            return Response(
                {'detail': f'Failed to send email: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {'detail': 'Message sent successfully.'},
            status=status.HTTP_200_OK,
        )