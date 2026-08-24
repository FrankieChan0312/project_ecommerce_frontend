import axios from "axios";
import type {GetAllProductDto, ProductDetailDto} from "../data/product/product.type.ts";

export const baseUrl ="http://localhost:8080";

export async function getAllProduct(
    categoryId?: number,
    keyword?: string
) {

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

export async function getProductByPid(pid:string) {
  const response = await axios.get<ProductDetailDto>(
      `${baseUrl}/public/products/${pid}`
  );
  return response.data;
}