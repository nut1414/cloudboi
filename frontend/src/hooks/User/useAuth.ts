// src/hooks/User/useAuth.ts
import { useState, useCallback } from 'react'
import { UserService, UserCreateUserData, UserLoginUserData } from '../../client'
import { useUser, USER_ACTIONS } from '../../contexts/userContext'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../useForm'

export const useAuth = () => {
    const { dispatch, error: contextError } = useUser()
    const navigate = useNavigate()

    // Shared state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state using the generic hook
    const login = useForm({
        username: '',
        password: ''
    })

    const register = useForm({
        username: '',
        email: '',
        password: ''
    })

    // Clear error helper
    const clearError = useCallback(() => {
        dispatch?.({ type: USER_ACTIONS.SET_ERROR, payload: null })
    }, [dispatch])

    // Validation logic
    const validateLoginForm = (): boolean => {
        const errors: Record<string, string> = {
            username: '',
            password: ''
        }
        let valid = true

        // Username validation
        if (!login.formData.username) {
            errors.username = 'Username is required'
            valid = false
        } else if (login.formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters'
            valid = false
        }

        // Password validation
        if (!login.formData.password) {
            errors.password = 'Password is required'
            valid = false
        }

        login.setFormErrors(errors)
        return valid
    }

    const validateRegisterForm = (): boolean => {
        const errors: Record<string, string> = {
            username: '',
            email: '',
            password: ''
        }
        let valid = true

        // Username validation
        if (!register.formData.username) {
            errors.username = 'Username is required'
            valid = false
        } else if (register.formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters'
            valid = false
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!register.formData.email) {
            errors.email = 'Email is required'
            valid = false
        } else if (!emailRegex.test(register.formData.email)) {
            errors.email = 'Please enter a valid email'
            valid = false
        }

        // Password validation
        if (!register.formData.password) {
            errors.password = 'Password is required'
            valid = false
        } else if (register.formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters'
            valid = false
        }

        register.setFormErrors(errors)
        return valid
    }

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
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        if (!validateLoginForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            await loginUser(login.formData.username, login.formData.password)
            // Redirect to dashboard after successful login
            navigate(`/user/${login.formData.username}/instance`, { replace: true })
        } catch (err: any) {
            // Error is already set in the context by the login function
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        if (!validateRegisterForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            await registerUser(
                register.formData.email,
                register.formData.password,
                register.formData.username
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
        loginForm: {
            data: login.formData,
            errors: login.formErrors,
            handleChange: login.handleChange
        },

        // Register form
        registerForm: {
            data: register.formData,
            errors: register.formErrors,
            handleChange: register.handleChange
        },

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