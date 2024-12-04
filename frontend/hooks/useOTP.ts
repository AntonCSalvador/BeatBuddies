import { useState, useRef } from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { sendOTP, verifyOTP } from '@/utils/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const useOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [confirmation, setConfirmation] = useState(false);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal | null>(null);

  const handleSendOTP = async () => {
    try {
      const result = await sendOTP(phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(result); // Store the confirmation result
      setConfirmation(true);
      return 'OTP sent';
    } catch (error) {
      throw new Error('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!confirmationResult) {
        throw new Error('No confirmation result found');
      }

      // Verify the OTP
      const user = await verifyOTP(otp, confirmationResult);

      // Add user to Firestore
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          phoneNumber: user.phoneNumber || phoneNumber,
          createdAt: new Date(),
        });
        return 'User signed in and added to Firestore';
      }

      return null;
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
