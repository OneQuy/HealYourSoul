import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Category } from "../../constants/AppConstants"
import { useCallback, useEffect } from "react"
import { SaveCurrentScreenForLoadNextTime } from "../../handle/AppUtils"
import { Text, TouchableOpacity, View } from "react-native"
import { CommonStyles } from "../../constants/CommonConstants"
import { NotificationOption, initNotificationAsync, setNotification_RemainSeconds } from "../../handle/Nofitication"
import { RandomInt } from "../../handle/Utils"

const category = Category.Art

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const ReminderScreen = () => {
    const navigation = useNavigation()

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

    const onPress = useCallback((num: number) => {
        const words = RandomInt(5, 50)
        const arr = new Array(words).fill(null).map(i => makeid(RandomInt(3, 10)))

        const msg= arr.join(' ')

        // console.log(msg);
        
        setNotification_RemainSeconds(5, {
            title: 'message ' + new Date(),
            message: msg,
        } as NotificationOption)
    }, [])

    useEffect(() => {
        initNotificationAsync()
    }, [])

    return (
        <View style={[CommonStyles.flex1_justifyContentCenter_AlignItemsCenter, { gap: 20 }]}>
            <TouchableOpacity onPress={() => onPress(5)} style={{ backgroundColor: 'gray', padding: 10, }}>
                <Text> 5s Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPress(10)} style={{ backgroundColor: 'gray', padding: 10, }}>
                <Text> 10s Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPress(60)} style={{ backgroundColor: 'gray', padding: 10, }}>
                <Text> 60s Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPress(300)} style={{ backgroundColor: 'gray', padding: 10, }}>
                <Text> 300s Notification</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ReminderScreen

