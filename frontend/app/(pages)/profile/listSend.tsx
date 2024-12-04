// /profile/listSend.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams } from 'expo-router';

export default function ListSend() {
  const { listId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl">List Details for ID: {listId}</Text>
    </View>
  );
}
