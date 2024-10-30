import React from 'react';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import HeaderLogin from '@/components/login/HeaderLogin';
import BodyLogin from '@/components/login/BodyLogin';
import { View } from 'react-native';

export default function LoginScreen() {
    return (
        <SafeAreaViewAll color="white">
            <View className="flex-1">
                <HeaderLogin />
                <BodyLogin />
            </View>
        </SafeAreaViewAll>
    );
}
