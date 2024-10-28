import React from 'react';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import HeaderLogin from '@/components/login/HeaderLogin';
import HeaderBody from '@/components/login/HeaderBody';

export default function LoginScreen() {
    return (
        <SafeAreaViewAll color="white">
            <HeaderLogin />
            <HeaderBody />
        </SafeAreaViewAll>
    );
}
