// /profile/addFavorite.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import { useRouter } from 'expo-router';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import { addFavoriteAlbum } from '@/utils/userData';

interface Album {
    id: string;
    name: string;
    artist: string;
    albumCover: string;
}

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' +
                btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}

async function searchAlbums(query: string): Promise<Album[]> {
    const token = await getAccessToken();
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    return data.albums.items.map((album: any) => ({
        id: album.id,
        name: album.name,
        artist: album.artists[0].name,
        albumCover: album.images[0]?.url || '',
    }));
}

export default function AddFavorite() {
    const [searchText, setSearchText] = useState('');
    const [albums, setAlbums] = useState<Album[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSearch = async () => {
        if (searchText.trim() === '') {
            Alert.alert('Empty Search', 'Please enter a search term.');
            return;
        }
        setIsLoading(true);
        setAlbums([]);
        try {
            const result = await searchAlbums(searchText);
            setAlbums(result);
        } catch (error) {
            console.error('Error fetching albums:', error);
            Alert.alert('Error', 'Failed to fetch albums.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAlbum = async (album: Album) => {
        try {
            await addFavoriteAlbum(album); // Add directly to the favorites collection
            router.back(); // Navigate back to the AccountInfo screen
        } catch (error) {
            console.error('Error adding album:', error);
            Alert.alert('Error', 'Failed to add album to favorites.');
        }
    };

    return (
        <SafeAreaViewAll color="white">
            <ScrollView
                className="flex-1 bg-white p-4"
                contentContainerStyle={{ padding: 16 }}
                keyboardShouldPersistTaps="handled"
            >
                <Text className="text-3xl font-bold text-center mb-8">
                    Search Albums
                </Text>

                <TextInput
                    placeholder="Search for an album"
                    value={searchText}
                    onChangeText={setSearchText}
                    className="border border-gray-300 rounded-lg p-3 mb-4 bg-white text-sm"
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    className="py-2 px-4 bg-blue-500 rounded-lg mb-8"
                >
                    <Text className="text-center text-white font-semibold">
                        Search
                    </Text>
                </TouchableOpacity>

                {isLoading && (
                    <Text className="text-center mb-4">Loading...</Text>
                )}

                {albums.map((album) => (
                    <View
                        key={album.id}
                        className="flex-row items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-sm"
                    >
                        {album.albumCover ? (
                            <Image
                                source={{ uri: album.albumCover }}
                                className="w-16 h-16 rounded-lg mr-4"
                            />
                        ) : (
                            <View className="w-16 h-16 bg-gray-300 rounded-lg mr-4 justify-center items-center">
                                <Text className="text-gray-600">No Cover</Text>
                            </View>
                        )}

                        <View className="flex-1">
                            <Text className="text-lg font-semibold">
                                {album.name}
                            </Text>
                            <Text className="text-sm text-gray-600">
                                {album.artist}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => handleAddAlbum(album)}
                            className="py-2 px-4 bg-green-500 rounded-lg"
                        >
                            <Text className="text-white font-semibold">
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {albums.length === 0 && !isLoading && (
                    <Text className="text-center text-gray-500 mt-8">
                        No albums found.
                    </Text>
                )}
            </ScrollView>
        </SafeAreaViewAll>
    );
}
