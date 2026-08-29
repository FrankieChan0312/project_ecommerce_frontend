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


// Create a shuffled copy instead of mutating the API response.
// Fisher-Yates gives every product an equal chance of appearing
// earlier in the default homepage listing.
function shuffleProducts<T>(
    list: T[]
): T[] {

  const shuffledList = [...list];

  for (
      let i = shuffledList.length - 1;
      i > 0;
      i--
  ) {

    const randomIndex =
        Math.floor(
            Math.random() * (i + 1)
        );

    [
      shuffledList[i],
      shuffledList[randomIndex]
    ] = [
      shuffledList[randomIndex],
      shuffledList[i]
    ];
  }

  return shuffledList;
}


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


  // Track which category/search request produced the currently
  // displayed product list. A different key means new data is loading.
  const [loadedQueryKey, setLoadedQueryKey] =
      useState<string | null>(null);

  const queryKey =
      `${categoryId ?? "all"}|${searchKeyword?.trim() ?? ""}`;


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

    // Wait until React applies the new page state before scrolling
    // back to the top of the product list.
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

    // Prevent an older request from updating the UI after
    // the category/search criteria have already changed.
    let isCancelled = false;


    const fetchDtoList = async () => {

      try {

        const responseData =
            await getAllProduct(
                categoryId,
                searchKeyword
            );


        const isDefaultHomePage =
            categoryId === undefined &&
            !searchKeyword?.trim();


        if (!isCancelled) {

          // Shuffle only the default homepage so older, low-pid products
          // do not permanently occupy the first page.
          //
          // Search and category results keep their backend order
          // so filtering remains predictable for the user.
          setDtoList(
              isDefaultHomePage
                  ? shuffleProducts(responseData)
                  : responseData
          );


          // A new category or search always starts from page 1.
          setCurrentPage(1);

          // Mark this request as loaded so the loading screen
          // can be replaced by the new product list.
          setLoadedQueryKey(queryKey);
        }

      } catch {

        if (!isCancelled) {

          void navigate({
            to: "/error"
          });
        }
      }
    };


    void fetchDtoList();


    return () => {

      // Cleanup runs when the query changes or the component unmounts.
      // Any result from the previous request will then be ignored.
      isCancelled = true;
    };

  }, [
    categoryId,
    searchKeyword,
    navigate,
    queryKey
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


  // Pagination is handled locally after the complete product
  // result has been returned from the backend.
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

  // Keep showing the loading state until the data belongs
  // to the current category/search criteria.
  if (
      loadedQueryKey !== queryKey ||
      !dtoList
  ) {

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