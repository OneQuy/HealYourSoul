import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

interface TheRandomShortTextProps {
    getTextAsync: () => Promise<string | undefined>
}

const TheRandomShortText = ({
    getTextAsync,
}: TheRandomShortTextProps) => {
    const [text, setText] = useState('')

    useEffect(() => {
        const initAsync = async () => {
            const text = await getTextAsync()

            // if (typ tex)
            // setText(text)
        }

        initAsync()
    }, [])

    return (
        <View>
            <Text>{text}</Text>
        </View>
    )
}

export default TheRandomShortText