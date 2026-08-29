import {
  Col,
  Container,
  Row,
  Spinner
} from "react-bootstrap";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  Link
} from "@tanstack/react-router";

import {
  LoginUserContext
} from "../../../context/LoginUserContext.tsx";

import {
  getFavorites,
  removeFavorite
} from "../../../api/favoriteApi.ts";

import type {
  FavoriteDto
} from "../../../data/favorite/favorite.type.ts";

import ProductCard
  from "../ProductListingPage/component/ProductCard.tsx";

import TopNavBar
  from "../../component/TopNavBar.tsx";

import "./FavoritesPage.css";


export default function FavoritesPage() {

  const loginUser =
      useContext(LoginUserContext);


  const [
    favoriteDtoList,
    setFavoriteDtoList
  ] =
      useState<FavoriteDto[]>([]);


  const [isLoading, setIsLoading] =
      useState(true);


  // Track products whose remove-favorite requests
  // are currently waiting for a backend response.
  const [
    pendingFavoritePids,
    setPendingFavoritePids
  ] =
      useState<Set<number>>(
          new Set()
      );


  // =========================
  // Load favorites
  // =========================

  useEffect(() => {

    const fetchFavorites =
        async () => {

          // Favorites belong to authenticated users.
          // Clear any previous user's favorites after logout.
          if (!loginUser) {

            setFavoriteDtoList([]);
            setIsLoading(false);

            return;
          }


          setIsLoading(true);


          try {

            // Load only the favorites belonging
            // to the currently authenticated user.
            const responseData =
                await getFavorites();

            setFavoriteDtoList(
                responseData
            );

          } catch (error) {

            console.error(
                "Failed to load favorites:",
                error
            );

          } finally {

            setIsLoading(false);
          }
        };


    void fetchFavorites();

  }, [loginUser]);


  // =========================
  // Remove favorite
  // =========================

  const handleRemoveFavorite =
      async (
          pid: number
      ) => {

        // Ignore repeated clicks while the same product
        // is already waiting for its DELETE request.
        if (
            pendingFavoritePids.has(pid)
        ) {

          return;
        }


        const removedFavorite =
            favoriteDtoList.find(
                (favorite) =>
                    favorite.pid === pid
            );


        if (!removedFavorite) {
          return;
        }


        // Remember the original position so a failed DELETE
        // can restore the product to approximately the same place.
        const removedIndex =
            favoriteDtoList.findIndex(
                (favorite) =>
                    favorite.pid === pid
            );


        // Mark this product as pending so its heart button
        // cannot be repeatedly clicked during the request.
        setPendingFavoritePids(
            (prevState) => {

              const updatedPids =
                  new Set(prevState);

              updatedPids.add(pid);

              return updatedPids;
            }
        );


        // Optimistic UI:
        // remove the product immediately instead of waiting
        // for the backend response.
        setFavoriteDtoList(
            (prevState) =>
                prevState.filter(
                    (favorite) =>
                        favorite.pid !== pid
                )
        );


        try {

          await removeFavorite(pid);

        } catch (error) {

          console.error(
              "Failed to remove favorite:",
              error
          );


          // Roll back the optimistic UI update
          // when the backend DELETE request fails.
          setFavoriteDtoList(
              (prevState) => {

                // Avoid adding the product twice
                // if it has already been restored.
                if (
                    prevState.some(
                        (favorite) =>
                            favorite.pid === pid
                    )
                ) {

                  return prevState;
                }


                const updatedList =
                    [...prevState];


                const insertIndex =
                    Math.min(
                        removedIndex,
                        updatedList.length
                    );


                updatedList.splice(
                    insertIndex,
                    0,
                    removedFavorite
                );


                return updatedList;
              }
          );


          alert(
              "取消收藏失敗，請稍後再試"
          );

        } finally {

          // Release the pending state regardless
          // of whether the request succeeds or fails.
          setPendingFavoritePids(
              (prevState) => {

                const updatedPids =
                    new Set(prevState);

                updatedPids.delete(pid);

                return updatedPids;
              }
          );
        }
      };


  return (
      <>
        <TopNavBar
            showSearch={false}
            showFavorite={false}
        />


        <Container className="py-4">

          {
            // undefined means Firebase is still checking
            // the current authentication state.
            loginUser === undefined
                ? (
                    <div className="py-5 text-center">

                      <Spinner
                          animation="border"
                      />

                    </div>
                )


                // null means authentication checking has finished
                // and no user is currently logged in.
                : loginUser === null
                    ? (
                        <div className="py-5 text-center">

                          <h1>
                            我的收藏
                          </h1>


                          <p className="mt-3">
                            請先登入後查看你的收藏商品。
                          </p>


                          <Link
                              to="/login"
                              className="btn favorites-primary-button"
                          >
                            Login
                          </Link>

                        </div>
                    )


                    : isLoading
                        ? (
                            <div className="py-5 text-center">

                              <Spinner
                                  animation="border"
                              />

                            </div>
                        )


                        : (
                            <>
                              <h1 className="mb-4">
                                我的收藏
                              </h1>


                              {
                                favoriteDtoList.length === 0
                                    ? (
                                        <div className="text-center py-5">

                                          <h4>
                                            你暫時未有收藏商品
                                          </h4>


                                          <p>
                                            返回商品頁按 ♡ 收藏你喜歡的商品。
                                          </p>


                                          <Link
                                              to="/"
                                              className="btn favorites-primary-button"
                                          >
                                            瀏覽商品
                                          </Link>

                                        </div>
                                    )


                                    : (
                                        <Row>

                                          {
                                            favoriteDtoList.map(
                                                (dto) => (

                                                    <Col
                                                        key={dto.pid}
                                                        className="d-flex my-2"
                                                        xs={12}
                                                        md={6}
                                                        lg={4}
                                                        xl={3}
                                                    >

                                                      {/* FavoritesPage reuses the same ProductCard
                                                          component as the homepage. Every product
                                                          on this page starts in the favorite state. */}
                                                      <ProductCard
                                                          dto={dto}
                                                          isFavorite={
                                                            true
                                                          }
                                                          isFavoriteUpdating={
                                                            pendingFavoritePids.has(
                                                                dto.pid
                                                            )
                                                          }
                                                          onToggleFavorite={
                                                            handleRemoveFavorite
                                                          }
                                                      />

                                                    </Col>

                                                )
                                            )
                                          }

                                        </Row>
                                    )
                              }

                            </>
                        )
          }

        </Container>
      </>
  );
}