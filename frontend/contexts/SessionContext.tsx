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

//Creates a session
const SessionContext = createContext<SessionContextType>({ 
    session: null,
    loading: true,
    setLoading: () => {},
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setSession(user); 
        setLoading(false); 
      });
  
      return () => unsubscribe(); 
    }, []);
  
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
