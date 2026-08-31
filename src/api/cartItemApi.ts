import axios from "axios";

import {
  getAuthConfig
} from "../authService/firebaseAuthService.ts";



import type {
  CartItemDto
} from "../data/cartItem/cartItem.type.ts";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// All cart endpoints require Firebase authentication.
// getAuthConfig() attaches the current user's Bearer token
// to the Authorization header.
export async function getUserCart() {

  const response =
      await axios.get<CartItemDto[]>(
          `${baseUrl}/cart/items`,
          await getAuthConfig()
      );

  return response.data;
}


export async function putCartItem(
    pid: number,
    quantity: number
) {

  // PUT adds the requested quantity to the cart.
  // If the product already exists, the backend increases
  // its current cart quantity instead of replacing it.
  const response =
      await axios.put(
          `${baseUrl}/cart/items/${pid}/${quantity}`,
          undefined,
          await getAuthConfig()
      );

  return response.data;
}


export async function patchCartItem(
    pid: number,
    quantity: number
) {

  // PATCH sets the cart item to the new final quantity.
  // Unlike PUT, the quantity here is not added to
  // the item's existing quantity.
  const response =
      await axios.patch(
          `${baseUrl}/cart/items/${pid}/${quantity}`,
          undefined,
          await getAuthConfig()
      );

  return response.data;
}


export async function deleteCartItem(
    pid: number
) {

  // Remove the selected product from the authenticated user's cart.
  const response =
      await axios.delete(
          `${baseUrl}/cart/items/${pid}`,
          await getAuthConfig()
      );

  return response.data;
}