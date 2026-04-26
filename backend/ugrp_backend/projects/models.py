from django.db import models
from django.conf import settings


class Project(models.Model):
    """
    A research project created by a mentor.
    Can be either Academic (internal research) or Industry (company-sponsored).
    Industry projects have extra fields: industry_name and deadline.
    """

    class Status(models.TextChoices):
        OPEN   = 'open',   'Open'
        CLOSED = 'closed', 'Closed'

    class ProjectType(models.TextChoices):
        ACADEMIC = 'academic', 'Academic'
        INDUSTRY = 'industry', 'Industry'

    # ── Core fields ───────────────────────────────────────────────────────────
    title        = models.CharField(max_length=255)
    description  = models.TextField()
    mentor       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects',
        limit_choices_to={'role': 'mentor'},
    )
    status       = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.OPEN,
    )
    project_type = models.CharField(
        max_length=10,
        choices=ProjectType.choices,
        default=ProjectType.ACADEMIC,
        help_text='Academic = internal research project. Industry = company-sponsored project.',
    )

    # ── Industry-only fields (null/blank for academic projects) ───────────────
    industry_name = models.CharField(
        max_length=255,
        blank=True,
        help_text='Name of the sponsoring company / industry partner. Required for industry projects.',
    )
    deadline = models.DateField(
        null=True,
        blank=True,
        help_text='Application or project deadline. Recommended for industry projects.',
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'

    def __str__(self):
        tag = f'[{self.project_type.upper()}]' if self.project_type else ''
        return f'{tag} [{self.status.upper()}] {self.title} — {self.mentor.email}'

    @property
    def is_industry(self):
        return self.project_type == self.ProjectType.INDUSTRY

    @property
    def is_academic(self):
        return self.project_type == self.ProjectType.ACADEMIC