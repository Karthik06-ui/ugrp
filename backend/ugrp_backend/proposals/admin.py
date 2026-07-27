from django.contrib import admin
from .models import Proposal, OwnStatement


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display  = ('id', 'student', 'project', 'status', 'created_at', 'updated_at')
    list_filter   = ('status',)
    search_fields = ('student__email', 'project__title')
    ordering      = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(OwnStatement)
class OwnStatementAdmin(admin.ModelAdmin):
    list_display    = ('id', 'name', 'email', 'roll_no', 'dept', 'statement', 'created_at')
    search_fields   = ('name', 'email', 'roll_no', 'statement', 'description')
    list_filter     = ('dept', 'created_at')
    readonly_fields = ('created_at',)