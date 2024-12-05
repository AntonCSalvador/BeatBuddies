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
export interface UserItemData {
    rating: number;
    review: string;
    createdAt?: any;
}

export interface FriendData {
    displayName: string;
    bio: string;
    profileImageLink: string;
}

export interface Album {
    id: string;
    name: string;
    artist: string;
    albumCover: string;
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

/**
 * Adds a friend to the user's friends subcollection.
 *
 * @param friendUuid - The UUID of the friend to be added
 */
export const addFriend = async (friendUuid: string) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const friendRef = doc(db, `users/${userId}/friends`, friendUuid);
        await setDoc(friendRef, {
            addedAt: serverTimestamp(),
        });
        console.log(`Friend with UUID ${friendUuid} added.`);
    } catch (error) {
        console.error('Error adding friend:', error);
        throw error;
    }
};

/**
 * Retrieves the friends' full data from the user's friends subcollection.
 *
 * @returns An array of friends with their UUIDs, names, bios, and profile pictures
 */
export const getFriends = async (): Promise<
    (FriendData & { uuid: string })[]
> => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const friendsRef = collection(db, `users/${userId}/friends`);
        const friendsSnapshot = await getDocs(friendsRef);

        const friends = await Promise.all(
            friendsSnapshot.docs.map(async (docSnap) => {
                const friendUuid = docSnap.id;
                const friendDocRef = doc(db, `users`, friendUuid);
                const friendDoc = await getDoc(friendDocRef);

                if (friendDoc.exists()) {
                    const friendData = friendDoc.data() as FriendData; // Cast to FriendData
                    return {
                        uuid: friendUuid,
                        ...friendData,
                    };
                }
                return null;
            })
        );

        return friends.filter((friend) => friend !== null) as (FriendData & {
            uuid: string;
        })[];
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
    }
};

/**
 * Retrieves a specific friend from the user's friends subcollection.
 *
 * @param friendUuid - The UUID of the friend to retrieve
 * @returns The friend's data or null if not found
 */
export const getFriend = async (
    friendUuid: string
): Promise<{ uuid: string; addedAt?: any } | null> => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const friendRef = doc(db, `users/${userId}/friends`, friendUuid);
        const friendSnap = await getDoc(friendRef);

        if (friendSnap.exists()) {
            return {
                uuid: friendSnap.id,
                ...(friendSnap.data() as { addedAt?: any }),
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching friend:', error);
        throw error;
    }
};

export const addFavoriteAlbum = async (album: Album) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const albumRef = doc(db, `users/${userId}/favorites`, album.id);
        await setDoc(albumRef, {
            id: album.id,
            name: album.name,
            artist: album.artist,
            albumCover: album.albumCover,
        });

        console.log(`Album ${album.name} added to favorites.`);
    } catch (error) {
        console.error('Error adding album to favorites:', error);
        throw error;
    }
};

/**
 * Fetches the user's favorite albums.
 *
 * @returns An array of albums
 */
export const getFavoriteAlbums = async (): Promise<Album[]> => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const favoritesRef = collection(db, `users/${userId}/favorites`);
        const favoritesSnapshot = await getDocs(favoritesRef);

        const albums = favoritesSnapshot.docs.map((doc) => ({
            ...(doc.data() as Album),
        }));

        return albums;
    } catch (error) {
        console.error('Error fetching favorite albums:', error);
        return []; // Return empty array if no collection exists
    }
};
