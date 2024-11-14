import React from 'react';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import SongDetails from '@/screens/pages/search/songdetails';
import { useGlobalSearchParams } from 'expo-router'; // Use this to retrieve dynamic parameters

export default function MusicPage() {
    const { songId } = useGlobalSearchParams(); // Get the songId from the dynamic route

    return (
        <SafeAreaViewAll color="white">
            <SongDetails songId={songId as string} />
        </SafeAreaViewAll>
    );
}
