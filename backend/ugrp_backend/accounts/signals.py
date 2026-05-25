from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User, StudentProfile, MentorProfile


@receiver(post_save, sender=User)
def create_role_profile(sender, instance, created, **kwargs):
    """
    Automatically create the matching profile when a new User is saved.
    Guard against duplicate creation (idempotent).
    """
    if not created:
        return

    if instance.role == User.Role.STUDENT:
        StudentProfile.objects.get_or_create(user=instance)
    elif instance.role == User.Role.MENTOR:
        MentorProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def link_team_member_on_signup(sender, instance, created, **kwargs):
    """
    When a new student signs up, check if they were added to a team.
    If so, link them to the TeamMember record and auto-enroll them
    if the team's proposal was already accepted.
    """
    if not created or instance.role != User.Role.STUDENT:
        return

    from projects.models import TeamMember
    from enrollments.models import Enrollment
    from proposals.signals import team_member_linked

    normalized_email = instance.email.strip().lower()
    
    # Find team members with matching email that are not yet linked to a user
    matching_members = TeamMember.objects.filter(
        email__iexact=normalized_email,
        user__isnull=True
    )
    
    for member in matching_members:
        # Link user to the TeamMember
        member.user = instance
        member.save()

        # Update StudentProfile if empty
        try:
            profile = instance.student_profile
            if not profile.name and member.name:
                profile.name = member.name
            if not profile.roll_number and member.roll_number:
                profile.roll_number = member.roll_number
            if not profile.department and member.department:
                profile.department = member.department
            profile.save()
        except Exception:
            pass

        # Check if the team's proposal is already accepted
        accepted_proposals = member.team.proposals.filter(status='accepted')
        for proposal in accepted_proposals:
            Enrollment.objects.get_or_create(
                student=instance,
                project=proposal.project
            )

        # Emit the signal
        team_member_linked.send(sender=TeamMember, user=instance, team_member=member)
