from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

import requests

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
    Calls the Resend REST API directly via requests (no resend package needed).
    Works on Render free plan — uses HTTPS port 443, not SMTP.
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

        # ── Config ───────────────────────────────────────────────────────────
        api_key    = getattr(settings, 'RESEND_API_KEY', '')
        recipients = getattr(settings, 'CONTACT_RECIPIENT_EMAILS', [])
        from_email = getattr(settings, 'CONTACT_FROM_EMAIL', 'onboarding@resend.dev')

        if not api_key:
            return Response(
                {'detail': 'Email service is not configured (missing RESEND_API_KEY).'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if not recipients:
            return Response(
                {'detail': 'No recipient email configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # ── HTML email body ───────────────────────────────────────────────────
        html_body = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#534AB7;margin-bottom:20px;">New UGRP Contact Message</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px 8px;color:#888;width:100px;font-size:13px;">Name</td>
                    <td style="padding:10px 8px;font-weight:600;font-size:13px;">{name}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;background:#fafafa;">
                    <td style="padding:10px 8px;color:#888;font-size:13px;">Email</td>
                    <td style="padding:10px 8px;font-size:13px;">
                        <a href="mailto:{email}" style="color:#534AB7;">{email}</a>
                    </td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px 8px;color:#888;font-size:13px;">Topic</td>
                    <td style="padding:10px 8px;font-size:13px;">{topic or '—'}</td>
                </tr>
            </table>
            <div style="background:#f5f4fe;border-left:4px solid #534AB7;
                        border-radius:4px;padding:16px;margin-bottom:20px;">
                <p style="margin:0;white-space:pre-wrap;color:#333;
                           font-size:14px;line-height:1.6;">{message}</p>
            </div>
            <p style="color:#aaa;font-size:12px;margin:0;">
                Reply directly to
                <a href="mailto:{email}" style="color:#534AB7;">{email}</a>
                to respond to this message.
            </p>
        </div>
        """

        # ── Call Resend REST API directly (no package import) ─────────────────
        try:
            response = requests.post(
                'https://api.resend.com/emails',
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type':  'application/json',
                },
                json={
                    'from':     from_email,
                    'to':       recipients,
                    'reply_to': email,
                    'subject':  f'[UGRP Contact] {topic or "General enquiry"} — from {name}',
                    'html':     html_body,
                },
                timeout=10,
            )

            if response.status_code not in (200, 201):
                error_detail = response.json().get('message', response.text)
                return Response(
                    {'detail': f'Resend API error: {error_detail}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except requests.exceptions.Timeout:
            return Response(
                {'detail': 'Email service timed out. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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