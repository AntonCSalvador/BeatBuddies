// /pages/TopAlbums2023.tsx
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import { Heart, MessageCircle, Share } from 'react-native-feather';


const listData = {
  id: '1',
  title: 'Top Albums of 2023',
  description: 'My personal selection of the best albums released in 2023.',
  creator: {
    name: 'GolDRoger',
    username: 'musiclover2023',
    avatarUrl: 'https://i.pinimg.com/236x/69/e9/35/69e935291a322a9958b0a704bc14b542.jpg',
  },
  albums: [
    {
      id: '1',
      spotifyId: '6XJtdV1dyt41CTN6g5Xk9g',
      title: 'SOS',
      artist: 'SZA',
      year: 2023,
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b2734a0ad4eec70e68630dc0ad4f',
    },
    {
      id: '2',
      spotifyId: '3lS1y25WAhcqJDATJK70Mq',
      title: 'Midnights',
      artist: 'Taylor Swift',
      year: 2023,
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273ad03c554ff2b9bb0f6e6b02b',
    },
    {
      id: '3',
      spotifyId: '7t4LbSQTfEhXqA3n4GE1rN',
      title: 'This Is Why',
      artist: 'Paramore',
      year: 2023,
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b2735f3a488b82346f5fb633ab39',
    },
    {
      id: '4',
      spotifyId: '1x2CEXv6TneJqkMWDNKtNQ',
      title: 'HEROES & VILLAINS',
      artist: 'Metro Boomin',
      year: 2023,
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273f05afc74b7c84d3e8883b4dd',
    },
    {
      id: '5',
      spotifyId: '0XynXhxc4al4dhymu5w1MV',
      title: 'Gloria',
      artist: 'Sam Smith',
      year: 2023,
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273b7473abafff9c6a899e0867e',
    },
  ],
};

export default function TopAlbums2023() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* List Creator Info */}
          <View className="flex-row items-center">
            <Image
              source={{ uri: listData.creator.avatarUrl }}
              className="w-16 h-16 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-2xl font-bold">{listData.title}</Text>
              <Text className="text-sm text-gray-500">
                by {listData.creator.name}
              </Text>
            </View>
          </View>

          {/* List Description */}
          <Text className="text-sm text-gray-500 mt-6">{listData.description}</Text>

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
              <Heart width={16} height={16} strokeWidth={2} color="#000" />
              <Text className="ml-2 text-sm">Like</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
              <MessageCircle width={16} height={16} strokeWidth={2} color="#000" />
              <Text className="ml-2 text-sm">Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
              <Share width={16} height={16} strokeWidth={2} color="#000" />
              <Text className="ml-2 text-sm">Share</Text>
            </TouchableOpacity>
          </View>

          {/* Album List */}
          <View className="mt-6">
            {listData.albums.map((album, index) => (
              <View
                key={album.id}
                className="flex-row items-center bg-gray-100 rounded-lg shadow mb-4 p-4"
              >
                {/* Album Cover and Index */}
                <View className="relative">
                  <View className="absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Text className="text-xs font-bold text-white">{index + 1}</Text>
                  </View>
                  <Image
                    source={{ uri: album.coverUrl }}
                    className="w-20 h-20 rounded-md"
                  />
                </View>

                {/* Album Details */}
                <View className="flex-1 ml-4">
                  <Text className="font-semibold">{album.title}</Text>
                  <Text className="text-sm text-gray-500">{album.artist}</Text>
                  <Text className="text-xs text-gray-500">{album.year}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
