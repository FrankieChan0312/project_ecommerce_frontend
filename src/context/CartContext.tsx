import {createContext} from "react";

interface CartContextData{
  cartItemCount:number;
  refreshCartItemCount:()=>Promise<void>;
}

export const CartContext =
    createContext<CartContextData|undefined>(undefined);