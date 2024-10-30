import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

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
        <View className="flex flex-col items-center justify-center p-4">
            <View className="w-[95%] p-1 rounded-xl bg-gray-100 border border-gray-300 mb-4">
                <TextInput
                    className="text-base text-gray-800 px-4 py-2"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={15}
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity
                className={`w-[95%] p-3 rounded-xl ${phoneNumber.length === 10 ? 'bg-teal-600' : 'bg-gray-400'}`}
                onPress={onSendOTP}
                disabled={phoneNumber.length <= 10}
                activeOpacity={0.8}
            >
                <Text className="text-white text-center font-semibold">
                    Send OTP
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PhoneInput;
