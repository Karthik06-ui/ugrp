from django.db import models
from django.conf import settings


def proposal_upload_path(instance, filename):
    """Uploads to: media/proposals/<student_id>/<filename>"""
    return f'proposals/{instance.student_id}/{filename}'


class Proposal(models.Model):
    """
    A student's application to a mentor's project.

    Business rules enforced here (DB level) and in the serializer/view:
      - A student cannot have two ACTIVE (non-rejected) proposals for the same project.
      - Re-application is allowed only after a rejection.
    """

    class Status(models.TextChoices):
        PENDING  = 'pending',  'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    student    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='proposals',
        limit_choices_to={'role': 'student'},
    )
    project    = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='proposals',
    )
    message    = models.TextField(help_text='Cover letter / motivation for applying.')
    attachment = models.FileField(
        upload_to=proposal_upload_path,
        null=True,
        blank=True,
        help_text='Optional resume, transcript, or recommendation letter (PDF/DOC, max 5 MB).',
    )
    status     = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering     = ['-created_at']
        verbose_name = 'Proposal'
        constraints  = [
            models.UniqueConstraint(
                fields    = ['student', 'project'],
                condition = models.Q(status__in=['pending', 'accepted']),
                name      = 'unique_active_proposal_per_student_project',
            )
        ]

    def __str__(self):
        return (
            f'Proposal #{self.pk} | {self.student.email} → '
            f'"{self.project.title}" [{self.status}]'
        )