import { useCallback, useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { MESSAGE_TYPES } from "../../constant/TerminalConstant"

const useTerminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null)
    const xtermRef = useRef<Terminal | null>(null)
    const fitAddonRef = useRef<FitAddon | null>(null)

    // Initialize terminal
    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#0d1729',
                foreground: '#e2e8f0',
                cursor: '#a855f7', // Purple cursor
                black: '#263238',
                red: '#ff5252',
                green: '#5cf19e',
                yellow: '#ffd740',
                blue: '#40c4ff',
                magenta: '#ff4081',
                cyan: '#64fcda',
                white: '#ffffff',
            },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            lineHeight: 1.2,
            scrollback: 3000,
            convertEol: true,
        })

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)

        if (terminalRef.current) {
            term.open(terminalRef.current)
            fitAddon.fit()
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
        )
    }, [])

    const setTerminalDataHandlerV2 = useCallback((handler: (data: string) => void) => {
        if (xtermRef.current) {
            xtermRef.current.onData((data) => {
                handler(data)
            })
        }
    }, [])

    // Get current terminal dimensions
    const getTerminalDimensions = useCallback(() => {
        if (xtermRef.current && xtermRef.current.rows && xtermRef.current.cols) {
            return {
                rows: xtermRef.current.rows.toString(),
                cols: xtermRef.current.cols.toString()
            }
        }
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
        setTerminalDataHandlerV2,
        fitTerminal,
        getTerminalDimensions
    }
}

// Hook for managing WebSocket connection
const useWebSocket = (
    apiBaseUrl: string,
    instanceName: string,
    onMessage: (data: string | ArrayBuffer) => void,
    getTerminalDimensions: () => { rows: string; cols: string } | undefined
  ) => {
    const wsRef = useRef<WebSocket | null>(null)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const textEncoder = new TextEncoder();
  
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

    const sendDataV2 = useCallback((data: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(textEncoder.encode(data))
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
                const ws = new WebSocket(`${apiBaseUrl}/instance/ws/${instanceName}`)
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
        sendDataV2,
        updateTerminalSize
    }
}

export { useWebSocket, useTerminal }