import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import { useRouter } from 'expo-router';

const friends = [
    {
        id: 1,
        displayName: 'John Doe',
        uuid: '1234-5678',
        bio: 'Music enthusiast and coffee lover.',
        profilePic: 'https://i.pravatar.cc/100?img=1',
    },
    {
        id: 2,
        displayName: 'Jane Smith',
        uuid: '8765-4321',
        bio: 'Lover of indie music and cats.',
        profilePic: 'https://i.pravatar.cc/100?img=2',
    },
    {
        id: 3,
        displayName: 'Alex Johnson',
        uuid: '5678-1234',
        bio: 'Exploring the world one song at a time.',
        profilePic: 'https://i.pravatar.cc/100?img=3',
    },
    {
        id: 4,
        displayName: 'Emily Davis',
        uuid: '4321-8765',
        bio: 'Concert-goer and playlist curator.',
        profilePic: 'https://i.pravatar.cc/100?img=4',
    },
];

export default function FriendsGallery() {
    const router = useRouter();

    const handleAddFriend = () => {
        router.push(`/(pages)/profile/searchFriends`);
        // Alert.alert('Add Friend', 'Feature to add friends coming soon!');
    };

    const renderItem = ({ item }: { item: (typeof friends)[0] }) => (
        <View className="flex-row items-center p-4 bg-gray-100 rounded-md mb-4">
            <Image
                source={{ uri: item.profilePic }}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
            />
            <View className="ml-4 flex-1">
                <Text className="text-base font-bold text-black">
                    {item.displayName}
                </Text>
                <Text className="text-sm text-gray-500">UUID: {item.uuid}</Text>
                <Text className="text-sm text-gray-400">{item.bio}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaViewAll color="white">
            <View className="flex-1 bg-white px-4 py-6">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold">Your Friends</Text>
                    <TouchableOpacity
                        onPress={handleAddFriend}
                        className="p-2 bg-blue-500 rounded-md"
                    >
                        <Ionicons
                            name="person-add-outline"
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                {/* Friends List */}
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 16 }}
                />
            </View>
        </SafeAreaViewAll>
    );
}
