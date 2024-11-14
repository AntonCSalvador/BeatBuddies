import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, FlatList } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import Track from '@/types/track';
import TrackCard from '@/components/general/TrackCard';

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

// Function to fetch popular tracks for the week
async function getPopularTracks(): Promise<Track[]> {
    const token = await getAccessToken();
    const response = await fetch(
        `https://api.spotify.com/v1/browse/featured-playlists?country=US`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const data = await response.json();
    const playlist = data.playlists.items[0];

    // Fetch tracks in the playlist
    const tracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const tracksData = await tracksResponse.json();
    return tracksData.items.map((item: any) => item.track);
}

export default function HomeScreen() {
    const [popularTracks, setPopularTracks] = useState<Track[]>([]);

    useEffect(() => {
        getPopularTracks().then((tracks) => setPopularTracks(tracks));
    }, []);

    return (
        <ScrollView className="p-5 bg-white">
            <Text className="text-4xl font-bold mb-5">Weekly Hits</Text>
            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {popularTracks.map((track) => (
                    <TrackCard key={track.id} track={track} />
                ))}
            </ScrollView> */}

            <FlatList
                data={popularTracks}
                renderItem={({ item }) => <TrackCard track={item} />}
                keyExtractor={(item) => item.id} // Ensure each track has a unique `id`
                horizontal // Use horizontal scroll if desired
                showsHorizontalScrollIndicator={false}
            />
        </ScrollView>
    );
}
