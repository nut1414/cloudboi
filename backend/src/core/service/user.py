from typing import Annotated
from fastapi import Depends, Request, Response, HTTPException, WebSocket

from ..models.user import UserCreateRequest, UserCreateResponse, UserLoginRequest, UserLoginResponse, UserSessionResponse, UserInDB, UserWallet
from ..utils.datetime import DateTimeUtils
from ..sql.operations import UserOperation
from .validators.user_validator import UserValidator
from ..utils.token import TokenUtils
from .helpers.user_helper import UserHelper


class UserService:
    def __init__(
        self,
        user_opr: UserOperation
    ):
        self.user_opr = user_opr

    async def create_user(self, user_create: UserCreateRequest) -> UserCreateResponse:
        """Create a new user with hashed password."""
        # Validate user input
        UserValidator.validate_email(user_create.email)
        UserValidator.validate_password(user_create.password)
        UserValidator.validate_username(user_create.username)
        
        # Check if user already exists
        existing_user = await self.user_opr.get_user_by_username(user_create.username)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already existed")
        
        existing_email = await self.user_opr.get_user_by_email(user_create.email)
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already existed")
        
        # Create user with hashed password and store in database
        user_create_in_db = UserInDB(
            username=user_create.username,
            email=user_create.email,
            password_hash=UserHelper.hash_password(user_create.password),
            last_updated_at=DateTimeUtils.now_dt()
        )
        created_user = await self.user_opr.upsert_user(user_create_in_db)

        # Create user wallet with initial balance of 0.0 and store in database
        user_wallet_create_in_db = UserWallet(
            user_id=created_user.user_id,
            balance=0.0,
            last_updated_at=DateTimeUtils.now_dt()
        )
        created_user_wallet = await self.user_opr.upsert_user_wallet(user_wallet_create_in_db)
        
        # Return user info with created_at timestamp
        return UserCreateResponse(
            username=created_user.username,
            email=created_user.email,
            balance=created_user_wallet.balance,
            created_at=created_user.last_updated_at
        )

    async def login_user(self, user_login: UserLoginRequest, response: Response = None) -> UserLoginResponse:
        """Authenticate a user and return tokens."""
        # Get user from database
        user = await self.user_opr.get_user_by_username(user_login.username)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Verify password
        if not UserHelper.verify_password(user_login.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Generate tokens
        token_data = {"sub": user.username, "email": user.email}
        access_token = TokenUtils.create_access_token(token_data)
        refresh_token = TokenUtils.create_refresh_token(token_data)
        
        # Set cookies if response object is provided
        if response:
            TokenUtils.set_secure_cookie(response, access_token, "access")
            TokenUtils.set_secure_cookie(response, refresh_token, "refresh")
        
        return UserLoginResponse(message="Login successful")
    
    async def get_user_session_from_token(self, access_token: str) -> UserSessionResponse:
        """Get user session from an access token."""
        unauthenticated_response = UserSessionResponse(
            is_authenticated=False,
            username=None,
            email=None,
            role=None
        )
        
        if not access_token:
            return unauthenticated_response
        
        # Validate token
        payload = TokenUtils.validate_token(access_token)
        if not payload:
            return unauthenticated_response
        
        # Get user details
        username = payload.get("sub")
        user = await self.user_opr.get_user_by_username(username)
        if not user:
            return unauthenticated_response
        
        # Get user role
        user_role = await self.user_opr.get_user_role(user.username)
        
        return UserSessionResponse(
            is_authenticated=True,
            username=user.username,
            email=user.email,
            role=user_role.role_name
        )

    async def get_user_session(self, request: Request) -> UserSessionResponse:
        """Get current user session information from HTTP request."""
        access_token = request.cookies.get("access_token")
        return await self.get_user_session_from_token(access_token)

    async def get_user_session_websocket(self, websocket: WebSocket) -> UserSessionResponse:
        """Get current user session information from websocket."""
        cookies = TokenUtils.get_websocket_cookie(websocket)
        access_token = cookies.get("access_token")
        return await self.get_user_session_from_token(access_token)

    async def logout_user(self, response: Response) -> UserLoginResponse:
        """Log out a user by clearing cookies."""
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return UserLoginResponse(message="Logout successful")