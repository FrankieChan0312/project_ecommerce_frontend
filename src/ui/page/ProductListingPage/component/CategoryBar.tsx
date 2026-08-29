import {
  Button,
  Spinner
} from "react-bootstrap";

import {
  useEffect,
  useState
} from "react";

import {useNavigate} from "@tanstack/react-router";

import type {
  CategoryDto
} from "../../../../data/category/category.type.ts";

import {
  getAllCategories
} from "../../../../api/categoryApi.ts";

import "./CategoryBar.css";


interface Props {
  selectedCategoryId?: number;
  onCategoryChange: (categoryId?: number) => void;
}


export default function CategoryBar({
                                      selectedCategoryId,
                                      onCategoryChange
                                    }: Props) {

  const [categories, setCategories] =
      useState<CategoryDto[]>([]);

  const [isLoading, setIsLoading] =
      useState(true);

  const navigate =
      useNavigate({from: "/"});


  useEffect(() => {

    const fetchCategories =
        async () => {

          try {

            const responseData =
                await getAllCategories();


            // Keep category buttons in database ID order
            // so their display order remains stable.
            const sortedCategories =
                [...responseData].sort(
                    (a, b) =>
                        a.categoryId
                        - b.categoryId
                );


            setCategories(
                sortedCategories
            );

          } catch {

            void navigate({
              to: "/error"
            });

          } finally {

            setIsLoading(false);
          }
        };


    void fetchCategories();

  }, [navigate]);


  if (isLoading) {

    return (
        <div className="category-bar-loading">

          <Spinner
              animation="border"
              size="sm"
          />

        </div>
    );
  }


  return (
      <div className="category-bar">

        {/* undefined represents the default "all products" filter. */}
        <Button
            className={
              selectedCategoryId === undefined
                  ? "category-button active"
                  : "category-button"
            }
            onClick={() => {
              onCategoryChange(undefined);
            }}
        >
          全部
        </Button>


        {
          categories.map(
              (category) => (

                  <Button
                      key={category.categoryId}
                      className={
                        selectedCategoryId === category.categoryId
                            ? "category-button active"
                            : "category-button"
                      }
                      onClick={() => {
                        onCategoryChange(
                            category.categoryId
                        );
                      }}
                  >
                    {category.name}
                  </Button>

              )
          )
        }

      </div>
  );
}