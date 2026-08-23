import {useEffect} from "react";
import {getUserCart} from "../../../api/cartItemApi.ts";

export default function ShoppingCart() {

  useEffect(() =>{
    getUserCart();
      },[]);
  return (
      <>

      </>
  )
}