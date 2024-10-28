import React from 'react';
import { View, TextInput, Button } from 'react-native';

interface OTPInputProps {
    otp: string;
    setOTP: (value: string) => void;
    onVerifyOTP: () => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ otp, setOTP, onVerifyOTP }) => {
    return (
        <View>
            <TextInput placeholder="OTP" value={otp} onChangeText={setOTP} />
            <Button title="Verify OTP" onPress={onVerifyOTP} />
        </View>
    );
};

export default OTPInput;
