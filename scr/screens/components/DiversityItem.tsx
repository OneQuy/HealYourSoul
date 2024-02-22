import { View, Text } from 'react-native'
import React from 'react'
import { DiversityItemType } from '../../constants/Types'

type DiversityItemProps = {
    data: DiversityItemType,
    onPressed: (item: DiversityItemType) => void,
}

const DiversityItem = ({
    data,
    onPressed,
}: DiversityItemProps) => {
    return (
        <View>
            <Text>DiversityItem</Text>
        </View>
    )
}

export default DiversityItem