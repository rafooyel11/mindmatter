import React from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const messages = [
  {
    id: '1',
    name: 'John',
    message: 'Hi I\'m feeling well today...',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Luca',
    message: 'Let\'s get coffee later...',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    name: 'Michael',
    message: 'Please help me',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    name: 'Jessica',
    message: 'Where are you?',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: '5',
    name: 'Mich',
    message: 'What did you eat today?',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

const MessageItem = ({ name, message, image }: {name: string; message: string; image: string;}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomColor: '#eee', borderBottomWidth: 1 }}>
    <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} />
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2F4F4F' }}>{name}</Text>
      <Text style={{ color: '#708090' }}>{message}</Text>
    </View>
  </View>
);

export default function MessagesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '600' }}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="person-add-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem name={item.name} message={item.message} image={item.image} />
        )}
      />
    </SafeAreaView>
  );
}
