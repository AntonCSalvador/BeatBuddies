import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useRouter } from 'expo-router';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

const albums = [
  { id: 1, title: 'The Dark Side of the Moon', artist: 'Pink Floyd', rating: 4.5, coverUrl: 'https://via.placeholder.com/300' },
  { id: 2, title: 'Thriller', artist: 'Michael Jackson', rating: 5, coverUrl: 'https://via.placeholder.com/300' },
  { id: 3, title: 'Back in Black', artist: 'AC/DC', rating: 4, coverUrl: 'https://via.placeholder.com/300' },
  { id: 4, title: 'Rumours', artist: 'Fleetwood Mac', rating: 4.5, coverUrl: 'https://via.placeholder.com/300' },
  { id: 5, title: 'Purple Rain', artist: 'Prince', rating: 5, coverUrl: 'https://via.placeholder.com/300' },
  { id: 6, title: 'Born to Run', artist: 'Bruce Springsteen', rating: 4, coverUrl: 'https://via.placeholder.com/300' },
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

export default function AlbumGallery() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof albums[0] }) => (
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
        <Text className="text-2xl font-bold text-center mb-6">Your Album Ratings</Text>
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2} // Display 2 albums per row
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </SafeAreaViewAll>
  );
}
