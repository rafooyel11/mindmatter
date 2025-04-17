import React from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    title: 'New friend request',
    message: 'John sent you a friend request',
    time: '5m ago',
    icon: 'person-add-outline',
    read: false,
  },
  {
    id: '2',
    title: 'New message',
    message: 'You have a new message from John',
    time: '10m ago',
    icon: 'chatbubble-ellipses-outline',
    read: false,
  },
  {
    id: '3',
    title: 'Mood tracking',
    message: 'Time to log your daily mood',
    time: '3h ago',
    icon: 'happy-outline',
    read: true,
  },
  {
    id: '4',
    title: 'Weekly Self Assessment',
    message: 'Let\'s take a quiz to see how you\'re doing',
    time: '5h ago',
    icon: 'book-outline',
    read: true,
  },
];

const NotificationItem = ({ title, message, time, icon, read }: 
  {title: string; message: string; time: string; icon: string; read: boolean;}) => (
  <View style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomColor: '#eee', 
    borderBottomWidth: 1,
    backgroundColor: read ? '#fff' : '#f0f8ff'
  }}>
    <View style={{ 
      width: 50, 
      height: 50, 
      borderRadius: 25, 
      backgroundColor: '#699992', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginRight: 16 
    }}>
      <Ionicons name={icon as any} size={24} color="white" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#2F4F4F' }}>{title}</Text>
      <Text style={{ color: '#708090' }}>{message}</Text>
    </View>
    <Text style={{ color: '#A9A9A9', fontSize: 12 }}>{time}</Text>
  </View>
);

export default function NotificationScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '600' }}>Notifications</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem 
            title={item.title} 
            message={item.message} 
            time={item.time} 
            icon={item.icon} 
            read={item.read} 
          />
        )}
      />
    </SafeAreaView>
  );
}