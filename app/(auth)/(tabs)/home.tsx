import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, Linking} from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { MoodIcon } from '../../components/moodIcon';
import { ActionIcon } from '../../components/actionIcon';
import { ChatInterface } from '../../components/chatbotInterface';
import { getAuth } from '@react-native-firebase/auth';

const defaultProfileImage = require('../../../assets/images/default-profile.png');

export default function HomeScreen() {

  const [userMood, setUserMood] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");  
  const auth = getAuth();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          await currentUser.reload();
          
          if (currentUser.displayName) {
            setUserName(currentUser.displayName);
          } else {
            setUserName("User");
          }
          
          // Set the user's profile picture if available
          if (currentUser.photoURL) {
            setUserAvatar(currentUser.photoURL);
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };
    
    loadUserProfile();
  }, []);

  const handleSendMessage = (message: string) => {
    // integrate ai service here
    console.log('User message:', message);
  }

  const handleMoodSelect = (mood: string) => {
    setUserMood(mood);
  };

  const handleEmergency = () => {
    const phoneNumber = '+639949382775'

    Alert.alert(
      "Emergency Contact", 
      "Would you like to call for emergency", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`)
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.profileContainer}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="person-circle-outline" size={48} color="#4B4B4B" />
            </View>
          )}
          <View>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.feeling}>
              {userMood ? `Feeling ${userMood}` : "..."}
            </Text>
          </View>
        </View>

        <Text style={styles.question}>How do you feel today?</Text>

        <View style={styles.moodRow}>
          <MoodIcon label="Happy" color="#F871A0" icon="happy" onPress={() => handleMoodSelect('Happy 😊')} />
          <MoodIcon label="Sad" color="#A78BFA" icon="sad" onPress={() => handleMoodSelect('Sad ☹️')} />
          <MoodIcon label="Neutral" color="#99F6E4" icon="neutral" onPress={() => handleMoodSelect('Neutral 😐')} />
          <MoodIcon label="Angry" color="#FDBA74" icon="angry" onPress={() => handleMoodSelect('Angry 😡')} />
        </View>

        <View style={styles.actionRow}>
          <ActionIcon label="Take Quiz" icon="assignment" backgroundColor="#99F6E4" color="#2A7C6E" href="/quiz"/>
          <ActionIcon label="SOS Emergency" icon="phone-in-talk" backgroundColor="#FFEEEE" color="#E53E3E" isEmergency={ true } onPress={handleEmergency}/>
        </View>

        <View>
          <ChatInterface botName="Montana AI" onSendMessage={handleSendMessage} initialMessages={[{ id: '1', text: "✨ Hello! How can I help you today?", isBot: true }]} />
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    marginRight: 10,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feeling: {
    color: 'gray',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
});