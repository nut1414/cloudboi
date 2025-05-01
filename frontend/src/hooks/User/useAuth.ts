import { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { UserService, UserCreateUserData, UserLoginUserData, UserCreateRequest, UserLoginRequest } from '../../client'
import { useUser, USER_ACTIONS } from '../../contexts/userContext'
import { useNavigate } from 'react-router-dom'
import useToast from '../useToast'
import { getErrorMessage } from '../../utils/errorHandling'

export const useAuth = () => {
  const { dispatch, error: contextError } = useUser()
  const navigate = useNavigate()
  const toast = useToast()
  
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
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Registration failed')
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
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Login failed')
      dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
      throw error
    }
  }, [dispatch, clearError])
  
  const logout = useCallback(async () => {
    try {
      clearError()
      
      await UserService.userLogoutUser()
      
      dispatch?.({ type: USER_ACTIONS.LOGOUT })
      toast.success('Logout successful')
      navigate('/login', { replace: true })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Logout failed')
      dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage })
      throw error
    }
  }, [dispatch, clearError, navigate, toast])
  
  // Form submission handlers
  const handleLoginSubmit: SubmitHandler<UserLoginRequest> = async (data) => {
    clearError()
    setIsSubmitting(true)
    
    try {
      const userData = await loginUser(data.username, data.password)
      toast.success('Login successful')
      // Use the returned userData directly to determine redirect path
      navigate(userData.role === "admin" ? `/admin/system` : `/user/${data.username}/instance`, { replace: true })
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
      toast.success('Registration successful')
      navigate(`/login`, { replace: true })
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