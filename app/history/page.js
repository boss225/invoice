"use client";
import React from "react";
import { Button } from "antd";
import "../globals.css";
import { useRouter } from "next/navigation";
import { HistoryInvoices } from "../components";

const History = () => {
  const router = useRouter();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "25rem",
        minHeight: "100vh",
        margin: "0 auto",
        paddingInline: "0.2rem",
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
      <HistoryInvoices />
    </div>
  );
};

export default History;
