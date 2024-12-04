import React from 'react';
import { View, Text, Image, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinkOptions from './LinkOptions'; // Import your LinkOptions component
import { signOut } from '@/utils/auth';

export default function ProfilePage() {
    const router = useRouter();

    // Dummy data for favorite albums
    const favoriteAlbums = [
        { id: '1', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Beabadoobee_-_Loveworm.png', title: 'Album 1' },
        { id: '2', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png/220px-Tyler%2C_the_Creator_-_Flower_Boy.png', title: 'Album 2' },
        { id: '3', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Coldplay_-_Parachutes.png', title: 'Album 3' },
        { id: '4', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Clairo_-_Charm.png', title: 'Album 4' },
        // Add more albums as needed
    ];

    // Dummy data for recent activity
    const recentActivity = [
        {
            id: '1',
            type: 'song', // Can be 'song', 'album', or 'artist'
            coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Beabadoobee_-_Loveworm.png',
            songTitle: 'Ceilings',
            artistName: 'Beabadoobee',
            rating: 4.5,
        },
        {
            id: '2',
            type: 'album',
            coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png/220px-Tyler%2C_the_Creator_-_Flower_Boy.png',
            albumTitle: 'Flower Boy',
            artistName: 'Tyler, the Creator',
            rating: 5,
        },
        {
            id: '3',
            type: 'artist',
            coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Coldplay_-_Parachutes.png',
            artistName: 'Coldplay',
            rating: 4,
        },
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
            {/* Recent Activity Section */}
            <View className="p-4">
                <Text className="text-xl font-bold mb-2">Recent Activity</Text>
                {recentActivity.map((activity) => {
                    const fullStars = Math.floor(activity.rating);
                    const hasHalfStar = activity.rating % 1 !== 0;

                    return (
                        <Pressable
                            key={activity.id}
                            className="flex-row items-start mb-4 bg-gray-100 p-3 rounded-lg"
                            onPress={() => console.log(`Pressed activity ID: ${activity.id}`)} //okay here just do router.push(`/(pages)/search/${activity.id}`); something like that instead of the console.log
                        >
                            {/* Cover Image */}
                            <Image
                                source={{ uri: activity.coverUrl }}
                                className="w-16 h-16 mr-4 rounded-md"
                            />
                            <View className="flex-1">
                                {/* Title and Details */}
                                {activity.type === 'song' && (
                                    <>
                                        <Text className="text-lg font-semibold text-black">
                                            {activity.songTitle}
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            by {activity.artistName}
                                        </Text>
                                    </>
                                )}
                                {activity.type === 'album' && (
                                    <>
                                        <Text className="text-lg font-semibold text-black">
                                            {activity.albumTitle}
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            by {activity.artistName}
                                        </Text>
                                    </>
                                )}
                                {activity.type === 'artist' && (
                                    <Text className="text-lg font-semibold text-black">
                                        {activity.artistName}
                                    </Text>
                                )}

                                {/* Rating */}
                                <View className="flex-row items-center mt-2">
                                    {[...Array(fullStars)].map((_, index) => (
                                        <Ionicons
                                            key={`star-${activity.id}-${index}`}
                                            name="star"
                                            size={16}
                                            color="#FFD700"
                                        />
                                    ))}
                                    {hasHalfStar && (
                                        <Ionicons name="star-half" size={16} color="#FFD700" />
                                    )}
                                    {[...Array(5 - Math.ceil(activity.rating))].map((_, index) => (
                                        <Ionicons
                                            key={`star-outline-${activity.id}-${index}`}
                                            name="star-outline"
                                            size={16}
                                            color="#E5E7EB"
                                        />
                                    ))}
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
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
                    onPress={() => router.push('/(pages)/profile/albumGallery')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Songs"
                    onPress={() => router.push('/(pages)/profile/songGallery')}
                    color="black"
                />
            </View>

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Artists"
                    onPress={() => router.push('/(pages)/profile/artistGallery')}
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

            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <LinkOptions
                    title="Friends"
                    onPress={() => router.push('/(pages)/profile/friendsList')}
                    color="black"
                />
            </View>

            {/* Security Options */}
            <View className="w-full mt-0 mb-0 border-t border-gray-200">
                <Text className="text-2xl pt-4 pl-4 font-bold">Settings</Text>
                <LinkOptions
                    title="Account Info"
                    onPress={() => router.push('/(pages)/profile/accountInfo')}
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
