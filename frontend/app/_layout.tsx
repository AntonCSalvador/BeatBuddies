import { SessionProvider } from '@/contexts/SessionContext';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

SplashScreen.preventAutoHideAsync();

//This is covered in a Session layer which check if the session is valid or not.
export default function RootLayout() {
    return (
        <SessionProvider>
            <Slot />
        </SessionProvider>
    );
}
