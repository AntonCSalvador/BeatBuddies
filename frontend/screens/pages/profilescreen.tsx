import React from 'react';
import { Button, View } from 'react-native';
import { signOut } from '@/utils/auth';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

export default function ProfileScreen() {
    return (
        <SafeAreaViewAll color="white">
            <View className="flex-1">
                <Button
                    title="Signout"
                    onPress={() => {
                        signOut();
                    }}
                />
            </View>
        </SafeAreaViewAll>
    );
}
