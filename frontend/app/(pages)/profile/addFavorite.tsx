import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';

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
            Authorization: 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
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

export default function AlbumSearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [albums, setAlbums] = useState<Album[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        setAlbums([]);
        try {
            const result = await searchAlbums(searchText);
            setAlbums(result);
        } catch (error) {
            console.error('Error fetching albums:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAlbum = (album: Album) => {
        console.log(`Added album: ${album.name} by ${album.artist}`);
    };

    return (
        <ScrollView
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
        >
            <Text
                style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: 'black',
                    marginBottom: 16,
                }}
            >
                Search Albums
            </Text>

            <TextInput
                placeholder="Search for an album"
                value={searchText}
                onChangeText={setSearchText}
                style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 8,
                    marginBottom: 16,
                    borderRadius: 4,
                }}
            />
            <Button title="Search" onPress={handleSearch} />

            {isLoading && <Text style={{ marginTop: 16 }}>Loading...</Text>}

            {albums.map((album) => (
                <View
                    key={album.id}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 16,
                        padding: 12,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 1,
                    }}
                >
                    <Image
                        source={{ uri: album.albumCover }}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            marginRight: 12,
                        }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: 'black',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}
                            numberOfLines={1}
                        >
                            {album.name}
                        </Text>
                        <Text
                            style={{
                                color: '#666',
                                fontSize: 14,
                                marginTop: 4,
                            }}
                            numberOfLines={1}
                        >
                            {album.artist}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleAddAlbum(album)}
                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            backgroundColor: '#007BFF',
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Add</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}
