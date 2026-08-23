import axios from "axios";
// import {getAccessToken, getAuthConfig} from "../authService/firebaseAuthService.ts";
import { getAuthConfig} from "../authService/firebaseAuthService.ts";

export async function getUserCart(){
  // const accessToken = await getAccessToken();

  const responseData =await axios.get(
      "http://localhost:8080/cart/items",
  await getAuthConfig()
  // {
  //   headers:{
  //     Authorization: `Bearer ${accessToken}`
  //   }
  // }
  );
  console.log(responseData);
}