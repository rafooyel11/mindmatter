import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getUserProfiles, UserProfile } from '../../service/user_service';
import { useRouter } from 'expo-router';
import { getUserChatRooms, getChatMessages, sendMessage, markMessagesAsRead, UserChat, Message } from '../../service/firestore_service';

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

const ChatBubble = ({ message, isMe }: {message: Message, isMe: boolean}) => (
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
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState<UserChat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfiles, setUserProfiles] = useState<{[key: string]: UserProfile}>({});
  const [otherUserInChat, setOtherUserInChat] = useState<UserProfile | null>(null);

  const router = useRouter();
  const currentUser = auth().currentUser;
  
  // Format firestore timestamp to readable date without date-fns
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageDate = timestamp.toDate();
    
    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // If this week, show day name
    const diffTime = Math.abs(now.getTime() - messageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return dayNames[messageDate.getDay()];
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString();
  };

  const openFindUsers = () => {
    router.push('/(auth)/users');
  };
  
  // Load user chat rooms
  useEffect(() => {
    if (!currentUser) return;
    
    const unsubscribe = getUserChatRooms().onSnapshot(async snapshot => {
      const roomsData = snapshot.docs.map(doc => doc.data());
      const roomIds = snapshot.docs.map(doc => doc.id);
      
      // Get all participant IDs to fetch their profiles
      const participantIds = roomsData.flatMap(room => room.participants);
      
      // Remove current user ID from the list
      const otherParticipantIds = participantIds.filter(id => id !== currentUser.uid);
      
      // Fetch all user profiles
      const profiles = await getUserProfiles(otherParticipantIds);
      setUserProfiles(profiles);
      
      // Create user chat data
      const chats: UserChat[] = [];
      
      for (let i = 0; i < roomsData.length; i++) {
        const roomData = roomsData[i];
        const roomId = roomIds[i];
        
        // Find the other participant (not current user)
        const otherParticipantId = roomData.participants.find((id: string) => id !== currentUser.uid);
        if (!otherParticipantId || !profiles[otherParticipantId]) continue;
        
        const otherUser = profiles[otherParticipantId];
        
        // Check for unread messages
        const unreadSnapshot = await firestore()
          .collection('chatRooms')
          .doc(roomId)
          .collection('messages')
          .where('read', '==', false)
          .where('sender', '==', otherParticipantId)
          .count()
          .get();
        
        const hasUnread = unreadSnapshot.data().count > 0;
        
        chats.push({
          id: roomId,
          uid: otherParticipantId,
          name: otherUser.name || 'Unknown User',
          message: roomData.lastMessage || 'No messages yet',
          image: otherUser.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
          time: formatMessageTime(roomData.lastMessageTime),
          unread: hasUnread
        });
      }
      
      setChatRooms(chats);
      setLoading(false);
    }, error => {
      console.error('Error fetching chat rooms:', error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Load messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    
    markMessagesAsRead(selectedChat);
    
    const unsubscribe = getChatMessages(selectedChat).onSnapshot(snapshot => {
      const messagesData: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          time: formatMessageTime(data.createdAt),
          createdAt: data.createdAt
        };
      });
      
      setMessages(messagesData);
      
      // Find the other user in this chat
      const room = chatRooms.find(room => room.id === selectedChat);
      if (room) {
        const profile = userProfiles[room.uid];
        setOtherUserInChat(profile || null);
      }
    });
    
    return () => unsubscribe();
  }, [selectedChat]);
  
  const filteredChatRooms = chatRooms.filter(
    room => room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openChat = (id: string) => {
    setSelectedChat(id);
  };

  const closeChat = () => {
    setSelectedChat(null);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedChat) return;
    
    try {
      await sendMessage(selectedChat, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '600' }}>Messages</Text>
        <TouchableOpacity onPress={openFindUsers}>
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#699992" />
        </View>
      ) : filteredChatRooms.length > 0 ? (
        <FlatList
          data={filteredChatRooms}
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
          <Text style={{ marginTop: 10, color: '#999', fontSize: 16 }}>
            {searchQuery ? 'No matches found' : 'No messages yet'}
          </Text>
        </View>
      )}

      {/* Chat Modal */}
      <Modal
        visible={selectedChat !== null}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {selectedChat && otherUserInChat && (
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
                  source={{ uri: otherUserInChat.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} 
                />
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                  {otherUserInChat.name}
                </Text>
              </View>

              {/* Chat Messages */}
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ChatBubble 
                    message={item} 
                    isMe={item.sender === currentUser?.uid} 
                  />
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
                    onPress={handleSendMessage}
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