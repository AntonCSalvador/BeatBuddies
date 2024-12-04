import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    ScrollView,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import { Audio } from 'expo-av';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

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

async function searchByType(
    query: string,
    type: string,
    offset = 0
): Promise<Track[]> {
    const token = await getAccessToken();
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=5&offset=${offset}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const searchData = await response.json();
    let items = [];
    if (type === 'track' && searchData.tracks) {
        items = searchData.tracks.items;
    } else if (type === 'album' && searchData.albums) {
        items = searchData.albums.items;
    } else if (type === 'artist' && searchData.artists) {
        items = searchData.artists.items;
    }

    return items.map((item: any) => {
        if (type === 'track') {
            return {
                id: item.id,
                name: item.name,
                artist: item.artists[0].name,
                album: item.album.name,
                albumCover: item.album.images[0]?.url || '',
                previewUrl: item.preview_url,
            };
        } else if (type === 'album') {
            return {
                id: item.id,
                name: item.name,
                artist: item.artists[0].name,
                album: item.name,
                albumCover: item.images[0]?.url || '',
                previewUrl: null,
            };
        } else if (type === 'artist') {
            return {
                id: item.id,
                name: item.name,
                artist: item.name,
                album: '',
                albumCover: item.images[0]?.url || '',
                previewUrl: null,
            };
        }
    });
}

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState<
        'track' | 'album' | 'artist'
    >('track');

    const fetchTracks = async (query: string, newOffset: number) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const result = await searchByType(query, selectedTab, newOffset);
            if (result.length > 0) {
                setTracks((prevTracks) => [...prevTracks, ...result]);
                setOffset(newOffset + result.length);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching results:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        setTracks([]);
        setOffset(0);
        setHasMore(true);
        fetchTracks(searchText, 0);
    };

    const handleAdd = (track: Track) => {
        console.log('Success:', track.name, ' id: ', track.id);
    };

    return (
        <SafeAreaViewAll color="white">
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } =
                        nativeEvent;
                    if (
                        layoutMeasurement.height + contentOffset.y >=
                        contentSize.height - 20
                    ) {
                        fetchTracks(searchText, offset);
                    }
                }}
                scrollEventThrottle={16}
            >
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 16,
                    }}
                >
                    Search
                </Text>

                {/* Tab Selection */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    {['track', 'album', 'artist'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => {
                                setSelectedTab(
                                    tab as 'track' | 'album' | 'artist'
                                );
                                setTracks([]);
                                setOffset(0);
                                setHasMore(true);
                            }}
                            style={{
                                flex: 1,
                                padding: 10,
                                backgroundColor:
                                    selectedTab === tab ? '#007BFF' : '#f0f0f0',
                                borderRadius: 4,
                                marginHorizontal: 2,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color:
                                        selectedTab === tab ? '#fff' : '#000',
                                }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TextInput
                    placeholder={`Search by ${selectedTab}`}
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

                {tracks.map((track) => (
                    <View
                        key={track.id}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 16,
                            padding: 12,
                            backgroundColor: '#e0e0e0',
                            borderRadius: 8,
                        }}
                    >
                        {track.albumCover ? (
                            <Image
                                source={{ uri: track.albumCover }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 8,
                                    marginRight: 16,
                                }}
                            />
                        ) : (
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: '#ccc',
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Text style={{ color: '#666' }}>No Cover</Text>
                            </View>
                        )}

                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                }}
                                numberOfLines={1}
                            >
                                {track.name}
                            </Text>
                            {selectedTab !== 'artist' && (
                                <Text
                                    style={{
                                        color: '#666',
                                        fontSize: 14,
                                        marginTop: 4,
                                    }}
                                    numberOfLines={1}
                                >
                                    {track.album}
                                </Text>
                            )}
                            <Text
                                style={{
                                    color: '#999',
                                    fontSize: 14,
                                    marginTop: 4,
                                }}
                                numberOfLines={1}
                            >
                                {track.artist}
                            </Text>
                        </View>

                        {/* Add Button */}
                        <TouchableOpacity
                            onPress={() => handleAdd(track)}
                            style={{
                                padding: 10,
                                backgroundColor: '#007BFF',
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {isLoading && <Text>Loading more...</Text>}
            </ScrollView>
        </SafeAreaViewAll>
    );
}
