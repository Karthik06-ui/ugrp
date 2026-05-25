from django.db import models
from django.conf import settings


def project_upload_path(instance, filename):
    """Uploads to: media/projects/<mentor_id>/<filename>"""
    return f'projects/{instance.mentor_id}/{filename}'


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
    document = models.FileField(
        upload_to=project_upload_path,
        null=True,
        blank=True,
        help_text='Detailed project specification document (PDF/DOC, max 20 MB).',
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


class Team(models.Model):
    name = models.CharField(max_length=255)
    leader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='led_teams',
        limit_choices_to={'role': 'student'},
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Team'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    class Role(models.TextChoices):
        LEAD_DEV     = 'lead_dev',     'Lead Developer'
        FRONTEND_DEV = 'frontend_dev', 'Frontend Developer'
        BACKEND_DEV  = 'backend_dev',  'Backend Developer'
        UIUX_DES     = 'uiux_des',     'UI/UX Designer'
        RESEARCHER   = 'researcher',   'Researcher'
        ANALYST      = 'analyst',      'Analyst'
        OTHER        = 'other',        'Other'

    class InvitationStatus(models.TextChoices):
        PENDING  = 'pending',  'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        DECLINED = 'declined', 'Declined'

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='team_memberships',
        limit_choices_to={'role': 'student'},
    )
    name = models.CharField(max_length=255)
    email = models.EmailField()
    roll_number = models.CharField(max_length=50)
    department = models.CharField(max_length=255)
    role = models.CharField(
        max_length=30,
        choices=Role.choices,
    )
    invitation_status = models.CharField(
        max_length=20,
        choices=InvitationStatus.choices,
        default=InvitationStatus.ACCEPTED,
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Team Member'
        constraints = [
            models.UniqueConstraint(fields=['team', 'email'], name='unique_team_member_email')
        ]

    def __str__(self):
        return f'{self.name} ({self.email}) - {self.role} in {self.team.name}'
