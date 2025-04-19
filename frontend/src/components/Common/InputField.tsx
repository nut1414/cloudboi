import React, { InputHTMLAttributes, ReactNode, useCallback } from 'react'
import { XCircleIcon } from "@heroicons/react/24/outline"
import { useTestId } from '../../utils/testUtils'

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    // Core props
    value: string
    onChange: (value: string) => void

    // Styling and layout props
    label?: string
    icon?: ReactNode
    endIcon?: ReactNode
    placeholder?: string
    error?: string
    helperText?: string

    // Optional callbacks
    onEndIconClick?: () => void
    sanitizeValue?: (value: string) => string
}

const InputField: React.FC<InputFieldProps> = React.memo(({
    // Destructure props with defaults
    value,
    onChange,
    label,
    icon,
    endIcon,
    placeholder,
    error,
    helperText,
    onEndIconClick,
    sanitizeValue,
    type = "text",
    disabled = false,
    className = "",
    ...restProps
}) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        // Apply sanitization if provided
        const processedValue = sanitizeValue ? sanitizeValue(newValue) : newValue
        onChange(processedValue)
    }, [onChange, sanitizeValue])

    // Use the test ID hook
    const { dataTestId, cleanProps } = useTestId(restProps)
    
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-200 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full p-3 rounded-lg 
                        bg-[#23375F] 
                        border ${error ? 'border-red-500' : 'border-blue-800/30'} 
                        focus:outline-none focus:ring-2 focus:ring-purple-500
                        text-white
                        ${icon ? 'pl-10' : ''}
                        ${endIcon ? 'pr-10' : ''}
                        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    data-testid={dataTestId ? `${dataTestId}-input-field` : undefined}
                    {...cleanProps}
                />

                {endIcon && (
                    <button
                        type="button"
                        onClick={onEndIconClick}
                        disabled={disabled}
                        className={`
                        absolute right-3 top-1/2 transform -translate-y-1/2
                        text-gray-300 hover:text-purple-400 focus:outline-none
                        ${!onEndIconClick ? 'pointer-events-none' : ''}
                        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                        data-testid={dataTestId ? `${dataTestId}-input-field-end-icon` : undefined}
                    >
                        {endIcon}
                    </button>
                )}
            </div>

            {(error || helperText) && (
                <div className={`mt-1 text-sm ${error ? 'text-red-400' : 'text-gray-400'} flex items-start gap-1`} 
                    data-testid={dataTestId ? `${dataTestId}-input-field-error` : undefined}>
                    {error && <XCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <p>{error || helperText}</p>
                </div>
            )}
        </div>
    )
})

export default InputField