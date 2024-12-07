import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig'; // Adjust path to your Firebase config

// Create a variable to hold the confirmation result
let confirmationResult: ConfirmationResult | null = null;

// Send OTP to the provided phone number
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: any) => {
    try {
        confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            recaptchaVerifier
        );
        return confirmationResult;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

// Verify the OTP so that user can be given access to the application
export const verifyOTP = async (otp: string) => {
    if (!confirmationResult) {
        throw new Error('No confirmation result found');
    }

    try {
        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        console.log('User signed in successfully:', user);
        return user;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};

// This is used to sign out the user when requested or if the session quits
export const signOut = async () => {
    try {
        await auth.signOut();
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};
