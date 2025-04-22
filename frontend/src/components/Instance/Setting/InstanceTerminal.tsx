import React, { useEffect } from 'react'
import { useTerminalWebSocket } from '../../../hooks/Instance/useTerminalConnection'
import { useXTerm } from '../../../hooks/useXTerm'
import { WS_URL } from '../../../config/api'
import 'xterm/css/xterm.css'
import { StatusHeader, StatusMessage, StatusFooter } from './InstanceStatus'

interface InstanceTerminalProps {
    instanceName: string,
    isRunning: boolean,
}

const InstanceTerminal: React.FC<InstanceTerminalProps> = ({ instanceName, isRunning }) => {
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
        updateTerminalSize
    } = useTerminalWebSocket(
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
            <StatusHeader 
                connected={connected} 
                instanceName={instanceName} 
                error={error || undefined} 
                type="Terminal"
            />

            <div
                className="flex-grow bg-[#0d1729] w-full h-full relative overflow-hidden"
                style={{ position: 'relative' }}
            >
                <StatusMessage 
                    isRunning={isRunning} 
                    connected={connected} 
                    error={error || undefined} 
                    type="terminal"
                />

                <div
                    ref={terminalRef}
                    className="p-2"
                    data-testid="instance-terminal-container"
                />
            </div>

            <StatusFooter type="terminal" />
        </div>
    )
}

export default InstanceTerminal