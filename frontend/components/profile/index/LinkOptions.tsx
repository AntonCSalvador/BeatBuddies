import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ProfileOptionProps {
    title: string;
    color: string;
    onPress: () => void;
}

export default function LinkOptions({
    title,
    color,
    onPress,
}: ProfileOptionProps) {
    return (
        <TouchableOpacity onPress={onPress} className="w-full  p-4 ">
            <View className="flex flex-row justify-between items-center">
                <Text
                    className="text-lg font-normal"
                    style={{
                        color: color,
                    }}
                >
                    {title}
                </Text>
                <Text className="text-lg text-gray-500">{'>'}</Text>
            </View>
        </TouchableOpacity>
    );
}
