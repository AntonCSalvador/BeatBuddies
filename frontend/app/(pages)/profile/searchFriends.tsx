import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

const friends = [
  {
    id: 1,
    username: 'jazzlover',
    name: 'Jazz Lover',
    bio: 'Exploring the world of jazz, one note at a time.',
    avatarUrl: 'https://via.placeholder.com/50',
  },
  {
    id: 2,
    username: 'rockstar',
    name: 'Rock Star',
    bio: 'Living life on the edge with rock n roll!',
    avatarUrl: 'https://via.placeholder.com/50',
  },
  {
    id: 3,
    username: 'classicalqueen',
    name: 'Classical Queen',
    bio: 'Finding beauty in the timeless classics.',
    avatarUrl: 'https://via.placeholder.com/50',
  },
  {
    id: 4,
    username: 'popprince',
    name: 'Pop Prince',
    bio: 'Keeping up with the latest pop hits and trends!',
    avatarUrl: 'https://via.placeholder.com/50',
  },
  {
    id: 5,
    username: 'indieexplorer',
    name: 'Indie Explorer',
    bio: 'Discovering hidden gems in the indie music scene.',
    avatarUrl: 'https://via.placeholder.com/50',
  },
];

export default function FriendsList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(
    (friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: typeof friends[0] }) => (
    <View className="flex-row items-center p-3 rounded-lg bg-gray-100 mb-2">
      {/* Avatar */}
      <Image
        source={{ uri: item.avatarUrl }}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        resizeMode="cover"
      />
      {/* Friend Details */}
      <View style={{ marginLeft: 16, flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>{item.name}</Text>
        <Text style={{ fontSize: 12, color: '#555' }}>@{item.username}</Text>
        <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{item.bio}</Text>
      </View>
      {/* Add Friend Button */}
      <TouchableOpacity style={{ padding: 8, backgroundColor: '#007BFF', borderRadius: 50 }} onPress={() => {console.log("add friend pressed for: " + item.username)}}>
        <Ionicons name="person-add-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaViewAll color="white">
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>Search Friends</Text>
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
              placeholder="Search friends..."
              value={searchQuery}
              onChangeText={setSearchQuery}
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

        {/* Friends List */}
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </SafeAreaViewAll>
  );
}
