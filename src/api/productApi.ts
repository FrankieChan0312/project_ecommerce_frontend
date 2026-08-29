import axios from "axios";

import type {
  GetAllProductDto,
  ProductDetailDto
} from "../data/product/product.type.ts";

export const baseUrl =
    "http://localhost:8080";


export async function getAllProduct(
    categoryId?: number,
    keyword?: string
) {

  // The same public endpoint supports the default product list,
  // category filtering, keyword search, and combined filtering.
  //
  // Undefined parameters are omitted from the request so the backend
  // can decide which product query mode to use.
  const response =
      await axios.get<GetAllProductDto[]>(
          `${baseUrl}/public/products`,
          {
            params: {
              categoryId,
              keyword: keyword || undefined
            }
          }
      );

  return response.data;
}


export async function getProductByPid(
    pid: string
) {

  // Product detail is public and therefore does not require
  // a Firebase authentication token.
  const response =
      await axios.get<ProductDetailDto>(
          `${baseUrl}/public/products/${pid}`
      );

  return response.data;
}