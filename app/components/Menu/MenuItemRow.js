"use client";
import React from "react";
import { Input, InputNumber, Button } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const MenuItemRow = ({
  menu,
  index,
  onRemove,
  onNameChange,
  onPriceChange,
  onQtyChange,
  onAddToData,
}) => {
  return (
    <div
      className="d-flex align-items-center mb-1"
      style={{ gap: "0.5rem" }}
    >
      <div>
        <label>
          <strong
            style={{
              marginRight: "0.5rem",
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => onRemove(index)}
          >
            <CloseOutlined style={{ fontSize: "0.8rem" }} />
          </strong>
          <small>Tên món</small>
        </label>
        <Input value={menu.name} onChange={(e) => onNameChange(index, e.target.value)} />
      </div>
      <div>
        <label>
          <small>Giá</small>
        </label>
        <InputNumber
          style={{ width: "6rem" }}
          value={menu.price}
          min={0}
          controls={false}
          onChange={(val) => onPriceChange(index, val)}
        />
      </div>
      <div>
        <label>
          <small>SL</small>
        </label>
        <InputNumber
          style={{ width: "3rem" }}
          value={menu.qty}
          min={0}
          controls={false}
          onChange={(val) => onQtyChange(index, val)}
        />
      </div>
      <Button
        disabled={menu.name === "" || menu.price === 0 || menu.qty === 0}
        style={{ marginTop: "1.15rem", paddingInline: "0.4rem" }}
        onClick={() => onAddToData(menu)}
        type="primary"
        danger
        icon={<PlusOutlined />}
      />
    </div>
  );
};

export default MenuItemRow;


