import { UserService, UserCreateUserData, UserLoginUserData } from '../../client';
import { useUser } from '../../contexts/userContext';

export const useAuth = () => {
    const { setUser, setError } = useUser();

    // Register function
    const register = async (email: string, password: string, username: string) => {
        try {
            setError(null);
            
            const userCreate: UserCreateUserData = {
                body: {
                    email,
                    password,
                    username
                }
            };
            
            await UserService.userCreateUser(userCreate);
            
            // Login after successful registration
            await login(username, password);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Registration failed';
            setError(errorMessage);
            throw error;
        }
    };

    // Login function
    const login = async (username: string, password: string) => {
        try {
            setError(null);
            
            const userLogin: UserLoginUserData = {
                body: {
                    username,
                    password
                }
            };
            
            await UserService.userLoginUser(userLogin);
            
            // Get user session after login
            const response = await UserService.userGetUserSession();
            if (response.data) {
                setUser(response.data);
            } else {
                throw new Error('No user data returned after login');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Login failed';
            setError(errorMessage);
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            setError(null);
            
            await UserService.userLogoutUser();
            
            setUser(null);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Logout failed';
            setError(errorMessage);
            throw error;
        }
    };

    return {
        register,
        login,
        logout
    };
};