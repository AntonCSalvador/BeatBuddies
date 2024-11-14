import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';
import Track from '@/types/track';



async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
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

function TrackCard({ track }: { track: Track }) {
    return (
        <View className="mr-4 w-36 items-center">
            <Image
                source={{ uri: track.album.images[0]?.url }}
                className="w-32 h-32 rounded-lg"
            />
            <Text className="text-center font-bold text-base mt-2">{track.name}</Text>
            <Text className="text-center text-gray-500 text-sm">
                {track.artists.map((artist) => artist.name).join(', ')}
            </Text>
            <Text className="text-center text-gray-400 text-xs">{track.album.name}</Text>
        </View>
    );
}

export default function HomeScreen() {
    const [popularTracks, setPopularTracks] = useState<Track[]>([]);

    useEffect(() => {
        getPopularTracks().then((tracks) => setPopularTracks(tracks));
    }, []);

    return (
        <ScrollView className="p-5 bg-white">
            <Text className="text-2xl font-bold mb-5">Most Popular This Week</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {popularTracks.map((track) => (
                    <TrackCard key={track.id} track={track} />
                ))}
            </ScrollView>
            
        </ScrollView>
    );
}
