export const parseToTimestamp = (str, useUTC = false) => {
  // Tách thành [time, date]
  const [timePart, datePart] = str.split(" ");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  const [day, month, year] = datePart.split("/").map(Number);
  let result = 0;
  if (useUTC) {
    // Trả timestamp theo UTC
    result = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  } else {
    // Trả timestamp theo local timezone của máy
    result = new Date(year, month - 1, day, hours, minutes, seconds).getTime();
  }
  return { day, month, year, timestamp: result / 1000 };
};
