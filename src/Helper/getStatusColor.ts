import { Statuses } from "../Static";

const getStatusColor = (status: Statuses) => {
  return status === Statuses.CONFIRMED
    ? "primary"
    : status === Statuses.PENDING
    ? "secondary"
    : status === Statuses.CANCELLED
    ? "danger"
    : status === Statuses.COMPLETED
    ? "success"
    : status === Statuses.PROCESSING
    ? "info"
    : status === Statuses.READY && "warning";
};

export default getStatusColor;
