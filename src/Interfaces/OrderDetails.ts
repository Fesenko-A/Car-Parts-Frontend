import Product from "./Product";

export default interface OrderDetails {
  orderId?: number;
  orderDetailsId?: number;
  productId?: number;
  product?: Product;
  quantity?: number;
  itemName?: string;
  price?: number;
}
