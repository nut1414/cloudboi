import { useCallback, useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"

// Special message types for control messages
const MESSAGE_TYPES = {
    TERMINAL_RESIZE: "TERMINAL_RESIZE",
    TERMINAL_INPUT: "TERMINAL_INPUT"
}

const useTerminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null)
    const xtermRef = useRef<Terminal | null>(null)
    const fitAddonRef = useRef<FitAddon | null>(null)
    const inputBufferRef = useRef<string>("")

    // Initialize terminal
    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            theme: {
              background: '#1e1e1e',
              foreground: '#f0f0f0',
            },
            convertEol: true,
        })

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)

        if (terminalRef.current) {
            term.open(terminalRef.current)
            fitAddon.fit()
            term.clear()
            term.focus()
        }

        xtermRef.current = term
        fitAddonRef.current = fitAddon

        return () => {
            term.dispose()
        }
    }, [])

    const fitTerminal = useCallback(() => {
        if (fitAddonRef.current) {
            fitAddonRef.current.fit()
        }
    }, [])

    // Function to write to terminal
    const writeToTerminal = useCallback((data: string | ArrayBuffer) => {
        xtermRef.current?.write(
            typeof data === 'string' ? data : new Uint8Array(data)
        );
    }, [])

    // Set up data handler with line buffering
    const setTerminalDataHandler = useCallback((handler: (data: string) => void) => {
        if (xtermRef.current) {
            xtermRef.current.onData((data) => {
                // Handle special keys and control characters
                const specialKey = handleSpecialKey(data, inputBufferRef.current, xtermRef.current, handler)
                if (specialKey) return
                
                // Add printable characters to the buffer and echo them
                if (isPrintableChar(data)) {
                    inputBufferRef.current += data
                    if (xtermRef.current) {
                        xtermRef.current.write(data)
                    }
                }
            })
        }
    }, [])

    // Helper functions for terminal input handling
    const isPrintableChar = (char: string): boolean => {
        return char.length === 1 && char.charCodeAt(0) >= 32
    }

    // TODO: Add more special key handling
    const handleSpecialKey = (
        key: string, 
        buffer: string, 
        term: Terminal | null,
        handler: (data: string) => void
    ): boolean => {
        // Return key - process the command
        if (key === '\r') {
            if (term) {
                term.write('\r\n') // Add new line locally
            }
            
            // Send the complete line
            handler(buffer)
            inputBufferRef.current = "" // Clear buffer
            return true
        }
        
        // Backspace key
        if (key === '\x7f') {
            if (buffer.length > 0) {
                inputBufferRef.current = buffer.slice(0, -1)
                // Move cursor back, write space, move cursor back again
                if (term) {
                    term.write('\b \b')
                }
            }
            return true
        }
        
        // Ctrl+C - send interrupt signal
        if (key === '\x03') {
            if (term) {
                term.write('^C\r\n')
            }
            handler('\x03')
            inputBufferRef.current = "" // Clear buffer
            return true
        }
        
        return false
    }

    // Get current terminal dimensions
    const getTerminalDimensions = useCallback(() => {
        if (xtermRef.current && xtermRef.current.rows && xtermRef.current.cols) {
            return {
                rows: xtermRef.current.rows,
                cols: xtermRef.current.cols
            }
        }
        return { rows: 24, cols: 80 } // Default dimensions
    }, [])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            fitTerminal()
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [fitTerminal])

    return {
        terminalRef,
        writeToTerminal,
        setTerminalDataHandler,
        fitTerminal,
        getTerminalDimensions
    }
}

// Hook for managing WebSocket connection
const useWebSocket = (
    apiBaseUrl: string,
    instanceName: string,
    onMessage: (data: string | ArrayBuffer) => void,
    getTerminalDimensions: () => { rows: number; cols: number }
  ) => {
    const wsRef = useRef<WebSocket | null>(null)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)
  
    // Send terminal dimensions through WebSocket as control message
    const updateTerminalSize = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const dimensions = getTerminalDimensions()
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
        const connectWebSocket = () => {
            try {
                // Only attempt new connection if we don't have one already
                if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
                    return
                }

                // Create WebSocket connection
                const ws = new WebSocket(`${apiBaseUrl}/instances/ws/${instanceName}`)
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
                setError('Failed to connect to terminal. Please try again later.')
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
    }, [apiBaseUrl, instanceName, onMessage, updateTerminalSize])
  
    return {
        connected,
        error,
        sendData,
        updateTerminalSize
    }
}

export { useWebSocket, useTerminal }