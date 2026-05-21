from rest_framework import serializers
from .models import Proposal

ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
MAX_FILE_SIZE_MB   = 5


class ProposalCreateSerializer(serializers.ModelSerializer):
    """
    Used by students to submit a new proposal.
    Accepts multipart/form-data when an attachment is included.
    Includes all applicant detail fields.
    """
    attachment_url = serializers.SerializerMethodField(read_only=True)
    project_title  = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model  = Proposal
        fields = (
            'id', 'project', 'project_title',
            # Applicant details
            'applicant_name', 'applicant_roll_no', 'applicant_contact',
            'applicant_email', 'applicant_department', 'applicant_year',
            # Proposal content
            'message', 'attachment', 'attachment_url',
            'status', 'created_at', 'updated_at',
        )
        read_only_fields = (
            'id', 'project_title', 'status',
            'created_at', 'updated_at', 'attachment_url',
        )

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.attachment.url) if request else obj.attachment.url
        return None

    def validate_attachment(self, file):
        if not file:
            return file
        name = file.name.lower()
        ext  = name.rsplit('.', 1)[-1] if '.' in name else ''
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f'Unsupported file type ".{ext}". Allowed: {", ".join(ALLOWED_EXTENSIONS)}.'
            )
        if file.size > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise serializers.ValidationError(
                f'File too large. Maximum allowed: {MAX_FILE_SIZE_MB} MB.'
            )
        return file

    def validate_applicant_contact(self, value):
        if value:
            digits = ''.join(filter(str.isdigit, value))
            if len(digits) < 10:
                raise serializers.ValidationError(
                    'Enter a valid contact number (minimum 10 digits).'
                )
        return value

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
    Read-only serializer for mentors — shows full applicant details
    so mentors can evaluate without visiting the student profile.
    """
    student_email        = serializers.EmailField(source='student.email',  read_only=True)
    project_title        = serializers.CharField(source='project.title',   read_only=True)
    attachment_url       = serializers.SerializerMethodField(read_only=True)
    applicant_year_label = serializers.CharField(
        source='get_applicant_year_display', read_only=True
    )

    class Meta:
        model  = Proposal
        fields = (
            'id',
            'student', 'student_email',
            'project', 'project_title',
            # Applicant details
            'applicant_name', 'applicant_roll_no', 'applicant_contact',
            'applicant_email', 'applicant_department',
            'applicant_year', 'applicant_year_label',
            # Proposal content
            'message', 'attachment', 'attachment_url',
            'status', 'created_at', 'updated_at',
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