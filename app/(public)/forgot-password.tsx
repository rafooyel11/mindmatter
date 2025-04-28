import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform, KeyboardAvoidingView, Keyboard, Alert } from 'react-native'
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/app';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  const resetPassword = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password reset sent to your email!", "Check your inbox to reset your password")
    } catch (e: any) {
      const err = e as FirebaseError;
      Alert.alert('Error', 'Failed to send password reset email: ' + err.message);
    }
  }


  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
          <View style={styles.container}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>Enter your email to reset password</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType='email-address'
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={resetPassword}>
              <Text style={styles.loginText}>Send Reset Email</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5C8D89',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  showText: {
    color: '#8BC34A',
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#5C8D89',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#5C8D89',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
