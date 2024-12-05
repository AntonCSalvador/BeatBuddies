import { auth, db } from '@/firebase/firebaseConfig';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';

/**
 * Searches for a user in the users collection by UUID.
 *
 * @param uuid - The UUID of the user to search for
 * @returns The user data or null if not found
 */
export const searchUserByUUID = async (
    uuid: string
): Promise<{
    name: string;
    bio: string;
    profilePic: string;
    uuid: string;
} | null> => {
    try {
        const userDocRef = doc(db, 'users', uuid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            return {
                name: userData.displayName,
                bio: userData.bio,
                profilePic: userData.profileImageLink,
                uuid,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error searching for user by UUID:', error);
        throw error;
    }
};
