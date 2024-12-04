// /components/ListCard.tsx
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface List {
    id: string;
    title: string;
    description: string;
    itemCount: number;
    coverImage: string;
}

interface ListCardProps {
    list: List;
}

export default function ListCard({ list }: ListCardProps) {
    const router = useRouter();

    const handlePress = () => {
        // Navigate to the ListDetailsPage with the list ID
        console.log('hi');
        router.push(`./pages/lists/${list.id}`);
    };

    return (
        <TouchableOpacity onPress={handlePress} className="mb-4">
            <ImageBackground
                source={{ uri: list.coverImage }}
                className="w-full h-48 justify-end"
                imageStyle={{ borderRadius: 8 }}
            >
                <View className="bg-black bg-opacity-50 p-4 rounded-b-lg">
                    <Text className="text-white text-xl font-bold">
                        {list.title}
                    </Text>
                    <Text className="text-gray-200 text-sm">
                        {list.description}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                        {list.itemCount} items
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}
