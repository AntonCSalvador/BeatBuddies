// AlbumGallery.tsx

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

// Define the type for the album data from Spotify
interface Album {
  id: string;
  title: string;
  artist: string;
  rating: number;
  coverUrl: string;
}

// Define the type for user album data
interface UserAlbumItem extends UserItemData {
  itemId: string;
}

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

export default function AlbumGallery() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAlbums() {
      try {
        setLoading(true);

        // Fetch the user's albums from your database
        const userAlbumsArray: UserAlbumItem[] = await getUserItems('albums');
        console.log('User Albums Array:', userAlbumsArray);

        if (!userAlbumsArray || userAlbumsArray.length === 0) {
          setError('No albums found in your collection.');
          return;
        }

        // Now fetch album details from Spotify API
        const token = await getAccessToken();

        // Fetch details for all albums concurrently
        const albumPromises = userAlbumsArray.map(async (item) => {
          const albumId = item.itemId.trim(); // Remove any leading/trailing whitespace

          // Validate albumId length (Spotify album IDs are typically 22 characters)
          if (albumId.length !== 22) {
            console.warn(`Album ID "${albumId}" may be invalid.`);
            return null; // Skip invalid IDs
          }

          try {
            const response = await fetch(
              `https://api.spotify.com/v1/albums/${albumId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Spotify API Error:', errorData);
              throw new Error(`Failed to fetch album with ID: ${albumId}`);
            }

            const data = await response.json();

            return {
              id: data.id,
              title: data.name,
              artist: data.artists.map((artist: any) => artist.name).join(', '),
              rating: item.rating,
              coverUrl: data.images[0]?.url || 'https://via.placeholder.com/300',
            };
          } catch (error) {
            console.error(`Error fetching album with ID "${albumId}":`, error);
            return null; // Skip albums that failed to fetch
          }
        });

        const albumsData = (await Promise.all(albumPromises)).filter(
          (album): album is Album => album !== null
        );

        if (albumsData.length === 0) {
          setError('No valid albums found in your collection.');
          return;
        }

        setAlbums(albumsData);
      } catch (err) {
        console.error('Error fetching albums:', err);
        setError('Failed to load albums.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserAlbums();
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

  const renderItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      onPress={() => {
        console.log('Navigating to ID:', item.id);
        router.push(`/(pages)/search/${item.id}`);
      }}
      className="flex-1 m-2 p-2 bg-gray-100 rounded-md"
    >
      <Image
        source={{ uri: item.coverUrl }}
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="mt-2 items-center">
        <Text className="text-sm font-medium text-center text-black">
          {item.title}
        </Text>
        <Text className="text-xs text-center text-gray-500">
          {item.artist}
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
          Your Album Ratings
        </Text>
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </SafeAreaViewAll>
  );
}
