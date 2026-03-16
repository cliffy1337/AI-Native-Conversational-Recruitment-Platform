from .base import *

# Debug mode for development
DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# Database
DATABASES = {
    "default": {
        "ENGINE": config("DB_ENGINE", default="django.db.backends.sqlite3"),
        "NAME": config("DB_NAME", default=BASE_DIR / "db.sqlite3"),
        "USER": config("DB_USER", default=""),
        "PASSWORD": config("DB_PASSWORD", default=""),
        "HOST": config("DB_HOST", default=""),
        "PORT": config("DB_PORT", default=""),
    }
}

# Email for development (console)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"