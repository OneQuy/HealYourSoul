import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { FontSize, FontWeight, Outline } from '../../constants/AppConstants'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { StorageKey } from './IAPPage'

const imgBg = 'https://images.unsplash.com/photo-1634741426773-1c110c1a0ec7?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const IAPPage_Subscribed = () => {
    const { getItem: premiumID, setItem: setPremiumID } = useAsyncStorage(StorageKey)

    return (
        <ImageBackground source={{ uri: imgBg }} style={{ flex: 1, gap: Outline.GapVertical, padding: Outline.Horizontal, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>You subscribed: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}> 1 Month </Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>Subscribed date: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>22/10/1994 </Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>Expired data: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>22/10/1994 </Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>Day left: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>22</Text>
            </View>
            <Text style={{ marginTop: Outline.GapVertical_2 * 2, color: 'white', fontSize: FontSize.Normal }}>{'I\'m glad that you supported me,' + '\n' + 'Thank you so much!'}</Text>
        </ImageBackground>
    )
}

export default IAPPage_Subscribed