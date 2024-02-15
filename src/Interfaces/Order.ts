import { OrderStatuses } from "../Static";
import OrderDetails from "./OrderDetails";
import PaymentMethod from "./PaymentMethod";

export default interface Order {
  orderId?: number;
  pickupName?: string;
  pickupPhoneNumber?: string;
  pickupEmail?: string;
  userId?: string;
  user?: any;
  orderTotal?: number;
  orderDate?: Date;
  paymentId?: string;
  status?: OrderStatuses;
  totalItems?: number;
  paymentMethodId?: number;
  paymentMethod?: PaymentMethod;
  lastUpdate?: Date;
  orderDetails?: OrderDetails[];
}
