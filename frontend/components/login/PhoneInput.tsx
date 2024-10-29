import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { styled } from 'nativewind';

interface PhoneInputProps {
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    onSendOTP: () => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    phoneNumber,
    setPhoneNumber,
    onSendOTP,
}) => {
    return (
        <View className="flex items-center justify-center p-4">
            <View className="w-4/5 p-3 rounded-full bg-gray-100 border border-gray-300 mb-4">
                <TextInput
                    className="text-base text-gray-800 px-4 py-2"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={15}
                    placeholderTextColor="#888"
                />
            </View>
            <Button title="Send OTP" onPress={onSendOTP} />
        </View>
    );
};

export default PhoneInput;

