"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";
import "../globals.css";
import { useRouter } from "next/navigation";

const API_URL_INVOICES =
  "https://script.google.com/macros/s/AKfycbzPT56jA80dgRDyCKmrXU4OLKTRCr3PIe3l2XgaC-fL9ZgKU9mwRJ8KCkONZhP7Rw0fXQ/exec";

const History = () => {
  const router = useRouter();

  const [invoices, setInvoices] = useState([]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "25rem",
        minHeight: "100vh",
        margin: "0 auto",
        zoom: 0.9,
      }}
    >
      <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
        <h2 className="mb-0">
          <strong>Lịch Sử Hóa Đơn</strong>
        </h2>
        <div className="d-flex" style={{ gap: "1rem" }}>
          <Button type="primary" size="small" onClick={() => router.push("/")}>
            Danh sách
          </Button>
        </div>
      </div>
    </div>
  );
};

export default History;
