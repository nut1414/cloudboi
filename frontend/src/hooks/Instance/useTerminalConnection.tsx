import { useCallback, useEffect, useRef, useState } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { MESSAGE_TYPES } from "../../constant/TerminalConstant"
import { handleSpecialKey, isPrintableChar } from "../../utils/TerminalHelper"

const useTerminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null)
    const xtermRef = useRef<Terminal | null>(null)
    const fitAddonRef = useRef<FitAddon | null>(null)
    const inputBufferRef = useRef<string>("")
    const cursorPosRef = useRef<number>(0)
    const historyRef = useRef<string[]>([])
    const historyPosRef = useRef<number>(-1)

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
        )
    }, [])

    // Set up data handler with line buffering
    const setTerminalDataHandler = useCallback((handler: (data: string) => void) => {
        if (xtermRef.current) {
            xtermRef.current.onData((data) => {
                // Handle special keys and control characters
                const specialKey = handleSpecialKey(
                    data, 
                    inputBufferRef.current,
                    cursorPosRef.current,
                    xtermRef.current, 
                    handler,
                    historyRef,
                    historyPosRef,
                    inputBufferRef,
                    cursorPosRef
                )
                if (specialKey) return
                
                // Add printable characters to the buffer and echo them
                if (isPrintableChar(data) && xtermRef.current) {
                    if (cursorPosRef.current === inputBufferRef.current.length) {
                        // Append at the end
                        inputBufferRef.current += data
                        cursorPosRef.current++
                        xtermRef.current.write(data)
                    } else {
                        // Insert in the middle
                        const newBuffer = 
                            inputBufferRef.current.substring(0, cursorPosRef.current) + 
                            data + 
                            inputBufferRef.current.substring(cursorPosRef.current)
                        
                        inputBufferRef.current = newBuffer
                        cursorPosRef.current++
                        
                        // Clear line from cursor to end and write remaining text
                        xtermRef.current.write(data + 
                            inputBufferRef.current.substring(cursorPosRef.current))
                        
                        // Move cursor back to the right position
                        if (cursorPosRef.current < inputBufferRef.current.length) {
                            xtermRef.current.write(
                                `\x1b[${inputBufferRef.current.length - cursorPosRef.current}D`
                            )
                        }
                    }
                }
            })
        }
    }, [])

    // Get current terminal dimensions
    const getTerminalDimensions = useCallback(() => {
        if (xtermRef.current && xtermRef.current.rows && xtermRef.current.cols) {
            return {
                rows: xtermRef.current.rows,
                cols: xtermRef.current.cols
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
            const dimensions = getTerminalDimensions() ?? { rows: 24, cols: 80 }
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