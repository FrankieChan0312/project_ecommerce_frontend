import {
  Alert,
  Button,
  Container,
  Stack
} from "react-bootstrap";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "@tanstack/react-router";

import {AxiosError} from "axios";

import TopNavBar from "../../component/TopNavBar.tsx";
import QuantitySelector from "../../component/QuantitySelector.tsx";
import LoadingContainer from "../../component/LoadingContainer.tsx";

import type {
  ProductDetailDto
} from "../../../data/product/product.type.ts";

import {
  getProductByPid
} from "../../../api/productApi.ts";

import {
  LoginUserContext
} from "../../../context/LoginUserContext.tsx";

import {
  CartContext
} from "../../../context/CartContext.tsx";

import {
  putCartItem
} from "../../../api/cartItemApi.ts";

import "./ProductDetailPage.css";


export default function ProductDetailPage() {

  const {productId} =
      useParams({
        from: "/product/$productId"
      });


  const [productDto, setProductDto] =
      useState<ProductDetailDto | undefined>(
          undefined
      );


  const [isLoading, setIsLoading] =
      useState(true);


  // Display a temporary warning when the backend rejects
  // the requested quantity because the available stock has changed.
  const [
    quantityIsExceedStock,
    setQuantityIsExceedStock
  ] =
      useState(false);


  // These states provide feedback while an add-to-cart
  // request is running and immediately after it succeeds.
  const [isAddingToCart, setIsAddingToCart] =
      useState(false);

  const [addToCartSuccess, setAddToCartSuccess] =
      useState(false);


  const [quantity, setQuantity] =
      useState(1);


  const loginUser =
      useContext(LoginUserContext);


  const cartContext =
      useContext(CartContext);


  const navigate =
      useNavigate({
        from: "/product/$productId"
      });


  const handleQuantityMinusOne = () => {

    // Cart quantity cannot fall below one.
    if (quantity > 1) {

      setQuantity(
          (prevState) =>
              prevState - 1
      );

      setQuantityIsExceedStock(false);
    }
  };


  const handleQuantityPlusOne = () => {

    // Prevent the selector from increasing beyond
    // the stock value returned by the product-detail API.
    if (
        productDto &&
        quantity < productDto.stock
    ) {

      setQuantity(
          (prevState) =>
              prevState + 1
      );

      setQuantityIsExceedStock(false);
    }
  };


  const handlePutCartItem = async () => {

    // null means Firebase has confirmed that no user is logged in.
    // Redirect unauthenticated users before calling the protected cart API.
    if (loginUser === null) {

      void navigate({
        to: "/login"
      });

      return;
    }


    // undefined means authentication is still loading.
    // Product data must also exist before an add-to-cart request can be sent.
    if (!loginUser || !productDto) {
      return;
    }


    try {

      setIsAddingToCart(true);
      setAddToCartSuccess(false);


      // PUT adds the selected quantity to any quantity
      // already stored for this product in the user's cart.
      await putCartItem(
          productDto.pid,
          quantity
      );


      // Synchronize the global navbar badge after
      // the backend cart has been successfully updated.
      await cartContext
          ?.refreshCartItemCount();


      setIsAddingToCart(false);
      setAddToCartSuccess(true);


      // Keep the success state visible briefly before
      // returning the button to its normal appearance.
      setTimeout(
          () => {
            setAddToCartSuccess(false);
          },
          2000
      );

    } catch (err) {

      setIsAddingToCart(false);


      // HTTP 400 represents a business validation failure,
      // such as stock becoming insufficient since the page was loaded.
      if (
          err instanceof AxiosError &&
          err.response?.status === 400
      ) {

        setQuantityIsExceedStock(true);


        setTimeout(
            () => {
              setQuantityIsExceedStock(false);
            },
            5000
        );

      } else {

        // Unexpected API failures are handled by the common error page.
        void navigate({
          to: "/error"
        });
      }
    }
  };


  const renderAddToCartButton = () => {

    // Use one button location for normal, loading and success states
    // so the layout does not jump while the request is processed.
    if (isAddingToCart) {

      return (
          <Button
              className="ms-2 product-detail-cart-button"
              disabled
          >
            幫緊你!
          </Button>
      );
    }


    if (addToCartSuccess) {

      return (
          <Button
              className="ms-2 product-detail-cart-button"
              disabled
          >
            成功了!
          </Button>
      );
    }


    return (
        <Button
            className="ms-2 product-detail-cart-button"
            onClick={handlePutCartItem}
        >
          加入購物車
        </Button>
    );
  };


  useEffect(() => {

    const fetchProduct = async () => {

      setIsLoading(true);

      try {

        // Reload product details whenever the product ID
        // in the route changes.
        const responseData =
            await getProductByPid(
                productId
            );

        setProductDto(responseData);

      } catch {

        void navigate({
          to: "/error"
        });

      } finally {

        setIsLoading(false);
      }
    };


    void fetchProduct();

  }, [
    productId,
    navigate
  ]);


  return (
      <>
        <TopNavBar/>


        {
          productDto && !isLoading
              ? (
                  <Container>

                    <img
                        style={{
                          height: "300px"
                        }}
                        src={productDto.imageUrl}
                        alt={productDto.name}
                    />


                    <h3>
                      {productDto.name}
                    </h3>


                    <h5
                        style={{
                          whiteSpace: "pre-line"
                        }}
                    >
                      {productDto.description}
                    </h5>


                    <Stack direction="horizontal">

                      {
                        // Quantity controls and cart actions are available
                        // only while the product has stock.
                        productDto.stock > 0
                            ? (
                                <>
                                  <QuantitySelector
                                      quantity={quantity}
                                      handleQuantityMinusOne={
                                        handleQuantityMinusOne
                                      }
                                      handleQuantityPlusOne={
                                        handleQuantityPlusOne
                                      }
                                      stock={
                                        productDto.stock
                                      }
                                  />

                                  {renderAddToCartButton()}
                                </>
                            )

                            : (
                                <Button
                                    variant="danger"
                                    disabled
                                    className="ms-2"
                                >
                                  售罄!
                                </Button>
                            )
                      }

                    </Stack>


                    {
                        quantityIsExceedStock && (
                            <Alert
                                variant="danger"
                                className="my-3 w-50"
                            >
                              The quantity is exceeding stock,
                              please try again.
                            </Alert>
                        )
                    }

                  </Container>
              )

              : (
                  <LoadingContainer/>
              )
        }

      </>
  );
}