import CartItem from "./CartItem";

export default interface ShoppingCart {
  id?: number;
  userId?: string;
  cartItems?: CartItem[];
  cartTotal?: number;
}
