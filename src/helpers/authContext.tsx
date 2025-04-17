/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  // Add any other user fields you want to track
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuthContext = () =>
  React.useContext<AuthContextType>(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  React.useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      unsubscribeFirestore = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserData);
        } else {
          // Initialize user document if it doesn't exist
          setUserData({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
        }
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [user?.uid]);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
