import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import { Audio } from 'expo-av';

// Define the type for the track data, including album images
interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumCover: string;
    previewUrl: string | null;
}

// Function to get the access token
async function getAccessToken() {
    const clientId = SPOTIFY_CLIENT_ID;
    const clientSecret = SPOTIFY_CLIENT_SECRET;

    // Fetch access token from Spotify API
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

// Function to search for tracks by name with pagination
async function searchTrackByName(trackName: string, offset = 0): Promise<Track[]> {
    const token = await getAccessToken();
    
    // Search for tracks using Spotify API with pagination support
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
        // Map API response to Track objects
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
    const [searchText, setSearchText] = useState(''); // Search input text
    const [tracks, setTracks] = useState<Track[]>([]); // List of unique tracks
    const [error, setError] = useState<string | null>(null); // Error message
    const [sound, setSound] = useState<Audio.Sound | null>(null); // Audio sound object
    const [offset, setOffset] = useState(0); // Pagination offset
    const [hasMore, setHasMore] = useState(true); // Flag to check if more tracks can be loaded
    const [isLoading, setIsLoading] = useState(false); // Flag to prevent duplicate requests

    useEffect(() => {
        // Set audio mode for playback
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
        });

        // Clean up sound on component unmount
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // Function to fetch tracks and update state
    const fetchTracks = async (query: string, newOffset: number) => {
        if (isLoading || !hasMore) return; // Prevent fetching if already loading or no more tracks

        setIsLoading(true);
        try {
            const result = await searchTrackByName(query, newOffset);
            if (result.length > 0) {
                setTracks((prevTracks) => {
                    const allTracks = [...prevTracks, ...result];

                    // Filter out tracks with duplicate artists
                    const uniqueArtists = new Set();
                    return allTracks.filter((track) => {
                        if (uniqueArtists.has(track.artist)) {
                            return false; // Exclude duplicate artists
                        } else {
                            uniqueArtists.add(track.artist);
                            return true;
                        }
                    });
                });
                setOffset(newOffset + result.length);
            } else {
                setHasMore(false); // No more tracks available
            }
        } catch (err) {
            setError('An error occurred while fetching more tracks');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle initial search
    const handleSearch = async () => {
        if (sound) {
            await sound.unloadAsync(); // Stop any playing sound
            setSound(null);
        }

        // Reset state for new search
        setTracks([]);
        setOffset(0);
        setHasMore(true);
        setError(null);
        fetchTracks(searchText, 0); // Fetch first batch of tracks
    };

    // Function to play the preview audio
    const playPreview = async (previewUrl: string) => {
        if (sound) {
            await sound.unloadAsync(); // Stop previously playing sound
            setSound(null);
        }

        try {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true }
            );
            setSound(newSound); // Save reference to the new sound
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ padding: 16 }}
            onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                // Check if user scrolled near the bottom
                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
                    fetchTracks(searchText, offset); // Fetch more tracks
                }
            }}
            scrollEventThrottle={16} // Adjust for smooth scrolling
        >
            {/* Search input field */}
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
            {/* Search button */}
            <Button title="Search" onPress={handleSearch} />

            {/* Error message */}
            {error && <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>}

            {/* List of tracks */}
            {tracks.map((track) => (
                <View key={track.id} style={{ marginTop: 16 }}>
                    <Text>Track ID: {track.id}</Text>
                    <Text>Track Name: {track.name}</Text>
                    <Text>Artist: {track.artist}</Text>
                    <Text>Album: {track.album}</Text>
                    {track.albumCover ? (
                        <Image
                            source={{ uri: track.albumCover }}
                            style={{ width: 200, height: 200, marginTop: 8 }}
                        />
                    ) : (
                        <Text>No Album Cover Available</Text>
                    )}
                    {track.previewUrl ? (
                        <Button
                            title="Play Preview"
                            onPress={() => track.previewUrl && playPreview(track.previewUrl)}
                        />
                    ) : (
                        <Text>No Preview Available</Text>
                    )}
                </View>
            ))}

            {/* Loading indicator */}
            {isLoading && <Text>Loading more...</Text>}
        </ScrollView>
    );
}
