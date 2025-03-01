import { Terminal } from "xterm"
import { KEY_CODES } from "../constant/TerminalConstant"

export const isPrintableChar = (char: string): boolean => {
    return char.length === 1 && char.charCodeAt(0) >= 32
}

type HistoryRef = React.MutableRefObject<string[]>
type HistoryPosRef = React.MutableRefObject<number>

interface KeyHandlerContext {
    buffer: string
    cursorPos: number
    term: Terminal | null
    handler: (data: string) => void
    history: HistoryRef
    historyPos: HistoryPosRef
    inputBufferRef: React.MutableRefObject<string>
    cursorPosRef: React.MutableRefObject<number>
}

// Key handler functions
const handleEnterKey = (context: KeyHandlerContext): boolean => {
    const { term, buffer, handler, history, historyPos, inputBufferRef, cursorPosRef } = context
    
    if (term) {
        term.write('\r\n') // Add new line locally
    }
    
    // Add command to history if it's not empty
    if (buffer.trim().length > 0) {
        history.current.push(buffer)
        historyPos.current = history.current.length
    }
    
    // Send the complete line
    handler(buffer)
    inputBufferRef.current = "" // Clear buffer
    cursorPosRef.current = 0
    return true
}

const handleBackspaceKey = (context: KeyHandlerContext): boolean => {
    const { buffer, cursorPos, term, inputBufferRef, cursorPosRef } = context
    
    if (buffer.length > 0 && cursorPos > 0) {
        // Remove character before cursor
        const newBuffer = buffer.substring(0, cursorPos - 1) + buffer.substring(cursorPos)
        inputBufferRef.current = newBuffer
        cursorPosRef.current--
        
        if (term) {
            // Move cursor back
            term.write('\b')
            
            if (cursorPos < buffer.length) {
                // We're in the middle of text, need to redraw everything after cursor
                // Clear from cursor to end of line
                term.write('\x1b[K')
                
                // Write the rest of the buffer
                term.write(buffer.substring(cursorPos))
                
                // Move cursor back to correct position
                term.write(`\x1b[${buffer.length - cursorPos}D`)
            } else {
                // We're at the end, just erase the last character
                term.write(' \b')
            }
        }
    }
    return true
}

const handleCtrlC = (context: KeyHandlerContext): boolean => {
    const { term, handler, inputBufferRef, cursorPosRef } = context
    
    if (term) {
        term.write('^C\r\n')
    }
    handler('\x03')
    inputBufferRef.current = "" // Clear buffer
    cursorPosRef.current = 0
    return true
}

const handleCtrlD = (context: KeyHandlerContext): boolean => {
    const { buffer, handler } = context
    
    if (buffer.length === 0) {
        handler('\x04') // Send EOF
        return true
    }
    // If buffer is not empty, Ctrl+D is typically ignored
    return false
}

const handleLeftArrow = (context: KeyHandlerContext): boolean => {
    const { cursorPos, term, cursorPosRef } = context
    
    if (cursorPos > 0) {
        cursorPosRef.current--
        if (term) {
            // Only send the escape sequence, no redrawing needed
            term.write(KEY_CODES.LEFT_ARROW)
        }
    }
    return true
}

const handleRightArrow = (context: KeyHandlerContext): boolean => {
    const { cursorPos, buffer, term, cursorPosRef } = context
    
    if (cursorPos < buffer.length) {
        cursorPosRef.current++
        if (term) {
            // Only send the escape sequence, no redrawing needed
            term.write(KEY_CODES.RIGHT_ARROW)
        }
    }
    return true
}

const handleUpArrow = (context: KeyHandlerContext): boolean => {
    const { buffer, term, history, historyPos, inputBufferRef, cursorPosRef } = context
    
    if (history.current.length > 0 && historyPos.current > 0) {
        historyPos.current--
        const historyItem = history.current[historyPos.current]
        
        if (term) {
            // Clear current line first
            if (buffer.length > 0) {
                // Move to start of line
                term.write('\r')
                
                // Clear the entire line (or use multiple backspaces)
                term.write('\x1b[K')
            }
            
            // Write history item
            term.write(historyItem)
        }
        
        inputBufferRef.current = historyItem
        cursorPosRef.current = historyItem.length
    }
    return true
}

const handleDownArrow = (context: KeyHandlerContext): boolean => {
    const { buffer, term, history, historyPos, inputBufferRef, cursorPosRef } = context
    
    if (historyPos.current < history.current.length - 1) {
        historyPos.current++
        const historyItem = history.current[historyPos.current]
        
        if (term) {
            // Clear current line first
            if (buffer.length > 0) {
                // Move to start of line
                term.write('\r')
                
                // Clear the entire line
                term.write('\x1b[K')
            }
            
            // Write history item
            term.write(historyItem)
        }
        
        inputBufferRef.current = historyItem
        cursorPosRef.current = historyItem.length
    } else if (historyPos.current === history.current.length - 1) {
        // At the end of history, clear the line
        historyPos.current = history.current.length
        
        if (term) {
            // Clear current line
            if (buffer.length > 0) {
                term.write('\r\x1b[K')
            }
        }
        
        inputBufferRef.current = ''
        cursorPosRef.current = 0
    }
    return true
}

const handleDeleteKey = (context: KeyHandlerContext): boolean => {
    const { buffer, cursorPos, term, inputBufferRef } = context
    
    if (cursorPos < buffer.length) {
        // Remove character at cursor position
        const newBuffer = buffer.substring(0, cursorPos) + buffer.substring(cursorPos + 1)
        inputBufferRef.current = newBuffer
        
        if (term) {
            // Clear from cursor to end of line
            term.write('\x1b[K')
            
            // Write the rest of the buffer
            term.write(newBuffer.substring(cursorPos))
            
            // Move cursor back to correct position
            if (cursorPos < newBuffer.length) {
                term.write(`\x1b[${newBuffer.length - cursorPos}D`)
            }
        }
    }
    return true
}

// Main function that delegates to appropriate handlers
export const handleSpecialKey = (
    key: string, 
    buffer: string,
    cursorPos: number,
    term: Terminal | null,
    handler: (data: string) => void,
    history: HistoryRef,
    historyPos: HistoryPosRef,
    inputBufferRef: React.MutableRefObject<string>,
    cursorPosRef: React.MutableRefObject<number>
): boolean => {
    const context: KeyHandlerContext = {
        buffer,
        cursorPos,
        term,
        handler,
        history,
        historyPos,
        inputBufferRef,
        cursorPosRef
    }

    // Handle keys based on their codes
    if (key === KEY_CODES.ENTER) {
        return handleEnterKey(context)
    }
    
    if (key === KEY_CODES.BACKSPACE) {
        return handleBackspaceKey(context)
    }
    
    if (key === KEY_CODES.CTRL_C) {
        return handleCtrlC(context)
    }
    
    if (key === KEY_CODES.CTRL_D) {
        return handleCtrlD(context)
    }
    
    // Handle escape sequences
    if (key.startsWith(KEY_CODES.ESC_PREFIX)) {
        switch (key) {
            case KEY_CODES.LEFT_ARROW:
                return handleLeftArrow(context)
            case KEY_CODES.RIGHT_ARROW:
                return handleRightArrow(context)
            case KEY_CODES.UP_ARROW:
                return handleUpArrow(context)
            case KEY_CODES.DOWN_ARROW:
                return handleDownArrow(context)
            case KEY_CODES.DELETE:
                return handleDeleteKey(context)
            default:
                // Consume other escape sequences
                return true
        }
    }
    
    return false
}