import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import { Link, router, useRouter } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/MMLogoTransparent.png')} style={styles.logo} />
      
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </Link>
      
      <Text style={styles.footerText}>
        Don't have an account? <Link href="/register" style={styles.signUpLink}>Sign up</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFE',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 40,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: '#699992',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 15,
  },
  loginText: {
    color: '#1E1E1E',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#699992',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 20,
  },
  signUpText: {
    color: '#FEFEFE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    color: 'black',
    fontSize: 14,
  },
  signUpLink: {
    color: '#7ED957',
    fontWeight: '400',
  },
});
