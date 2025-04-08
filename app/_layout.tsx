import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text} from 'react-native';

export default function RootLayout() {
    const [initializing, setInitializing] = React.useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
    const router = useRouter();
    const segments = useSegments();
    const auth = getAuth();

    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
        console.log('onAuthStateChanged', user);
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    useEffect(() => {
        if (initializing) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (user && !inAuthGroup) {
            router.replace('/(auth)/(tabs)/home');
        } else if (!user && inAuthGroup) {
            router.replace("/");
        }
    },[user, initializing, segments]);

    if (initializing) 
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1,}}>
                <ActivityIndicator size="large" color="#699992" />
                <Text style={{fontWeight: 'bold', marginTop: 5,}}>Loading...</Text>
            </View>
        )

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(public)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    )
}
