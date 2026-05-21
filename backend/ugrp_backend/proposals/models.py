from django.db import models
from django.conf import settings


def proposal_upload_path(instance, filename):
    """Uploads to: media/proposals/<student_id>/<filename>"""
    return f'proposals/{instance.student_id}/{filename}'


class Proposal(models.Model):
    """
    A student's application to a mentor's project.
    Includes applicant details so mentors get a full picture
    without having to visit the student profile separately.
    """

    class Status(models.TextChoices):
        PENDING  = 'pending',  'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    class Year(models.IntegerChoices):
        FIRST  = 1, '1st Year'
        SECOND = 2, '2nd Year'
        THIRD  = 3, '3rd Year'
        FOURTH = 4, '4th Year'

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

    # ── Applicant details (filled in the proposal form) ───────────────────────
    applicant_name       = models.CharField(max_length=150, blank=True, help_text='Full name of the applicant.')
    applicant_roll_no    = models.CharField(max_length=50,  blank=True, help_text='University roll number.')
    applicant_contact    = models.CharField(max_length=20,  blank=True, help_text='Phone number.')
    applicant_email      = models.EmailField(blank=True,               help_text='Contact email.')
    applicant_department = models.CharField(max_length=150, blank=True, help_text='Department / branch.')
    applicant_year       = models.IntegerField(
        choices=Year.choices,
        null=True, blank=True,
        help_text='Current year of study.',
    )

    # ── Proposal content ──────────────────────────────────────────────────────
    message    = models.TextField(help_text='Cover letter / motivation for applying.')
    attachment = models.FileField(
        upload_to=proposal_upload_path,
        null=True, blank=True,
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