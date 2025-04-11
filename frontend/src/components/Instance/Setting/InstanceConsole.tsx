import React, { useEffect } from 'react'
import { useConsoleWebSocket } from '../../../hooks/Instance/useConsoleConnection'
import { useXTerm } from '../../../hooks/useXTerm'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { WS_URL } from '../../../config/api'
import 'xterm/css/xterm.css'

interface InstanceConsoleProps {
    instanceName: string,
    isRunning: boolean,
}

const InstanceConsole: React.FC<InstanceConsoleProps> = ({ instanceName, isRunning }) => {
    // Use terminal hook
    const {
        terminalRef,
        writeToTerminal,
        setTerminalDataHandlerV2,
        fitTerminal,
        getTerminalDimensions
    } = useXTerm()
    
    // Use WebSocket hook only if instance is running
    const {
        connected,
        error,
        sendData,
        updateTerminalSize,
        isBufferLoaded
    } = useConsoleWebSocket(
        WS_URL,
        instanceName,
        writeToTerminal,
        getTerminalDimensions,
        isRunning
    )

    // Connect terminal data events to WebSocket
    useEffect(() => {
        if (isRunning) {
            setTerminalDataHandlerV2(sendData)
        }
    }, [sendData, setTerminalDataHandlerV2, isRunning])

    // Fit terminal when component mounts or connection status changes
    useEffect(() => {
        if (connected && isRunning) {
            setTimeout(() => {
                fitTerminal()
                updateTerminalSize()
            }, 100)
        }
    }, [connected, fitTerminal, updateTerminalSize, isRunning])

    return (
        <div className="flex flex-col h-full">
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
                    {instanceName} - Text Console
                </div>
            </div>

            <div
                className="flex-grow bg-[#0d1729] w-full h-full relative overflow-hidden"
                style={{ position: 'relative' }}
            >
                {!isRunning ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="flex items-center space-x-3 bg-red-900/20 px-4 py-2 rounded-md border border-red-800/30">
                            <span className="text-gray-300">Console unavailable - <span className="text-red-400 font-medium">Instance not running</span></span>
                        </div>
                    </div>
                ) : !connected && !error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="flex items-center space-x-3 bg-[#172a47] px-4 py-2 rounded-md border border-blue-800/30">
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-blue-200">
                                {isBufferLoaded ? 'Connecting to console...' : 'Loading console buffer...'}
                            </span>
                        </div>
                    </div>
                ) : null}

                <div
                    ref={terminalRef}
                    className="p-2"
                />
            </div>

            <div className="px-3 py-2 bg-[#172a47] border-t border-blue-900/30 text-xs text-gray-400">
                Instance Text Console - Press Ctrl+C to cancel, Ctrl+D to exit
            </div>
        </div>
    )
}

export default InstanceConsole 