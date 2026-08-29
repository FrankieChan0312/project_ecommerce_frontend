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

    // Subscribe once when the application starts.
    // Firebase will notify React whenever the user logs in or out.
    onAuthStateChanged(setLoginUser);

  }, []);


  const refreshCartItemCount =
      useCallback(async () => {

        // A logged-out user has no authenticated cart.
        // Reset the shared badge immediately when the user signs out.
        if (!loginUser) {

          setCartItemCount(0);

          return;
        }

        try {

          const cartItemDtoList =
              await getUserCart();

          // The navbar badge shows the total number of units
          // across all cart items rather than the number of product rows.
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

    // Refresh the shared cart badge whenever the authenticated
    // user changes, including immediately after login or logout.
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

          {/* All routed pages share the authentication and cart state above. */}
          <Outlet/>

        </CartContext.Provider>

      </LoginUserContext.Provider>
  );
}