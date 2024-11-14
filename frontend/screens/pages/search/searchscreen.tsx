import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import { Audio } from 'expo-av';
import { useRouter, useFocusEffect } from 'expo-router'; // Updated import
import { Pressable } from 'react-native'; 

interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumCover: string;
    previewUrl: string | null;
}

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
async function searchTrackByName(trackName: string, offset = 0): Promise<Track[]> {
    const token = await getAccessToken();
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=5&offset=${offset}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const searchData = await response.json();
    if (searchData.tracks.items.length > 0) {
        return searchData.tracks.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            albumCover: track.album.images[0]?.url || '',
            previewUrl: track.preview_url,
        }));
    } else {
        return [];
    }
}

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
        });

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (sound) {
                    sound.unloadAsync();
                    setSound(null);
                }
            };
        }, [sound])
    );

    const fetchTracks = async (query: string, newOffset: number) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const result = await searchTrackByName(query, newOffset);
            if (result.length > 0) {
                setTracks((prevTracks) => {
                    const allTracks = [...prevTracks, ...result];
                    const uniqueArtists = new Set();
                    return allTracks.filter((track) => {
                        if (uniqueArtists.has(track.artist)) {
                            return false;
                        } else {
                            uniqueArtists.add(track.artist);
                            return true;
                        }
                    });
                });
                setOffset(newOffset + result.length);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError('An error occurred while fetching more tracks');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }

        setTracks([]);
        setOffset(0);
        setHasMore(true);
        setError(null);
        fetchTracks(searchText, 0);
    };

    const playPreview = async (previewUrl: string) => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }

        try {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true }
            );
            setSound(newSound);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ padding: 16 }}
            onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
                    fetchTracks(searchText, offset);
                }
            }}
            scrollEventThrottle={16}
        >
            <TextInput
                placeholder="Enter track name"
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

            {error && <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>}

            {tracks.map((track) => (
                <Pressable
                    key={track.id}
                    className="flex-row items-center mt-4 p-3 bg-neutral-200 rounded-lg"
                    onPress={() => router.push(`/(pages)/search/${track.id}`)}
                >
                    {track.albumCover ? (
                        <Image
                            source={{ uri: track.albumCover }}
                            className="w-20 h-20 rounded-lg mr-4"
                        />
                    ) : (
                        <View className="w-20 h-20 bg-neutral-400 rounded-lg justify-center items-center mr-4">
                            <Text className="text-neutral-700">No Cover</Text>
                        </View>
                    )}

                    <View className="flex-1">
                        <Text className="text-black font-bold text-lg" numberOfLines={1}>{track.name}</Text>
                        <Text className="text-neutral-600 text-sm mt-1" numberOfLines={1}>
                            {track.album} • {new Date().getFullYear()}
                        </Text>
                        <Text className="text-neutral-500 text-sm mt-1">{track.artist}</Text>
                    </View>

                    {track.previewUrl && (
                        <Button
                            title="Play"
                            color="#007BFF"
                            onPress={() => playPreview(track.previewUrl!)}
                        />
                    )}
                </Pressable>
            ))}

            {isLoading && <Text>Loading more...</Text>}
        </ScrollView>
    );
}
