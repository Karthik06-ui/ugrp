from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    """Allow access only to authenticated users with role=student."""
    message = 'Access restricted to students only.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_student
        )


class IsMentor(BasePermission):
    """Allow access only to authenticated users with role=mentor."""
    message = 'Access restricted to mentors only.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_mentor
        )


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level: allow full access to the owner of the object,
    read-only to everyone else.
    Assumes the model instance has a `.user` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return obj.user == request.user


class IsProfileOwner(BasePermission):
    """
    Ensures a user can only read/edit their own profile.
    Works for both StudentProfile and MentorProfile.
    """
    message = 'You can only access your own profile.'

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user