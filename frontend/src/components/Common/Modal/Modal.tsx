import React, { useRef, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from '../Button/Button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnClickOutside?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Handle escape key press
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose, closeOnClickOutside])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200">
      <div 
        className={`bg-[#192A51] rounded-xl shadow-lg border border-blue-900/30 w-full ${sizeClasses[size]} transform transition-transform duration-300 ease-out`}
        ref={modalRef}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-blue-800/30">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 border-t border-blue-800/30 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal 