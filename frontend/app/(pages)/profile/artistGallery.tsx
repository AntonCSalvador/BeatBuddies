import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useRouter } from 'expo-router';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

const artists = [
  {
    id: 1,
    name: 'Frank Ocean',
    rating: 5,
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb48b04e5f928f5cf21c2c9b49',
  },
  {
    id: 2,
    name: 'Beabadoobee',
    rating: 4.5,
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb67ad72b8416cf36714468959',
  },
  {
    id: 3,
    name: 'Clairo',
    rating: 4.5,
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebc3b110abe2e10f30edc21973',
  },
  {
    id: 4,
    name: 'NewJeans',
    rating: 5,
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebae94c0919fcb1b47ba3547b8',
  },
  {
    id: 5,
    name: 'Phoebe Bridgers',
    rating: 4.5,
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebbbe330dfbbc80bce6a1d8561',
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

export default function ArtistGallery() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof artists[0] }) => (
    <View className="w-1/2 p-2"> {/* Each item takes up 50% of the row */}
      <TouchableOpacity
        key={item.id}
        onPress={() => router.push(`/(pages)/search/${item.id}`)}
        className="bg-gray-100 rounded-md pb-4" // Added paddingBottom for the entire card
      >
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-40 rounded-md"
          resizeMode="cover"
        />
        <View className="mt-2 items-center">
          <Text className="text-sm font-medium text-center text-black">{item.name}</Text>
          <View className="mt-2 pb-1"> {/* Added paddingBottom for stars */}
            <StarRating rating={item.rating} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaViewAll color="white">
      <View className="flex-1 bg-white px-4 py-6">
        <Text className="text-2xl font-bold text-center mb-6">Your Favorite Artists</Text>
        <FlatList
          data={artists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2} // Display 2 artists per row
          columnWrapperStyle={{ flexWrap: 'wrap' }} // Ensures proper wrapping of items
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </SafeAreaViewAll>
  );
}
