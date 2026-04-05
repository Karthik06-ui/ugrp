from rest_framework import serializers
from .models import Blog

MAX_IMAGE_MB = 5
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']


class BlogListSerializer(serializers.ModelSerializer):
    """Public list — no private author fields."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Blog
        fields = (
            'id', 'title', 'content', 'image_url',
            'category', 'external_link',
            'author_name', 'created_at',
        )

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class BlogDetailSerializer(BlogListSerializer):
    """Full public detail — same as list, same privacy rules."""
    class Meta(BlogListSerializer.Meta):
        pass


class BlogCreateSerializer(serializers.ModelSerializer):
    """
    Write serializer — accepts all author fields but only exposes name in response.
    Handles multipart/form-data for image upload.
    """
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = Blog
        fields = (
            'id', 'title', 'content', 'image', 'image_url',
            'category', 'external_link',
            'author_name', 'author_email', 'author_contact',
            'created_at',
        )
        read_only_fields = ('id', 'created_at', 'image_url')
        extra_kwargs = {
            'author_email':   {'write_only': True},
            'author_contact': {'write_only': True},
        }

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def validate_image(self, file):
        if not file:
            return file
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise serializers.ValidationError('Only JPG, PNG, or WebP images are allowed.')
        if file.size > MAX_IMAGE_MB * 1024 * 1024:
            raise serializers.ValidationError(
                f'Image too large ({file.size // (1024*1024)} MB). Maximum: {MAX_IMAGE_MB} MB.'
            )
        return file

    def validate_author_contact(self, value):
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) < 10:
            raise serializers.ValidationError('Please enter a valid contact number (min 10 digits).')
        return value