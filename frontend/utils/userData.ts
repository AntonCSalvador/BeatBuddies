// services/userDataService.ts

import { auth, db } from '@/firebase/firebaseConfig';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';

// TypeScript interface for user data
export  interface UserItemData {
    rating: number;
    review: string;
    createdAt?: any;
}

/**
 * Adds an item (album, song, or artist) to the user's subcollection.
 *
 * @param collectionName - The name of the subcollection ('albums', 'songs', 'artists')
 * @param itemId - The ID of the item (from Spotify API)
 * @param userItemData - The user's rating and review for the item
 */
export const addItemToUser = async (
    collectionName: 'albums' | 'songs' | 'artists',
    itemId: string,
    userItemData: UserItemData
) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const userItemRef = doc(
            db,
            `users/${userId}/${collectionName}`,
            itemId
        );
        await setDoc(userItemRef, {
            ...userItemData,
            createdAt: serverTimestamp(),
        });
        console.log(`Item added to user's ${collectionName} collection`);
    } catch (error) {
        console.error(`Error adding item to user's ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Retrieves all items from the user's subcollection.
 *
 * @param collectionName - The name of the subcollection ('albums', 'songs', 'artists')
 * @returns An array of items with their IDs and user-specific data
 */
export const getUserItems = async (
    collectionName: 'albums' | 'songs' | 'artists'
): Promise<({ itemId: string } & UserItemData)[]> => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const userItemsRef = collection(
            db,
            `users/${userId}/${collectionName}`
        );
        const userItemsSnapshot = await getDocs(userItemsRef);

        const items = userItemsSnapshot.docs.map((doc) => ({
            itemId: doc.id,
            ...(doc.data() as UserItemData),
        }));

        return items;
    } catch (error) {
        console.error(`Error fetching user's ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Retrieves a specific item from the user's subcollection.
 *
 * @param collectionName - The name of the subcollection ('albums', 'songs', 'artists')
 * @param itemId - The ID of the item (from Spotify API)
 * @returns The user's item data or null if not found
 */
export const getUserItem = async (
    collectionName: 'albums' | 'songs' | 'artists',
    itemId: string
): Promise<(UserItemData & { itemId: string }) | null> => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const userItemRef = doc(
            db,
            `users/${userId}/${collectionName}`,
            itemId
        );
        const userItemSnap = await getDoc(userItemRef);

        if (userItemSnap.exists()) {
            return {
                itemId: userItemSnap.id,
                ...(userItemSnap.data() as UserItemData),
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching user's ${collectionName} item:`, error);
        throw error;
    }
};
