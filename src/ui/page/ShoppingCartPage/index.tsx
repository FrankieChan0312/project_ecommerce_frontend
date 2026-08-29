import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  Button,
  Container
} from "react-bootstrap";

import {
  useNavigate
} from "@tanstack/react-router";

import {
  getUserCart
} from "../../../api/cartItemApi.ts";

import {
  postTransaction
} from "../../../api/transactionApi.ts";

import TopNavBar from "../../component/TopNavBar.tsx";
import ShoppingCartTable from "./component/ShoppingCartTable.tsx";
import LoadingContainer from "../../component/LoadingContainer.tsx";

import type {
  CartItemDto
} from "../../../data/cartItem/cartItem.type.ts";

import {
  LoginUserContext
} from "../../../context/LoginUserContext.tsx";

import {
  CartContext
} from "../../../context/CartContext.tsx";

import "./ShoppingCartPage.css";


const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 50;


export default function ShoppingCartPage() {

  const [cartItemDtoList, setCartItemDtoList] =
      useState<CartItemDto[] | undefined>(
          undefined
      );

  const [isLoading, setIsLoading] =
      useState(true);

  const [isCheckout, setIsCheckout] =
      useState(false);


  const loginUser =
      useContext(LoginUserContext);

  const cartContext =
      useContext(CartContext);


  const navigate =
      useNavigate({
        from: "/shoppingcart/"
      });


  // =========================
  // Load user cart
  // =========================

  useEffect(() => {

    const fetchUserCart =
        async () => {

          setIsLoading(true);

          try {

            // Cart data belongs to the authenticated user,
            // so the request includes the Firebase Bearer token.
            const responseData =
                await getUserCart();

            setCartItemDtoList(
                responseData
            );

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

      // Redirect only after Firebase has confirmed
      // that no user is currently authenticated.
      void navigate({
        to: "/login"
      });
    }

  }, [
    loginUser,
    navigate
  ]);


  // =========================
  // Local cart synchronization
  // =========================

  const handleQuantityChange = (
      pid: number,
      quantity: number
  ) => {

    // Update the local cart only after the backend
    // has successfully changed the quantity.
    setCartItemDtoList(
        (prevState) =>
            prevState?.map(
                (dto) =>
                    dto.pid === pid
                        ? {
                          ...dto,
                          cartQuantity: quantity
                        }
                        : dto
            )
    );

    // Keep the global navbar cart badge synchronized
    // with the latest quantities.
    void cartContext
        ?.refreshCartItemCount();
  };


  const handleDelete = (
      pid: number
  ) => {

    // Remove the deleted product from the local cart
    // without requesting the complete cart again.
    setCartItemDtoList(
        (prevState) =>
            prevState?.filter(
                (dto) =>
                    dto.pid !== pid
            )
    );

    // Refresh the navbar badge after deletion.
    void cartContext
        ?.refreshCartItemCount();
  };


  // =========================
  // Checkout
  // =========================

  const handleCheckout =
      async () => {

        try {

          setIsCheckout(true);

          // Create a transaction snapshot from the current cart.
          // The backend creates the transaction in PREPARE status.
          const responseData =
              await postTransaction();

          // Continue checkout using the transaction ID returned
          // by the backend.
          void navigate({
            to: "/checkout/$tid",
            params: {
              tid: responseData.tid.toString()
            }
          });

        } catch {

          void navigate({
            to: "/error"
          });

        } finally {

          setIsCheckout(false);
        }
      };


  // =========================
  // Price calculation
  // =========================

  const calSubtotal = (
      dtoList: CartItemDto[]
  ) => {

    // Merchandise total before delivery charges.
    return dtoList.reduce(
        (total, dto) =>
            total
            + dto.cartQuantity
            * dto.price,
        0
    );
  };


  const calShippingFee = (
      dtoList: CartItemDto[]
  ) => {

    const subtotal =
        calSubtotal(dtoList);

    // Orders of HK$500 or above receive free delivery.
    // Smaller orders are charged HK$50.
    return subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_FEE;
  };


  const calGrandTotal = (
      dtoList: CartItemDto[]
  ) => {

    // Final amount displayed before checkout.
    // The backend independently calculates the transaction total
    // and remains the final authority for the charged amount.
    return calSubtotal(dtoList)
        + calShippingFee(dtoList);
  };


  // =========================
  // Cart content
  // =========================

  const renderShoppingCart = () => {

    if (
        isLoading ||
        !cartItemDtoList
    ) {

      return <LoadingContainer/>;
    }


    if (cartItemDtoList.length === 0) {

      return (
          <h1>
            你的購物車空白一片
          </h1>
      );
    }


    const subtotal =
        calSubtotal(
            cartItemDtoList
        );

    const shippingFee =
        calShippingFee(
            cartItemDtoList
        );

    const grandTotal =
        calGrandTotal(
            cartItemDtoList
        );


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
                  cartItemDtoList={
                    cartItemDtoList
                  }
                  handleQuantityChange={
                    handleQuantityChange
                  }
                  handleDelete={
                    handleDelete
                  }
              />

            </div>


            <div className="shopping-cart-summary">

              <h3>
                賬單總覽
              </h3>


              <div className="shopping-cart-summary-row">

                <span>
                  商品總額
                </span>

                <span>
                  HK${subtotal.toLocaleString()}
                </span>

              </div>


              <div className="shopping-cart-summary-row">

                <span>
                  運費
                </span>

                <span>
                  {
                    shippingFee === 0
                        ? "免費"
                        : `HK$${shippingFee.toLocaleString()}`
                  }
                </span>

              </div>


              <hr/>


              <div className="shopping-cart-total">

                <span>
                  Total
                </span>

                <span>
                  HK${grandTotal.toLocaleString()}
                </span>

              </div>


              <Button
                  className="shopping-cart-checkout-button"
                  onClick={() => {
                    void handleCheckout();
                  }}
                  disabled={isCheckout}
              >
                {
                  isCheckout
                      ? "正在處理..."
                      : "前往結賬"
                }
              </Button>

            </div>

          </div>
        </>
    );
  };


  return (
      <>
        <TopNavBar
            showSearch={false}
        />

        <Container>
          {renderShoppingCart()}
        </Container>
      </>
  );
}