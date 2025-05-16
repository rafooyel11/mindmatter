import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
}

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    if (!userDoc.exists) return null;
    
    const userData = userDoc.data() as UserProfile;
    return { ...userData, uid: userDoc.id };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Get multiple user profiles by IDs
export const getUserProfiles = async (userIds: string[]): Promise<{[key: string]: UserProfile}> => {
  try {
    const uniqueIds = [...new Set(userIds)]; // Remove duplicates
    const userProfiles: {[key: string]: UserProfile} = {};
    
    // Firestore can only get 10 docs at a time with getAll, so we batch
    const batches = [];
    for (let i = 0; i < uniqueIds.length; i += 10) {
      const batch = uniqueIds.slice(i, i + 10);
      batches.push(batch);
    }
    
    for (const batch of batches) {
      const docs = await Promise.all(
        batch.map(id => firestore().collection('users').doc(id).get())
      );
      
      docs.forEach(doc => {
        if (doc.exists()) {
          userProfiles[doc.id] = { ...doc.data() as UserProfile, uid: doc.id };
        }
      });
    }
    
    return userProfiles;
  } catch (error) {
    console.error('Error getting user profiles:', error);
    return {};
  }
};

// Update the current user's FCM token for push notifications
export const updateUserFcmToken = async (token: string): Promise<void> => {
  const currentUser = auth().currentUser;
  if (!currentUser) return;
  
  await firestore()
    .collection('users')
    .doc(currentUser.uid)
    .update({
      fcmTokens: firestore.FieldValue.arrayUnion(token)
    });
};