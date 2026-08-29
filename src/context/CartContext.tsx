import {createContext} from "react";

interface CartContextData {

  // Total number of product units currently in the user's cart.
  // This is the sum of cart quantities, not the number of cart rows.
  cartItemCount: number;

  // Reload the cart from the backend and synchronize
  // the global navbar cart badge.
  refreshCartItemCount: () => Promise<void>;
}


// CartContext allows pages such as Product Detail, Shopping Cart
// and Checkout to update the same cart badge shown in the navbar.
export const CartContext =
    createContext<
        CartContextData | undefined
    >(undefined);