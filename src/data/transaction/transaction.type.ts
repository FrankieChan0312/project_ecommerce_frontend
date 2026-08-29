export interface TransactionDto {
  tid:               number;
  buyerUid:          number;
  dateTime:          string;
  transactionStatus: string;
  total:             number;
  items:             TransactionProduct[];
}

export interface TransactionProduct {
  tpid:     number;
  product:  Product;
  quantity: number;
  subtotal: number;
}

export interface Product {
  pid:         number;
  name:        string;
  description: string;
  imageUrl:    string;
  price:       number;
  stock:       number;
}
