import { PaymentStatuses } from "../Static";
import Order from "./Order";

export default interface OnlinePayment {
  id?: number;
  orderId?: number;
  order?: Order;
  paymentId?: number;
  paymentStatus?: PaymentStatuses;
  paymentAmount?: number;
  paymentDate?: Date;
  lastUpdate?: Date;
  clientSecret?: string;
}
