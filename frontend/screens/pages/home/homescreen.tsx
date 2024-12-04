import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import Track from '@/types/track';
import TrackCard from '@/components/general/TrackCard';

async function getAccessToken(): Promise<string | null> {
    try {
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
        if (!response.ok) {
            console.error('Failed to fetch access token:', response.status, await response.text());
            return null;
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

async function getPlaylistTracks(playlistId: string): Promise<Track[]> {
    const token = await getAccessToken();
    if (!token) {
        console.error('No valid access token available.');
        return [];
    }

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            console.error('Failed to fetch playlist tracks:', response.status, await response.text());
            return [];
        }
        const data = await response.json();
        return data.items
            .filter((item: any) => item.track)
            .map((item: any) => item.track);
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
        return [];
    }
}

async function searchPlaylist(playlistName: string): Promise<string | null> {
    const token = await getAccessToken();
    if (!token) {
        console.error('No valid access token available.');
        return null;
    }

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(playlistName)}&type=playlist&limit=1`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        console.error('Failed to search playlist:', response.status, await response.text());
        return null;
    }

    const data = await response.json();
    const playlist = data.playlists.items[0];
    return playlist ? playlist.id : null;
}

export default function HomeScreen() {
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        const playlistId = '0FvrqU0ykTn25Ll0dSmRTY'; // Today's Top Hits
        getPlaylistTracks(playlistId).then((tracks) => setTracks(tracks));
    }, []);

    return (
        <ScrollView className="p-5 bg-white">
            <Text className="text-4xl font-bold mb-5">Today's Top Hits</Text>
            <FlatList
                data={tracks}
                renderItem={({ item }) => <TrackCard track={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </ScrollView>
    );
}
