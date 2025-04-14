import { useWebSocketBase } from "../useWebSocketBase"

// Terminal WebSocket hook
export const useTerminalWebSocket = (
    apiBaseUrl: string,
    instanceName: string,
    onMessage: (data: string | ArrayBuffer) => void,
    getTerminalDimensions: () => { rows: string; cols: string } | undefined,
    isRunning: boolean
) => {
    return useWebSocketBase(
        apiBaseUrl,
        instanceName,
        "ws/terminal",
        onMessage,
        getTerminalDimensions,
        isRunning
    )
}