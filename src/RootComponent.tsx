import {Outlet} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "./authService/firebaseAuthService.ts";
import type {UserData} from "./data/user/user.type.ts";
import {LoginUserContext} from "./context/LoginUserContext.tsx";

export default function RootComponent() {
  const [loginUser, setloginUser] = useState<UserData | null|undefined>(undefined);
  useEffect(() => {
    onAuthStateChanged(setloginUser);
  }, [])
  return (
      <>
        <LoginUserContext.Provider value={loginUser}>
          <Outlet/>
        </LoginUserContext.Provider>
      </>
  )
}