// /pages/ActivityPage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ActivityCard from '@/components/activity/ActivityCard';
import Activity from '@/types/activity';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

const mockActivities: Activity[] = [
    {
        id: '1',
        username: 'JohnDoe',
        userAvatar: 'https://via.placeholder.com/150',
        action: 'reviewed',
        movieTitle: 'Inception',
        review: 'A mind-bending masterpiece!',
        rating: 4.5,
        timestamp: '2024-12-03T15:30:00Z',
        posterImage: 'https://via.placeholder.com/300',
    },
    {
        id: '2',
        username: 'JaneSmith',
        userAvatar: 'https://via.placeholder.com/150',
        action: 'liked',
        movieTitle: 'The Dark Knight',
        timestamp: '2024-12-02T18:45:00Z',
        posterImage: 'https://via.placeholder.com/300',
    },
    {
        id: '3',
        username: 'MovieBuff123',
        userAvatar: 'https://via.placeholder.com/150',
        action: 'watched',
        movieTitle: 'Interstellar',
        timestamp: '2024-12-01T21:00:00Z',
        posterImage: 'https://via.placeholder.com/300',
    },
];

export default function ActivityPage() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setActivities(mockActivities);
        }, 1000);
    }, []);

    return (
        <SafeAreaViewAll color="white">
            <ScrollView className="p-5">
                <Text className="text-4xl font-bold text-black mb-5">Activity Feed</Text>
                {activities.map((activity) => (
                    <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onUserPress={(username) => console.log('Navigate to user:', username)}
                        onMoviePress={(movieTitle) => console.log('Navigate to movie:', movieTitle)}
                    />
                ))}
            </ScrollView>
        </SafeAreaViewAll>
    );
}
