from django.contrib import admin
from .models import Task, Review, Remark


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display  = ('id', 'title', 'project', 'assigned_to', 'status', 'due_date', 'created_at')
    list_filter   = ('status',)
    search_fields = ('title', 'assigned_to__email', 'project__title')
    ordering      = ('due_date', '-created_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ('id', 'mentor', 'student', 'project', 'rating', 'created_at')
    list_filter   = ('rating',)
    search_fields = ('mentor__email', 'student__email', 'project__title')
    ordering      = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Remark)
class RemarkAdmin(admin.ModelAdmin):
    list_display  = ('id', 'author', 'project', 'created_at')
    search_fields = ('author__email', 'project__title', 'content')
    ordering      = ('-created_at',)
    readonly_fields = ('created_at',)