import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import { addFriend } from '@/utils/userData';
import { searchUserByUUID } from '@/utils/generalFirebase';

export default function SearchFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearchResult([]); // Clear previous results

        try {
            const user = await searchUserByUUID(searchQuery.trim());
            if (user) {
                setSearchResult([user]); // Wrap in array for FlatList
            }
        } catch (error) {
            console.error('Error searching for user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (uuid: string) => {
        try {
            await addFriend(uuid);
            alert('Friend added successfully!');
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend. Please try again.');
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="flex-row items-center p-3 rounded-lg bg-gray-100 mb-2">
            {/* Avatar */}
            <Image
                source={{ uri: item.profilePic }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                resizeMode="cover"
            />
            {/* User Details */}
            <View style={{ marginLeft: 16, flex: 1 }}>
                <Text
                    style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}
                >
                    {item.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#555' }}>
                    @{item.uuid}
                </Text>
                <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    {item.bio}
                </Text>
            </View>
            {/* Add Friend Button */}
            <TouchableOpacity
                style={{
                    padding: 8,
                    backgroundColor: '#007BFF',
                    borderRadius: 50,
                }}
                onPress={() => handleAddFriend(item.uuid)}
            >
                <Ionicons name="person-add-outline" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaViewAll color="white">
            <View
                style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}
            >
                {/* Header */}
                <View style={{ marginBottom: 16 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginBottom: 8,
                        }}
                    >
                        Search Friends
                    </Text>
                    <View style={{ position: 'relative' }}>
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color="#888"
                            style={{
                                position: 'absolute',
                                left: 12,
                                top: '50%',
                                transform: [{ translateY: -10 }],
                            }}
                        />
                        <TextInput
                            placeholder="Search by UUID..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            style={{
                                paddingLeft: 40,
                                paddingVertical: 8,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                            }}
                        />
                    </View>
                </View>

                {/* Loading Indicator */}
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#007BFF"
                        style={{ marginTop: 16 }}
                    />
                )}

                {/* Friends List */}
                <FlatList
                    data={searchResult}
                    keyExtractor={(item) => item.uuid}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 16 }}
                />

                {/* No Results */}
                {!loading &&
                    searchResult.length === 0 &&
                    searchQuery.trim() !== '' && (
                        <Text style={{ textAlign: 'center', color: '#555' }}>
                            No users found.
                        </Text>
                    )}
            </View>
        </SafeAreaViewAll>
    );
}
