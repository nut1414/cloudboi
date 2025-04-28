import React from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface StatusHeaderProps {
  connected: boolean
  instanceName: string
  error?: string
  type?: string
}

interface StatusMessageProps {
  isRunning: boolean
  connected: boolean
  error?: string
  isBufferLoaded?: boolean
  type?: 'terminal' | 'console'
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({ 
  connected, 
  instanceName, 
  error, 
  type 
}) => {
  return (
    <div className="flex items-center justify-between bg-[#172a47] px-4 py-2 border-b border-blue-900/30">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm text-gray-300">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {error && (
        <div className="flex items-center">
          <span className="text-xs text-red-400 mr-2">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="p-1 bg-blue-800/30 hover:bg-blue-700/50 rounded text-blue-300 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="text-xs text-gray-400">
        {instanceName}{type ? ` - ${type}` : ''}
      </div>
    </div>
  )
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ 
  isRunning, 
  connected, 
  error, 
  isBufferLoaded, 
  type = 'terminal' 
}) => {
  if (!isRunning) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
        <div className="flex items-center space-x-3 bg-red-900/20 px-4 py-2 rounded-md border border-red-800/30">
          <span className="text-gray-300">{type === 'terminal' ? 'Terminal' : 'Console'} unavailable - <span className="text-red-400 font-medium">Instance not running</span></span>
        </div>
      </div>
    )
  }
  
  if (!connected && !error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
        <div className="flex items-center space-x-3 bg-[#172a47] px-4 py-2 rounded-md border border-blue-800/30">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-200">
            {type === 'console' && isBufferLoaded !== undefined 
              ? isBufferLoaded 
                ? 'Connecting to console...' 
                : 'Loading console buffer...'
              : `Connecting to ${type}...`}
          </span>
        </div>
      </div>
    )
  }
  
  return null
}

export const StatusFooter: React.FC<{type?: 'terminal' | 'console'}> = ({ type = 'terminal' }) => {
  return (
    <div className="px-3 py-2 bg-[#172a47] border-t border-blue-900/30 text-xs text-gray-400">
      {type === 'console' 
        ? 'Instance Text Console - Press Ctrl+C to cancel, Ctrl+D to exit'
        : 'Instance Terminal - Press Ctrl+C to cancel, Ctrl+D to exit'}
    </div>
  )
} 