const getPageDetails = (
  pageNumber: number,
  pageSize: number,
  totalRecords: number
) => {
  const dataStartNumber = (pageNumber - 1) * pageSize + 1;

  const dataEndNumber = pageNumber * pageSize;

  return `${dataStartNumber} - ${
    dataEndNumber < totalRecords ? dataEndNumber : totalRecords
  } of ${totalRecords}`;
};

export default getPageDetails;
