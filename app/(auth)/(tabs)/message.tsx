import React, { useState } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const messages = [
  {
    id: '1',
    name: 'John',
    message: 'Hi I\'m feeling well today...',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: '2',
    name: 'Luca',
    message: 'Let\'s get coffee later...',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '3',
    name: 'Michael',
    message: 'Please help me',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: '4',
    name: 'Jessica',
    message: 'Where are you?',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    time: 'Monday',
    unread: false,
  },
  {
    id: '5',
    name: 'Mich',
    message: 'What did you eat today?',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    time: 'Apr 12',
    unread: false,
  },
];

// Sample chat data for the chat interface
const chatData = {
  '1': [
    { id: '1', text: 'Hi there!', sender: 'other', time: '10:25 AM' },
    { id: '2', text: 'How are you feeling today?', sender: 'me', time: '10:26 AM' },
    { id: '3', text: 'Hi I\'m feeling well today...', sender: 'other', time: '10:30 AM' },
  ],
  '2': [
    { id: '1', text: 'Hey! Are you free later?', sender: 'other', time: 'Yesterday' },
    { id: '2', text: 'Maybe, what\'s up?', sender: 'me', time: 'Yesterday' },
    { id: '3', text: 'Let\'s get coffee later...', sender: 'other', time: 'Yesterday' },
  ],
  // Add more chat histories for other users as needed
};

const MessageItem = ({ name, message, image, time, unread, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 16, 
      borderBottomColor: '#eee', 
      borderBottomWidth: 1 
    }}
  >
    <View style={{ position: 'relative' }}>
      <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} />
      {unread && (
        <View style={{ 
          position: 'absolute', 
          right: 14, 
          top: 0, 
          backgroundColor: '#4CAF50', 
          width: 14, 
          height: 14, 
          borderRadius: 7,
          borderWidth: 2,
          borderColor: 'white'
        }} />
      )}
    </View>
    
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#2F4F4F' }}>{name}</Text>
        <Text style={{ fontSize: 12, color: '#A9A9A9' }}>{time}</Text>
      </View>
      <Text 
        style={{ color: unread ? '#000' : '#708090', fontWeight: unread ? '500' : 'normal' }}
        numberOfLines={1}
      >
        {message}
      </Text>
    </View>
  </TouchableOpacity>
);

const ChatBubble = ({ message, isMe }: any) => (
  <View style={{ 
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    backgroundColor: isMe ? '#DCF8C6' : '#ECECEC',
    padding: 10,
    borderRadius: 18,
    marginVertical: 5,
    marginHorizontal: 16,
    maxWidth: '70%',
  }}>
    <Text>{message.text}</Text>
    <Text style={{ fontSize: 10, color: '#999', alignSelf: 'flex-end', marginTop: 4 }}>{message.time}</Text>
  </View>
);

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  
  const filteredMessages = messages.filter(
    message => message.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openChat = (id: any) => {
    setSelectedChat(id);
  };

  const closeChat = () => {
    setSelectedChat(null);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    // Here you would typically send the message to your backend
    // For now, we'll just clear the input
    setNewMessage('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '600' }}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="person-add-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#f2f2f2', 
        borderRadius: 20,
        margin: 16,
        paddingHorizontal: 15,
      }}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={{ 
            flex: 1, 
            paddingVertical: 10, 
            paddingHorizontal: 10,
            fontSize: 16,
          }}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {filteredMessages.length > 0 ? (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageItem 
              name={item.name} 
              message={item.message} 
              image={item.image}
              time={item.time}
              unread={item.unread}
              onPress={() => openChat(item.id)} 
            />
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ddd" />
          <Text style={{ marginTop: 10, color: '#999', fontSize: 16 }}>No messages found</Text>
        </View>
      )}

      {/* Chat Modal */}
      <Modal
        visible={selectedChat !== null}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {selectedChat && (
            <>
              {/* Chat Header */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                padding: 16, 
                borderBottomWidth: 1, 
                borderBottomColor: '#eee'
              }}>
                <TouchableOpacity onPress={closeChat} style={{ marginRight: 10 }}>
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Image 
                  source={{ uri: messages.find(m => m.id === selectedChat)?.image }} 
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} 
                />
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                  {messages.find(m => m.id === selectedChat)?.name}
                </Text>
              </View>

              {/* Chat Messages */}
              <FlatList
                data={chatData[selectedChat] || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ChatBubble message={item} isMe={item.sender === 'me'} />
                )}
                contentContainerStyle={{ paddingVertical: 10 }}
              />

              {/* Message Input */}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
              >
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  padding: 10,
                  borderTopWidth: 1,
                  borderTopColor: '#eee',
                }}>
                  <TouchableOpacity style={{ marginHorizontal: 8 }}>
                    <Ionicons name="add-circle-outline" size={24} color="#666" />
                  </TouchableOpacity>
                  <TextInput
                    style={{ 
                      flex: 1, 
                      backgroundColor: '#f2f2f2', 
                      borderRadius: 20,
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      fontSize: 16,
                    }}
                    placeholder="Message"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                  />
                  <TouchableOpacity 
                    style={{ 
                      marginHorizontal: 8,
                      backgroundColor: newMessage.trim() ? '#007bff' : '#ccc',
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Ionicons name="send" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}