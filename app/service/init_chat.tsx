import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export const initializeUserForChat = async (userId: string, userData: {
  name: string;
  email: string;
  avatar?: string;
}): Promise<void> => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .set({
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || '',
        joinDate: firestore.Timestamp.now(),
        fcmTokens: [],
        online: false,
        lastSeen: firestore.Timestamp.now(),
      });
      
  } catch (error) {
    console.error('Error initializing user for chat:', error);
    throw error;
  }
};


export const findUsers = async (searchQuery: string = '', limit: number = 20): Promise<any[]> => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');
    
    let query: FirebaseFirestoreTypes.Query = firestore().collection('users');
    
    if (searchQuery) {
      
      
      const searchEnd = searchQuery.replace(/.$/, 
        c => String.fromCharCode(c.charCodeAt(0) + 1));
        
      query = query
        .where('name', '>=', searchQuery)
        .where('name', '<', searchEnd);
    }
    
    const snapshot = await query.limit(limit).get();
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== currentUser.uid);
      
  } catch (error) {
    console.error('Error finding users:', error);
    return [];
  }
};