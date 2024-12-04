// ArtistGallery.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import { getUserItems, UserItemData } from '@/utils/userData';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import { encode as btoa } from 'base-64';

// Define the type for user artist data
interface UserArtistItem extends UserItemData {
  itemId: string; // Spotify Artist ID
}

// Define the type for the artist data from Spotify
interface Artist extends UserArtistItem {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  imageUrl: string;
}

// StarRating Component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <View className="flex-row justify-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      ))}
      {hasHalfStar && <Ionicons name="star-half" size={16} color="#FFD700" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Ionicons
          key={i + fullStars}
          name="star-outline"
          size={16}
          color="#d3d3d3"
        />
      ))}
    </View>
  );
}

export default function ArtistGallery() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserArtists() {
      try {
        setLoading(true);

        // Fetch the user's artists from your database
        const userArtistsArray: UserArtistItem[] = await getUserItems('artists');
        console.log('User Artists Array:', userArtistsArray);

        if (!userArtistsArray || userArtistsArray.length === 0) {
          setError('No artists found in your collection.');
          return;
        }

        // Fetch the Spotify API access token
        const token = await getAccessToken();

        // Fetch details for all artists concurrently
        const artistPromises = userArtistsArray.map(async (item) => {
          const artistId = item.itemId.trim(); // Remove any leading/trailing whitespace

          // Validate artistId length (Spotify artist IDs are typically 22 characters)
          if (artistId.length !== 22) {
            console.warn(`Artist ID "${artistId}" may be invalid.`);
            return null; // Skip invalid IDs
          }

          try {
            const response = await fetch(
              `https://api.spotify.com/v1/artists/${artistId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Spotify API Error:', errorData);
              throw new Error(`Failed to fetch artist with ID: ${artistId}`);
            }

            const data = await response.json();

            return {
              id: data.id,
              name: data.name,
              genres: data.genres,
              popularity: data.popularity,
              imageUrl: data.images[0]?.url || 'https://via.placeholder.com/300',
              rating: item.rating, // User rating
              review: item.review, // User review
            };
          } catch (error) {
            console.error(`Error fetching artist with ID "${artistId}":`, error);
            return null; // Skip artists that failed to fetch
          }
        });

        const artistsData = (await Promise.all(artistPromises)).filter(
          (artist): artist is Artist => artist !== null
        );

        if (artistsData.length === 0) {
          setError('No valid artists found in your collection.');
          return;
        }

        setArtists(artistsData);
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError('Failed to load artists.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserArtists();
  }, []);

  // Helper function to get the Spotify API access token
  async function getAccessToken(): Promise<string> {
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

  const renderItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      onPress={() => {
        console.log('Navigating to ID:', item.id);
        router.push(`/(pages)/search/${item.id}`);
      }}
      className="flex-1 m-2 p-2 bg-gray-100 rounded-md"
    >
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="mt-2 items-center">
        <Text className="text-sm font-medium text-center text-black">
          {item.name}
        </Text>
        <StarRating rating={item.rating} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaViewAll color="white">
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </SafeAreaViewAll>
    );
  }

  if (error) {
    return (
      <SafeAreaViewAll color="white">
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-red-500 text-lg">{error}</Text>
        </View>
      </SafeAreaViewAll>
    );
  }

  return (
    <SafeAreaViewAll color="white">
      <View className="flex-1 bg-white px-4 py-6">
        <Text className="text-2xl font-bold text-center mb-6">
          Your Favorite Artists
        </Text>
        <FlatList
          data={artists}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2} // Display 2 artists per row
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </SafeAreaViewAll>
  );
}
