from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, StudentProfile, MentorProfile


# ─────────────────────────────────────────────────────────────────────────────
#  Auth serializers
# ─────────────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    """Handles new user creation for both roles."""
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirm password')

    class Meta:
        model  = User
        fields = ('email', 'password', 'password2', 'role', 'username')
        extra_kwargs = {'username': {'required': False}}

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def validate_role(self, value):
        if value not in (User.Role.STUDENT, User.Role.MENTOR):
            raise serializers.ValidationError('Role must be "student" or "mentor".')
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email    = validated_data['email'],
            password = validated_data['password'],
            role     = validated_data['role'],
            username = validated_data.get('username', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Returns JWT pair on successful credential check."""
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request  = self.context.get('request'),
            username = attrs['email'],   # USERNAME_FIELD = 'email'
            password = attrs['password'],
        )
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        refresh = RefreshToken.for_user(user)
        return {
            'user_id': user.id,
            'email':   user.email,
            'role':    user.role,
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        }


# ─────────────────────────────────────────────────────────────────────────────
#  Profile serializers
# ─────────────────────────────────────────────────────────────────────────────

class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model  = StudentProfile
        fields = (
            'id', 'email', 'name', 'roll_number',
            'year', 'department', 'skills', 'bio',
        )

    def validate_roll_number(self, value):
        """
        roll_number must be globally unique — but allow the current instance
        to keep its own roll_number during updates.
        """
        qs = StudentProfile.objects.filter(roll_number=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('This roll number is already registered.')
        return value


class MentorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model  = MentorProfile
        fields = ('id', 'email', 'name', 'department', 'designation', 'bio')