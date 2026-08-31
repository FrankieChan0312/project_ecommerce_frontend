import axios from "axios";

import type {
  CategoryDto
} from "../data/category/category.type.ts";

const baseUrl = import.meta.env.VITE_API_BASE_URL;


export async function getAllCategories() {

  // Category browsing is public, so no Firebase authentication
  // token is required for this request.
  //
  // The returned categories are used by the homepage
  // to build the product category filter.
  const response =
      await axios.get<CategoryDto[]>(
          `${baseUrl}/public/categories`
      );

  return response.data;
}