from django.db import models
from django.conf import settings


class Enrollment(models.Model):
    """
    Created automatically when a mentor accepts a student's proposal.
    Represents the confirmed link between a student and a project.
    """

    student   = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
        limit_choices_to={'role': 'student'},
    )
    project   = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering     = ['-joined_at']
        verbose_name = 'Enrollment'
        # A student can only be enrolled once per project
        unique_together = ('student', 'project')

    def __str__(self):
        return f'{self.student.email} enrolled in "{self.project.title}"'