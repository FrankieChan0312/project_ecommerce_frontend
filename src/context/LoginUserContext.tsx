import {createContext} from "react";

import type {
  UserData
} from "../data/user/user.type.ts";


// undefined = Firebase authentication state is still loading.
// null      = authentication check finished and no user is logged in.
// UserData  = an authenticated user is available.
export const LoginUserContext =
    createContext<
        UserData | null | undefined
    >(undefined);