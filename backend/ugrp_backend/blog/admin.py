from django.contrib import admin
from .models import Blog


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display   = ('title', 'author_name', 'author_email', 'category', 'is_published', 'created_at')
    list_filter    = ('is_published', 'category')
    search_fields  = ('title', 'author_name', 'author_email')
    ordering       = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    # Show private author fields only in admin — never exposed to public API
    fieldsets = (
        ('Content',        {'fields': ('title', 'content', 'image', 'category', 'external_link')}),
        ('Author (private)', {'fields': ('author_name', 'author_email', 'author_contact'), 'classes': ('collapse',)}),
        ('Publishing',     {'fields': ('is_published', 'created_at', 'updated_at')}),
    )