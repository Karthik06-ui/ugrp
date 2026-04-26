from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ('title', 'mentor', 'project_type', 'industry_name', 'status', 'deadline', 'created_at')
    list_filter   = ('status', 'project_type')
    search_fields = ('title', 'mentor__email', 'industry_name')
    ordering      = ('-created_at',)