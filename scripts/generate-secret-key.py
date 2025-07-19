#!/usr/bin/env python3
"""
Generate a secure Flask secret key for production use.
Run this script to generate a new secret key for your Flask application.
"""

import secrets

def generate_secret_key():
    """Generate a secure random secret key."""
    return secrets.token_hex(32)

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("Generated Flask Secret Key:")
    print(f"FLASK_SECRET_KEY={secret_key}")
    print("\nAdd this to your backend/.env file for production use.")
    print("For development, you can use the default value in the config.") 