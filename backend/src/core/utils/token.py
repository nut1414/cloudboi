from fastapi import Response, WebSocket
from jose import jwt
from datetime import datetime, timedelta
import secrets

from ..config import TokenConfig
from .datetime import DateTimeUtils

class TokenUtils:
    @classmethod
    def _generate_token(cls, data: dict, expires_delta: timedelta):
        """Generate a JWT token."""
        to_encode = data.copy()
        now = DateTimeUtils.now_dt()

        to_encode.update({
            "exp": now + expires_delta,
            "iat": now,
            "jti": secrets.token_hex(16),
            "iss": TokenConfig.ISSUER,
            "aud": TokenConfig.AUDIENCE
        })

        return jwt.encode(to_encode, TokenConfig.SECRET_KEY, algorithm=TokenConfig.ALGORITHM)

    @classmethod
    def create_access_token(cls, data: dict):
        """Create an access token."""
        return cls._generate_token(data, timedelta(minutes=TokenConfig.ACCESS_TOKEN_EXPIRE_MINUTES))

    @classmethod
    def create_refresh_token(cls, data: dict):
        """Create a refresh token."""
        return cls._generate_token(data, timedelta(days=TokenConfig.REFRESH_TOKEN_EXPIRE_DAYS))

    @classmethod
    def set_secure_cookie(cls, response: Response, token: str, token_type: str):
        """Set a secure, HTTP-only cookie."""
        max_age = (
            TokenConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60 if token_type == "access"
            else TokenConfig.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
        response.set_cookie(
            key=f"{token_type}_token",
            value=token,
            httponly=True,
            secure=TokenConfig.SECURE_COOKIES,
            samesite="strict",
            max_age=max_age
        )

    @classmethod
    def validate_token(cls, token: str):
        """Validate and decode token."""
        try:
            return jwt.decode(
                token,
                TokenConfig.SECRET_KEY,
                algorithms=[TokenConfig.ALGORITHM],
                issuer=TokenConfig.ISSUER,
                audience=TokenConfig.AUDIENCE
            )
        except Exception as e:
            return None
    
    @classmethod
    def get_websocket_cookie(cls, websocket: WebSocket) -> dict:
        """Extract cookies from websocket headers."""
        cookies = {}
        for header in websocket.headers.getlist("cookie"):
            pairs = header.split("; ")
            for pair in pairs:
                key, value = pair.split("=", 1)
                cookies[key] = value
        return cookies