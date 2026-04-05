from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ('title', 'mentor', 'status', 'created_at')
    list_filter   = ('status',)
    search_fields = ('title', 'mentor__email')
    ordering      = ('-created_at',)