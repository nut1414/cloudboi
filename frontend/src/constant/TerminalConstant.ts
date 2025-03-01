export const KEY_CODES = {
    ENTER: '\r',
    BACKSPACE: '\x7f',
    CTRL_C: '\x03',
    CTRL_D: '\x04',
    ESC_PREFIX: '\x1b',
    LEFT_ARROW: '\x1b[D',
    RIGHT_ARROW: '\x1b[C',
    UP_ARROW: '\x1b[A',
    DOWN_ARROW: '\x1b[B',
    DELETE: '\x1b[3~',
}

export const MESSAGE_TYPES = {
    TERMINAL_RESIZE: "TERMINAL_RESIZE",
    TERMINAL_INPUT: "TERMINAL_INPUT"
}