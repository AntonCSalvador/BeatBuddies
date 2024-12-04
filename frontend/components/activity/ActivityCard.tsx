// /components/ActivityCard.tsx
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import Activity from '@/types/activity';

interface ActivityCardProps {
    activity: Activity;
    onUserPress?: (username: string) => void; // Optional user click handler
    onMoviePress?: (movieTitle: string) => void; // Optional movie click handler
}

export default function ActivityCard({ activity, onUserPress, onMoviePress }: ActivityCardProps) {
    return (
        <View className="flex-row bg-white p-4 rounded-lg shadow-md mb-4">
            {/* User Avatar */}
            <Pressable onPress={() => onUserPress?.(activity.username)}>
                <Image
                    source={{ uri: activity.userAvatar }}
                    className="w-12 h-12 rounded-full mr-4"
                />
            </Pressable>

            {/* Activity Details */}
            <View className="flex-1">
                <Text className="text-black font-semibold">
                    <Pressable onPress={() => onUserPress?.(activity.username)}>
                        <Text className="text-black">{activity.username}</Text>
                    </Pressable>{' '}
                    <Text className="text-gray-500">{activity.action}</Text>
                </Text>

                <Pressable onPress={() => onMoviePress?.(activity.movieTitle)}>
                    <Text className="text-gray-800 font-semibold">{activity.movieTitle}</Text>
                </Pressable>

                {/* Optional Review */}
                {activity.review && (
                    <Text className="text-gray-600 italic mt-1" numberOfLines={2}>
                        "{activity.review}"
                    </Text>
                )}

                {/* Timestamp */}
                <Text className="text-gray-400 text-xs mt-2">
                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                </Text>
            </View>

            {/* Movie Poster */}
            <Pressable onPress={() => onMoviePress?.(activity.movieTitle)}>
                <Image
                    source={{ uri: activity.posterImage }}
                    className="w-16 h-24 rounded-lg"
                />
            </Pressable>
        </View>
    );
}
