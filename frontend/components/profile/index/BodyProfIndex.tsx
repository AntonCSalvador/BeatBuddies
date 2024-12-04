import React from 'react';
import { View, Text, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinkOptions from './LinkOptions'; // Import your LinkOptions component
import { signOut } from '@/utils/auth';

export default function ProfilePage() {
    const router = useRouter();

    // Dummy data for favorite albums
    const favoriteAlbums = [
        { id: '1', coverUrl: 'https://via.placeholder.com/150', title: 'Album 1' },
        { id: '2', coverUrl: 'https://via.placeholder.com/150', title: 'Album 2' },
        { id: '3', coverUrl: 'https://via.placeholder.com/150', title: 'Album 3' },
        { id: '4', coverUrl: 'https://via.placeholder.com/150', title: 'Album 4' },
        // Add more albums as needed
    ];

    // Dummy data for recent activity
    const recentActivity = [
        {
            id: '1',
            coverUrl: 'https://via.placeholder.com/100',
            title: 'Album 5',
            rating: 4,
        },
        {
            id: '2',
            coverUrl: 'https://via.placeholder.com/100',
            title: 'Album 6',
            rating: 5,
        },
        {
            id: '3',
            coverUrl: 'https://via.placeholder.com/100',
            title: 'Album 7',
            rating: 3,
        },
        // Add more activity as needed
    ];

    const confirmSignOut = () => {
        Alert.alert(
            'Confirm Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => signOut(),
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Header Section */}
            <View className="items-center p-4 bg-gray-100">
                <Image
                    source={{ uri: 'https://via.placeholder.com/100' }}
                    className="w-24 h-24 rounded-full mb-2"
                />
                <Text className="text-2xl font-bold">Your Name</Text>
                <Text className="text-gray-600">Your bio goes here.</Text>
            </View>

            {/* Favorite Albums Section */}
            <View className="p-4">
                <Text className="text-xl font-bold mb-2">Favorite Albums</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {favoriteAlbums.map((album) => (
                        <View key={album.id} className="mr-4">
                            <Image
                                source={{ uri: album.coverUrl }}
                                className="w-32 h-32"
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Recent Activity Section */}
            <View className="p-4">
                <Text className="text-xl font-bold mb-2">Recent Activity</Text>
                {recentActivity.map((activity) => (
                    <View
                        key={activity.id}
                        className="flex-row items-center mb-4"
                    >
                        <Image
                            source={{ uri: activity.coverUrl }}
                            className="w-16 h-16 mr-4"
                        />
                        <View className="flex-1">
                            <Text className="text-lg font-semibold">
                                {activity.title}
                            </Text>
                            <View className="flex-row items-center">
                                {[...Array(5)].map((_, index) => (
                                        <Ionicons
                                            name={'star-outline'}
                                            key={index}
                                            size={16}
                                            color={
                                                index < activity.rating
                                                    ? '#FFD700'
                                                    : '#E5E7EB'
                                            }
                                        />
                                ))}
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Navigation Links (Using LinkOptions) */}
            {/* Profile Options */}
            {/* <View className="w-full mt-4 border-t border-gray-200">
                <Text className="text-2xl pt-4 pl-4 font-bold">
                    Profile
                </Text>
                <LinkOptions
                    title="Account Info"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
                <LinkOptions
                    title="Activity"
                    onPress={() => router.push('/(pages)/activity')}
                    color="black"
                />
            </View> */}

            {/* Ratings Options */}
            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Albums"
                    onPress={() => router.push('/(pages)/profile/')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Songs"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Artists"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Lists"
                    onPress={() => router.push('/(pages)/profile/ListsPage')}
                    color="black"
                />
            </View>

            {/* Security Options */}
            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <Text className="text-2xl pt-4 pl-4 font-bold">
                    Settings
                </Text>
                <LinkOptions
                    title="Account Info"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
                <LinkOptions
                    title="Sign Out"
                    onPress={confirmSignOut}
                    color="red"
                />
            </View>
        </ScrollView>
    );
}
