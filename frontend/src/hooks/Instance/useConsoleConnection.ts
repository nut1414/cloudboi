import { useCallback, useEffect, useState } from "react"
import { useWebSocketBase } from "../useWebSocketBase"
import { InstanceService } from "../../client"
import { Terminal } from "xterm"
import useToast from "../useToast"
import { getErrorMessage } from "../../utils/errorHandling"

// Hook for managing WebSocket connection for console
export const useConsoleWebSocket = (
    apiBaseUrl: string,
    instanceName: string,
    onMessage: (data: string | ArrayBuffer) => void,
    getTerminalDimensions: () => { rows: string; cols: string } | undefined,
    isRunning: boolean,
    xtermRef: React.RefObject<Terminal>
) => {
    const [consoleBuffer, setConsoleBuffer] = useState<string>("")
    const toast = useToast()

    const fetchConsoleBuffer = useCallback(async () => {
        try {
            const response = await InstanceService.instanceGetInstanceConsoleBuffer({
                path: { instance_name: instanceName }
            })
            if (response.data) {
                setConsoleBuffer(response.data)
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to fetch console buffer"))
        }
    }, [instanceName])

    // Pre-connection callback to fetch console buffer
    const preConnectionCallback = useCallback(async () => {
        if (isRunning && apiBaseUrl && instanceName) {
            await fetchConsoleBuffer()
        }
    }, [apiBaseUrl, instanceName, isRunning])

    // Get the base websocket connection
    const baseConnection = useWebSocketBase(
        apiBaseUrl,
        instanceName,
        "ws/console",
        onMessage,
        getTerminalDimensions,
        isRunning,
        preConnectionCallback
    )

    // Apply console buffer to terminal when it's loaded
    useEffect(() => {
        if (baseConnection.isPreconnectionComplete && consoleBuffer && isRunning) {
            xtermRef.current?.write(consoleBuffer)
        }
    }, [baseConnection.isPreconnectionComplete, consoleBuffer, onMessage, isRunning])

    return {
        ...baseConnection,
        isBufferLoaded: baseConnection.isPreconnectionComplete
    }
} 