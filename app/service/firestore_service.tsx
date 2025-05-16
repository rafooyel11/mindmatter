import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface UserChat {
  id: string;
  uid: string;
  name: string;
  message: string;
  image: string;
  time: string;
  unread: boolean;
}


const getCurrentUserId = (): string => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};


export const createChatRoom = async (otherUserId: string): Promise<string> => {
  const currentUserId = getCurrentUserId();
  
  
  const chatRoomsSnapshot = await firestore()
    .collection('chatRooms')
    .where('participants', 'array-contains', currentUserId)
    .get();
  
  
  const existingRoom = chatRoomsSnapshot.docs.find(
    doc => doc.data().participants.includes(otherUserId)
  );
  
  if (existingRoom) {
    return existingRoom.id;
  }
  
  
  const newRoomRef = firestore().collection('chatRooms').doc();
  const timestamp = firestore.Timestamp.now();
  
  await newRoomRef.set({
    participants: [currentUserId, otherUserId],
    createdAt: timestamp,
    updatedAt: timestamp,
    lastMessage: '',
    lastMessageTime: timestamp
  });
  
  return newRoomRef.id;
};


export const sendMessage = async (roomId: string, text: string): Promise<void> => {
  const currentUserId = getCurrentUserId();
  const timestamp = firestore.Timestamp.now();
  
  
  await firestore()
    .collection('chatRooms')
    .doc(roomId)
    .collection('messages')
    .add({
      text,
      sender: currentUserId,
      createdAt: timestamp,
      read: false
    });
  
  
  await firestore()
    .collection('chatRooms')
    .doc(roomId)
    .update({
      lastMessage: text,
      lastMessageTime: timestamp,
      updatedAt: timestamp
    });
};


export const getUserChatRooms = () => {
  const currentUserId = getCurrentUserId();
  
  return firestore()
    .collection('chatRooms')
    .where('participants', 'array-contains', currentUserId)
    .orderBy('updatedAt', 'desc');
};


export const getChatMessages = (roomId: string) => {
  return firestore()
    .collection('chatRooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('createdAt', 'asc');
};


export const markMessagesAsRead = async (roomId: string): Promise<void> => {
  const currentUserId = getCurrentUserId();
  
  const unreadMessagesQuery = await firestore()
    .collection('chatRooms')
    .doc(roomId)
    .collection('messages')
    .where('read', '==', false)
    .where('sender', '!=', currentUserId)
    .get();
  
  const batch = firestore().batch();
  
  unreadMessagesQuery.docs.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });
  
  await batch.commit();
};