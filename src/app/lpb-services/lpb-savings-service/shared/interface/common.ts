export interface Product {
  code: string;
  name: string;
  type?: string;
}

export interface ReceiptJson {
  total: number | string;
  receipts: { quantity: number; denomination: number; amount: number }[];
}
