import {Col, Row} from "react-bootstrap";
import ProductCard from "./ProductCard.tsx";
import {useEffect, useState} from "react";
import type {GetAllProductDto} from "../../../../data/product/product.type.ts";
// import mockData from "./../response.json";
import {useNavigate} from "@tanstack/react-router";
import LoadingContainer from "../../../component/LoadingContainer.tsx";
import {getAllProduct} from "../../../../api/productApi.ts";

export default function ProductCardContainer() {

  const [dtoList, setDtoList] = useState<GetAllProductDto  [] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate({from: "/"});

  useEffect(() => {
    const fetchDtoList = async () => {
      try {
        const responseData=await getAllProduct();
        setDtoList(responseData);
        setIsLoading(false);
      } catch {
        void navigate({to: "/error"})

      }
    }

    void fetchDtoList();
  }, []);

  return (

      dtoList && !isLoading
          ? (

              <Row className={"my-3"}>
                {
                    dtoList && !isLoading &&

                    dtoList.map(
                        (dto) => (
                            <Col
                                key={dto.pid}
                                className="d-flex my-2"
                                xs={12} md={6} lg={4} xl={3}
                            >
                              <ProductCard dto={dto}/>
                            </Col>
                        )
                    )
                }
              </Row>
          ) : (
              <LoadingContainer/>

          )
  )
}