// /pages/ListsPage.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ListCard from '@/components/profile/lists/ListCard';
import { useRouter } from 'expo-router';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

//function that shows what lists a user has in their profile
export default function ListsPage() {
    const router = useRouter();

    // Dummy data for lists
    const lists = [
        {
            id: '1',
            title: 'Top Albums of 2024',
            description: 'A curated list of the best albums released in 2024.',
            itemCount: 15,
            coverImage:
                'https://i8.amplience.net/i/naras/2024_grammys_general_key_art_euphoria_right_alined.jpg',
        },
        {
            id: '2',
            title: 'All-Time Favorite Songs',
            description: 'Songs that have stood the test of time.',
            itemCount: 25,
            coverImage:
                'https://static.tvtropes.org/pmwiki/pub/images/follow_your_nose.png',
        },
        {
            id: '3',
            title: 'Best Indie Artists',
            description: 'Highlighting the best indie music artists.',
            itemCount: 10,
            coverImage:
                'https://wfuv.org/sites/default/files/images/posts/SliderBeabadoobee%20-%202023%2001%20-%20please%20credit%20Jacob%20Erland.jpg',
        },
        // Add more lists as needed
    ];

    return (
        <SafeAreaViewAll color="white">
            <ScrollView className="flex-1 bg-white">
                {/* Header */}
                <View className="p-4 border-b border-gray-200">
                    <Text className="text-3xl font-bold">Lists</Text>
                </View>

                {/* Create New List Button */}
                <TouchableOpacity
                    onPress={() =>
                        router.push('/(pages)/profile/CreateNewList')
                    } //create new page here
                    className="m-4 p-4 bg-blue-500 rounded-lg items-center"
                >
                    <Text className="text-white font-bold">
                        Create New List
                    </Text>
                </TouchableOpacity>

                {/* Content */}
                <View className="p-4">
                    {lists.map((list) => (
                        <ListCard key={list.id} list={list} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaViewAll>
    );
}
