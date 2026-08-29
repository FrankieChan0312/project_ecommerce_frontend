import {
  Alert,
  Button,
  Container
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


  const [
    quantityIsExceedStock,
    setQuantityIsExceedStock
  ] =
      useState(false);


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

    if (quantity > 1) {

      setQuantity(
          (prevState) =>
              prevState - 1
      );

      setQuantityIsExceedStock(false);
    }
  };


  const handleQuantityPlusOne = () => {

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

    // Redirect unauthenticated users before calling
    // the protected shopping-cart API.
    if (loginUser === null) {

      void navigate({
        to: "/login"
      });

      return;
    }


    if (!loginUser || !productDto) {
      return;
    }


    try {

      setIsAddingToCart(true);
      setAddToCartSuccess(false);


      // PUT adds the selected quantity to any quantity
      // already stored for this product in the cart.
      await putCartItem(
          productDto.pid,
          quantity
      );


      // Synchronize the navbar cart badge after
      // the backend cart has been updated.
      await cartContext
          ?.refreshCartItemCount();


      setAddToCartSuccess(true);


      setTimeout(
          () => {
            setAddToCartSuccess(false);
          },
          2000
      );

    } catch (err) {

      // HTTP 400 may occur when stock has changed
      // since the product page was loaded.
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

        void navigate({
          to: "/error"
        });
      }

    } finally {

      setIsAddingToCart(false);
    }
  };


  const renderAddToCartButton = () => {

    if (isAddingToCart) {

      return (
          <Button
              className="product-detail-cart-button"
              disabled
          >
            正在加入...
          </Button>
      );
    }


    if (addToCartSuccess) {

      return (
          <Button
              className="product-detail-cart-button"
              disabled
          >
            ✓ 已加入購物車
          </Button>
      );
    }


    return (
        <Button
            className="product-detail-cart-button"
            onClick={() => {
              void handlePutCartItem();
            }}
        >
          加入購物車
        </Button>
    );
  };


  useEffect(() => {

    const fetchProduct =
        async () => {

          setIsLoading(true);


          try {

            const responseData =
                await getProductByPid(
                    productId
                );

            setProductDto(
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


    void fetchProduct();

  }, [
    productId,
    navigate
  ]);


  return (
      <>
        <TopNavBar
            showSearch={false}
        />


        {
          productDto && !isLoading
              ? (
                  <main className="product-detail-page">

                    <Container>


                      <Button
                          className="product-detail-back-button"
                          onClick={() => {
                            void navigate({
                              to: "/"
                            });
                          }}
                      >
                        ← 返回商品列表
                      </Button>


                      <div className="product-detail-card">


                        <div className="product-detail-image-section">

                          <img
                              className="product-detail-image"
                              src={productDto.imageUrl}
                              alt={productDto.name}
                          />

                        </div>


                        <section className="product-detail-info">


                          {
                              productDto.categoryName && (

                                  <div className="product-detail-category">
                                    {productDto.categoryName}
                                  </div>

                              )
                          }


                          <h1 className="product-detail-name">
                            {productDto.name}
                          </h1>


                          {
                              productDto.origin && (

                                  <div className="product-detail-origin">
                                    產地：{productDto.origin}
                                  </div>

                              )
                          }


                          <div className="product-detail-price">
                            HK$
                            {
                              productDto.price
                                  .toFixed(2)
                            }
                          </div>


                          <div
                              className={
                                productDto.stock > 0
                                    ? "product-detail-stock in-stock"
                                    : "product-detail-stock out-of-stock"
                              }
                          >

                            {
                              productDto.stock > 0
                                  ? `● 有貨 · 尚有 ${productDto.stock} 件`
                                  : "● 暫時售罄"
                            }

                          </div>


                          <hr className="product-detail-divider"/>


                          <div className="product-detail-description">

                            <h2>
                              商品介紹
                            </h2>


                            <p>
                              {productDto.description}
                            </p>

                          </div>


                          {
                            productDto.stock > 0
                                ? (
                                    <div className="product-detail-actions">

                                      <QuantitySelector
                                          quantity={
                                            quantity
                                          }
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

                                    </div>
                                )

                                : (
                                    <Button
                                        variant="danger"
                                        disabled
                                        className="product-detail-sold-out-button"
                                    >
                                      暫時售罄
                                    </Button>
                                )
                          }


                          {
                              quantityIsExceedStock && (

                                  <Alert
                                      variant="danger"
                                      className="product-detail-alert"
                                  >
                                    庫存數量已更新，請重新選擇購買數量。
                                  </Alert>

                              )
                          }


                          <div className="product-detail-delivery-note">
                            滿 HK$500 免費送貨
                          </div>


                        </section>

                      </div>

                    </Container>

                  </main>
              )

              : (
                  <LoadingContainer/>
              )
        }

      </>
  );
}