"use client";
import React, { useMemo, useState } from "react";
import { Input, InputNumber, Table, Button, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const OrderSummary = ({
  menus,
  data,
  handleChangeData,
  address,
  onRemoveDataItem,
  onAddToData,
  onAddressChange,
  onClearData,
  onViewInvoice,
}) => {
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState([]);

  const columns = [
    {
      title: "Món",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => (
        <div className="d-flex flex-column">
          <p className="mb-50">
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
            <span style={{ fontWeight: 600, whiteSpace: "break-spaces" }}>
              {text}
            </span>
          </p>
          <div className="mb-0">
            <span
              style={{
                background: "#e9e9e9",
                padding: "0.2rem 0.4rem",
                borderRadius: "5px",
                marginRight: "0.5rem",
              }}
            >
              {record.price.toLocaleString()}
            </span>
            <InputNumber
              style={{ width: "3rem" }}
              size="small"
              value={record?.qty}
              onChange={(value) => {
                const newData = data.map((e, i) =>
                  index === i ? { ...e, qty: value || 1 } : e
                );
                handleChangeData(newData);
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount, record, index) => (
        <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
          <InputNumber
            style={{ width: "4.5rem" }}
            size="small"
            value={discount}
            onChange={(value) => {
              const newData = data.map((e, i) =>
                index === i ? { ...e, discount: value || 0 } : e
              );
              handleChangeData(newData);
            }}
          />
          <p>x {record?.qty}</p>
        </div>
      ),
    },
    {
      title: "TT",
      key: "total",
      render: (_, record) =>
        ((record.price - record?.discount) * record.qty).toLocaleString(),
    },
  ];

  const totalAmount = useMemo(
    () =>
      data.reduce(
        (sum, item) =>
          sum + (item.price - Number(item?.discount || 0)) * item.qty,
        0
      ),
    [data]
  );

  return (
    <div
      className="invoice w-100"
      style={{ padding: 0, maxWidth: "initial", marginTop: "1rem" }}
    >
      <Select
        className="w-100"
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        placeholder="Chọn món"
        showSearch
        value={selectedValues}
        filterOption={(input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        }
        options={menus
          .filter((e) => !!e?.name?.trim?.())
          .map((menu, index) => ({
            label: menu.name,
            value: index,
          }))}
        onChange={(value) => {
          setSelectedValues(value);
          onAddToData(value);
        }}
        onClear={() => {
          setSelectedValues([]);
          onClearData();
        }}
      />
      <Table
        rowKey={(record) => `order-item-${record.name}`}
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
        className="mt-2"
        bordered
      />
      <div style={{ margin: "1rem 0" }}>
        <div className="d-flex justify-content-between align-items-center">
          <p>
            <strong>Giảm Giá:</strong>
          </p>
          <p>
            <strong>
              {data
                .reduce(
                  (sum, item) => sum + Number(item?.discount || 0) * item?.qty,
                  0
                )
                .toLocaleString()}
            </strong>
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <p>
            <strong>Tổng Thanh Toán:</strong>
          </p>
          <strong style={{ fontSize: "1rem" }}>
            {totalAmount.toLocaleString()}
          </strong>
        </div>
      </div>
      <div className="d-flex">
        <Input
          placeholder="Địa chỉ ship"
          className="w-100"
          value={address}
          onChange={onAddressChange}
        />
      </div>
      <div className="d-flex justify-content-between mt-2">
        <Button
          disabled={data.length === 0}
          onClick={() => {
            setSelectedValues([]);
            onClearData();
          }}
        >
          Làm mới
        </Button>
        <div className="d-flex gap-1">
          <Button
            type="primary"
            disabled={data.length === 0 || address === ""}
            onClick={onViewInvoice}
          >
            Xuất hóa đơn
          </Button>
          <Button type="primary" danger onClick={() => router.push("/history")}>
            Lịch Sử
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
