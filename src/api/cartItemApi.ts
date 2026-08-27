import axios from "axios";
// import {getAccessToken, getAuthConfig} from "../authService/firebaseAuthService.ts";
import { getAuthConfig} from "../authService/firebaseAuthService.ts";
import {baseUrl} from "./productApi.ts";
import type {CartItemDto} from "../data/cartItem/cartItem.type.ts";

export async function getUserCart(){
  // const accessToken = await getAccessToken();

  const response =await axios.get<CartItemDto[]>(
      `${baseUrl}/cart/items`,
  await getAuthConfig()
  // {
  //   headers:{
  //     Authorization: `Bearer ${accessToken}`
  //   }
  // }
  );
  return response.data;
}

export async function putCartItem(pid:number, quantity:number){
  const response =await axios.put (
      `${baseUrl}/cart/items/${pid}/${quantity}`,
      undefined,
      await getAuthConfig()
  );
  return response.data;
}