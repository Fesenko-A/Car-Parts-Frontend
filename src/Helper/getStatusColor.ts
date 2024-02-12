import { OrderStatuses } from "../Static";

const getStatusColor = (status: OrderStatuses) => {
  return status === OrderStatuses.CONFIRMED
    ? "primary"
    : status === OrderStatuses.PENDING
    ? "secondary"
    : status === OrderStatuses.CANCELLED
    ? "danger"
    : status === OrderStatuses.COMPLETED
    ? "success"
    : status === OrderStatuses.PROCESSING
    ? "info"
    : status === OrderStatuses.READY && "warning";
};

export default getStatusColor;
