export type ThemeColor = {
    background: string,
    text: string,
}

const LightColors: ThemeColor = {
    background: '#f2f2f2',
    text: '#000000',
}

const DarkColors: ThemeColor = {
    background: '#0d111c',
    text: '#ffffff',
}

export function GetColors(isLight: boolean) {
    return isLight ? LightColors : DarkColors;
}