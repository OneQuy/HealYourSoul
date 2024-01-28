import { createContext } from "react";

export type ThemeColor = {
    background: string,
    counterBackground: string,

    primary: string,
    counterPrimary: string,

    shouldStatusBarLight: boolean,
}

export const defaultThemeType: ThemeType = 'default_light'

export type ThemeType = keyof typeof themes;

export const themes = {

    // specials

    article_special: { // l
        background: '#D0B17A',
        counterBackground: '#1c1c1c',

        primary: '#1c1c1c',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    // dark

    light_brown_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#B19C81',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    gold_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#f7c623',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    pink_dark: { // l
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#F39A9D',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    orange_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#fc9732',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    red_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#DE3C4B',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    brown_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#C97C5D',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    blue_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#3185FC',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    green_dark_2: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#80CED7',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    green_little_dark: {
        background: '#1c1c1c',
        counterBackground: '#EDEEC9',

        primary: '#EDEEC9',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    banana_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#84c454',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    green_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#4a8758',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    purple_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#6f3999',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: true,
    } as ThemeColor,

    default_dark: {
        background: '#1c1c1c',
        counterBackground: '#fafafa',

        primary: '#fafafa',
        counterPrimary: '#1c1c1c',

        shouldStatusBarLight: true,
    } as ThemeColor,

    // light

    light_brown_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#B19C81',
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

    pink_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#F39A9D',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    orange_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#fc9732',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    red_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#DE3C4B',
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

    blue_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#3185FC',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    green_light_2: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#80CED7',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    banana_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#84c454',
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

    purple_light: { // l
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#6f3999',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    dark_blue_light: {
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#282F44',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,

    default_light: {
        background: '#fafafa',
        counterBackground: '#1c1c1c',

        primary: '#1c1c1c',
        counterPrimary: '#fafafa',

        shouldStatusBarLight: false,
    } as ThemeColor,
} as const

export function GetColors(type: ThemeType) {
    return themes[type];
}

export const ThemeContext = createContext(GetColors('default_light'));