// AlbumDetails.tsx

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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { addItemToUser, getUserItem } from '@/utils/userData';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import { encode as btoa } from 'base-64';

// Define the type for the album data
interface Album {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
}

interface AlbumDetailsProps {
  songId: string; // Assuming the ID is passed as songId
}

export default function AlbumDetails({ songId }: AlbumDetailsProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchAlbumDetails() {
      try {
        setLoading(true);
        const token = await getAccessToken();

        const response = await fetch(
          `https://api.spotify.com/v1/albums/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Spotify API Error:', errorData);
          throw new Error('Failed to fetch album details');
        }

        const data = await response.json();
        setAlbum({
          id: data.id,
          name: data.name,
          artist: data.artists.map((artist: any) => artist.name).join(', '),
          albumCover: data.images[0]?.url || '',
        });

        // Fetch existing review
        const existingReview = await getUserItem('albums', songId);
        if (existingReview) {
          setRating(existingReview.rating);
          setReview(existingReview.review);
        }
      } catch (error) {
        console.error('Error fetching album details:', error);
        setError('Failed to load album details');
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumDetails();
  }, [songId]);

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
      await addItemToUser('albums', album!.id, { rating: rating, review: review });
      console.log('Album review added/updated successfully');
      Alert.alert('Success', 'Your review has been saved.');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error adding/updating album review:', error);
      Alert.alert('Error', 'Failed to save your review. Please try again.');
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

  if (!album) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg">Album not found</Text>
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
            <Image source={{ uri: album.albumCover }} className="w-52 h-52 rounded-lg mb-4" />
            <Text className="text-2xl font-bold text-black text-center mb-2">{album.name}</Text>
            <Text className="text-lg text-gray-600 mb-1">Artist: {album.artist}</Text>

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
              <Ionicons name="send-outline" size={24} color="#fff" />
              <Text className="text-white text-lg ml-2">Submit Review</Text>
            </TouchableOpacity>
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

  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedCredentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Error fetching access token:', data);
    throw new Error(`Error fetching access token: ${data.error_description}`);
  }
  return data.access_token;
}
