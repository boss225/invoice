"use client";
import React from "react";
import { Button } from "antd";

const MenuHeader = ({ onAddNewMenu }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
      <h1 className="mb-0">
        <strong>MENU</strong>
      </h1>
      <Button type="primary" onClick={onAddNewMenu}>
        Thêm món
      </Button>
    </div>
  );
};

export default MenuHeader;


