import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

export default function ListSend() {
    const { listId } = useLocalSearchParams();

    return (
        <SafeAreaViewAll color="white">
        <ScrollView className="flex-1 bg-white p-4">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-3xl font-bold text-gray-800">List Name</Text>
                <TouchableOpacity
                    className="py-2 px-4 bg-blue-500 rounded-lg"
                    onPress={() => console.log('Edit List')}
                >
                    <Text className="text-white text-sm font-semibold">Edit</Text>
                </TouchableOpacity>
            </View>

            {/* List ID Section */}
            <View className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
                <Text className="text-lg font-semibold text-gray-700">List ID</Text>
                <Text className="text-base text-gray-500 mt-1">{listId}</Text>
            </View>

            {/* Placeholder for List Items */}
            <View className="mb-6">
                <Text className="text-xl font-bold text-gray-800">Items in the List</Text>
                <View className="mt-4 space-y-4">
                    {/* Replace these placeholders with actual list items */}
                    {[1, 2, 3].map((item, index) => (
                        <View
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg shadow-sm flex-row items-center justify-between"
                        >
                            <Text className="text-base font-medium text-gray-700">
                                Item {item}
                            </Text>
                            <TouchableOpacity
                                className="py-1 px-3 bg-red-500 rounded-lg"
                                onPress={() => console.log(`Remove Item ${item}`)}
                            >
                                <Text className="text-white text-sm font-semibold">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            {/* Add New Item Button */}
            <TouchableOpacity
                className="py-3 bg-blue-500 rounded-lg items-center"
                onPress={() => console.log('Add New Item')}
            >
                <Text className="text-white text-lg font-semibold">Add New Item</Text>
            </TouchableOpacity>
        </ScrollView>
        </SafeAreaViewAll>
    );
}
