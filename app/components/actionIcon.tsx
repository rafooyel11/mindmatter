import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

type ActionIconProps = {
    label: string
    icon: keyof typeof MaterialIcons.glyphMap
    onPress?: () => void
}

export const ActionIcon = ({ label, icon, onPress }: ActionIconProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.actionIcon}>
                <MaterialIcons name={icon} size={20} color="#4B4B4B" />
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    label: {
        textAlign: 'center',
        fontSize: 12,
        color: '#4B4B4B',
    },
});

export default ActionIcon