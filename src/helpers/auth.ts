/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import { auth } from "./firebaseConfig";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

export function onAuthStateChanged(cb: any) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signInWithGithub() {
  const provider = new GithubAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (
      error instanceof FirebaseError &&
      error.code === "auth/account-exists-with-different-credential"
    ) {
      // Get the email from the error
      const email = error.customData?.email as string;
      if (email) {
        // Get sign in methods for this email
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods[0] === "google.com") {
          toast.error(
            "This email is already associated with a Google account. Please sign in with Google first.",
            { duration: 6000 }
          );
        } else {
          toast.error(`Please sign in with ${methods[0]} first`);
        }
      }
    } else if (
      error instanceof FirebaseError &&
      error.code === "auth/popup-blocked"
    ) {
      toast.error("Popup was blocked. Please allow popups and try again.", {
        duration: 6000,
      });
    } else {
      console.error("Error signing in with Github:", error);
      toast.error("An error occurred during sign in");
    }
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}

export async function signIn(email: string, password: string) {
  // let result = null,
  //   error = null;
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    console.log(e);
  }

  // return { result, error };
}

export default async function signUp(email: string, password: string) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    console.error(e);
  }
}
