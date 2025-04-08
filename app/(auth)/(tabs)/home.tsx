import { View, Text, Button } from 'react-native'
import { getAuth } from '@react-native-firebase/auth'
import React from 'react'

export default function Home () {
  const auth = getAuth()

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Sign Out" onPress={() => auth.signOut()} ></Button>
    </View>
  )
}