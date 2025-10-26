"use client";
import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API_URL_MENU } from "../helper";

const MenuHeader = ({ viewTab, setViewTab, onAddNewMenu, menus }) => {
  const saveMenu = () => {
    const compare = localStorage.menus === JSON.stringify(menus);
    if (viewTab === 1 && !compare) {
      localStorage.setItem("menus", JSON.stringify(menus));
      fetch(API_URL_MENU, {
        method: "POST",
        body: new URLSearchParams({ row: 1, value: JSON.stringify(menus) }),
        redirect: "follow",
      });
    }

    setViewTab(!viewTab ? 1 : 0);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
      <h2 className="mb-0">
        <strong>{!viewTab ? "Danh Sách Món" : "Menu"}</strong>
      </h2>
      <div className="d-flex" style={{ gap: "1rem" }}>
        {!!viewTab && (
          <Button
            type="primary"
            danger
            size="small"
            icon={<PlusOutlined />}
            onClick={onAddNewMenu}
          />
        )}
        <Button type="primary" size="small" onClick={saveMenu}>
          {!viewTab ? "Xem menu" : "Danh sách"}
        </Button>
      </div>
    </div>
  );
};

export default MenuHeader;
