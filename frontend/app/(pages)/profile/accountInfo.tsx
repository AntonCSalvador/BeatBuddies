import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator,
} from 'react-native';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_URL } from '@/screens/spotify';
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebase/firebaseConfig';
import {
    getDoc,
    doc,
    updateDoc,
    collection,
    getDocs,
    deleteDoc,
    setDoc,
} from 'firebase/firestore';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';

interface Album {
    id: string;
    name: string;
    artist: string;
    albumCover: string;
}

export default function AccountInfo() {
    const [favoriteAlbums, setFavoriteAlbums] = useState<Album[]>([]);
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(
        'https://i.pinimg.com/736x/a6/67/73/a667732975f0f1da1a0fd4625e30d776.jpg'
    );
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    // Fetch user data and favorite albums on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.log('No user is currently signed in.');
                setIsLoading(false);
                return;
            }

            try {
                const userRef = doc(db, 'users', user.uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setDisplayName(userData.displayName || '');
                    setBio(userData.Bio || '');
                    setAvatarUrl(userData.profileImageLink || avatarUrl);

                    // Fetch favorite albums
                    await fetchFavoriteAlbums();
                } else {
                    console.log('User document does not exist.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to fetch user data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchFavoriteAlbums = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const favoritesRef = collection(db, `users/${user.uid}/favorites`);
            const snapshot = await getDocs(favoritesRef);

            if (snapshot.empty) {
                console.log('No favorite albums found.');
                return;
            }

            const albumIds = snapshot.docs.map((doc) => doc.id);

            // Query Spotify for album details
            const token = await getSpotifyAccessToken();
            const albumDetails = await Promise.all(
                albumIds.map(async (id) => {
                    try {
                        const response = await fetch(
                            `https://api.spotify.com/v1/albums/${id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (!response.ok) {
                            console.error(
                                `Failed to fetch album with ID: ${id}`
                            );
                            return null;
                        }

                        const data = await response.json();
                        return {
                            id: data.id,
                            name: data.name,
                            artist: data.artists
                                .map((artist: any) => artist.name)
                                .join(', '),
                            albumCover:
                                data.images[0]?.url ||
                                'https://via.placeholder.com/300',
                        };
                    } catch (error) {
                        console.error('Error fetching album details:', error);
                        return null;
                    }
                })
            );

            // Update state with valid albums
            setFavoriteAlbums(albumDetails.filter((album) => album !== null));
        } catch (error) {
            console.error('Error fetching favorite albums:', error);
        }
    };

    const getSpotifyAccessToken = async (): Promise<string> => {
        try {
            const credentials = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
            const response = await fetch(
                'https://accounts.spotify.com/api/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${btoa(credentials)}`,
                    },
                    body: 'grant_type=client_credentials',
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(`Error fetching Spotify token: ${data.error}`);
            }

            return data.access_token;
        } catch (error) {
            console.error('Error fetching Spotify access token:', error);
            throw error;
        }
    };

    const handleAddFavoriteAlbum = async (album: Album) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not signed in.');

            const albumRef = doc(db, `users/${user.uid}/favorites`, album.id);
            await setDoc(albumRef, { addedAt: new Date() });

            setFavoriteAlbums((prev) => [...prev, album]);
            Alert.alert('Success', `${album.name} added to favorites.`);
        } catch (error) {
            console.error('Error adding favorite album:', error);
            Alert.alert('Error', 'Failed to add album to favorites.');
        }
    };

    const handleRemoveFavoriteAlbum = async (albumId: string) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not signed in.');

            const albumRef = doc(db, `users/${user.uid}/favorites`, albumId);
            await deleteDoc(albumRef);

            setFavoriteAlbums((prev) =>
                prev.filter((album) => album.id !== albumId)
            );
            Alert.alert('Success', 'Album removed from favorites.');
        } catch (error) {
            console.error('Error removing favorite album:', error);
            Alert.alert('Error', 'Failed to remove album from favorites.');
        }
    };

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleImageUpload = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(
                'Permission Required',
                'Please allow access to the media library.'
            );
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (pickerResult.canceled) {
            return;
        }

        const { uri, type: mimeType } = pickerResult.assets[0];
        const fileName = uri.split('/').pop();
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri,
                name: fileName || 'upload',
                type: mimeType || 'image/jpeg',
            } as any);
            formData.append('upload_preset', 'beatbuddies'); // Replace with your Cloudinary preset
            formData.append('cloud_name', 'dk4wmqxux'); // Replace with your Cloudinary cloud name

            const response = await fetch(`${CLOUDINARY_URL}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            setAvatarUrl(data.secure_url);
            Alert.alert('Upload Successful', 'Your picture has been uploaded.');
        } catch (error) {
            Alert.alert(
                'Upload Failed',
                'Something went wrong during the upload.'
            );
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const validateInput = () => {
        // Regular expression for display name validation: alphanumeric, spaces, underscores, max 15 chars
        const displayNameRegex = /^[a-zA-Z0-9 _]{1,15}$/;

        // Validate display name
        if (!displayNameRegex.test(displayName)) {
            Alert.alert(
                'Invalid Display Name',
                'Display Name must be less than 15 characters and can only contain letters, numbers, spaces, and underscores.'
            );
            return false;
        }

        // Validate bio length
        if (bio.length > 250) {
            Alert.alert('Invalid Bio', 'Bio must be less than 250 characters.');
            return false;
        }

        return true; // Input is valid
    };

    const handleSubmit = async () => {
        if (validateInput()) {
            const user = auth.currentUser;

            if (!user) {
                Alert.alert('Error', 'No user is currently signed in.');
                return;
            }

            try {
                // Reference to the user's document in Firestore
                const userRef = doc(db, 'users', user.uid);

                // Update the document with new data
                await updateDoc(userRef, {
                    displayName: displayName,
                    Bio: bio,
                    profileImageLink: avatarUrl,
                });

                console.log('Profile updated:', {
                    displayName,
                    bio,
                    avatarUrl,
                });
                Alert.alert('Success', 'Your profile has been updated!');
            } catch (error) {
                console.error('Error updating profile:', error);
                Alert.alert(
                    'Error',
                    'Failed to update your profile. Please try again.'
                );
            }
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaViewAll color="white">
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={60}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text className="text-2xl font-bold text-center mb-4">
                            Your BeatBuddies Account
                        </Text>

                        {/* Avatar Section */}
                        <View className="items-center mb-6">
                            <Image
                                source={{ uri: avatarUrl }}
                                className="w-24 h-24 rounded-full mb-4"
                            />
                            <TouchableOpacity
                                onPress={handleImageUpload}
                                className={`py-2 px-4 rounded-lg ${
                                    isUploading ? 'bg-gray-300' : 'bg-blue-500'
                                }`}
                                disabled={isUploading}
                            >
                                <Text className="text-white text-sm">
                                    {isUploading
                                        ? 'Uploading...'
                                        : 'Upload Picture'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Favorite Albums Section */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold mb-2">
                                Favorite Albums
                            </Text>
                            <View className="flex-row flex-wrap -mx-2">
                                {favoriteAlbums.map((album) => (
                                    <View
                                        key={album.id}
                                        className="w-1/4 px-2 mb-4"
                                    >
                                        <Image
                                            source={{ uri: album.albumCover }}
                                            className="w-full h-24 rounded-lg mb-2"
                                        />
                                        <Text
                                            className="text-xs text-center font-semibold"
                                            numberOfLines={1}
                                        >
                                            {album.name}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleRemoveFavoriteAlbum(
                                                    album.id
                                                )
                                            }
                                            className="mt-1 py-1 px-2 bg-red-500 rounded-lg"
                                        >
                                            <Text className="text-white text-xs">
                                                Remove
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <TouchableOpacity
                                    className={`w-1/4 px-2 mb-4 ${
                                        favoriteAlbums.length >= 4
                                            ? 'opacity-50'
                                            : ''
                                    }`}
                                    onPress={() =>
                                        favoriteAlbums.length < 4
                                            ? router.push(
                                                  '/profile/addFavorite'
                                              )
                                            : Alert.alert(
                                                  'Limit Reached',
                                                  'You can only have 4 favorite albums.'
                                              )
                                    }
                                    activeOpacity={
                                        favoriteAlbums.length < 4 ? 0.7 : 1
                                    }
                                    disabled={favoriteAlbums.length >= 4}
                                >
                                    <View className="w-full h-24 border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                        <Text className="text-lg font-bold text-gray-400">
                                            +
                                        </Text>
                                        <Text className="text-xs text-gray-400 text-center mt-1">
                                            Add Album
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Display Name Input */}
                        <View className="mb-4">
                            <Text className="text-lg font-bold mb-2">
                                Display Name
                            </Text>
                            <TextInput
                                placeholder="Your display name"
                                value={displayName}
                                onChangeText={setDisplayName}
                                className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                            />
                        </View>

                        {/* Bio Input */}
                        <View className="mb-4">
                            <Text className="text-lg font-bold mb-2">Bio</Text>
                            <TextInput
                                placeholder="Tell us about yourself and your music taste..."
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={4}
                                className="border border-gray-300 rounded-lg p-3 bg-white text-sm text-justify"
                            />
                        </View>

                        {/* Save Changes Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="py-4 rounded-lg bg-blue-500"
                        >
                            <Text className="text-center text-white font-semibold">
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaViewAll>
    );
}
