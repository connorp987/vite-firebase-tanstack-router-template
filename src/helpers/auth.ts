/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
    signInWithEmailAndPassword,
    GithubAuthProvider,
    createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebaseConfig";
import { toast } from "sonner";

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
        toast.error("You either logged in with another provider already, or an unknown error has occured.", { duration: 8000, });
        console.error("Error signing in with Github", error);
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
