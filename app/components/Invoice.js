"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { parseToTimestamp } from "./helper";
import "../globals.css";

const InvoiceContent = React.forwardRef((props, ref) => {
  const date = new Date().toLocaleString("vi-VN");
  const { day, month, timestamp } = parseToTimestamp(date);
  const discount = props.discount;

  const subtotal = props.data.reduce((sum, item) => {
    const lineTotal = item.qty * item.price;
    return sum + lineTotal;
  }, 0);

  const total = subtotal - discount;

  const invoiceInfo = {
    shopName: "BẾP MẸ MÂY",
    invoiceId: timestamp,
    date,
    address: props.address || "Lễ tân",
    items: props.data,
    subtotal,
    qrUrl: `https://img.vietqr.io/image/vcb-vinh220592-qr_only.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`,
  };

  return (
    <div ref={ref} className="invoice">
      <h3 className="text-center">{invoiceInfo.shopName}</h3>
      <h4 className="text-center">HÓA ĐƠN THANH TOÁN</h4>
      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Số:</strong>
        </p>{" "}
        <p>{invoiceInfo.invoiceId}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Điện thoại:</strong>
        </p>
        <p>0916.320.245</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Ngày:</strong>
        </p>{" "}
        <p>{invoiceInfo.date}</p>
      </div>
      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Địa chỉ:</strong>
        </p>{" "}
        <p><strong>{props.address}</strong></p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>SL</th>
            <th>ĐG</th>
            <th>TT</th>
          </tr>
        </thead>
        <tbody>
          {invoiceInfo.items.map((item, i) => {
            const lineTotal = item.qty * item.price;
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price.toLocaleString()}</td>
                <td>{lineTotal.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Tổng tiền:</strong>
        </p>{" "}
        <p>{invoiceInfo.subtotal.toLocaleString()}đ</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Giảm giá:</strong>
        </p>{" "}
        <p>{discount.toLocaleString()}đ</p>
      </div>
      <hr />
      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Tổng thanh toán:</strong>
        </p>{" "}
        <p>
          <strong>{total.toLocaleString()}đ</strong>
        </p>
      </div>
      <div className="qr-container">
        <Image
          src={invoiceInfo.qrUrl}
          alt="QR Thanh toán"
          width={200}
          height={200}
        />
        <p>Quét mã để thanh toán</p>
      </div>
    </div>
  );
});

const Invoice = (props) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div style={{ textAlign: "center" }}>
      <InvoiceContent ref={contentRef} {...props} />
      <div
        className="d-flex justify-content-center mt-2"
        style={{ gap: "1rem" }}
      >
        <button onClick={() => props.setViewInvoice(false)}>
          Quay lại menu
        </button>
        <button
          onClick={() => {
            setIsPrinting(true);
            setTimeout(() => {
              reactToPrintFn();
              setIsPrinting(false);
            }, 100);
          }}
        >
          In hóa đơn
        </button>
      </div>
    </div>
  );
};

export default Invoice;
