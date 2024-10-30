import React from 'react';
import { View, Alert, Text } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import PhoneInput from '@/components/login/PhoneInput';
import OTPInput from '@/components/login/OTPInput';
import { useOTP } from '@/hooks/useOTP';
import { auth } from '@/firebase/firebaseConfig';

export default function BodyLogin() {
    const {
        phoneNumber,
        setPhoneNumber,
        otp,
        setOTP,
        confirmation,
        recaptchaVerifier,
        handleSendOTP,
        handleVerifyOTP,
    } = useOTP();

    const handleSendOTPWrapper = async () => {
        try {
            const message = await handleSendOTP();
            Alert.alert('OTP Sent', message);
        } catch (error: unknown) {
            Alert.alert('Error', 'Failed to send OTP');
        }
    };

    const handleVerifyOTPWrapper = async () => {
        try {
            const message = await handleVerifyOTP();
            if (message) {
                Alert.alert('Success', message);
            }
        } catch (error: unknown) {
            Alert.alert('Error', 'Failed to verify OTP');
        }
    };

    return (
        <View className="w-full h-[70%] p-2 ">
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={auth.app.options}
            />
            {!confirmation ? (
                <View className="flex w-full  justify-center flex-col border border-black rounded-lg">
                    <View className="mb-5 pt-4">
                        <Text className="pl-7 text-3xl">OTP Login</Text>
                        <Text className="pl-7 text-gray-600">
                            Enter your phone number to receive a one-time
                            password
                        </Text>
                    </View>

                    <PhoneInput
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        onSendOTP={handleSendOTPWrapper}
                    />
                </View>
            ) : (
                <View className="flex w-full  justify-center flex-col border border-black rounded-lg">
                    <View className="mb-5 pt-4">
                        <Text className="pl-7 text-3xl">OTP Login</Text>
                        <Text className="pl-7 text-gray-600">
                            Enter your OTP code to verify
                        </Text>
                    </View>
                    <OTPInput
                        otp={otp}
                        setOTP={setOTP}
                        onVerifyOTP={handleVerifyOTPWrapper}
                    />
                </View>
            )}
        </View>
    );
}
