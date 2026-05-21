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