"use client";
import React from "react";

const InvoiceHeader = ({ shopName }) => {
  return (
    <>
      <h3 className="text-center" style={{ fontWeight: 600 }}>
        {shopName}
      </h3>
      <p className="text-center">Liên hệ: 0916.320.245</p>
      <h4 className="text-center mt-1" style={{ fontWeight: 600 }}>
        HÓA ĐƠN THANH TOÁN
      </h4>
    </>
  );
};

export default InvoiceHeader;


