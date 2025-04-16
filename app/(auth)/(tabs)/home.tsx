import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { MoodIcon } from '../../components/moodIcon';
import { ActionIcon } from '../../components/actionIcon';
import { ChatInterface } from '../../components/chatbotInterface';


export default function HomeScreen() {

  const [userMood, setUserMood] = useState<string | null>(null);

  const handleSendMessage = (message: string) => {
    // integrate ai service here
    console.log('User message:', message);
  }

  const handleMoodSelect = (mood: string) => {
    setUserMood(mood);
  };



  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={48} color="#4B4B4B" />
          </View>
          <View>
            <Text style={styles.name}>Rafael Herrera</Text>
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

        <ScrollView contentContainerStyle={styles.moodRow}>
          <ActionIcon label="Take Quiz" icon="assignment" />
          <ActionIcon label="SOS Emergency" icon="phone-in-talk" />
        </ScrollView>

        <ChatInterface botName="Montana AI" onSendMessage={handleSendMessage} initialMessages={[{ id: '1', text: "✨ Hello! How can I help you today?", isBot: true }]} />


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
});
