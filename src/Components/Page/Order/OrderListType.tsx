import { Order } from "../../../Interfaces";

export default interface OrderListType {
  isLoading: boolean;
  orderData: Order[];
}
