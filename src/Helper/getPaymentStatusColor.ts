import { PaymentStatuses } from "../Static";

const getPaymentStatusColor = (status: PaymentStatuses) => {
  return status === PaymentStatuses.PAID ? "success" : "danger";
};

export default getPaymentStatusColor;
