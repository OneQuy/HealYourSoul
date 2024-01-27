import { createContext } from "react";

export type ThemeColor = {
    background: string,
    counterBackground: string,

    primary: string,
    counterPrimary: string,
}

export const defaultThemeType: ThemeType = 'light';

export type ThemeType = keyof typeof themes;

export const themes = {
    light: {
        background: '#ffffff',
        counterBackground: '#000000',

        primary: '#000000',
        counterPrimary: '#ffffff',
    } as ThemeColor,
    
    dark: {
        background: '#000000',
        counterBackground: '#ffffff',

        primary: '#ffffff',
        counterPrimary: '#000000'
    } as ThemeColor,

    yellow: {
        background: '#fad502',
        counterBackground: '#6800a3',

        primary: '#6800a3',
        counterPrimary: '#ffffff',
    } as ThemeColor,
} as const

export function GetColors(type: ThemeType) {
    return themes[type];
}

export const ThemeContext = createContext(GetColors('light'));
