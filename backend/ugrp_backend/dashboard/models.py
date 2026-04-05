from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Task(models.Model):
    """
    A unit of work created by a mentor inside a project.
    Can only be assigned to a student who is enrolled in that project.

    Mentor  → creates / updates / deletes
    Student → updates status only
    """

    class Status(models.TextChoices):
        TODO        = 'todo',        'To Do'
        IN_PROGRESS = 'in_progress', 'In Progress'
        DONE        = 'done',        'Done'

    project     = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assigned_tasks',
        limit_choices_to={'role': 'student'},
        help_text='Must be enrolled in the project.',
    )
    created_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tasks',
        limit_choices_to={'role': 'mentor'},
    )
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status      = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.TODO,
    )
    due_date    = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering     = ['due_date', '-created_at']
        verbose_name = 'Task'

    def __str__(self):
        return f'[{self.status}] {self.title} → {self.assigned_to.email}'


class Review(models.Model):
    """
    A mentor's formal review of a student's contribution to a project.
    One review per (mentor, student, project) triplet — can be updated.
    """

    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_received',
        limit_choices_to={'role': 'student'},
    )
    mentor  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_given',
        limit_choices_to={'role': 'mentor'},
    )
    rating  = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='1 (poor) to 5 (excellent)',
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering     = ['-created_at']
        verbose_name = 'Review'
        # One review per (mentor → student) per project
        unique_together = ('mentor', 'student', 'project')

    def __str__(self):
        return (
            f'Review by {self.mentor.email} on {self.student.email} '
            f'for "{self.project.title}" [{self.rating}/5]'
        )


class Remark(models.Model):
    """
    A free-form progress note or comment on a project.
    Either the owning mentor or any enrolled student may post remarks.
    """

    project    = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='remarks',
    )
    author     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='remarks',
    )
    content    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering     = ['-created_at']
        verbose_name = 'Remark'

    def __str__(self):
        return f'Remark by {self.author.email} on "{self.project.title}"'