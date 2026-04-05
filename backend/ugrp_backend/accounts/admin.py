from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, StudentProfile, MentorProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display   = ('email', 'role', 'is_active', 'is_staff', 'date_joined')
    list_filter    = ('role', 'is_active', 'is_staff')
    search_fields  = ('email', 'username')
    ordering       = ('-date_joined',)

    fieldsets = (
        (None,           {'fields': ('email', 'password')}),
        ('Personal info',{'fields': ('username', 'role')}),
        ('Permissions',  {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display  = ('user', 'name', 'roll_number', 'year', 'department')
    search_fields = ('user__email', 'name', 'roll_number')


@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display  = ('user', 'name', 'department', 'designation')
    search_fields = ('user__email', 'name')