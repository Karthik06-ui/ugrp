from rest_framework import permissions

class IsTeamLeadOrIndividual(permissions.BasePermission):
    """
    Permission class to allow only the submitter (student / Team Lead)
    to edit, update, or delete a proposal or draft.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the requesting user is the student who submitted the proposal
        return obj.student == request.user


class IsProposalParticipant(permissions.BasePermission):
    """
    Permission class to allow:
    - The project mentor (full access)
    - The team lead/individual student (full access)
    - Team members (read-only access to view their own team's proposal status)
    """
    def has_object_permission(self, request, view, obj):
        user = request.user

        # Project mentor has full access
        if user.role == 'mentor':
            return obj.project.mentor == user

        # Submitter has full access
        if obj.student == user:
            return True

        # Team members have read-only access if they are part of the team
        if obj.application_type == 'team' and obj.team:
            is_member = obj.team.members.filter(user=user).exists()
            if is_member and request.method in permissions.SAFE_METHODS:
                return True

        return False
