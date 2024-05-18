import { View, Text, StyleSheet, ColorValue, TouchableOpacity, Dimensions } from 'react-native'
import React, { useMemo } from 'react'
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading'

const Window = Dimensions.get('window')

const BorderRadius = Window.height * 0.02

const Padding = Window.height * 0.008

const OneQuyApp = ({
    primaryColor = '#1c1c1c',
    counterPrimaryColor = '#fafafa',
    counterBackgroundColor = '#C1C1C1',
    backgroundColor = '#fafafa',
    fontSize = 13,
}: {
    primaryColor?: ColorValue
    counterPrimaryColor?: ColorValue
    counterBackgroundColor?: ColorValue
    backgroundColor?: ColorValue,
    fontSize?: number,
}) => {
    const currentApp = useMemo(() => {
        return {
            logo: 'https://play-lh.googleusercontent.com/eucsatvqG8yTQSl2k_2kCFHk1OLD1chJGsxL8JXn1gldKKfHEmZX4WrWPpUZk3Xaew=w480-h960-rw'
        }
    }, [])

    console.log(backgroundColor);
    
    const style = useMemo(() => {
        return StyleSheet.create({
            master: {
                width: '100%',
                backgroundColor: backgroundColor,
                gap: Padding,
            },

            titleView: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },

            titleTxt: {
                // padding: Padding,
                fontSize: fontSize * 1.5,
                color: primaryColor,
                fontWeight: 'bold',
            },

            installTO: {
                padding: Padding,
                backgroundColor: primaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: BorderRadius,
            },

            installTxt: {
                fontSize,
                color: counterPrimaryColor,
            },

            nextTO: {
                padding: Padding,
                width: '20%',
                borderColor: counterBackgroundColor,
                borderWidth: StyleSheet.hairlineWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: BorderRadius,
            },

            nextTxt: {
                fontSize,
                color: counterBackgroundColor,
            },

            descriptionTxt: {
                fontSize,
                color: counterBackgroundColor,
                // textAlign:'justify'
            },

            descriptionView: {
                flexDirection: 'row',
                gap: Window.height * 0.01,
                justifyContent: 'space-between',
                alignItems: 'center',
            },

            logoImg: {
                height: Window.height * 0.08,
                aspectRatio: 1,
                borderRadius: BorderRadius,
                overflow: 'hidden',
            },

            descriptionTxtView: {
                flex: 1,
                // backgroundColor: '#aaffee',
            },

        })
    }, [
        backgroundColor,
        counterBackgroundColor,
        primaryColor,
        counterPrimaryColor,
        fontSize,
    ])

    return (
        <View style={style.master}>
            {/* title */}
            <View style={style.titleView}>
                <Text style={style.titleTxt}>Vocaby</Text>
                {/* go next btn */}
                <TouchableOpacity style={style.nextTO}>
                    <Text style={style.nextTxt}>{'Next'}</Text>
                </TouchableOpacity>
            </View>

            {/* description */}
            <View style={style.descriptionView}>
                {/* logo */}
                <ImageBackgroundWithLoading
                    source={{ uri: currentApp.logo }}
                    style={style.logoImg}
                />
                {/* description */}
                <View style={style.descriptionTxtView}>
                    <Text style={style.descriptionTxt}>{'Vocaby is your pocket English tutor, delivering vocabulary lessons directly to your mobile device through convenient notifications. Enhance your English skills effortlessly on the go!'}</Text>
                </View>
            </View>


            <TouchableOpacity style={style.installTO}>
                <Text style={style.installTxt}>{'Install'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default OneQuyApp