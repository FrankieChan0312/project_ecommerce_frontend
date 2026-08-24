import axios from "axios";
import type {CategoryDto} from "../data/category/category.type.ts";
import {baseUrl} from "./productApi.ts";

export async function getAllCategories() {
  const response = await axios.get<CategoryDto[]>(
      `${baseUrl}/public/categories`
  );

  return response.data;
}