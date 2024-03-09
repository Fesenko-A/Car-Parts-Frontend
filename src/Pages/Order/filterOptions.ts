import { OrderStatuses } from "../../Static";

const filterOptions = [
  "All",
  OrderStatuses.PENDING,
  OrderStatuses.CONFIRMED,
  OrderStatuses.PROCESSING,
  OrderStatuses.READY,
  OrderStatuses.COMPLETED,
  OrderStatuses.CANCELLED,
];

export default filterOptions;
