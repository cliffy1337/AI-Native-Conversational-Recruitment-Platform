from .base import *

DEBUG = True
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="", cast=Csv())

# Use staging database
DATABASES = {
    "default": {
        "ENGINE": config("DB_ENGINE", default="django.db.backends.postgresql"),
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT", cast=int),
    }
}

STATIC_ROOT = BASE_DIR / "staticfiles"