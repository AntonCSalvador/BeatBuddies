import React from 'react';
import { signOut } from '@/utils/auth';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import LinkOptions from './LinkOptions';

export default function BodyProfIndex() {
    const router = useRouter();

    const confirmSignOut = () => {
        Alert.alert(
            'Confirm Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => signOut(),
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View className="flex-1 w-full relative">
            {/* Profile Header */}
            <View className="w-full h-[7%]">
                <Text className="text-2xl pt-4 pl-4 font-nunito-extrabold">
                    Profile
                </Text>
            </View>

            {/* Profile Options */}
            <View className="w-full">
                <LinkOptions
                    title="Account Info"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
                <LinkOptions
                    title="Activity"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
            </View>

            {/* Ratings Header */}
            <View className="w-full h-[7%] mt-4 border-t">
                <Text className="text-2xl pt-4 pl-4 font-nunito-extrabold">
                    Ratings
                </Text>
            </View>

            {/* Ratings Options */}
            <View className="w-full">
                <LinkOptions
                    title="Albums"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
                <LinkOptions
                    title="Songs"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
                <LinkOptions
                    title="Artists"
                    onPress={() => router.push('/(pages)/home')}
                    color="black"
                />
            </View>

            {/* Security Header */}
            <View className="w-full h-[7%] mt-4 border-t">
                <Text className="text-2xl pt-4 pl-4 font-nunito-extrabold">
                    Security
                </Text>
            </View>
            {/* Security Options */}
            <View className="w-full">
                <LinkOptions
                    title="Sign Out"
                    onPress={confirmSignOut}
                    color="red"
                />
            </View>
        </View>
    );
}
