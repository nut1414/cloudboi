import { useCallback, useEffect, useRef } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"

// Base terminal hook for initializing and controlling xterm.js
export const useXTerm = () => {
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
        xtermRef.current?.onData((data) => {
            handler(data)
        })
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
        xtermRef,
        writeToTerminal,
        setTerminalDataHandlerV2,
        fitTerminal,
        getTerminalDimensions
    }
}