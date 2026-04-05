from django.db import models


def blog_image_upload_path(instance, filename):
    return f'blog/images/{filename}'


class Blog(models.Model):
    """
    Public blog post — writable by anyone (no login required).
    Only author_name is shown publicly; email and contact are stored privately.
    """

    title          = models.CharField(max_length=255)
    content        = models.TextField()
    image          = models.ImageField(
        upload_to=blog_image_upload_path,
        null=True, blank=True,
        help_text='Cover image (JPG/PNG, max 5 MB).',
    )
    category       = models.CharField(max_length=100, blank=True, help_text='e.g. Research, AI, Fellowship')
    external_link  = models.URLField(blank=True, help_text='Optional external article or reference URL.')

    # Author info — only name is shown publicly
    author_name    = models.CharField(max_length=150, help_text='Displayed publicly on the blog post.')
    author_email   = models.EmailField(help_text='Stored privately — never shown publicly.')
    author_contact = models.CharField(max_length=20, help_text='Stored privately — never shown publicly.')

    is_published   = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering     = ['-created_at']
        verbose_name = 'Blog'

    def __str__(self):
        return f'"{self.title}" by {self.author_name}'