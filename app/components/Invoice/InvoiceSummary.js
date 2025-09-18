"use client";
import React from "react";
import { Divider } from "antd";
import { formatCurrencyVND } from "../helper";

const InvoiceSummary = ({ subtotal, discount, total }) => {
  return (
    <>
      <div className="d-flex justify-content-between mt-2">
        <p>
          <strong>Tổng tiền:</strong>
        </p>
        <p>{formatCurrencyVND(subtotal)}</p>
      </div>

      <div className="d-flex justify-content-between">
        <p>
          <strong>Giảm giá:</strong>
        </p>
        <p>{formatCurrencyVND(discount)}</p>
      </div>

      <Divider className="mt-1 mb-1" />

      <div className="d-flex justify-content-between">
        <p>
          <strong>Tổng thanh toán:</strong>
        </p>
        <p>
          <strong>{formatCurrencyVND(total)}</strong>
        </p>
      </div>
    </>
  );
};

export default InvoiceSummary;


