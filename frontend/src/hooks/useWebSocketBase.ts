import { useCallback, useEffect, useRef, useState } from "react"
import { MESSAGE_TYPES } from "../constant/TerminalConstant"

// Base WebSocket hook for terminal/console connections
export const useWebSocketBase = (
    apiBaseUrl: string,
    instanceName: string,
    endpoint: string,
    onMessage: (data: string | ArrayBuffer) => void,
    getTerminalDimensions: () => { rows: string; cols: string } | undefined,
    isRunning: boolean,
    preConnectionCallback?: () => Promise<void>
) => {
    const wsRef = useRef<WebSocket | null>(null)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPreconnectionComplete, setIsPreconnectionComplete] = useState(!preConnectionCallback)

    // Execute pre-connection callback if provided
    useEffect(() => {
        if (isRunning && apiBaseUrl && instanceName && preConnectionCallback && !isPreconnectionComplete) {
            preConnectionCallback()
                .then(() => setIsPreconnectionComplete(true))
                .catch(error => {
                    console.error("Pre-connection action failed:", error)
                    setIsPreconnectionComplete(true) // Continue even if pre-connection fails
                })
        }
    }, [apiBaseUrl, instanceName, isRunning, preConnectionCallback, isPreconnectionComplete])

    // Send terminal dimensions through WebSocket as control message
    const updateTerminalSize = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const dimensions = getTerminalDimensions() ?? { rows: "24", cols: "80" }
            const message = {
                type: MESSAGE_TYPES.TERMINAL_RESIZE,
                payload: dimensions
            }
            wsRef.current.send(JSON.stringify(message))
        }
    }, [getTerminalDimensions])
  
    // Send data through WebSocket
    const sendData = useCallback((data: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const message = {
                type: MESSAGE_TYPES.TERMINAL_INPUT,
                payload: data
            }
            wsRef.current.send(JSON.stringify(message))
        }
    }, [])
  
    // Connect to WebSocket
    useEffect(() => {
        // Don't connect until pre-connection tasks are complete
        if (!isRunning || !apiBaseUrl || !instanceName || !isPreconnectionComplete) {
            return
        }
        
        const connectWebSocket = () => {
            try {
                // Only attempt new connection if we don't have one already
                if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
                    return
                }

                // Create WebSocket connection
                const ws = new WebSocket(`${apiBaseUrl}/instance/${endpoint}/${instanceName}`)
                wsRef.current = ws
        
                ws.onopen = () => {
                    setConnected(true)
                    setError(null)
                    
                    // Initial terminal size update
                    setTimeout(updateTerminalSize, 500)
                }
                
                ws.binaryType = 'arraybuffer'
                ws.onmessage = (event: MessageEvent<ArrayBuffer>) => {
                    // Pass terminal data to handler
                    onMessage(event.data)
                }
        
                ws.onclose = (event) => {
                    setConnected(false)
                    
                    // Try to reconnect unless it was a normal closure
                    if (event.code !== 1000) {
                        setError('Connection lost. Attempting to reconnect...')
                        setTimeout(connectWebSocket, 3000)
                    }
                }
        
                ws.onerror = (error) => {
                    console.error('WebSocket error:', error)
                    setError('Connection error. Please try again later.')
                }
            } catch (error) {
                console.error('Failed to connect:', error)
                setError('Failed to connect. Please try again later.')
            }
        }
    
        connectWebSocket()
    
        // Clean up WebSocket on component unmount
        return () => {
            if (wsRef.current) {
                // Use code 1000 for normal closure
                wsRef.current.close(1000, 'Component unmounted')
                wsRef.current = null
            }
        }
    }, [apiBaseUrl, instanceName, onMessage, updateTerminalSize, isRunning, endpoint, isPreconnectionComplete])
  
    return {
        connected,
        error,
        sendData,
        updateTerminalSize,
        isPreconnectionComplete
    }
}