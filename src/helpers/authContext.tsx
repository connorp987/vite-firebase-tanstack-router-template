/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { firebase_app } from "./firebaseConfig";
import { User as FirebaseUser } from "firebase/auth";

interface User {
  user: FirebaseUser | null;
}

const auth = getAuth(firebase_app);
const userObj: User = { user: null };
export const AuthContext = React.createContext(userObj);

export const useAuthContext = () => React.useContext<User>(AuthContext);

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
