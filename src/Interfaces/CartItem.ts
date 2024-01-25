import Product from "./Product";

export default interface CartItem {
  id?: number;
  productId?: number;
  product?: Product;
  quantity?: number;
  shoppingCartId?: number;
}
