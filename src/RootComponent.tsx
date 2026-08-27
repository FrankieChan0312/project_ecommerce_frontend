// import {Outlet} from "@tanstack/react-router";
// import {useEffect, useState} from "react";
// import {onAuthStateChanged} from "./authService/firebaseAuthService.ts";
// import type {UserData} from "./data/user/user.type.ts";
// import {LoginUserContext} from "./context/LoginUserContext.tsx";
//
// export default function RootComponent() {
//   const [loginUser, setloginUser] = useState<UserData | null|undefined>(undefined);
//   useEffect(() => {
//     onAuthStateChanged(setloginUser);
//   }, [])
//   return (
//       <>
//         <LoginUserContext.Provider value={loginUser}>
//           <Outlet/>
//         </LoginUserContext.Provider>
//       </>
//   )
// }

import {Outlet} from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged
} from "./authService/firebaseAuthService.ts";

import type {
  UserData
} from "./data/user/user.type.ts";

import {
  LoginUserContext
} from "./context/LoginUserContext.tsx";

import {
  CartContext
} from "./context/CartContext.tsx";

import {
  getUserCart
} from "./api/cartItemApi.ts";


export default function RootComponent() {

  const [loginUser, setLoginUser] =
      useState<UserData | null | undefined>(
          undefined
      );

  const [cartItemCount, setCartItemCount] =
      useState(0);


  useEffect(() => {

    onAuthStateChanged(setLoginUser);

  }, []);


  const refreshCartItemCount =
      useCallback(async () => {

        if (!loginUser) {

          setCartItemCount(0);

          return;
        }

        try {

          const cartItemDtoList =
              await getUserCart();

          const totalQuantity =
              cartItemDtoList.reduce(
                  (total, dto) =>
                      total + dto.cartQuantity,
                  0
              );

          setCartItemCount(totalQuantity);

        } catch (error) {

          console.error(
              "Failed to load cart item count:",
              error
          );
        }

      }, [loginUser]);


  useEffect(() => {

    void refreshCartItemCount();

  }, [refreshCartItemCount]);


  return (
      <LoginUserContext.Provider
          value={loginUser}
      >

        <CartContext.Provider
            value={{
              cartItemCount,
              refreshCartItemCount
            }}
        >

          <Outlet/>

        </CartContext.Provider>

      </LoginUserContext.Provider>
  );
}