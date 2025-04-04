import { useState } from "react"

export function useForm<T extends Record<string, any>>(initialState: T) {
    const [formData, setFormData] = useState<T>(initialState)
    const [formErrors, setFormErrors] = useState<Record<keyof T, string>>(() => {
        // Initialize all error fields as empty strings
        return Object.keys(initialState).reduce((acc, key) => {
            acc[key as keyof T] = ''
            return acc
        }, {} as Record<keyof T, string>)
    })

    const handleChange = (field: keyof T, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const resetForm = () => {
        setFormData(initialState)
        setFormErrors(Object.keys(initialState).reduce((acc, key) => {
            acc[key as keyof T] = ''
            return acc
        }, {} as Record<keyof T, string>))
    }

    return {
        formData,
        formErrors,
        handleChange,
        setFormErrors,
        resetForm
    }
}