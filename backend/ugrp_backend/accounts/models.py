from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """
    Custom manager that treats email (not username) as the unique identifier.
    """

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set.')
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)   # satisfy AbstractUser internals
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'mentor')   # superuser needs a role
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom user model.
    - Email is the primary login identifier (unique).
    - Username is kept optional for admin/display purposes.
    - Role distinguishes Student vs Mentor throughout the system.
    """

    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        MENTOR  = 'mentor',  'Mentor'

    # Make username optional; email is the login field
    username = models.CharField(max_length=150, blank=True)
    email    = models.EmailField(unique=True)
    role     = models.CharField(max_length=10, choices=Role.choices)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['role']   # asked during `createsuperuser`

    objects = UserManager()

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.email} ({self.role})'

    # ── Convenience helpers ──────────────────────────────────────────────────
    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_mentor(self):
        return self.role == self.Role.MENTOR


# ─────────────────────────────────────────────────────────────────────────────
#  Role-specific profiles  (auto-created via signals)
# ─────────────────────────────────────────────────────────────────────────────

class StudentProfile(models.Model):
    """Extended profile for users with role=student."""

    class Year(models.IntegerChoices):
        FIRST  = 1, '1st Year'
        SECOND = 2, '2nd Year'
        THIRD  = 3, '3rd Year'
        FOURTH = 4, '4th Year'

    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    name        = models.CharField(max_length=255, blank=True)
    roll_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    year        = models.IntegerField(choices=Year.choices, null=True, blank=True)
    department  = models.CharField(max_length=255, blank=True)
    skills      = models.JSONField(default=list, blank=True)
    bio         = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Student Profile'

    def __str__(self):
        return f'StudentProfile({self.user.email})'


class MentorProfile(models.Model):
    """Extended profile for users with role=mentor."""

    class Designation(models.TextChoices):
        PROFESSOR           = 'Professor',           'Professor'
        ASSOCIATE_PROFESSOR = 'Associate Professor', 'Associate Professor'
        ASSISTANT_PROFESSOR = 'Assistant Professor', 'Assistant Professor'
        LECTURER            = 'Lecturer',            'Lecturer'
        RESEARCHER          = 'Researcher',          'Researcher'

    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    name        = models.CharField(max_length=255, blank=True)
    department  = models.CharField(max_length=255, blank=True)
    designation = models.CharField(
        max_length=50,
        choices=Designation.choices,
        default=Designation.ASSISTANT_PROFESSOR,
    )
    bio         = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Mentor Profile'

    def __str__(self):
        return f'MentorProfile({self.user.email})'