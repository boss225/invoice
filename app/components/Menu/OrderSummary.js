"use client";
import React, { useMemo } from "react";
import { Input, InputNumber, Table, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const OrderSummary = ({
  data,
  discount,
  address,
  onRemoveDataItem,
  onDiscountChange,
  onAddressChange,
  onClearData,
  onViewInvoice,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Tên món",
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => (
          <div className="d-flex align-items-center">
            <span
              style={{
                marginRight: "0.5rem",
                color: "red",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => onRemoveDataItem(index)}
            >
              <CloseOutlined style={{ fontSize: "0.8rem" }} />
            </span>
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price) => price.toLocaleString(),
      },
      {
        title: "SL",
        dataIndex: "qty",
        key: "qty",
        render: (qty) => qty.toLocaleString(),
      },
      {
        title: "TT",
        key: "total",
        render: (_, record) => (record.price * record.qty).toLocaleString(),
      },
    ],
    [onRemoveDataItem]
  );

  const dataSource = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        key: index,
      })),
    [data]
  );

  const totalAmount = useMemo(
    () => data.reduce((sum, item) => sum + item.price * item.qty, 0) - discount,
    [data, discount]
  );

  return (
    <div className="invoice w-100" style={{ padding: 0, maxWidth: "initial", marginTop: "1rem" }}>
      <h2 className="text-center">Danh sách món</h2>
      <Table dataSource={dataSource} columns={columns} pagination={false} size="small" className="mt-2" bordered />
      <div style={{ margin: "1rem 0" }}>
        <div className="d-flex justify-content-between align-items-center">
          <p>
            <strong>Giảm Giá:</strong>
          </p>
          <InputNumber style={{ width: "6rem" }} value={discount} min={0} controls={false} onChange={onDiscountChange} />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <p>
            <strong>Tổng Thanh Toán:</strong>
          </p>
          <strong style={{ fontSize: "1rem" }}>{totalAmount.toLocaleString()}</strong>
        </div>
      </div>
      <div className="d-flex">
        <Input placeholder="Địa chỉ ship" className="w-100" value={address} onChange={onAddressChange} />
      </div>
      <div className="d-flex justify-content-between mt-2">
        <Button disabled={data.length === 0} onClick={onClearData}>
          Xóa danh sách
        </Button>
        <Button type="primary" disabled={data.length === 0 || address === ""} onClick={onViewInvoice}>
          Xem hóa đơn
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;


