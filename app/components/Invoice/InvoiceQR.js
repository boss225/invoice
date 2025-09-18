"use client";
import React from "react";

const InvoiceQR = ({ qrUrl }) => {
  return (
    <div className="qr-container">
      <img
        src={qrUrl}
        width={100}
        height={100}
        alt="QR Thanh toán"
        crossOrigin="anonymous"
      />
      <p>Quét mã để thanh toán</p>
    </div>
  );
};

export default InvoiceQR;


