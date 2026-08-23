import {Button, Container, Stack} from "react-bootstrap";
import TopNavBar from "../../component/TopNavBar.tsx";
import QuantitySelector from "../../component/QuantitySelector.tsx";
import {useEffect, useState} from "react";
import type {ProductDetailDto} from "../../../data/product/product.type.ts";
import {useNavigate, useParams} from "@tanstack/react-router";
// import mockData from "./response.json"
import LoadingContainer from "../../component/LoadingContainer.tsx";
import {getProductByPid} from "../../../api/productApi.ts";

export default function ProductDetailPage() {
  const {productId}= useParams({from:"/product/$productId"});
  const [productDto, setProductDto] = useState<ProductDetailDto |undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate({from: "/"});
  const [quantity, setQuantity] = useState(1);
  const handleQuantityMinusOne=() =>
  {
    if (quantity > 1) {
      setQuantity((prevState) => (prevState - 1))
    }
  }
  const handleQuantityPlusOne=() =>
  {
    if (productDto && quantity < productDto.stock) {
      setQuantity((prevState) => (prevState + 1))
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const responseData = await getProductByPid(productId);
        setProductDto(responseData);
        setIsLoading(false);

      } catch {
        void navigate({to: "/error"})
      }
    }
    void fetchProduct();
  }, [])

  return (
      <>
        <TopNavBar/>
        {
          productDto && !isLoading
              ? (
                  <Container>
                    <img
                        style={{height: "300px"}}
                        src={productDto.imageUrl}
                        alt="product"
                    />
                    <h3> {productDto.name}</h3>
                    <h5 style={{whiteSpace: 'pre-line'}}>
                      {productDto.description}
                    </h5>
                    <Stack direction={"horizontal"}>

                      {
                        productDto.stock
                            ? (
                                <>
                                  <QuantitySelector
                                      quantity={quantity}
                                      handleQuantityMinusOne={handleQuantityMinusOne}
                                      handleQuantityPlusOne={handleQuantityPlusOne}
                                      stock={productDto.stock}
                                  />
                                  <Button className="ms-2">加入購物車</Button>
                                </>
                            ) : (
                                <Button variant="danger" disabled className="ms-2">售罄!</Button>
                            )
                      }
                    </Stack>
                  </Container>
              ) : (
                  <LoadingContainer/>
              )
        }
      </>
  )
}