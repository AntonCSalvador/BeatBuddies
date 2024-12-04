import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useRouter } from 'expo-router';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

const songs = [
  {
    id: 1,
    title: 'Sofia',
    artist: 'Clairo',
    rating: 4.5,
    coverUrl: 'https://i.scdn.co/image/ab67616d00001e025b65766f77e6b55b2fc54a03',
  },
  {
    id: 2,
    title: 'Ditto',
    artist: 'NewJeans',
    rating: 5,
    coverUrl: 'https://i.scdn.co/image/ab67616d00001e0258bdf2f45aeb734e2b6d13bc',
  },
  {
    id: 3,
    title: 'Coffee',
    artist: 'Beabadoobee',
    rating: 4,
    coverUrl: 'https://i.scdn.co/image/ab67616d00001e0208a58df2310d229c33c0a070',
  },
  {
    id: 4,
    title: 'Pretty Girl',
    artist: 'Clairo',
    rating: 4.5,
    coverUrl: 'https://i.scdn.co/image/ab67616d00001e0225e0b6f9b3b632176d4e50bb',
  },
  {
    id: 5,
    title: 'OMG',
    artist: 'NewJeans',
    rating: 5,
    coverUrl: 'https://i.scdn.co/image/ab67616d00001e02411c5c72597893c464896b8d',
  },
  {
    id: 6,
    title: 'She Plays Bass',
    artist: 'Beabadoobee',
    rating: 4,
    coverUrl: 'https://i.scdn.co/image/ab67616d00001e0210c0b1730a39d6e7c2c3c6f7',
  },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <View className="flex-row justify-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      ))}
      {hasHalfStar && <Ionicons name="star-half" size={16} color="#FFD700" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Ionicons key={i + fullStars} name="star-outline" size={16} color="#d3d3d3" />
      ))}
    </View>
  );
}

export default function SongGallery() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof songs[0] }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push(`/(pages)/search/${item.id}`)}
      className="flex-1 m-2 p-2 bg-gray-100 rounded-md"
    >
      <Image
        source={{ uri: item.coverUrl }}
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="mt-2 items-center">
        <Text className="text-sm font-medium text-center text-black">{item.title}</Text>
        <Text className="text-xs text-center text-gray-500">{item.artist}</Text>
        <StarRating rating={item.rating} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaViewAll color="white">
      <View className="flex-1 bg-white px-4 py-6">
        <Text className="text-2xl font-bold text-center mb-6">Your Song Ratings</Text>
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2} // Display 2 songs per row
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </SafeAreaViewAll>
  );
}
