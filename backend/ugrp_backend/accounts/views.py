from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StudentProfile, MentorProfile
from .permissions import IsStudent, IsMentor, IsProfileOwner
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    StudentProfileSerializer,
    MentorProfileSerializer,
)


# ─────────────────────────────────────────────────────────────────────────────
#  Auth views
# ─────────────────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    """
    POST /api/auth/register/
    Open endpoint — creates a user and returns JWT tokens immediately.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Issue tokens right after registration (skip a second login round-trip)
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'message': 'Registration successful.',
                'user_id': user.id,
                'email':   user.email,
                'role':    user.role,
                'access':  str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    Returns JWT access + refresh tokens on valid credentials.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
#  Student profile views
# ─────────────────────────────────────────────────────────────────────────────

class StudentProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/profile/student/   — fetch own student profile
    PATCH /api/profile/student/  — update own student profile

    Access: authenticated students only, and only their own profile.
    """
    serializer_class   = StudentProfileSerializer
    permission_classes = [IsAuthenticated, IsStudent, IsProfileOwner]

    def get_object(self):
        profile = self.request.user.student_profile
        self.check_object_permissions(self.request, profile)
        return profile

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True   # always allow partial PATCH
        return super().update(request, *args, **kwargs)


# ─────────────────────────────────────────────────────────────────────────────
#  Mentor profile views
# ─────────────────────────────────────────────────────────────────────────────

class MentorProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/profile/mentor/  — fetch own mentor profile
    PATCH /api/profile/mentor/  — update own mentor profile

    Access: authenticated mentors only, and only their own profile.
    """
    serializer_class   = MentorProfileSerializer
    permission_classes = [IsAuthenticated, IsMentor, IsProfileOwner]

    def get_object(self):
        profile = self.request.user.mentor_profile
        self.check_object_permissions(self.request, profile)
        return profile

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


class StudentInfoView(APIView):
    """
    GET /api/auth/student-info/?email=...
    Retrieves student info (name, roll_number, department) by normalized email.
    Used for email blur auto-fetch during team registration.
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        email = request.query_params.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(email__iexact=email, role=User.Role.STUDENT)
            profile = user.student_profile
            return Response({
                'id': user.id,
                'name': profile.name,
                'roll_number': profile.roll_number,
                'department': profile.department,
                'email': user.email
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)