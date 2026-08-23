export interface GetAllProductDto {
  hasStock: boolean;
  imageUrl: string;
  name: string;
  pid: number;
  price: number;
}

export interface ProductDetailDto {
  description: string;
  imageUrl:    string;
  name:        string;
  pid:         number;
  price:       number;
  stock:       number;
}
