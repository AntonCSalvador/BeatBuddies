import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter, useSegments } from 'expo-router';

// Session context type
type SessionContextType = {
    session: User | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
};

const SessionContext = createContext<SessionContextType>({ 
    session: null,
    loading: true,
    setLoading: () => {},
});

// Custom hook for using session context
export const useSession = () => useContext(SessionContext);

// SessionProvider component
export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();
  
    useEffect(() => {
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setSession(user); // Set user session
        setLoading(false); // Set loading to false
      });
  
      return () => unsubscribe(); 
    }, []);
  
    // Handle redirects based on authentication state
    useEffect(() => {
      if (!loading) {
        if (!session) {
          if (segments[0] !== '(public)') {
            router.replace('/(public)/login');
          }
        } else {
          if (segments[0] !== '(pages)') {
            router.replace('/(pages)/home');
          }
        }
      }
    }, [session, segments, router, loading]);
  
    return (
      <SessionContext.Provider value={{ session, loading, setLoading }}>
        {children}
      </SessionContext.Provider>
    );
};
