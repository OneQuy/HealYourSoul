import Clipboard from "@react-native-clipboard/clipboard"

var now = ''

export const Clipboard_Clear = () => { Clipboard.setString('') }

export const Clipboard_AppendLine = (s: string) => {
    now += '\n' + s
    Clipboard.setString(now)
}