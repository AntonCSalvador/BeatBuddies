import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface OTPInputProps {
    otp: string;
    setOTP: (value: string) => void;
    onVerifyOTP: () => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ otp, setOTP, onVerifyOTP }) => {
    return (
        <View className="flex items-center justify-center p-4">
            <View className="w-[95%] p-1 rounded-xl bg-gray-100 border border-gray-300 mb-4">
                <TextInput
                    className="text-base text-gray-800 px-4 py-2"
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOTP}
                    maxLength={6}
                    keyboardType="number-pad"
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity
                className={`w-[95%] p-3 rounded-xl ${otp.length === 6 ? 'bg-teal-600' : 'bg-gray-400'}`}
                onPress={onVerifyOTP}
                disabled={otp.length !== 6}
                activeOpacity={0.8}
            >
                <Text className="text-white text-center font-semibold">
                    Verify OTP
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default OTPInput;
