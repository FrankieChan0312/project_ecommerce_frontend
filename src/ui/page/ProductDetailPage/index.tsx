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

import {CartContext} from "../../../context/CartContext.tsx";

import {
  putCartItem
} from "../../../api/cartItemApi.ts";


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
  ] = useState(false);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  const [quantity, setQuantity] =
      useState(1);

  const loginUser =
      useContext(LoginUserContext);

  const cartContext = useContext(CartContext);

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

        setIsAddingToCart(true)
        setAddToCartSuccess(false);
        await putCartItem(
            productDto.pid,
            quantity
        );
        await cartContext?.refreshCartItemCount();
        setIsAddingToCart(false);
        setAddToCartSuccess(true);

        setTimeout(
            () => {
              setAddToCartSuccess(false);
            }, 2000
        );

    } catch (err) {
      setIsAddingToCart(false);
      if (
          err instanceof AxiosError &&
          err.response?.status === 400
      ) {

        setQuantityIsExceedStock(true);

        setTimeout(
            () => {
              setQuantityIsExceedStock(false);
            }, 5000
        )

      } else {

        void navigate({
          to: "/error"
        });
      }
    }
  };

  const renderAddToCartButton = () => {
    if (isAddingToCart) {
      return (
          <Button className="ms-2" disabled>幫緊你!</Button>
      )
    }
    if (addToCartSuccess) {
      return (
          <Button className="ms-2" disabled variant="success">成功了!</Button>
      )
    }
    return <Button
        className="ms-2"
        onClick={
          handlePutCartItem
        }
    >
      加入購物車
    </Button>
  }

  useEffect(() => {

    const fetchProduct = async () => {

      setIsLoading(true);

      try {

        const responseData =
            await getProductByPid(productId);

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

  }, [productId, navigate]);


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