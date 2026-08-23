import {initializeApp} from "firebase/app";
import {firebaseConfig} from "./firebaseConfig.ts";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";
import type {UserData} from "../data/user/user.type.ts";


export const serviceInit = () => {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // Initialize Firebase
  initializeApp(firebaseConfig);
}

// https://firebase.google.com/docs/auth/web/start#sign_in_existing_users
export const signInWithEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const auth = getAuth();
    await firebaseSignInWithEmailAndPassword(auth, email, password);
    // Signed in
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// https://firebase.google.com/docs/auth/web/google-signin#before_you_begin
export const signInWithGoogle = async (): Promise<boolean> => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    await signInWithPopup(auth, provider);
    // Signed in
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
export const onAuthStateChanged = (setUser: (user: UserData | null) => void) => {
  const auth = getAuth();
  firebaseOnAuthStateChanged(auth, (user) => {
    let loginUser: UserData | null;
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      loginUser = {
        email: user.email || "Login User"
      }
    } else {
      // User is signed out
      loginUser = null;
    }
    setUser(loginUser);
  });
};

export const getAccessToken = (): Promise<string> | null => {
  const currentUser = getAuth().currentUser;
  if (!currentUser) {
    return null;
  }
  return currentUser.getIdToken(false);
}

export const getAuthConfig = async () => {
  const accessToken = await getAccessToken();

  // console.log("Firebase ID Token:", accessToken);

  if (!accessToken) {
    throw new Error();
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }
}

export const signOut = async () => {
  const auth = getAuth();
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.log(error);
  }
}
