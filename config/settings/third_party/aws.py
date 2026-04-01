from ..django.base import get_secret

# AWS Configuration (your existing AWS settings)
AWS_ACCESS_KEY_ID = get_secret('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = get_secret('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = get_secret('AWS_STORAGE_BUCKET_NAME', 'your-app-files')
AWS_S3_REGION_NAME = get_secret('AWS_S3_REGION_NAME', 'us-east-1')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

# Profile pictures bucket
AWS_PROFILE_PICTURES_BUCKET_NAME = get_secret('AWS_PROFILE_PICTURES_BUCKET_NAME', 'your-app-profile-pics')
AWS_CLOUDFRONT_DOMAIN = get_secret('AWS_CLOUDFRONT_DOMAIN', None)

# Storage Settings
AWS_DEFAULT_ACL = 'private'
AWS_QUERYSTRING_AUTH = True
AWS_QUERYSTRING_EXPIRE = 3600
AWS_RESUME_URL_EXPIRE = 1800

# S3 Storage Classes
AWS_S3_OBJECT_PARAMETERS = {
    'StorageClass': get_secret('AWS_S3_STORAGE_CLASS', 'STANDARD'),
}

# Custom storage backends
DEFAULT_FILE_STORAGE = 'config.storage_backends.MediaStorage'

# For allauth - if you want to serve user avatars via CloudFront
if AWS_CLOUDFRONT_DOMAIN:
    ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'