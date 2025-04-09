import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={48} color="#4B4B4B" />
          </View>
          <View>
            <Text style={styles.name}>Rafael Herrera</Text>
            <Text style={styles.feeling}>Feeling Happy 😊</Text>
          </View>
        </View>

        <Text style={styles.question}>How do you feel today?</Text>

        <View style={styles.moodRow}>
          <MoodIcon label="Happy" color="#F871A0" icon="happy" />
          <MoodIcon label="Sad" color="#A78BFA" icon="sad" />
          <MoodIcon label="Neutral" color="#99F6E4" icon="neutral" />
          <MoodIcon label="Emotional" color="#FDBA74" icon="emotion" />
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodRow}
        >
          <ActionIcon label="Take Quiz" icon="assignment" />
          <ActionIcon label="SOS Emergency" icon="phone-in-talk" />
          <ActionIcon label="Seek Guidance" icon="support-agent" />
          <ActionIcon label="Contact Friends" icon="group" />
          <ActionIcon label="Mental Health" icon="psychology" />
          <ActionIcon label="Meditation" icon="self-improvement" />
        </ScrollView>

        <Text style={styles.chatHeader}>Talk to Montana AI</Text>

        <View style={styles.chatBox}>
          <View style={styles.botBubble}>
            <Text style={styles.botText}>✨ Hello!</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="Reply" placeholderTextColor="#999" />
            <TouchableOpacity style={styles.sendButton}>
              <Entypo name="arrow-bold-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const MoodIcon = ({ label, color, icon }) => (
  <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
    <View style={[styles.moodIcon, { backgroundColor: color }]}>
      <Text style={{ fontSize: 18 }}>😊</Text>
    </View>
    <Text>{label}</Text>
  </View>
);

const ActionIcon = ({ label, icon }) => (
  <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
    <View style={styles.actionIcon}>
      <MaterialIcons name={icon} size={20} color="#4B4B4B" />
    </View>
    <Text style={{ textAlign: 'center' }}>{label}</Text>
  </View>
);

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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  moodIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
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
  chatHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  chatBox: {
    backgroundColor: '#EAF3F1',
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  botText: {
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#4B4B4B',
    borderRadius: 50,
    padding: 10,
  },
});
