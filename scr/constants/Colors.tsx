import { createContext } from "react";

export type ThemeColor = {
    background: string,
    primary: string,
    counterPrimary: string,
    text: string,
}

export const defaultThemeType: ThemeType = 'yellow';

export type ThemeType = keyof typeof themes;

export const themes = {
    yellow: {
        background: '#fff',
        primary: '#000',
        counterPrimary: '#ffffff',
        text: '#ffffff',
    } as ThemeColor,
    
    dark: {
        background: '#0d111c',
        primary: '#fff39c',
        counterPrimary: '#000',
        text: '#000000',
    } as ThemeColor,
}

export function GetColors(type: ThemeType) {
    return themes[type];
}

export const ThemeContext = createContext(GetColors('yellow'));
