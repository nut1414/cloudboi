from passlib.context import CryptContext

class UserHelper:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def hash_password(cls, password: str) -> str:
        """Hash a password for storing."""
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verify a stored password against a provided password."""
        return cls.pwd_context.verify(plain_password, hashed_password)
