import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinkOptions from '@/components/profile/index/LinkOptions'; // Import your LinkOptions component
import { signOut } from '@/utils/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';
import { getDocs, collection } from 'firebase/firestore';
import { Album } from '@/utils/userData';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import * as Clipboard from 'expo-clipboard'; // Install this if you're using Expo
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

export default function ProfilePage() {
    const router = useRouter();
    const [favoriteAlbums, setFavoriteAlbums] = useState<Album[]>([]);
    
    const { id } = useLocalSearchParams(); // Get the songId from the dynamic route
    const theiruuid = id;

    // Dummy data for favorite albums

    const fetchFavoriteAlbums = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const favoritesRef = collection(db, `users/${user.uid}/favorites`);
            const snapshot = await getDocs(favoritesRef);

            if (snapshot.empty) {
                setFavoriteAlbums([]);
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
                                headers: { Authorization: `Bearer ${token}` },
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
                                .map((artist) => artist.name)
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

            setFavoriteAlbums(albumDetails.filter((album) => album !== null));
        } catch (error) {
            console.error('Error fetching favorite albums:', error);
        }
    };

    const [profileData, setProfileData] = useState({
        displayName: '',
        bio: '',
        avatarUrl: 'https://via.placeholder.com/100', // Default placeholder image
    });
    const [loading, setLoading] = useState(true);

    // Dummy data for recent activity
    const recentActivity = [
        {
            id: '1',
            type: 'song', // Can be 'song', 'album', or 'artist'
            coverUrl:
                'https://upload.wikimedia.org/wikipedia/en/f/f9/Beabadoobee_-_Loveworm.png',
            songTitle: 'Ceilings',
            artistName: 'Beabadoobee',
            rating: 4.5,
        },
        {
            id: '2',
            type: 'album',
            coverUrl:
                'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png/220px-Tyler%2C_the_Creator_-_Flower_Boy.png',
            albumTitle: 'Flower Boy',
            artistName: 'Tyler, the Creator',
            rating: 5,
        },
        {
            id: '3',
            type: 'artist',
            coverUrl:
                'https://upload.wikimedia.org/wikipedia/en/f/fd/Coldplay_-_Parachutes.png',
            artistName: 'Coldplay',
            rating: 4,
        },
    ];

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

    const confirmSignOut = () => {
        Alert.alert(
            'Confirm Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => signOut(),
                },
            ],
            { cancelable: true }
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const fetchProfileData = async () => {
                setLoading(true);
                try {
                    const user = auth.currentUser;
                    if (!user) {
                        throw new Error('No user is currently signed in.');
                    }

                    const userRef = doc(db, 'users', user.uid);
                    const userSnapshot = await getDoc(userRef);

                    if (userSnapshot.exists()) {
                        const data = userSnapshot.data();
                        if (isActive) {
                            setProfileData({
                                displayName:
                                    data.displayName || 'No name provided',
                                bio: data.Bio || 'No bio provided',
                                avatarUrl:
                                    data.profileImageLink ||
                                    'https://via.placeholder.com/100',
                            });
                        }
                    } else {
                        throw new Error('User document does not exist.');
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    Alert.alert(
                        'Error',
                        'Failed to fetch profile information.'
                    );
                } finally {
                    if (isActive) {
                        setLoading(false);
                    }
                }
            };

            fetchProfileData();
            fetchFavoriteAlbums();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const copyToClipboard = (text: any) => {
        Clipboard.setStringAsync(text); // Copies the text to clipboard
        Alert.alert("Copied to Clipboard", text); // Show confirmation (optional)
    };

    return (
        <SafeAreaViewAll color="white">
        <ScrollView className="flex-1 bg-white">
            {/* Header Section */}
            <View className="items-center p-4 bg-gray-100">
                <Image
                    source={{ uri: profileData.avatarUrl }}
                    className="w-24 h-24 rounded-full mb-2"
                />
                <Text className="text-2xl font-bold">
                    {theiruuid}
                </Text>
                <Text className="text-gray-600">{profileData.bio}</Text>
            </View>

            {/* Favorite Albums Section */}
            <View className="p-4">
                <Text className="text-xl font-bold mb-2">Favorite Albums</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {favoriteAlbums.map((album) => (
                        <View key={album.id} className="mr-4">
                            <Image
                                source={{ uri: album.albumCover }}
                                className="w-32 h-32 rounded-lg"
                            />
                            <Text className="text-center mt-2 font-semibold">
                                {album.name}
                            </Text>
                            <Text className="text-center text-gray-500">
                                {album.artist}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Recent Activity Section */}
            <View className="p-4">
                <Text className="text-xl font-bold mb-2">Recent Activity</Text>
                {recentActivity.map((activity) => {
                    const fullStars = Math.floor(activity.rating);
                    const hasHalfStar = activity.rating % 1 !== 0;

                    return (
                        <Pressable
                            key={activity.id}
                            className="flex-row items-start mb-4 bg-gray-100 p-3 rounded-lg"
                            onPress={() =>
                                console.log(
                                    `Pressed activity ID: ${activity.id}`
                                )
                            } //okay here just do router.push(`/(pages)/search/${activity.id}`); something like that instead of the console.log
                        >
                            {/* Cover Image */}
                            <Image
                                source={{ uri: activity.coverUrl }}
                                className="w-16 h-16 mr-4 rounded-md"
                            />
                            <View className="flex-1">
                                {/* Title and Details */}
                                {activity.type === 'song' && (
                                    <>
                                        <Text className="text-lg font-semibold text-black">
                                            {activity.songTitle}
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            by {activity.artistName}
                                        </Text>
                                    </>
                                )}
                                {activity.type === 'album' && (
                                    <>
                                        <Text className="text-lg font-semibold text-black">
                                            {activity.albumTitle}
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            by {activity.artistName}
                                        </Text>
                                    </>
                                )}
                                {activity.type === 'artist' && (
                                    <Text className="text-lg font-semibold text-black">
                                        {activity.artistName}
                                    </Text>
                                )}

                                {/* Rating */}
                                <View className="flex-row items-center mt-2">
                                    {[...Array(fullStars)].map((_, index) => (
                                        <Ionicons
                                            key={`star-${activity.id}-${index}`}
                                            name="star"
                                            size={16}
                                            color="#FFD700"
                                        />
                                    ))}
                                    {hasHalfStar && (
                                        <Ionicons
                                            name="star-half"
                                            size={16}
                                            color="#FFD700"
                                        />
                                    )}
                                    {[
                                        ...Array(
                                            5 - Math.ceil(activity.rating)
                                        ),
                                    ].map((_, index) => (
                                        <Ionicons
                                            key={`star-outline-${activity.id}-${index}`}
                                            name="star-outline"
                                            size={16}
                                            color="#E5E7EB"
                                        />
                                    ))}
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* Navigation Links (Using LinkOptions) */}
            {/* Profile Options */}
            {/* <View className="w-full mt-4 border-t border-gray-200">
                <Text className="text-2xl pt-4 pl-4 font-bold">
                    Profile
                </Text>
                <LinkOptions
                    title="Account Info"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
                <LinkOptions
                    title="Activity"
                    onPress={() => router.push('/(pages)/activity')}
                    color="black"
                />
            </View> */}

            {/* Ratings Options */}
            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Albums"
                    onPress={() => router.push('/(pages)/profile/albumGallery')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Songs"
                    onPress={() => router.push('/(pages)/profile/songGallery')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Artists"
                    onPress={() =>
                        router.push('/(pages)/profile/artistGallery')
                    }
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Lists"
                    onPress={() => router.push('/(pages)/profile/ListsPage')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Friends"
                    onPress={() => router.push('/(pages)/profile/friendsList')}
                    color="black"
                />
            </View>

            {/* Security Options */}
            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <Text className="text-2xl pt-4 pl-4 font-bold">Share</Text>
                <Pressable 
                    onPress={() => {copyToClipboard(theiruuid)}}
                    className="flex-row items-center justify-between py-4 mr-4 active:bg-gray-100"
                >
                    <Text className="text-m pl-4 font-bold">{theiruuid}</Text>
                    <Ionicons name="copy-outline" size={18} color="black" />
                </Pressable>
            </View>
        </ScrollView>
        </SafeAreaViewAll>
    );
}
