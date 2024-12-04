// services/userDataService.ts

import { auth, db } from '@/firebase/firebaseConfig';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Type definitions (optional but recommended)
interface Album {
  id?: string;
}

interface Song {
  id?: string;
}

interface Artist {
  id?: string;
}

/**
 * Adds an album to the user's albums subcollection
 */
export const addAlbumToUser = async (albumData: Album) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const albumsRef = collection(db, `users/${userId}/albums`);
    await addDoc(albumsRef, {
      ...albumData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding album to user:', error);
    throw error;
  }
};

/**
 * Retrieves all albums from the user's albums subcollection
 */
export const getUserAlbums = async (): Promise<Album[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const albumsRef = collection(db, `users/${userId}/albums`);
    const querySnapshot = await getDocs(albumsRef);

    const albums = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Album[];

    return albums;
  } catch (error) {
    console.error('Error fetching user albums:', error);
    throw error;
  }
};

// Repeat similar patterns for songs and artists

/**
 * Adds a song to the user's songs subcollection
 */
export const addSongToUser = async (songData: Song) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const songsRef = collection(db, `users/${userId}/songs`);
    await addDoc(songsRef, {
      ...songData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding song to user:', error);
    throw error;
  }
};

/**
 * Retrieves all songs from the user's songs subcollection
 */
export const getUserSongs = async (): Promise<Song[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const songsRef = collection(db, `users/${userId}/songs`);
    const querySnapshot = await getDocs(songsRef);

    const songs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Song[];

    return songs;
  } catch (error) {
    console.error('Error fetching user songs:', error);
    throw error;
  }
};

/**
 * Adds an artist to the user's artists subcollection
 */
export const addArtistToUser = async (artistData: Artist) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const artistsRef = collection(db, `users/${userId}/artists`);
    await addDoc(artistsRef, {
      ...artistData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding artist to user:', error);
    throw error;
  }
};

/**
 * Retrieves all artists from the user's artists subcollection
 */
export const getUserArtists = async (): Promise<Artist[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const artistsRef = collection(db, `users/${userId}/artists`);
    const querySnapshot = await getDocs(artistsRef);

    const artists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Artist[];

    return artists;
  } catch (error) {
    console.error('Error fetching user artists:', error);
    throw error;
  }
};
