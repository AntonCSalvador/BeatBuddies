// /pages/ActivityPage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import Activity from '@/types/activity';

const mockActivities: Activity[] = [
    {
        id: '1',
        username: 'HanniPham',
        userAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpJOzDrU1-vpcl-Jr_7kTd2pHWHhCFMVj4tw&s',
        action: 'reviewed',
        songTitle: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        review: 'A stellar pop anthem with retro vibes!',
        rating: 5.0,
        timestamp: '2024-12-03T15:30:00Z',
        coverImage: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    },
    {
        id: '2',
        username: 'Gojo77',
        userAvatar: 'https://wallpapers-clan.com/wp-content/uploads/2022/09/gojo-pfp-17.jpg',
        action: 'reviewed',
        songTitle: 'Love Story',
        artist: 'Taylor Swift',
        album: 'Fearless',
        review: 'Taylor redefines modern storytelling in music.',
        rating: 4.75,
        timestamp: '2024-12-02T18:45:00Z',
        coverImage: 'https://i.scdn.co/image/ab67616d0000b273877ea8fa223c26f19aaef92d',
    },
    {
        id: '3',
        username: 'Lasagna120',
        userAvatar: 'https://i.pinimg.com/564x/96/e4/82/96e48207b373600cea04807d51d20c4d.jpg',
        action: 'reviewed',
        songTitle: 'drivers license',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        review: 'An emotional rollercoaster packed with raw lyrics.',
        rating: 4.5,
        timestamp: '2024-12-01T21:00:00Z',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/b/b2/Olivia_Rodrigo_-_SOUR.png',
    },
    {
        id: '4',
        username: 'BarkVader',
        userAvatar: 'https://img.freepik.com/premium-photo/araffe-cat-dressed-as-darth-vader-front-full-moon-generative-ai_901242-49987.jpg',
        action: 'reviewed',
        songTitle: 'Bad Habits',
        artist: 'Ed Sheeran',
        album: '=',
        review: 'Catchy beats, but the lyrics feel repetitive.',
        rating: 3.5,
        timestamp: '2024-12-04T10:15:00Z',
        coverImage: 'https://i.scdn.co/image/ab67616d00001e02ef24c3fdbf856340d55cfeb2',
    },
    {
        id: '5',
        username: 'BuggyDClown',
        userAvatar: 'https://i.pinimg.com/736x/38/1a/eb/381aeb3ece63f397508d78e2011ba52c.jpg',
        action: 'reviewed',
        songTitle: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        review: 'Timeless and unparalleled artistry!',
        rating: 5.0,
        timestamp: '2024-12-03T22:00:00Z',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png',
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
                <Text className="text-4xl font-bold text-black mb-5">
                    Activity
                </Text>
                {activities.map((activity) => (
                    <View
                        key={activity.id}
                        className="bg-gray-100 rounded-lg mb-4 shadow p-4 flex-row items-start"
                    >
                        <Image
                            source={{ uri: activity.userAvatar }}
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-black">
                                {activity.username}
                            </Text>
                            <Text className="text-sm text-gray-600 mb-1">
                                {activity.action}{' '}
                                {activity.songTitle && (
                                    <Text className="font-medium text-black">
                                        {activity.songTitle}
                                    </Text>
                                )}{' '}
                                {activity.artist && (
                                    <Text className="font-medium text-black">
                                        by {activity.artist}
                                    </Text>
                                )}{' '}
                                {activity.album && (
                                    <Text className="font-medium text-black">
                                        ({activity.album})
                                    </Text>
                                )}
                            </Text>
                            <Text
                                className="text-sm text-gray-800 italic mb-1"
                                numberOfLines={3}
                            >
                                "{activity.review}"
                            </Text>
                            {activity.rating !== undefined && (
                                <View className="flex-row items-center mb-2">
                                    {Array.from({ length: 5 }, (_, index) => {
                                        const isHalf =
                                            activity.rating - index >= 0.5 &&
                                            activity.rating - index < 1;
                                        const isFull =
                                            index < Math.floor(activity.rating);

                                        return isFull ? (
                                            <Ionicons
                                                key={index}
                                                name="star"
                                                size={16}
                                                color="#FFD700"
                                            />
                                        ) : isHalf ? (
                                            <Ionicons
                                                key={index}
                                                name="star-half"
                                                size={16}
                                                color="#FFD700"
                                            />
                                        ) : (
                                            <Ionicons
                                                key={index}
                                                name="star-outline"
                                                size={16}
                                                color="#D1D5DB"
                                            />
                                        );
                                    })}
                                </View>
                            )}
                            <Text className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                            </Text>
                        </View>
                        <Image
                            source={{ uri: activity.coverImage }}
                            className="w-16 h-16 rounded-lg"
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaViewAll>
    );
}
