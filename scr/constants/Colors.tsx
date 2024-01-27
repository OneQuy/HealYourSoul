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
    pinkbrown: { // l
        background: '#6D454C',
        counterBackground: '#fafafa',

        primary: '#EF709D',
        counterPrimary: '#1c1c1c',
    } as ThemeColor,

    blue: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#3185FC',
        counterPrimary: '#fafafa',
    } as ThemeColor,

    green_dark: { // d
        background: '#fafafa',
        counterBackground: '#30321C',

        primary: '#30321C',
        counterPrimary: '#fafafa',
    } as ThemeColor,

    gold_light: { // d
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#F3CA40',
        counterPrimary: '#1c1c1c',
    } as ThemeColor,

    gold: { // d
        background: '#1c1c1c',
        counterBackground: '#F3CA40',

        primary: '#F3CA40',
        counterPrimary: '#1c1c1c',
    } as ThemeColor,

    orange: { // l
        background: '#EEE2DF',
        counterBackground: '#1c1c1c',

        primary: '#C97C5D',
        counterPrimary: '#fafafa',
    } as ThemeColor,

    purple: { // l
        background: '#fafafa',
        counterBackground: '#453750',

        primary: '#453750',
        counterPrimary: '#fafafa',
    } as ThemeColor,

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
