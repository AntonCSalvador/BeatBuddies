import React from 'react';
import { View, TextInput, Button } from 'react-native';

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
        <View>
            <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <Button title="Send OTP" onPress={onSendOTP} />
        </View>
    );
};

export default PhoneInput;
