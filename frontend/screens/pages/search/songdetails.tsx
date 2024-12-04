import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import { useRouter } from 'expo-router';
import { addItemToUser, getUserItem } from '@/utils/userData';

// Define the type for the track data
interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumCover: string;
    previewUrl: string | null;
}

interface SongDetailsProps {
    songId: string; // Dynamic song ID passed from the route
}

export default function SongDetails({ songId }: SongDetailsProps) {
    const [track, setTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); // To track play/pause status
    const [rating, setRating] = useState<number>(0); // Updated state for half-star rating
    const [review, setReview] = useState<string>(''); // State for review
    const router = useRouter();


    useEffect(() => {
        async function fetchTrackDetails() {
            try {
                setLoading(true);
                const token = await getAccessToken();
                const response = await fetch(
                    `https://api.spotify.com/v1/tracks/${songId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch track details');
                }

                const data = await response.json();
                setTrack({
                    id: data.id,
                    name: data.name,
                    artist: data.artists[0].name,
                    album: data.album.name,
                    albumCover: data.album.images[0]?.url || '',
                    previewUrl: data.preview_url,
                });

                // Check if the user has already reviewed this song
                const existingReview = await getUserItem('songs', songId);
                if (existingReview) {
                    setRating(existingReview.rating);
                    setReview(existingReview.review);
                }
            } catch (error) {
                setError('Failed to load track details');
            } finally {
                setLoading(false);
            }
        }

        fetchTrackDetails();

        return () => {
            if (sound) {
                sound.unloadAsync(); // Ensure sound is stopped when component unmounts
            }
        };
    }, [songId]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (sound) {
                    sound.unloadAsync();
                    setSound(null);
                    setIsPlaying(false); // Reset state when navigating away
                }
            };
        }, [sound])
    );

    const playPreview = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
            return;
        }

        if (track?.previewUrl) {
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: track.previewUrl },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
            } catch (error) {
                console.error('Error playing preview:', error);
            }
        }
    };

    const pausePreview = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            pausePreview();
        } else {
            playPreview();
        }
    };

    const handleStarPress = (star: number) => {
        if (rating === star) {
            setRating(star - 0.5);
        } else if (rating === star - 0.5) {
            setRating(0);
        } else {
            setRating(star);
        }
    };

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleSubmit = async () => {
        console.log('Rating submitted:', rating);
        console.log('Review submitted:', review);
        try {
            await addItemToUser('songs', track!.id, {
                rating: rating,
                review: review,
            });
            console.log('Song review added/updated successfully');
            Alert.alert('Success', 'Your review has been saved.');
        } catch (error) {
            console.error('Error adding/updating song review:', error);
            Alert.alert(
                'Error',
                'Failed to save your review. Please try again.'
            );
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
       
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-red-500 text-lg">{error}</Text>
            </View>
        );
        
    }

    if (!track) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-red-500 text-lg">Track not found</Text>
            </View>
        );
        
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 bg-white px-6 py-4">
                    {/* Custom Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-12 left-4 p-2"
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <View className="items-center mt-12">
                        <Image
                            source={{ uri: track.albumCover }}
                            className="w-52 h-52 rounded-lg mb-4"
                        />
                        <Text className="text-2xl font-bold text-black text-center mb-2">
                            {track.name}
                        </Text>
                        <Text className="text-lg text-gray-600 mb-1">
                            Artist: {track.artist}
                        </Text>
                        <Text className="text-md text-gray-500 mb-4">
                            Album: {track.album}
                        </Text>

                        {/* Half-Star Rating */}
                        <View className="flex-row items-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => {
                                let iconName = 'star-outline';

                                if (rating >= star) {
                                    iconName = 'star';
                                } else if (rating === star - 0.5) {
                                    iconName = 'star-half';
                                }

                                return (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => handleStarPress(star)}
                                    >
                                        <Ionicons
                                            name={iconName}
                                            size={32}
                                            color="#FFD700"
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Review Input */}
                        <TextInput
                            className="w-full border border-gray-300 rounded-lg p-3 text-base h-28 mb-4"
                            placeholder="Write your review here..."
                            value={review}
                            onChangeText={setReview}
                            multiline
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={handleDismissKeyboard}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="flex-row items-center justify-center bg-blue-500 py-3 px-5 rounded-lg mb-4"
                        >
                            <Ionicons
                                name="send-outline"
                                size={24}
                                color="#fff"
                            />
                            <Text className="text-white text-lg ml-2">
                                Submit Review
                            </Text>
                        </TouchableOpacity>

                        {/* Play/Pause Button */}
                        {track.previewUrl ? (
                            <TouchableOpacity
                                onPress={togglePlayPause}
                                className="flex-row items-center justify-center bg-green-500 py-3 px-5 rounded-lg"
                            >
                                <Ionicons
                                    name={isPlaying ? 'pause' : 'play'}
                                    size={24}
                                    color="#fff"
                                />
                                <Text className="text-white text-lg ml-2">
                                    {isPlaying
                                        ? 'Pause Preview'
                                        : 'Play Preview'}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text className="text-gray-500 mt-2">
                                No Preview Available
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Helper function to get the Spotify API access token
async function getAccessToken() {
    const clientId = SPOTIFY_CLIENT_ID;
    const clientSecret = SPOTIFY_CLIENT_SECRET;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}
