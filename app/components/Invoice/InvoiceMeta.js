"use client";
import React from "react";

const InvoiceMeta = ({ invoiceId, date, address }) => {
  return (
    <>
      <div className="d-flex justify-content-between mt-2">
        <p>
          <strong>Số:</strong>
        </p>
        <p>{invoiceId}</p>
      </div>

      <div className="d-flex justify-content-between">
        <p>
          <strong>Ngày:</strong>
        </p>
        <p>{date}</p>
      </div>

      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Nơi nhận:</strong>
        </p>
        <p>
          <strong>{address}</strong>
        </p>
      </div>
    </>
  );
};

export default InvoiceMeta;


