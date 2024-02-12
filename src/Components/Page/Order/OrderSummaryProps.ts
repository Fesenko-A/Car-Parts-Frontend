import { ShoppingCart } from "../../../Interfaces";
import { OrderStatuses } from "../../../Static";

export interface OrderSummaryProps {
  data: {
    id?: number;
    cartItems?: ShoppingCart[];
    cartTotal?: number;
    userId?: string;
    paymentId?: string;
    status?: OrderStatuses;
  };
  userInput: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}
