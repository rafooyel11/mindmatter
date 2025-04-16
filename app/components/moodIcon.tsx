import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

type MoodIconProps = {
    label: string
    color: string
    icon: string
    onPress?: () => void
}

export const MoodIcon = ({ label, color, icon, onPress }: MoodIconProps) => {

    const getEmoji = (emojiName: string) => {
        switch (emojiName) {
            case 'happy':
                return '😊'
            case 'sad':
                return '😢'
            case 'neutral':
                return '😐'
            case 'angry':
                return '😡'
            default:
                return '😊'
        }
    };

    return (
        <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <View style={[styles.moodIcon, { backgroundColor: color }]}>
                <Text style={{ fontSize: 24, marginLeft: 5 }}>{getEmoji(icon)} </Text>
            </View>
            <Text>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    moodIcon: {
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,            
    }
})

export default MoodIcon