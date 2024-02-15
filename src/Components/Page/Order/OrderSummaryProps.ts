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
    orderDate?: Date;
    lastUpdate?: Date;
    paymentMethod?: string;
    paid?: boolean;
  };
  userInput: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}
