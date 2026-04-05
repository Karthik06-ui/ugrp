from django.db import models
from django.conf import settings


class Project(models.Model):
    """
    A research project created by a mentor.
    Students can browse and submit proposals against open projects.
    """

    class Status(models.TextChoices):
        OPEN   = 'open',   'Open'
        CLOSED = 'closed', 'Closed'

    class Domain(models.TextChoices):
        AI          = 'ai', 'Artificial Intelligence'
        ML          = 'ml', 'Machine Learning'
        DS          = 'ds', 'Data Science'
        WEB         = 'web', 'Web Development'
        APP         = 'app', 'App Development'
        MECH        = 'mech', 'Mechanical Engineering'
        CIVIL       = 'civil', 'Civil Engineering'
        ECE         = 'ece', 'Electronics & Communication'
        ELECTRICAL  = 'electrical', 'Electrical Engineering'
        IOT         = 'iot', 'Internet of Things'
        ROBOTICS    = 'robotics', 'Robotics'

    title       = models.CharField(max_length=255)
    description = models.TextField()

    mentor      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects',
        limit_choices_to={'role': 'mentor'},
    )

    # ✅ New Domain Field
    domain = models.CharField(
        max_length=20,
        choices=Domain.choices,
        default=Domain.AI,
    )

    status      = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.OPEN,
    )

    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'

    def __str__(self):
        return f'[{self.status.upper()}] {self.title} ({self.domain}) — {self.mentor.email}'