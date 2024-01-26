import { createContext } from "react";

export type ThemeColor = {
    background: string,
    counterBackground: string,

    primary: string,
    counterPrimary: string,
}

export const defaultThemeType: ThemeType = 'black';

export type ThemeType = keyof typeof themes;

export const themes = {
    black: {
        background: '#ffffff',
        counterBackground: '#000000',

        primary: '#000000',
        counterPrimary: '#ffffff',
    } as ThemeColor,
    
    bblack: {
        background: '#fad502',
        counterBackground: '#6800a3',

        primary: '#6800a3',
        counterPrimary: '#ffffff',
    } as ThemeColor,

    // yellow: {
    //     background: '#0d111c',
    //     counterBackground: '#000000',

    //     primary: '#fff39c',
    //     counterPrimary: '#000',
    // } as ThemeColor,
}

export function GetColors(type: ThemeType) {
    // @ts-ignore
    if (type === 'yellow')
        type = 'black'

    return themes[type];
}

export const ThemeContext = createContext(GetColors('black'));
