import React from 'react';
import HomeScreen from '@/screens/pages/home/homescreen';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

export default function HomePage() {
    return (
        <SafeAreaViewAll color="white">
            <HomeScreen />
        </SafeAreaViewAll>
    );
}
