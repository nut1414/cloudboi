import React, { useEffect } from 'react'
import { useConsoleWebSocket } from '../../../hooks/Instance/useConsoleConnection'
import { useXTerm } from '../../../hooks/useXTerm'
import { WS_URL } from '../../../config/api'
import 'xterm/css/xterm.css'
import { StatusHeader, StatusMessage, StatusFooter } from './InstanceStatus'

interface InstanceConsoleProps {
    instanceName: string,
    isRunning: boolean,
}

const InstanceConsole: React.FC<InstanceConsoleProps> = ({ instanceName, isRunning }) => {
    // Use terminal hook
    const {
        terminalRef,
        xtermRef,
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
        isRunning,
        xtermRef
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
                type="Text Console" 
            />

            <div
                className="flex-grow bg-[#0d1729] w-full h-full relative overflow-hidden"
                style={{ position: 'relative' }}
            >
                <StatusMessage 
                    isRunning={isRunning} 
                    connected={connected} 
                    error={error || undefined}
                    isBufferLoaded={isBufferLoaded}
                    type="console"
                />

                <div
                    ref={terminalRef}
                    className="p-2"
                    data-testid="instance-console-container"
                />
            </div>

            <StatusFooter type="console" />
        </div>
    )
}

export default InstanceConsole 