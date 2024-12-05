import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import { useRouter } from 'expo-router';
import { getFriends } from '@/utils/userData';
import { FriendData } from '@/utils/userData';

export default function FriendsGallery() {
    const router = useRouter();
    const [friends, setFriends] = useState<(FriendData & { uuid: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsList = await getFriends(); // Retrieve detailed friend data
                setFriends(friendsList);
            } catch (error) {
                console.error('Error fetching friends:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    const handleAddFriend = () => {
        router.push(`/(pages)/profile/searchFriends`);
    };

    const renderItem = ({ item }: { item: FriendData & { uuid: string } }) => (
        <View className="flex-row items-center p-3 rounded-lg bg-gray-100 mb-2">
            {/* Avatar */}
            <Image
                source={{ uri: item.profileImageLink }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                resizeMode="cover"
            />
            {/* Friend Details */}
            <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>{item.displayName}</Text>
                <Text style={{ fontSize: 12, color: '#555' }}>@{item.uuid}</Text>
                <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{item.bio}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaViewAll color="white">
                <Text>Loading...</Text>
            </SafeAreaViewAll>
        );
    }

    return (
        <SafeAreaViewAll color="white">
            <View className="flex-1 bg-white px-4 py-6">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold">Your Friends</Text>
                    <TouchableOpacity onPress={handleAddFriend} className="p-2 bg-blue-500 rounded-md">
                        <Ionicons name="person-add-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Friends List */}
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.uuid}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 16 }}
                />
            </View>
        </SafeAreaViewAll>
    );
}
