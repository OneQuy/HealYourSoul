import { createContext } from "react";

export type ThemeColor = {
    background: string,
    counterBackground: string,

    primary: string,
    counterPrimary: string,

    shouldStatusBarLight: boolean,
}

export const defaultThemeType: ThemeType = 'white';

export type ThemeType = keyof typeof themes;

export const themes = {
    // light

    blue_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#3185FC',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    green_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#4a8758',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    pink_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#F39A9D',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    brown_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#C97C5D',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    gold_light: { // l
        background: '#ffffff',
        counterBackground: '#1c1c1c',

        primary: '#f7c623',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: false,
    } as ThemeColor,

    purple_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#6f3999',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    default_light: {
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#1c1c1c',
        counterPrimary: '#fafafa',
    } as ThemeColor,

    // gold: { // d
    //     background: '#1c1c1c',
    //     counterBackground: '#F3CA40',

    //     primary: '#F3CA40',
    //     counterPrimary: '#1c1c1c',
    // } as ThemeColor,

    // yellowgreendark: { // d
    //     background: '#1c1c1c',
    //     counterBackground: '#EDEEC9',

    //     primary: '#EDEEC9',
    //     counterPrimary: '#1c1c1c',
    // } as ThemeColor,

    // black: {
    //     background: '#1c1c1c',
    //     counterBackground: '#fafafa',

    //     primary: '#fafafa',
    //     counterPrimary: '#1c1c1c'
    // } as ThemeColor,

    // yellow: { // l
    //     background: '#fad502',
    //     counterBackground: '#6800a3',

    //     primary: '#6800a3',
    //     counterPrimary: '#fafafa',
    // } as ThemeColor,

    // brown: { // l
    //     background: '#D0B17A',
    //     counterBackground: '#1c1c1c',

    //     primary: '#1c1c1c',
    //     counterPrimary: 'white',
    // } as ThemeColor,
} as const

export function GetColors(type: ThemeType) {
    return themes[type];
}

export const ThemeContext = createContext(GetColors('white'));
