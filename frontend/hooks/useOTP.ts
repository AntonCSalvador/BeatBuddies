import { useState, useRef } from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { sendOTP, verifyOTP } from '@/utils/auth';

export const useOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal | null>(null);

  const handleSendOTP = async () => {
    try {
      await sendOTP(phoneNumber, recaptchaVerifier.current);
      setConfirmation(true);
      return 'OTP sent';
    } catch (error) {
      throw new Error('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const user = await verifyOTP(otp);
      return user ? 'User signed in successfully' : null;
    } catch (error) {
      throw new Error('Failed to verify OTP');
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOTP,
    confirmation,
    recaptchaVerifier,
    handleSendOTP,
    handleVerifyOTP,
  };
};
