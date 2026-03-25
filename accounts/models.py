from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from config.storage_backends import ProfilePictureStorage, ResumeStorage


class User(AbstractUser):
    """
    Custom User model for a job portal.
    Extends AbstractUser, compatible with django-allauth.
    Uses email as the primary login field.
    """

    email = models.EmailField(_('Email Address'), unique=True)

    # Profile picture and resume with custom storage
    profile_picture = models.ImageField(
        upload_to='profile_pictures/%Y/%m/%d/',
        storage=ProfilePictureStorage(),
        blank=True,
        null=True,
        verbose_name=_('Profile Picture')
    )

    resume = models.FileField(
        upload_to='resumes/%Y/%m/%d/',
        storage=ResumeStorage(),
        blank=True,
        null=True,
        validators=[FileExtensionValidator(['pdf', 'doc', 'docx'])],
        verbose_name=_('Resume/CV')
    )

    # User type
    USER_TYPE_CHOICES = [
        ('job_seeker', _('Job Seeker')),
        ('recruiter', _('Recruiter')),
        ('admin', _('Admin')),
    ]
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='job_seeker',
        verbose_name=_('User Type')
    )

    # Optional fields
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_('Phone Number'))
    company_name = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Company Name'))

    # Onboarding tracking
    onboarding_completed = models.BooleanField(default=False, verbose_name=_('Onboarding Completed'))

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Use email as primary login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username is still required by AbstractUser

    class Meta:
        db_table = 'accounts_user'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        swappable = 'AUTH_USER_MODEL'

    def __str__(self):
        return self.email or self.username

    @property
    def is_recruiter(self):
        return self.user_type == 'recruiter'

    @property
    def is_job_seeker(self):
        return self.user_type == 'job_seeker'

    @property
    def profile_picture_url(self):
        """Return profile picture URL or fallback"""
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
        return '/static/images/default-avatar.png'

    def delete_profile_picture(self):
        """Delete profile picture from storage"""
        if self.profile_picture:
            self.profile_picture.delete(save=False)
            self.profile_picture = None
            self.save(update_fields=['profile_picture'])
            return True
        return False

    def clean(self):
        """
        Model-level validation:
        - Company name is required if user is a recruiter.
        """
        super().clean()
        if self.is_recruiter and not self.company_name:
            raise ValidationError({
                'company_name': _('Company Name is required for recruiters.')
            })

    # Admin display helper
    def admin_profile_picture(self):
        if self.profile_picture:
            return format_html('<img src="{}" width="50" />', self.profile_picture.url)
        return ''
    admin_profile_picture.short_description = _('Profile Picture')