"""
API client for making requests to the backend.
This module provides a clean interface for making API requests with consistent error handling.
"""
import json
from typing import Dict, Any, Optional
from playwright.sync_api import Page, APIResponse

from ..data.models import UserData, UserInstanceData

class ApiClient:
    """
    A client for making API requests with consistent error handling.
    This class centralizes all API interactions for better maintainability.
    """
    def __init__(self, page: Page, base_url: str):
        """
        Initialize the API client with a page and base URL.
        
        Args:
            page: The Page object to use for making requests
            base_url: The base URL for all API requests
        """
        self.page = page
        self.base_url = base_url
        
    def make_request(
        self, 
        endpoint: str, 
        data: Optional[Dict[str, Any]] = None,
        method: str = "post", 
        action_name: str = "API request"
    ) -> Optional[APIResponse]:
        """
        Make an API request with error handling.
        
        Args:
            endpoint: The API endpoint (will be appended to base_url)
            data: The data to send in the request body
            method: The HTTP method to use (get, post, put, delete, etc.)
            action_name: A name for the action (used in logging)
            
        Returns:
            The API response if successful, None if the request failed in a non-critical way
        """
        if self.page is None:
            return None
            
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
            
        try:
            # Get the appropriate method from the APIRequestContext
            request_method = getattr(self.page.context.request, method.lower())
            
            # Prepare arguments for the request
            kwargs = {"headers": {"Content-Type": "application/json"}}
            
            # Only include data for methods that support a body
            if data is not None and method.lower() not in ["get", "head"]:
                kwargs["data"] = json.dumps(data)
                
            # For GET requests, convert data to params if provided
            if method.lower() == "get" and data is not None:
                kwargs["params"] = data
                
            # Make the request
            response = request_method(url, **kwargs)
            
            if response.status >= 400:
                print(f"{action_name} warning - Status: {response.status}")
                try:
                    error_details = response.json()
                    print(f"{action_name} details: {error_details}")
                except Exception:
                    print(f"Could not parse error response: {response.text()[:100]}...")
                
                if response.status >= 500:
                    print(f"Server error detected, skipping {action_name}")
                    return None
                elif response.status != 409:  # 409 = User already exists (acceptable for registration)
                    if "login" in action_name.lower() and response.status == 401:
                        raise Exception(f"Authentication failed: Invalid credentials")
                    else:
                        raise Exception(f"{action_name} failed with status {response.status}")
            
            return response
        except json.JSONDecodeError as e:
            print(f"{action_name} response is not valid JSON: {str(e)}")
            return None
        except Exception as e:
            print(f"{action_name} exception: {str(e)}")
            if "502 Bad Gateway" in str(e):
                print(f"502 Bad Gateway detected, skipping {action_name}")
                return None
            raise
    
    # User Management API Methods
    def register_user(self, user: UserData) -> Optional[APIResponse]:
        """Register a new user"""
        data = {
            "username": user.username,
            "email": user.email,
            "password": user.password
        }
        return self.make_request("user/register", data, action_name="Registration")
    
    def create_admin_user(self, user: UserData) -> Optional[APIResponse]:
        """Create an admin user"""
        data = {
            "username": user.username,
            "email": user.email,
            "password": user.password
        }
        return self.make_request("user/admin/create", data, action_name="Admin creation")
    
    def login_user(self, user: UserData) -> Optional[APIResponse]:
        """Login a user"""
        data = {
            "username": user.username,
            "password": user.password
        }
        return self.make_request("user/login", data, action_name="Login")
        
    # Instance Management API Methods
    def start_instance(self, hostname: str) -> Optional[APIResponse]:
        """Start an instance by hostname"""
        return self.make_request(f"instance/{hostname}/start", method="post", action_name="Start Instance")
    
    def stop_instance(self, hostname: str) -> Optional[APIResponse]:
        """Stop an instance by hostname"""
        return self.make_request(f"instance/{hostname}/stop", method="post", action_name="Stop Instance")

    def delete_instance(self, hostname: str) -> Optional[APIResponse]:
        """Delete an instance by hostname"""
        return self.make_request(f"instance/{hostname}/delete", method="post", action_name="Delete Instance")
    
    def create_instance(self, instance_data: UserInstanceData) -> Optional[APIResponse]:
        """
        Create a new instance
        
        Args:
            instance_data: Instance configuration data
            
        Returns:
            API response if successful, None otherwise
        """
        data = {
            "instance_name": instance_data.hostname,
            "root_password": instance_data.root_password,
            "os_type": {
                "os_type_id": instance_data.os_type.os_type_id,
                "os_image_name": instance_data.os_type.os_image_name,
                "os_image_version": instance_data.os_type.os_image_version
            },
            "instance_plan": {
                "instance_plan_id": instance_data.instance_plan.instance_plan_id,
                "instance_package_name": instance_data.instance_plan.instance_package_name,
                "vcpu_amount": instance_data.instance_plan.vcpu_amount,
                "ram_amount": instance_data.instance_plan.ram_amount,
                "storage_amount": instance_data.instance_plan.storage_amount,
                "cost_hour": instance_data.instance_plan.cost_hour
            }
        }
        return self.make_request("instance/create", data, action_name="Create Instance")
    
    # Billing API Methods
    def trigger_overdue_subscription_action(self, instance_name: str) -> Optional[APIResponse]:
        """Trigger overdue subscription action"""
        return self.make_request(f"billing/trigger/overdue/{instance_name}", method="post", action_name="Trigger Overdue Subscription Action")
    
    def trigger_expired_subscription_action(self, instance_name: str) -> Optional[APIResponse]:
        """Trigger expired subscription action"""
        return self.make_request(f"billing/trigger/expired/{instance_name}", method="post", action_name="Trigger Expired Subscription Action")
    
    def user_topup(self, username: str, amount: float) -> Optional[APIResponse]:
        """User topup"""
        data = {
            "amount": amount
        }
        return self.make_request(f"billing/topup/{username}", data, method="post", action_name="User Topup")

    # Admin API Methods
    def admin_topup(self, username: str, amount: float) -> Optional[APIResponse]:
        """Admin topup"""
        data = {
            "username": username,
            "amount": amount
        }
        return self.make_request("admin/topup", data, action_name="Admin Topup")
