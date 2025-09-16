export const parseToTimestamp = (str) => {
  const [timePart, datePart] = str.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const timestamp = new Date().getTime();
  return { day, month, year, timestamp };
};
