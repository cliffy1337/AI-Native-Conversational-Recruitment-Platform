import secrets
import string

# Generate a secure 50-character secret key
alphabet = string.ascii_letters + string.digits + string.punctuation
secret_key = ''.join(secrets.choice(alphabet) for _ in range(50))
print(secret_key)