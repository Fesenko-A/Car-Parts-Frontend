import { Statuses } from "../Static";
import OrderDetails from "./OrderDetails";

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
  status?: Statuses;
  totalItems?: number;
  orderDetails?: OrderDetails[];
}
