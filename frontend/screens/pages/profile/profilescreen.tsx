import React from 'react';
import { Button, View } from 'react-native';
import { signOut } from '@/utils/auth';
import HeaderProfile from '@/components/profile/HeaderProfile';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import BodyProfIndex from '@/components/profile/index/BodyProfIndex';

export default function ProfileScreen() {
    return (
        <SafeAreaViewAll color="white">
            <View className="flex-1">
                <HeaderProfile />
                <BodyProfIndex />
            </View>
        </SafeAreaViewAll>
    );
}
