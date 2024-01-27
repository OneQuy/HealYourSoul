import { createContext } from "react";

export type ThemeColor = {
    background: string,
    counterBackground: string,

    primary: string,
    counterPrimary: string,
}

export const defaultThemeType: ThemeType = 'white';

export type ThemeType = keyof typeof themes;

export const themes = {
    yellowgreendark: { // d
        background: '#1c1c1c',
        counterBackground: '#EDEEC9',

        primary: '#EDEEC9',
        counterPrimary: '#1c1c1c',
    } as ThemeColor,
    
    green: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#98C9A3',
        counterPrimary: '#1c1c1c',
    } as ThemeColor,

    pink: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#F39A9D',
        counterPrimary: '#1c1c1c',
    } as ThemeColor,
    
    darkblue: { // d
        background: '#2D3142',
        counterBackground: '#fafafa',

        primary: '#fafafa',
        counterPrimary: '#2D3142',
    } as ThemeColor,
    
    white: {
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#1c1c1c',
        counterPrimary: '#fafafa',
    } as ThemeColor,
    
    black: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#fafafa',
        counterPrimary: '#1c1c1c'
    } as ThemeColor,

    yellow: { // l
        background: '#fad502',
        counterBackground: '#6800a3',

        primary: '#6800a3',
        counterPrimary: '#fafafa',
    } as ThemeColor,
    
    brown: { // l
        background: '#D0B17A',
        counterBackground: '#1c1c1c',

        primary: '#1c1c1c',
        counterPrimary: 'white',
    } as ThemeColor,
} as const

export function GetColors(type: ThemeType) {
    return themes[type];
}

export const ThemeContext = createContext(GetColors('white'));
