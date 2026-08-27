import {
  Col,
  Pagination,
  Row
} from "react-bootstrap";

import ProductCard from "./ProductCard.tsx";

import {
  useEffect,
  useRef,
  useState
} from "react";

import type {
  GetAllProductDto
} from "../../../../data/product/product.type.ts";

import {useNavigate} from "@tanstack/react-router";

import LoadingContainer from "../../../component/LoadingContainer.tsx";

import {
  getAllProduct
} from "../../../../api/productApi.ts";
import "./ProductCardContainer.css";

interface Props {
  categoryId?: number;
  searchKeyword?: string;
  favoritePids: Set<number>;
  pendingFavoritePids: Set<number>;
  onToggleFavorite: (pid: number) => Promise<void>;
}


const ITEMS_PER_PAGE = 12;


export default function ProductCardContainer({
                                               categoryId,
                                               searchKeyword,
                                               favoritePids,
                                               pendingFavoritePids,
                                               onToggleFavorite
                                             }: Props) {

  const [dtoList, setDtoList] =
      useState<GetAllProductDto[] | undefined>(
          undefined
      );

  const [isLoading, setIsLoading] =
      useState(true);

  const [currentPage, setCurrentPage] =
      useState(1);

  const productListRef =
      useRef<HTMLDivElement | null>(null);

  const navigate =
      useNavigate({from: "/"});

  const handlePageChange = (
      pageNumber: number
  ) => {

    setCurrentPage(pageNumber);

    window.setTimeout(() => {

      productListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 0);
  };

  // =========================
  // Fetch products
  // =========================

  useEffect(() => {

    let isCancelled = false;

    setCurrentPage(1);

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

          void navigate({
            to: "/error"
          });
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

  }, [
    categoryId,
    searchKeyword,
    navigate
  ]);


  // =========================
  // Pagination calculation
  // =========================

  const totalPages =
      dtoList
          ? Math.ceil(
              dtoList.length / ITEMS_PER_PAGE
          )
          : 0;


  const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;


  const currentPageDtoList =
      dtoList
          ? dtoList.slice(
              startIndex,
              startIndex + ITEMS_PER_PAGE
          )
          : [];


  // =========================
  // Loading
  // =========================

  if (isLoading || !dtoList) {

    return <LoadingContainer/>;
  }


  // =========================
  // Product list
  // =========================

  return (
      <>
        <div className="product-list-summary">

  <span>
    共 {dtoList.length} 件商品
  </span>

          {
              totalPages > 1 && (
                  <span>
          第 {currentPage} / {totalPages} 頁
        </span>
              )
          }

        </div>
        <div ref={productListRef}>

          <Row className="product-list-anchor">

            {
              currentPageDtoList.map(
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
                            isFavorite={
                              favoritePids.has(dto.pid)
                            }
                            isFavoriteUpdating={
                              pendingFavoritePids.has(dto.pid)
                            }
                            onToggleFavorite={
                              onToggleFavorite
                            }
                        />

                      </Col>

                  )
              )
            }

          </Row>

        </div>


        {
            totalPages > 1 && (

                <div className="d-flex justify-content-center my-4">

                  <Pagination className="product-pagination">

                    <Pagination.First
                        disabled={currentPage === 1}
                        onClick={() => {
                          handlePageChange(1);
                        }}
                    />


                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => {

                          handlePageChange(
                              Math.max(
                                  currentPage - 1,
                                  1
                              )
                          );

                        }}
                    />


                    {
                      Array.from(
                          {
                            length: totalPages
                          },
                          (_, index) => {

                            const pageNumber =
                                index + 1;

                            return (

                                <Pagination.Item
                                    key={pageNumber}
                                    active={
                                        currentPage === pageNumber
                                    }
                                    onClick={() => {
                                      handlePageChange(
                                          pageNumber
                                      );
                                    }}
                                >
                                  {pageNumber}
                                </Pagination.Item>

                            );
                          }
                      )
                    }


                    <Pagination.Next
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() => {

                          handlePageChange(
                              Math.min(
                                  currentPage + 1,
                                  totalPages
                              )
                          );

                        }}
                    />


                    <Pagination.Last
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() => {
                          handlePageChange(
                              totalPages
                          );
                        }}
                    />

                  </Pagination>

                </div>
            )
        }

      </>
  );
}