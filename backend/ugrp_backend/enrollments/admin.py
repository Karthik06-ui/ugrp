from django.contrib import admin
from .models import Enrollment


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display  = ('id', 'student', 'project', 'joined_at')
    search_fields = ('student__email', 'project__title')
    ordering      = ('-joined_at',)
    readonly_fields = ('joined_at',)