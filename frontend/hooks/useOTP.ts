// hooks/useOTP.ts
import { useState, useRef } from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth, db } from '@/firebase/firebaseConfig';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ConfirmationResult } from 'firebase/auth';


export const useOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal | null>(null);

  const handleSendOTP = async () => {
    try {
      if (!recaptchaVerifier.current) throw new Error('Recaptcha verifier not ready');
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(confirmation);
      return 'OTP sent';
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw new Error('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!confirmationResult) throw new Error('No confirmation result available');
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      await checkOrCreateUser(user);
      return 'User signed in successfully';
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      throw new Error('Failed to verify OTP');
    }
  };

  // Function to check or create user in Firestore
  const checkOrCreateUser = async (user: User) => {
    try {
      console.log('User UID:', user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        // User does not exist, create new user
        const newUser = {
          uid: user.uid,
          phoneNumber: user.phoneNumber || null,
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, newUser);
        console.log('New user created in Firestore');
      } else {
        console.log('User already exists in Firestore');
      }
    } catch (error) {
      console.error('Error checking or creating user:', error);
      throw new Error('Failed to check or create user');
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOTP,
    confirmation: !!confirmationResult,
    recaptchaVerifier,
    handleSendOTP,
    handleVerifyOTP,
  };
};
