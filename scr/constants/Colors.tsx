import { createContext } from "react";

export type ThemeColor = {
    background: string,
    primary: string,
    counterPrimary: string,
    text: string,
}

export const ThemeList = ['green','pink', 'red'];

const LightColors: ThemeColor = {
    background: '#fff',
    primary: '#fff39c',
    counterPrimary: '#000',
    text: '#000000',
}

const DarkColors: ThemeColor = {
    background: '#0d111c',
    primary: '#fff39c',
    counterPrimary: '#000',
    text: '#ffffff',
}

export function GetColors(isLight: boolean) {
    return isLight ? LightColors : DarkColors;
}

export const ThemeContext = createContext(GetColors(true));
