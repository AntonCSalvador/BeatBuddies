import React from 'react';
import { View, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import PhoneInput from '@/components/login/PhoneInput';
import OTPInput from '@/components/login/OTPInput';
import { useOTP } from '@/hooks/useOTP';
import { auth } from '@/firebase/firebaseConfig';

export default function LoginScreen() {
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
            Alert.alert('Error');
        }
    };

    const handleVerifyOTPWrapper = async () => {
        try {
            const message = await handleVerifyOTP();
            if (message) {
                Alert.alert('Success', message);
            }
        } catch (error: unknown) {
            Alert.alert('Error');
        }
    };

    return (
        <SafeAreaViewAll color="white">
            <View>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={auth.app.options}
                />
                {!confirmation ? (
                    <PhoneInput
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        onSendOTP={handleSendOTPWrapper}
                    />
                ) : (
                    <OTPInput
                        otp={otp}
                        setOTP={setOTP}
                        onVerifyOTP={handleVerifyOTPWrapper}
                    />
                )}
            </View>
        </SafeAreaViewAll>
    );
}
