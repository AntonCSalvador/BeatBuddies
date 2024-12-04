import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, ImageBackground } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import Track from '@/types/track';
import TrackCard from '@/components/general/TrackCard';

const playlists = [
    { id: '289BykisTApQXnbKyeRaQo', name: "Today's Top Hits" },
    { id: '4Ex1CCPHIBPbQgvXSrPixJ', name: 'Discover Weekly' },
    { id: '7ATKFHYTr8rosvgjdxMjCR', name: 'Top Global Hits' },
    { id: '6IKQrtMc4c00YzONcUt7QH', name: 'Chill Vibes' },
    { id: '7HYSmnCiPhDIKNExhkSynh', name: 'New Releases' },
];

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

async function getPlaylistTracks(playlistId: string, cache: { [key: string]: Track[] }): Promise<Track[]> {
    if (cache[playlistId]) {
        // Use cached tracks
        console.log(`Using cached tracks for playlist ${playlistId}`);
        return cache[playlistId];
    }

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
        const tracks = data.items
            .filter((item: any) => item.track)
            .map((item: any) => item.track);

        // Cache the result
        cache[playlistId] = tracks;
        return tracks;
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
        return [];
    }
}

export default function HomeScreen() {
    const [playlistTracks, setPlaylistTracks] = useState<{ [key: string]: Track[] }>({});
    const cache = React.useRef<{ [key: string]: Track[] }>({});

    useEffect(() => {
        playlists.forEach(({ id }) => {
            getPlaylistTracks(id, cache.current).then((tracks) => {
                console.log(`Tracks for playlist ${id}:`, tracks); // Debug log for tracks
                setPlaylistTracks((prev) => ({ ...prev, [id]: tracks }));
            });
        });
    }, []);

    console.log('Playlists:', playlists); // Debug log for playlists

    return (
        <ScrollView className="bg-gradient-to-b from-blue-900 via-black to-black">
            <Text className="text-5xl font-bold text-black text-center mt-10 mb-5">
                BeatBuddies
            </Text>
            {playlists.map(({ id, name }) => (
                <View key={id} className="mb-10">
                    <Text className="text-3xl text-black font-semibold px-5 mb-3">
                        {name || 'Unnamed Playlist'}
                    </Text>
                    <FlatList
                        data={playlistTracks[id] || []}
                        renderItem={({ item }) => <TrackCard track={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    />
                </View>
            ))}
        </ScrollView>
    );
}
