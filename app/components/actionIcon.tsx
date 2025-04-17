import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import React from 'react'


type ActionIconProps = {
    label: string
    icon: keyof typeof MaterialIcons.glyphMap
    onPress?: () => void
    color?: string
    backgroundColor?: string
    href?: string
    isEmergency?: boolean
}

export const ActionIcon = ({ label, icon, onPress, color = "#4B4B4B", backgroundColor = "#E5E5E5", href, isEmergency = false }: ActionIconProps) => {

    // For non-link action icons
    if (!href) {
        return (
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <View style={[styles.actionIcon, { backgroundColor }, isEmergency && styles.emergencyIcon]}>
                    <MaterialIcons name={icon} size={24} color={color} />
                </View>
                <Text style={[styles.label, { color }, isEmergency && styles.emergencyLabel]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    }

    // For link action icons
    return (
        <Link href={href as any} asChild>
            <TouchableOpacity style={styles.container}>
                <View style={[styles.actionIcon, { backgroundColor }, isEmergency && styles.emergencyIcon]}>
                    <MaterialIcons name={icon} size={24} color={color} />
                </View>
                <Text style={[styles.label, { color }, isEmergency && styles.emergencyLabel]}>
                    {label}
                </Text>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 10,
        width: 120,
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
    emergencyIcon: {
        borderWidth: 2,
        borderColor: '#FF6B6B',
    },
    emergencyLabel: {
        color: '#FF6B6B',
        fontWeight: 'bold',
    },
    label: {
        textAlign: 'center',
        fontSize: 12,
        color: '#4B4B4B',
    },
});

export default ActionIcon