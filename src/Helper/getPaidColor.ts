const getPaidColor = (paid: boolean) => {
  return paid === true ? "success" : "danger";
};

export default getPaidColor;
