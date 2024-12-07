import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';
import Activity from '@/types/activity';
//An interafce the keeps track of where the user pressed
interface ActivityCardProps {
    activity: Activity;
    onUserPress?: (username: string) => void;
    onMoviePress?: (movieTitle: string) => void;
}

export default function ActivityCard({
    activity,
    onUserPress,
    onMoviePress,
}: ActivityCardProps) {
    return (
        <View className="flex-row p-4 bg-white border-b border-gray-200">
            {/* User Avatar */}
            <Pressable onPress={() => onUserPress?.(activity.username)}>
                <Image
                    source={{ uri: activity.userAvatar }}
                    className="w-10 h-10 rounded-full mr-3"
                />
            </Pressable>

            {/* Activity Details */}
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Pressable onPress={() => onUserPress?.(activity.username)}>
                        <Text className="text-sm font-semibold text-black mr-1">
                            {activity.username}
                        </Text>
                    </Pressable>
                    <Text className="text-sm text-gray-600">
                        {activity.action}
                    </Text>
                </View>

                <Pressable onPress={() => onMoviePress?.(activity.movieTitle)}>
                    <Text className="text-base font-semibold text-black mt-1">
                        {activity.movieTitle}
                    </Text>
                </Pressable>

                {/* Optional Review */}
                {activity.review && (
                    <Text
                        className="text-sm text-gray-800 mt-1"
                        numberOfLines={3}
                    >
                        “{activity.review}”
                    </Text>
                )}

                {/* Rating */}
                {activity.rating !== undefined && (
                    <View className="flex-row items-center mt-1">
                        {Array.from({ length: 5 }, (_, index) => {
                            const isHalf =
                                activity.rating - index >= 0.5 &&
                                activity.rating - index < 1;
                            const isFull = index < Math.floor(activity.rating);

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

                {/* Timestamp */}
                <Text className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                    })}
                </Text>
            </View>

            {/* Movie Poster */}
            <Pressable onPress={() => onMoviePress?.(activity.movieTitle)}>
                <Image
                    source={{ uri: activity.posterImage }}
                    className="w-20 h-28 rounded-md ml-3"
                />
            </Pressable>
        </View>
    );
}
