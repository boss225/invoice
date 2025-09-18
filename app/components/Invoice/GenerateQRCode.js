import React, { useEffect, useCallback } from "react";
import { parseToTimestamp } from "../helper";

const GenerateQRCode = (props) => {
  const { discount = 0, data = [] } = props;
  const subtotal = data.reduce((sum, item) => {
    const lineTotal = (item.qty || 0) * (item.price || 0);
    return sum + lineTotal;
  }, 0);
  const date = new Date().toLocaleString("vi-VN");
  const { day, month, timestamp } = parseToTimestamp(date);
  const total = Math.max(0, subtotal - discount);

  const drawQRCode = useCallback(() => {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const qrUrl = `https://img.vietqr.io/image/vcb-0651000791618-h6uAjiQ.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 100, 100);
    };
    img.src = qrUrl;
  }, [data]);

  useEffect(() => {
    drawQRCode();
  }, [data]);

  return (
    <canvas
      id="qr-canvas"
      width="100"
      height="100"
      style={{ display: "block", margin: "0 auto" }}
    />
  );
};

export default GenerateQRCode;
