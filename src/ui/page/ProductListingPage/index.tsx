import {Container} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";

import {LoginUserContext} from "../../../context/LoginUserContext.tsx";
import {
  addFavorite,
  getFavorites,
  removeFavorite
} from "../../../api/favoriteApi.ts";

import TopNavBar from "../../component/TopNavBar.tsx";
import ProductCardContainer from "./component/ProductCardContainer.tsx";
import CategoryBar from "./component/CategoryBar.tsx";


export default function ProductListingPage() {

  const loginUser = useContext(LoginUserContext);

  const [selectedCategoryId, setSelectedCategoryId] =
      useState<number | undefined>(undefined);

  const [searchKeyword, setSearchKeyword] =
      useState("");

  const [debouncedSearchKeyword, setDebouncedSearchKeyword] =
      useState("");

  const [favoritePids, setFavoritePids] =
      useState<Set<number>>(new Set());

  const [pendingFavoritePids, setPendingFavoritePids] =
      useState<Set<number>>(new Set());

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };


  // Search debounce
  useEffect(() => {

    const timeoutId = window.setTimeout(() => {

      setDebouncedSearchKeyword(
          searchKeyword.trim()
      );

    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };

  }, [searchKeyword]);


  // Load logged-in user's favorites
  useEffect(() => {

    const fetchFavorites = async () => {

      if (!loginUser) {
        setFavoritePids(new Set());
        return;
      }

      try {

        const favoriteDtoList =
            await getFavorites();

        const pidSet =
            new Set(
                favoriteDtoList.map(
                    (favorite) => favorite.pid
                )
            );

        setFavoritePids(pidSet);

      } catch (error) {

        console.error(
            "Failed to load favorites:",
            error
        );
      }
    };

    void fetchFavorites();

  }, [loginUser]);

  const handleToggleFavorite = async (pid: number) => {

    if (!loginUser) {
      alert("請先登入後再使用收藏功能");
      return;
    }

    // 同一件商品仲處理緊，就忽略再次 click
    if (pendingFavoritePids.has(pid)) {
      return;
    }

    const wasFavorite = favoritePids.has(pid);


    // 標記為 processing
    setPendingFavoritePids((prevState) => {

      const updatedPids =
          new Set(prevState);

      updatedPids.add(pid);

      return updatedPids;
    });


    // Optimistic UI
    setFavoritePids((prevState) => {

      const updatedPids =
          new Set(prevState);

      if (wasFavorite) {
        updatedPids.delete(pid);
      } else {
        updatedPids.add(pid);
      }

      return updatedPids;
    });


    try {

      if (wasFavorite) {
        await removeFavorite(pid);
      } else {
        await addFavorite(pid);
      }

    } catch (error) {

      console.error(
          "Failed to update favorite:",
          error
      );


      // Backend 失敗 → rollback
      setFavoritePids((prevState) => {

        const updatedPids =
            new Set(prevState);

        if (wasFavorite) {
          updatedPids.add(pid);
        } else {
          updatedPids.delete(pid);
        }

        return updatedPids;
      });

      alert("收藏更新失敗，請稍後再試");

    } finally {

      // request 完成，解除 protection
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
            searchKeyword={searchKeyword}
            onSearch={handleSearch}
        />

        <Container>

          <CategoryBar
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
          />

          <ProductCardContainer
              categoryId={selectedCategoryId}
              searchKeyword={debouncedSearchKeyword}
              favoritePids={favoritePids}
              pendingFavoritePids={pendingFavoritePids}
              onToggleFavorite={handleToggleFavorite}
          />

        </Container>
      </>
  );
}