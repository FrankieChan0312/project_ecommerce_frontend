import {Col, Row} from "react-bootstrap";
import ProductCard from "./ProductCard.tsx";
import {useEffect, useState} from "react";
import type {GetAllProductDto} from "../../../../data/product/product.type.ts";
import {useNavigate} from "@tanstack/react-router";
import LoadingContainer from "../../../component/LoadingContainer.tsx";
import {getAllProduct} from "../../../../api/productApi.ts";


interface Props {
  categoryId?: number;
  searchKeyword?: string;
  favoritePids: Set<number>;
  pendingFavoritePids: Set<number>;
  onToggleFavorite: (pid: number) => Promise<void>;
}

export default function ProductCardContainer({
                                               categoryId,
                                               searchKeyword,
                                               favoritePids,
                                               pendingFavoritePids,
                                               onToggleFavorite
                                             }: Props) {

  const [dtoList, setDtoList] =
      useState<GetAllProductDto[] | undefined>(undefined);

  const [isLoading, setIsLoading] =
      useState(true);

  const navigate =
      useNavigate({from: "/"});


  useEffect(() => {

    let isCancelled = false;

    const fetchDtoList = async () => {

      setIsLoading(true);

      try {

        const responseData =
            await getAllProduct(
                categoryId,
                searchKeyword
            );

        if (!isCancelled) {
          setDtoList(responseData);
        }

      } catch {

        if (!isCancelled) {
          void navigate({to: "/error"});
        }

      } finally {

        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchDtoList();

    return () => {
      isCancelled = true;
    };

  }, [categoryId, searchKeyword, navigate]);


  return (

      dtoList && !isLoading
          ? (
              <Row className="my-3">

                {
                  dtoList.map(
                      (dto) => (
                          <Col
                              key={dto.pid}
                              className="d-flex my-2"
                              xs={12}
                              md={6}
                              lg={4}
                              xl={3}
                          >
                            <ProductCard
                                dto={dto}
                                isFavorite={favoritePids.has(dto.pid)}
                                isFavoriteUpdating={pendingFavoritePids.has(dto.pid)}
                                onToggleFavorite={onToggleFavorite}
                            />
                          </Col>
                      )
                  )
                }

              </Row>
          )
          : (
              <LoadingContainer/>
          )
  );
}