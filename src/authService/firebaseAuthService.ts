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

import type {
  UserData
} from "../data/user/user.type.ts";


export const serviceInit = () => {

  // Initialize Firebase when the application starts.
  // Other authentication functions use this configured Firebase app.
  initializeApp(firebaseConfig);
};


export const signInWithEmailAndPassword = async (
    email: string,
    password: string
): Promise<boolean> => {

  try {

    const auth = getAuth();

    // Authenticate the user with Firebase using email and password.
    await firebaseSignInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return true;

  } catch (error) {

    console.log(error);
    return false;
  }
};


export const signInWithGoogle =
    async (): Promise<boolean> => {

      try {

        const provider =
            new GoogleAuthProvider();

        const auth =
            getAuth();

        // Open the Google sign-in flow and let Firebase
        // authenticate the selected Google account.
        await signInWithPopup(
            auth,
            provider
        );

        return true;

      } catch (error) {

        console.log(error);
        return false;
      }
    };


export const onAuthStateChanged = (
    setUser: (user: UserData | null) => void
) => {

  const auth =
      getAuth();

  // Observe Firebase authentication state changes.
  // The Firebase User is converted into the lightweight UserData
  // used by the React application.
  firebaseOnAuthStateChanged(
      auth,
      (user) => {

        let loginUser:
            UserData | null;

        if (user) {

          loginUser = {
            email:
                user.email
                || "Login User"
          };

        } else {

          loginUser = null;
        }

        setUser(loginUser);
      }
  );
};


export const getAccessToken =
    (): Promise<string> | null => {

      const currentUser =
          getAuth().currentUser;

      if (!currentUser) {
        return null;
      }

      // Retrieve the Firebase ID token for the current user.
      // Firebase automatically refreshes an expired token when necessary.
      return currentUser.getIdToken(false);
    };


export const getAuthConfig =
    async () => {

      const accessToken =
          await getAccessToken();

      if (!accessToken) {
        throw new Error(
            "User is not authenticated"
        );
      }

      // Build the Axios request configuration used by protected APIs.
      // Spring Security validates this Firebase ID token on the backend.
      return {
        headers: {
          Authorization:
              `Bearer ${accessToken}`
        }
      };
    };


export const signOut =
    async () => {

      const auth =
          getAuth();

      try {

        // End the Firebase session.
        // The authentication-state observer will then update
        // the React application to the signed-out state.
        await firebaseSignOut(auth);

      } catch (error) {

        console.log(error);
      }
    };