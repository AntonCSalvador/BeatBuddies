import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';

// Define the type for the track data, including album images
interface Track {
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
}

// Function to get the access token
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

// Function to fetch track data
async function getTrackData(trackId: string): Promise<Track> {
    const token = await getAccessToken();
    const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const trackData = await response.json();
    return trackData;
}

export default function HomeScreen() {
    const [track, setTrack] = useState<Track | null>(null);

    useEffect(() => {
        // Replace with a specific track ID from Spotify
        const trackId = '3iBgrkexCzVuPy4O9vx7Mf';

        // Fetch track data and update state
        getTrackData(trackId).then((data) => setTrack(data));
    }, []);

    return (
        <View>
            <Text>Hi</Text>
            {track ? (
                <View>
                    <Text>Track Name: {track.name}</Text>
                    <Text>
                        Artist: {track.artists?.[0]?.name || 'Unknown Artist'}
                    </Text>
                    <Text>Album: {track.album?.name || 'Unknown Album'}</Text>

                    {/* Display the album cover if available */}
                    {track.album.images?.[0]?.url ? (
                        <Image
                            source={{ uri: track.album.images[0].url }}
                            style={{ width: 200, height: 200 }}
                        />
                    ) : (
                        <Text>No Album Cover Available</Text>
                    )}
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}
