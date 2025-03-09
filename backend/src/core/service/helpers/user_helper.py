import bcrypt

class UserHelper:
    # Bcrypt work factor - higher is more secure but slower
    # Recommended minimum is 12, though 10-14 is commonly used
    BCRYPT_ROUNDS = 12

    @classmethod
    def hash_password(cls, password: str) -> str:
        """Hash a password for storing."""
        # Convert password to bytes, hash it, then convert back to string
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=cls.BCRYPT_ROUNDS)
        hashed_bytes = bcrypt.hashpw(password_bytes, salt)
        return hashed_bytes.decode('utf-8')

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verify a stored password against a provided password."""
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)