import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';

export default function ListDetailsPage() {
    const router = useRouter();
    const route = useRoute();
    const { id } = route.params as { id: string };

    // For now, just display the list ID
    return (
        <View className="flex-1 bg-white items-center justify-center">
            <Text className="text-2xl">List Details for ID: {id}</Text>
        </View>
    );
}

