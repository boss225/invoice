export const API_URL_MENU =
  "https://script.google.com/macros/s/AKfycbwWKQ8aqyY0dEAu82l2lsg3usqLLnHhZ130F91xhfPcoydzcN18R4X8FLbfpAtJmvDgPg/exec";

export const parseToTimestamp = (str) => {
  const [timePart, datePart] = str.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const timestamp = new Date().getTime();
  return { day, month, year, timestamp };
};

export const formatCurrencyVND = (value) => {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch (_e) {
    return `${(value || 0).toLocaleString()} đ`;
  }
};

export const formatNumber = (value) => {
  return (value || 0).toLocaleString("vi-VN");
};
