import React, { useRef, useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { sendOTP, verifyOTP } from '@/utils/auth'; // Import from your auth.ts file
import { auth } from '@/firebase/firebaseConfig'; // Import your Firebase instance
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';



export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const recaptchaVerifier = useRef(null);

  const handleSendOTP = async () => {
    try {
      await sendOTP(phoneNumber, recaptchaVerifier.current);
      setConfirmation(true);
      Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const user = await verifyOTP(otp);
      if (user) {
        Alert.alert('Success', 'User signed in successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
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
        <>
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="Send OTP" onPress={handleSendOTP} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="OTP"
            value={otp}
            onChangeText={setOTP}
          />
          <Button title="Verify OTP" onPress={handleVerifyOTP} />
        </>
      )}
    </View>
    </SafeAreaViewAll>
  );
}