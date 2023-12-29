import { View, Text, StyleSheet } from 'react-native'
import React from 'react'


const SubRedditSelector = () => {
    const[selectedItems, setSelectedItems] = useState([]);

    const renderItem = ({ item }) => {
        const isSelected = selectedItems.includes(item.id);

        return (
            <View style={{ flexDirection: 'row', padding: 10 }}>
                {/* Left Column: Checkbox */}
                <CheckBox
                    value={isSelected}
                    onValueChange={() => handleCheckboxChange(item.id)}
                />

                {/* Right Column: Texts */}
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.label}</Text>
                    <Text>Additional Info 1</Text>
                    <Text>Additional Info 2</Text>
                    <Text>Additional Info 3</Text>
                </View>
            </View>
        );
    };

    const handleCheckboxChange = (itemId) => {
        const newSelectedItems = selectedItems.includes(itemId)
            ? selectedItems.filter((id) => id !== itemId)
            : [...selectedItems, itemId];

        setSelectedItems(newSelectedItems);
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
            />
        </View>
    );
}

export default SubRedditSelector

const style = StyleSheet.create({
    masterView: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'green' }
})