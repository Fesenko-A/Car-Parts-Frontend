import { OnlinePayment } from "../../../Interfaces";

export default interface OnlinePaymentListType {
  isLoading: boolean;
  paymentData: OnlinePayment[];
}
