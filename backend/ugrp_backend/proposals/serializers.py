from rest_framework import serializers

from .models import Proposal

ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
MAX_FILE_SIZE_MB   = 5


class ProposalCreateSerializer(serializers.ModelSerializer):
    """
    Used by students to submit a new proposal AND list their own proposals.
    Accepts multipart/form-data when an attachment is included.
    `student` is injected from the request user — never from the payload.
    """
    attachment_url = serializers.SerializerMethodField(read_only=True)
    project_title  = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model  = Proposal
        fields = (
            'id', 'project', 'project_title',
            'message', 'attachment', 'attachment_url',
            'status', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'project_title', 'status', 'created_at', 'updated_at', 'attachment_url')

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.attachment.url) if request else obj.attachment.url
        return None

    def validate_attachment(self, file):
        if not file:
            return file

        # Extension check
        name = file.name.lower()
        ext  = name.rsplit('.', 1)[-1] if '.' in name else ''
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f'Unsupported file type ".{ext}". '
                f'Allowed: {", ".join(ALLOWED_EXTENSIONS)}.'
            )

        # Size check
        if file.size > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise serializers.ValidationError(
                f'File too large ({file.size // (1024*1024)} MB). Maximum allowed: {MAX_FILE_SIZE_MB} MB.'
            )

        return file

    def validate(self, attrs):
        student = self.context['request'].user
        project = attrs['project']

        if project.status != 'open':
            raise serializers.ValidationError(
                {'project': 'This project is not accepting proposals right now.'}
            )

        active_exists = Proposal.objects.filter(
            student    = student,
            project    = project,
            status__in = [Proposal.Status.PENDING, Proposal.Status.ACCEPTED],
        ).exists()

        if active_exists:
            raise serializers.ValidationError(
                {'non_field_errors': (
                    'You already have an active proposal for this project. '
                    'You may re-apply only after a rejection.'
                )}
            )

        return attrs

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class ProposalListSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for mentors — includes file download URL.
    """
    student_email  = serializers.EmailField(source='student.email',  read_only=True)
    student_name   = serializers.CharField(
        source='student.student_profile.name', read_only=True, default=''
    )
    project_title  = serializers.CharField(source='project.title',   read_only=True)
    attachment_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = Proposal
        fields = (
            'id',
            'student', 'student_email', 'student_name',
            'project', 'project_title',
            'message', 'attachment', 'attachment_url',
            'status',
            'created_at', 'updated_at',
        )
        read_only_fields = fields

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.attachment.url) if request else obj.attachment.url
        return None


class ProposalStatusUpdateSerializer(serializers.ModelSerializer):
    """Mentor accept / reject — status only."""

    class Meta:
        model  = Proposal
        fields = ('id', 'status', 'updated_at')
        read_only_fields = ('id', 'updated_at')

    def validate_status(self, value):
        if value not in (Proposal.Status.ACCEPTED, Proposal.Status.REJECTED):
            raise serializers.ValidationError(
                f'Status can only be "accepted" or "rejected". Got: "{value}".'
            )
        return value

    def validate(self, attrs):
        if self.instance and self.instance.status != Proposal.Status.PENDING:
            raise serializers.ValidationError(
                f'This proposal is already "{self.instance.status}" and cannot be changed.'
            )
        return attrs