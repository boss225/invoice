"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../globals.css";

const InvoiceContent = React.forwardRef((props, ref) => {
  const discount = 1000;
  const items = [
    { name: "Món 1", qty: 1, price: 33000 },
    { name: "Món 2", qty: 1, price: 17000 },
    { name: "Món 3", qty: 1, price: 58000 },
    { name: "Món 4", qty: 1, price: 25000 },
    { name: "Món 5", qty: 1, price: 68000 },
    { name: "Món 6", qty: 1, price: 16000 },
    { name: "Món 7", qty: 1, price: 41000 },
    { name: "Món 8", qty: 1, price: 81000 },
    { name: "Món 9", qty: 1, price: 81000 },
    { name: "Món 10", qty: 2, price: 83000 },
    { name: "Món 11", qty: 1, price: 115000 },
    { name: "Món 12", qty: 1, price: 74000 },
    { name: "Món 13", qty: 3, price: 29000 },
  ];

  const subtotal = items.reduce((sum, item) => {
    const lineTotal = item.qty * item.price;
    return sum + lineTotal;
  }, 0);

  const total = subtotal - discount;

  const invoiceInfo = {
    shopName: "BẾP MẸ MÂY",
    invoiceId: "101",
    date: new Date().toLocaleString("vi-VN"),
    address: "CT5-11-4",
    items,
    subtotal,
    qrUrl: `https://img.vietqr.io/image/vcb-vinh220592-qr_only.jpg?amount=${total}&addInfo=MAY101`,
  };

  return (
    <div ref={ref} className="invoice">
      <h3 className="text-center">{invoiceInfo.shopName}</h3>
      <h4 className="text-center">HÓA ĐƠN THANH TOÁN</h4>
      <div className="d-flex justify-content-between mt-1">
        <p><strong>Số:</strong></p> <p>{invoiceInfo.invoiceId}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p><strong>Ngày:</strong></p> <p>{invoiceInfo.date}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p><strong>Địa chỉ:</strong></p> <p>{invoiceInfo.address}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên món</th>
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
        <p><strong>Tổng tiền:</strong></p> <p>{invoiceInfo.subtotal.toLocaleString()}đ</p>
      </div>
      <div className="d-flex justify-content-between">
        <p><strong>Giảm giá:</strong></p> <p>{discount.toLocaleString()}đ</p>
      </div>
      <hr/>
      <div className="d-flex justify-content-between mt-1">
        <p><strong>Tổng thanh toán:</strong></p> <p><strong>{total.toLocaleString()}đ</strong></p>
      </div>
      <div className="qr-container">
        <img src={invoiceInfo.qrUrl} alt="QR Thanh toán" />
        <p>Quét mã để thanh toán</p>
      </div>
    </div>
  );
});

const Invoice = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div style={{ textAlign: "center" }}>
      <InvoiceContent ref={contentRef} />
      <button onClick={reactToPrintFn} style={{ marginTop: "20px" }}>
        In hóa đơn
      </button>
    </div>
  );
};

export default Invoice;
