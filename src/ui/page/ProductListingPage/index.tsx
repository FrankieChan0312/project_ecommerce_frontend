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

  const loginUser =
      useContext(LoginUserContext);


  const [selectedCategoryId, setSelectedCategoryId] =
      useState<number | undefined>(
          undefined
      );


  const [searchKeyword, setSearchKeyword] =
      useState("");


  const [
    debouncedSearchKeyword,
    setDebouncedSearchKeyword
  ] =
      useState("");


  // Store favorite product IDs in a Set for fast lookup
  // when rendering the favorite state of each product card.
  const [favoritePids, setFavoritePids] =
      useState<Set<number>>(
          new Set()
      );


  // Track favorite requests that are currently in progress.
  // This prevents repeated clicks from sending duplicate requests.
  const [pendingFavoritePids, setPendingFavoritePids] =
      useState<Set<number>>(
          new Set()
      );


  const handleSearch = (
      keyword: string
  ) => {

    setSearchKeyword(keyword);
  };


  // =========================
  // Search debounce
  // =========================

  useEffect(() => {

    // Wait briefly before sending the keyword to ProductCardContainer.
    // This prevents an API request from being triggered for every keystroke.
    const timeoutId =
        window.setTimeout(() => {

          setDebouncedSearchKeyword(
              searchKeyword.trim()
          );

        }, 300);


    // Cancel the previous timer whenever the user types again
    // before the 300 ms delay has completed.
    return () => {

      window.clearTimeout(
          timeoutId
      );
    };

  }, [searchKeyword]);


  // =========================
  // Load favorites
  // =========================

  useEffect(() => {

    const fetchFavorites =
        async () => {

          // Favorites belong to authenticated users.
          // Clear any previous favorite state after logout.
          if (!loginUser) {

            setFavoritePids(
                new Set()
            );

            return;
          }


          try {

            const favoriteDtoList =
                await getFavorites();


            // Convert the API response into a Set of product IDs
            // so ProductCard can check favorite status efficiently.
            const pidSet =
                new Set(
                    favoriteDtoList.map(
                        (favorite) =>
                            favorite.pid
                    )
                );


            setFavoritePids(
                pidSet
            );

          } catch (error) {

            console.error(
                "Failed to load favorites:",
                error
            );
          }
        };


    void fetchFavorites();

  }, [loginUser]);


  const handleToggleFavorite =
      async (
          pid: number
      ) => {

        if (!loginUser) {

          alert(
              "請先登入後再使用收藏功能"
          );

          return;
        }


        // Ignore repeated clicks while the same product
        // is already waiting for a favorite API response.
        if (
            pendingFavoritePids.has(pid)
        ) {

          return;
        }


        const wasFavorite =
            favoritePids.has(pid);


        // Mark this product as pending so the UI can disable
        // repeated favorite actions until the request finishes.
        setPendingFavoritePids(
            (prevState) => {

              const updatedPids =
                  new Set(prevState);

              updatedPids.add(pid);

              return updatedPids;
            }
        );


        // Optimistically update the heart immediately instead of waiting
        // for the backend, making the interaction feel more responsive.
        setFavoritePids(
            (prevState) => {

              const updatedPids =
                  new Set(prevState);

              if (wasFavorite) {

                updatedPids.delete(pid);

              } else {

                updatedPids.add(pid);
              }

              return updatedPids;
            }
        );


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


          // Roll back the optimistic UI update when
          // the backend request fails.
          setFavoritePids(
              (prevState) => {

                const updatedPids =
                    new Set(prevState);

                if (wasFavorite) {

                  updatedPids.add(pid);

                } else {

                  updatedPids.delete(pid);
                }

                return updatedPids;
              }
          );


          alert(
              "收藏更新失敗，請稍後再試"
          );

        } finally {

          // Release the pending state regardless of success or failure
          // so the user can interact with this product again.
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
            searchKeyword={searchKeyword}
            onSearch={handleSearch}
        />


        <Container>

          <CategoryBar
              selectedCategoryId={
                selectedCategoryId
              }
              onCategoryChange={
                setSelectedCategoryId
              }
          />


          <ProductCardContainer
              categoryId={
                selectedCategoryId
              }
              searchKeyword={
                debouncedSearchKeyword
              }
              favoritePids={
                favoritePids
              }
              pendingFavoritePids={
                pendingFavoritePids
              }
              onToggleFavorite={
                handleToggleFavorite
              }
          />

        </Container>
      </>
  );
}