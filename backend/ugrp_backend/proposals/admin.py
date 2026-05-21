from django.contrib import admin
from .models import Proposal


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display  = ('id', 'student', 'project', 'status', 'created_at', 'updated_at')
    list_filter   = ('status',)
    search_fields = ('student__email', 'project__title')
    ordering      = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')