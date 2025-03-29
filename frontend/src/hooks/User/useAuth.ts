// src/hooks/useAuth.ts
import { useCallback } from 'react'
import { UserService, UserCreateUserData, UserLoginUserData } from '../../client'
import { useUser, USER_ACTIONS } from '../../contexts/userContext'

export const useAuth = () => {
    const { dispatch } = useUser()

    // Register function
    const register = useCallback(async (email: string, password: string, username: string) => {
        try {
            dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: null })
            
            const userCreate: UserCreateUserData = {
                body: {
                    email,
                    password,
                    username
                }
            }
            
            await UserService.userCreateUser(userCreate)
            
            // Login after successful registration
            await login(username, password)
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Registration failed'
            dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
            throw error
        }
    }, [dispatch])

    // Login function
    const login = useCallback(async (username: string, password: string) => {
        try {
            dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: null })
            
            const userLogin: UserLoginUserData = {
                body: {
                    username,
                    password
                }
            }
            
            await UserService.userLoginUser(userLogin)
            
            // Get user session after login
            const response = await UserService.userGetUserSession()
            if (response.data) {
                dispatch?.({ type: USER_ACTIONS.SET_USER, payload: response.data })
            } else {
                throw new Error('No user data returned after login')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Login failed'
            dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
            throw error
        }
    }, [dispatch])

    // Logout function
    const logout = useCallback(async () => {
        try {
            dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: null })
            
            await UserService.userLogoutUser()
            
            dispatch?.({ type: USER_ACTIONS.LOGOUT })
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Logout failed'
            dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
            throw error
        }
    }, [dispatch])

    return {
        register,
        login,
        logout
    }
}