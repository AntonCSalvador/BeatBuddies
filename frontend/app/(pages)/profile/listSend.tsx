// /pages/TopAlbums2024.tsx
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import { Heart, MessageCircle, Share } from 'react-native-feather';
import { useRouter } from 'expo-router';

const listData = {
  id: '1',
  title: 'Top Albums of 2024',
  description: 'My personal selection of the best albums released in 2024.',
  creator: {
    name: 'GolDRoger',
    username: 'musiclover2024',
    avatarUrl: 'https://i.pinimg.com/236x/69/e9/35/69e935291a322a9958b0a704bc14b542.jpg',
  },
  albums: [
    {
      id: '1',
      spotifyId: '1KNUCVXgIxKUGiuEB8eG0i',
      title: 'Charm',
      artist: 'Clairo',
      year: 2024,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Clairo_-_Charm.png',
    },
    {
      id: '2',
      spotifyId: '7aJuG4TFXa2hmE4z1yxc3n',
      title: 'HIT ME HARD AND SOFT',
      artist: 'Billie Eilish',
      year: 2024,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/aa/Billie_Eilish_-_Hit_Me_Hard_and_Soft.png',
    },
    {
      id: '3',
      spotifyId: '5oT7xqbRbQCevZ0XC5aBFu',
      title: 'This Is How Tomorrow Moves',
      artist: 'beabadoobee',
      year: 2024,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Beabadoobee_-_This_Is_How_Tomorrow_Moves.png/220px-Beabadoobee_-_This_Is_How_Tomorrow_Moves.png',
    },
    {
      id: '4',
      spotifyId: '2lIZef4lzdvZkiiCzvPKj7',
      title: 'BRAT',
      artist: 'Charli xcx',
      year: 2024,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Charli_XCX_-_Brat_%28album_cover%29.png',
    },
    {
      id: '5',
      spotifyId: '0hvT3yIEysuuvkK73vgdcW',
      title: 'GNX',
      artist: 'Kendrick Lamar',
      year: 2024,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Kendrick_Lamar_-_GNX.png/220px-Kendrick_Lamar_-_GNX.png',
    },
  ],
};

export default function TopAlbums2024() {
  const router = useRouter();

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
              <Pressable
                key={album.id}
                className="flex-row items-center bg-gray-100 rounded-lg shadow mb-4 p-4"
                onPress={() => {router.push(`/(pages)/profile/tracks/${album.spotifyId}`);}} //maybe fix later
              >
                {/* Album Cover and Index */}
                <View className="relative">
                    <Image
                        source={{ uri: album.coverUrl }}
                        className="w-20 h-20 rounded-md"
                    />
                    <View className="absolute top-1 left-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Text className="text-xs font-bold text-white">{index + 1}</Text>
                    </View>
                </View>

                {/* Album Details */}
                <View className="flex-1 ml-4">
                  <Text className="font-semibold">{album.title}</Text>
                  <Text className="text-sm text-gray-500">{album.artist}</Text>
                  <Text className="text-xs text-gray-500">{album.year}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
