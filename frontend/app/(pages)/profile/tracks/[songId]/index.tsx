import React, { useEffect, useState } from 'react';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import SongDetails from '@/screens/pages/search/songdetails';
import AlbumDetails from '@/screens/pages/search/albumdetails';
import ArtistDetails from '@/screens/pages/search/artistdetails';
import { Text } from 'react-native';

import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'; // Use this to retrieve dynamic parameters
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/screens/spotify';

export default function ProfileMusicPage() {
    const { songId } = useLocalSearchParams(); // Get the songId from the dynamic route
    const [tab, setTab] = useState<number | null>(null); // State to determine which component to render
    const [error, setError] = useState<string | null>(null); // State to handle errors

    // Ensure songId is a string
    const resolvedSongId = Array.isArray(songId) ? songId[0] : songId;

    useEffect(() => {
        console.log(songId);
        if (!resolvedSongId) {
            setError('No song ID provided.');
            return;
        }

        const determineTab = async () => {
            try {
                if (await trackCheck(resolvedSongId)) {
                    setTab(1);
                } else if (await albumCheck(resolvedSongId)) {
                    console.log('in the album check');
                    setTab(2);
                } else if (await artistCheck(resolvedSongId)) {
                    console.log('in the artist check');
                    setTab(3);
                } else {
                    setError('No matching data found for the provided ID.');
                }
            } catch (err) {
                setError('Error occurred while checking data.');
            }
        };

        determineTab();
    }, [resolvedSongId]);

    if (error) {
        return (
            <SafeAreaViewAll color="white">
                <Text>{error}</Text>
            </SafeAreaViewAll>
        );
    }

    if (tab === null) {
        return (
            <SafeAreaViewAll color="white">
                <Text>Loading...</Text>
            </SafeAreaViewAll>
        );
    }

    return (
        <SafeAreaViewAll color="white">
            {tab === 1 && <SongDetails songId={resolvedSongId as string} />}
            {tab === 2 && <AlbumDetails songId={resolvedSongId as string} />}
            {tab === 3 && <ArtistDetails songId={resolvedSongId as string} />}
        </SafeAreaViewAll>
    );
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

async function trackCheck(id: string): Promise<boolean> {
    try {
        const token = await getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/tracks/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.ok; // Return true if track exists
    } catch (error) {
        return false;
    }
}

async function albumCheck(id: string): Promise<boolean> {
    try {
        const token = await getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/albums/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.ok; // Return true if album exists
    } catch (error) {
        return false;
    }
}

async function artistCheck(id: string): Promise<boolean> {
    try {
        const token = await getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/artists/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.ok; // Return true if artist exists
    } catch (error) {
        return false;
    }
}
