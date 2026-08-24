export interface GetAllProductDto {
  pid: number;
  name: string;
  imageUrl: string;
  price: number;
  hasStock: boolean;

  categoryId: number | null;
  categoryName: string | null;
  origin: string | null;
}

export interface ProductDetailDto {
  pid: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;

  categoryId: number | null;
  categoryName: string | null;
  origin: string | null;
}
