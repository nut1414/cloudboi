import React, { useEffect, useMemo } from 'react'
import { useTerminal, useWebSocket } from '../../hooks/Instance/useTerminalConnection'
import 'xterm/css/xterm.css'

interface InstanceTerminalProps {
  instanceName: string
  apiBaseUrl: string
}

const InstanceTerminal: React.FC<InstanceTerminalProps> = ({ instanceName, apiBaseUrl }) => {
    // Use terminal hook
    const {
        terminalRef,
        writeToTerminal,
        setTerminalDataHandlerV2,
        fitTerminal,
        getTerminalDimensions
    } = useTerminal()

    // Use WebSocket hook
    const {
        connected,
        error,
        sendData,
        updateTerminalSize
    } = useWebSocket(
        apiBaseUrl,
        instanceName,
        writeToTerminal,
        getTerminalDimensions
    )

    // Connect terminal data events to WebSocket
    useEffect(() => {
        setTerminalDataHandlerV2(sendData)
    }, [sendData, setTerminalDataHandlerV2])

    // Fit terminal when needed
    useEffect(() => {
        if (connected) {
            fitTerminal()
            updateTerminalSize()
        }
    }, [connected, fitTerminal, updateTerminalSize])

    const Terminal = useMemo(() => {
        return (
            <div className="relative h-full w-full">
                {error && (
                    <div className="px-3 py-2 bg-red-600 bg-opacity-80 text-white rounded">
                        {error}
                    </div>
                )}
                
                {!connected && !error && (
                    <div className="px-3 py-2 bg-black bg-opacity-70 text-white rounded">
                        Connecting to terminal...
                    </div>
                )}
                
                <div 
                    ref={terminalRef} 
                    className="h-full w-full"
                    style={{ textAlign: 'left' }}
                />
            </div>
        )
    },[connected, error, terminalRef])

    return (
        <div className="container p-4">
            <h1 className="text-2xl font-bold mb-4">LXD Terminal</h1>
            <div className="flex flex-col h-screen">
                <div className="flex-grow border border-gray-300 rounded overflow-hidden shadow-md">
                    {Terminal}
                </div>
            </div>
        </div>
    )
}


export default InstanceTerminal