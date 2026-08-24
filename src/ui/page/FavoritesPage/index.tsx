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

import {Link} from "@tanstack/react-router";

import {LoginUserContext} from "../../../context/LoginUserContext.tsx";
import {
  getFavorites,
  removeFavorite
} from "../../../api/favoriteApi.ts";

import type {
  FavoriteDto
} from "../../../data/favorite/favorite.type.ts";

import ProductCard from "../ProductListingPage/component/ProductCard.tsx";
import TopNavBar from "../../component/TopNavBar.tsx";

export default function FavoritesPage() {

  const loginUser =
      useContext(LoginUserContext);

  const [favoriteDtoList, setFavoriteDtoList] =
      useState<FavoriteDto[]>([]);

  const [isLoading, setIsLoading] =
      useState(true);

  const [pendingFavoritePids, setPendingFavoritePids] =
      useState<Set<number>>(new Set());

  useEffect(() => {

    const fetchFavorites = async () => {

      if (!loginUser) {
        setFavoriteDtoList([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {

        const responseData =
            await getFavorites();

        setFavoriteDtoList(responseData);

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

  const handleRemoveFavorite = async (pid: number) => {

    if (pendingFavoritePids.has(pid)) {
      return;
    }

    const removedFavorite =
        favoriteDtoList.find(
            (favorite) => favorite.pid === pid
        );

    if (!removedFavorite) {
      return;
    }

    const removedIndex =
        favoriteDtoList.findIndex(
            (favorite) => favorite.pid === pid
        );


    // 防止同一商品重複 click
    setPendingFavoritePids((prevState) => {

      const updatedPids =
          new Set(prevState);

      updatedPids.add(pid);

      return updatedPids;
    });


    // Optimistic UI：
    // 先立即從畫面移除
    setFavoriteDtoList((prevState) =>
        prevState.filter(
            (favorite) => favorite.pid !== pid
        )
    );


    try {

      await removeFavorite(pid);

    } catch (error) {

      console.error(
          "Failed to remove favorite:",
          error
      );


      // DELETE 失敗 → rollback
      setFavoriteDtoList((prevState) => {

        if (
            prevState.some(
                (favorite) => favorite.pid === pid
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
      });

      alert("取消收藏失敗，請稍後再試");

    } finally {

      setPendingFavoritePids((prevState) => {

        const updatedPids =
            new Set(prevState);

        updatedPids.delete(pid);

        return updatedPids;
      });
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
            loginUser === undefined
                ? (
                    <div className="py-5 text-center">
                      <Spinner animation="border"/>
                    </div>
                )

                : loginUser === null
                    ? (
                        <div className="py-5 text-center">

                          <h1>我的收藏</h1>

                          <p className="mt-3">
                            請先登入後查看你的收藏商品。
                          </p>

                          <Link
                              to="/login"
                              className="btn btn-primary"
                          >
                            Login
                          </Link>

                        </div>
                    )

                    : isLoading
                        ? (
                            <div className="py-5 text-center">
                              <Spinner animation="border"/>
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
                                              className="btn btn-primary"
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
                                                      <ProductCard
                                                          dto={dto}
                                                          isFavorite={true}
                                                          isFavoriteUpdating={
                                                            pendingFavoritePids.has(dto.pid)
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