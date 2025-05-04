import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { getApp } from '@react-native-firebase/app'
import { getAuth, updateProfile } from '@react-native-firebase/auth'

const defaultProfileImage = require('../../assets/images/default-profile.png')

const IMGBB_API_KEY = '5575a897d8cbcdde290a80418b60e6ad';

const EditProfile = () => {
  const router = useRouter()
  const app = getApp()
  const auth = getAuth(app)
  const [loading, setLoading] = useState(false)
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: null as string | null,
  })

  // Request permissions first
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture');
      }
    })();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser({
        name: currentUser.displayName || 'User',
        email: currentUser.email || '',
        avatar: currentUser.photoURL || null,
      })
    }
  }, [])

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setUser(prev => ({ ...prev, avatar: result.assets[0].uri }))
      }
    } catch (error) {
      console.error('Error picking image:', error)
      if (router) {
        Alert.alert('Error', 'Failed to pick image. Please try again.')
      }
    }
  }

  // Function to upload image to ImgBB
  const uploadToImgBB = async (imageUri: string | URL | Request) => {
    try {
      // Convert imageUri to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            // Get base64 data
            if (!reader.result) {
              reject(new Error('Failed to read image data'));
              return;
            }
            const base64data = reader.result.toString().split(',')[1];
            
            // Create form data for ImgBB API
            const formData = new FormData();
            formData.append('key', IMGBB_API_KEY);
            formData.append('image', base64data);
            
            // Upload to ImgBB
            const response = await fetch('https://api.imgbb.com/1/upload', {
              method: 'POST',
              body: formData
            });
            
            const responseData = await response.json();
            
            if (responseData.success) {
              resolve(responseData.data.url);
            } else {
              reject(new Error('Failed to upload image to ImgBB'));
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error preparing image:', error);
      throw error;
    }
  };

  const updateProfilePicture = async () => {
    if (!auth.currentUser) return
    
    setLoading(true)
    try {
      // Handle name update
      if (user.name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: user.name,
        })
      }
      
      // Only upload if the avatar has changed and is a local URI
      if (user.avatar && !user.avatar.startsWith('http')) {
        try {
          // Upload to ImgBB and get URL
          const imageUrl = await uploadToImgBB(user.avatar);
          
          // Update user profile with the image URL
          await updateProfile(auth.currentUser, {
            photoURL: imageUrl as string,
          });
          
          Alert.alert('Success', 'Profile updated successfully.');
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Alert.alert('Error', 'Failed to upload profile picture. Your name was updated successfully.');
        }
      } else {
        // If only the name was changed or nothing changed
        Alert.alert('Success', 'Profile updated successfully.');
      }
      
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#699992" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Image source={defaultProfileImage} style={styles.avatar} />
          )}
          <TouchableOpacity style={styles.changePictureButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser(prev => ({ ...prev, name: text }))}
          placeholder="Your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={[styles.input, { color: '#999' }]}
          value={user.email}
          editable={false}
        />
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={updateProfilePicture}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePictureButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#699992',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#699992',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
})

export default EditProfile