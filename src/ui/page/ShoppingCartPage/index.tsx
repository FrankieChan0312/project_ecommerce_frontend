import {useContext, useEffect, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {useNavigate} from "@tanstack/react-router";

import {getUserCart} from "../../../api/cartItemApi.ts";

import TopNavBar from "../../component/TopNavBar.tsx";
import ShoppingCartTable from "./component/ShoppingCartTable.tsx";
import LoadingContainer from "../../component/LoadingContainer.tsx";
import "./ShoppingCartPage.css";

import type {
  CartItemDto
} from "../../../data/cartItem/cartItem.type.ts";

import {
  LoginUserContext
} from "../../../context/LoginUserContext.tsx";


export default function ShoppingCartPage() {

  const [cartItemDtoList, setCartItemDtoList] =
      useState<CartItemDto[] | undefined>(undefined);

  const [isLoading, setIsLoading] =
      useState(true);

  const loginUser =
      useContext(LoginUserContext);

  const navigate =
      useNavigate({from: "/shoppingcart/"});


  useEffect(() => {

    const fetchUserCart = async () => {

      setIsLoading(true);

      try {

        const responseData =
            await getUserCart();

        setCartItemDtoList(responseData);

      } catch {

        void navigate({
          to: "/error"
        });

      } finally {

        setIsLoading(false);
      }
    };


    if (loginUser) {

      void fetchUserCart();

    } else if (loginUser === null) {

      void navigate({
        to: "/login"
      });
    }

  }, [loginUser, navigate]);


  const calTotal = (
      dtoList: CartItemDto[]
  ) => {

    const addPrice = (
        total: number,
        dto: CartItemDto
    ) => {

      return total +
          dto.cartQuantity * dto.price;
    };

    return dtoList.reduce(
        addPrice,
        0
    );
  };


  const renderShoppingCart = () => {

    if (!isLoading && cartItemDtoList) {

      if (cartItemDtoList.length === 0) {

        return (
            <h1>
              你的購物車空白一片
            </h1>
        );

      } else {

        // return (
        //     <>
        //       <h1 className="my-3">
        //         Shopping Cart
        //       </h1>
        //       <ShoppingCartTable
        //           cartItemDtoList={
        //             cartItemDtoList
        //           }
        //       />
        //
        //       <h2 className="my-3">
        //         Total: HK$
        //         {
        //           calTotal(
        //               cartItemDtoList
        //           ).toLocaleString()
        //         }
        //       </h2>
        //
        //       <Button className="mb-4">
        //         <h3 className="mb-0">
        //           Pay!
        //         </h3>
        //       </Button>
        //     </>
        // );

        return (
            <>
              <div className="shopping-cart-header">

                <div>
                  <h1 className="shopping-cart-title">
                    Shopping Cart
                  </h1>

                  <p className="shopping-cart-count">
                    {cartItemDtoList.length} 件商品
                  </p>
                </div>

              </div>


              <div className="shopping-cart-layout">

                <div className="shopping-cart-table-section">

                  <ShoppingCartTable
                      cartItemDtoList={cartItemDtoList}
                  />

                </div>


                <div className="shopping-cart-summary">

                  <h3>
                    Order Summary
                  </h3>

                  <div className="shopping-cart-summary-row">
                    <span>商品總額</span>

                    <span>
              HK$
                      {calTotal(cartItemDtoList).toLocaleString()}
            </span>
                  </div>


                  <div className="shopping-cart-summary-row">
                    <span>運費</span>

                    <span>
              結帳時計算
            </span>
                  </div>


                  <hr/>


                  <div className="shopping-cart-total">

                    <span>Total</span>

                    <span>
              HK$
                      {calTotal(cartItemDtoList).toLocaleString()}
            </span>

                  </div>


                  <Button
                      className="shopping-cart-checkout-button"
                  >
                    Checkout
                  </Button>

                </div>

              </div>
            </>
        );

      }

    } else {

      return <LoadingContainer/>;
    }
  };


  return (
      <>
        <TopNavBar/>

        <Container>



          {renderShoppingCart()}

        </Container>
      </>
  );
}