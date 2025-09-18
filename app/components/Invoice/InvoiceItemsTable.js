"use client";
import React, { useMemo } from "react";
import { Table } from "antd";
import { formatNumber } from "../helper";

const InvoiceItemsTable = ({ items }) => {
  const columns = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 20,
        render: (_, __, index) => index + 1,
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "SL",
        dataIndex: "qty",
        key: "qty",
        width: 30,
        align: "center",
      },
      {
        title: "ĐG",
        dataIndex: "price",
        key: "price",
        align: "right",
        render: (price) => formatNumber(price),
      },
      {
        title: "TT",
        key: "total",
        align: "right",
        render: (_, record) =>
          formatNumber((record.qty || 0) * (record.price || 0)),
      },
    ],
    []
  );

  const dataSource = useMemo(
    () => items.map((item, index) => ({ ...item, key: index })),
    [items]
  );

  return (
    <div className="d-flex justify-content-between mt-1">
      <Table
        className="w-100 table-invoice"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
};

export default InvoiceItemsTable;


