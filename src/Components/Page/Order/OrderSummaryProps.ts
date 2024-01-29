import { ShoppingCart } from "../../../Interfaces";
import { Statuses } from "../../../Static";

export interface OrderSummaryProps {
  data: {
    id?: number;
    cartItems?: ShoppingCart[];
    cartTotal?: number;
    userId?: string;
    paymentId?: string;
    status?: Statuses;
  };
  userInput: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}
