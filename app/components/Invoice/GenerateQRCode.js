import React, { useEffect, useCallback, useState } from "react";
import { parseToTimestamp } from "../helper";
import { Spin } from "antd";

const GenerateQRCode = (props) => {
  const { discount = 0, data = [] } = props;
  const subtotal = data.reduce((sum, item) => {
    const lineTotal = (item.qty || 0) * (item.price || 0);
    return sum + lineTotal;
  }, 0);
  const date = new Date().toLocaleString("vi-VN");
  const { day, month, timestamp } = parseToTimestamp(date);
  const total = Math.max(0, subtotal - discount);

  const [qrGenerated, setQrGenerated] = useState("");

  const drawQRCode = useCallback(() => {
    const qrUrl = `https://img.vietqr.io/image/vcb-0651000791618-qr_only.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`;

    fetch(qrUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setQrGenerated(reader.result);
        reader.readAsDataURL(blob); // => base64 string
      });
  }, [data]);

  useEffect(() => drawQRCode(), [data]);

  if (!qrGenerated) return <Spin className="mt-2 mb-2" />;

  return (
    <img
      src={qrGenerated}
      width={100}
      height={100}
      alt="QR Thanh toán"
      crossOrigin="anonymous"
    />
  );
};

export default GenerateQRCode;
