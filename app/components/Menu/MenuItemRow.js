"use client";
import React from "react";
import { Input, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const MenuItemRow = ({
  menu,
  index,
  onRemove,
  onNameChange,
  onPriceChange,
}) => {
  return (
    <div
      style={{
        gap: "0.5rem",
        background: "#f1f1f1",
        padding: "0.2rem",
        borderRadius: "5px",
        marginBottom: "0.5rem",
      }}
      className="d-flex"
    >
      <div style={{ flex: 1 }}>
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
        <Input
          value={menu.name}
          onChange={(e) => onNameChange(index, e.target.value)}
        />
      </div>
      <div style={{ flex: 0.5 }}>
        <label>
          <small>Giá</small>
        </label>
        <InputNumber
          style={{ width: "100%" }}
          value={menu.price}
          min={0}
          controls={false}
          onChange={(val) => onPriceChange(index, val)}
        />
      </div>
    </div>
  );
};

export default MenuItemRow;
