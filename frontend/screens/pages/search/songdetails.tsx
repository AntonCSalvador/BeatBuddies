import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';

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
    const navigation = useNavigation(); // Use navigation to handle back

    useEffect(() => {
        async function fetchTrackDetails() {
            try {
                setLoading(true);
                const token = await getAccessToken();
                const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

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
            } catch (error) {
                setError('Failed to load track details');
            } finally {
                setLoading(false);
            }
        }

        fetchTrackDetails();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [songId]);

    const playPreview = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }

        if (track?.previewUrl) {
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: track.previewUrl },
                    { shouldPlay: true }
                );
                setSound(newSound);
            } catch (error) {
                console.error('Error playing preview:', error);
            }
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    if (!track) {
        return <Text style={styles.error}>Track not found</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Custom Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Image source={{ uri: track.albumCover }} style={styles.image} />
            <Text style={styles.title}>{track.name}</Text>
            <Text style={styles.subtitle}>Artist: {track.artist}</Text>
            <Text style={styles.album}>Album: {track.album}</Text>
            {track.previewUrl ? (
                <Button title="Play Preview" onPress={playPreview} />
            ) : (
                <Text style={styles.noPreview}>No Preview Available</Text>
            )}
        </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 4,
    },
    album: {
        fontSize: 16,
        color: '#777',
        marginBottom: 10,
    },
    noPreview: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});