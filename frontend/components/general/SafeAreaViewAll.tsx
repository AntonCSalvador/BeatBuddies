import React, { ReactNode } from 'react';
import { Platform, SafeAreaView, StatusBar } from 'react-native';

interface Props {
    children: Readonly<ReactNode>;
    color: string;
}

export default function SafeAreaViewAll({ children, color }: Props) {
    const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    return (
        <SafeAreaView
            style={{ paddingTop, backgroundColor: color }}
            className="flex-1"
        >
            {children}
        </SafeAreaView>
    );
}
