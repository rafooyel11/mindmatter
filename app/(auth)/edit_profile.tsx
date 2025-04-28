import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import {Stack, useRouter} from 'expo-router'
import * as ImagePicker from 'expo-image-picker'  
import { getApp } from '@react-native-firebase/app'
import { getAuth, updateProfile } from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

const EditProfile = () => {
  return (
    <View>
      <Text>EditProfile</Text>
    </View>
  )
}

export default EditProfile