import { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { UserService, UserCreateUserData, UserLoginUserData, UserCreateRequest, UserLoginRequest } from '../../client'
import { useUser, USER_ACTIONS } from '../../contexts/userContext'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { user, dispatch, error: contextError } = useUser()
  const navigate = useNavigate()
  
  // Shared state
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // React Hook Form setup
  const loginForm = useForm<UserLoginRequest>({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  
  const registerForm = useForm<UserCreateRequest>({
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })
  
  // Clear error helper
  const clearError = useCallback(() => {
    dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: null })
  }, [dispatch])
  
  // API calls
  const registerUser = useCallback(async (email: string, password: string, username: string) => {
    try {
      clearError()
      
      const userCreate: UserCreateUserData = {
        body: {
          email,
          password,
          username
        }
      }
      
      await UserService.userCreateUser(userCreate)
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed'
      dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
      throw error
    }
  }, [dispatch, clearError])
  
  const loginUser = useCallback(async (username: string, password: string) => {
    try {
      clearError()
      
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
        return response.data // Return the user data
      } else {
        throw new Error('No user data returned after login')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
      throw error
    }
  }, [dispatch, clearError])
  
  const logout = useCallback(async () => {
    try {
      clearError()
      
      await UserService.userLogoutUser()
      
      dispatch?.({ type: USER_ACTIONS.LOGOUT })
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Logout failed'
      dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
      throw error
    }
  }, [dispatch, clearError])
  
  // Form submission handlers
  const handleLoginSubmit: SubmitHandler<UserLoginRequest> = async (data) => {
    clearError()
    setIsSubmitting(true)
    
    try {
      const userData = await loginUser(data.username, data.password)
      // Use the returned userData directly to determine redirect path
      navigate(userData.role === "admin" ? `/admin/system` : `/user/${data.username}/instance`, { replace: true })
    } catch (err: any) {
      // Error is already set in the context by the login function
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleRegisterSubmit: SubmitHandler<UserCreateRequest> = async (data) => {
    clearError()
    setIsSubmitting(true)
    
    try {
      await registerUser(
        data.email,
        data.password,
        data.username
      )
      navigate(`/login`, { replace: true })
    } catch (err: any) {
      // Error is already set in the context by the register function
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return {
    // Login form
    loginForm,
    
    // Register form
    registerForm,
    
    // Shared state and methods
    isSubmitting,
    error: contextError,
    handleLoginSubmit,
    handleRegisterSubmit,
    clearError,
    loginUser,
    registerUser,
    logout
  }
}