"use client";
import React from "react";
import { Button, Avatar, Dropdown } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API_URL_MENU } from "../helper";

const MenuHeader = ({ user, viewTab, setViewTab, onAddNewMenu, menus }) => {
  const saveMenu = () => {
    const user = localStorage?.user || "";
    const compare = localStorage?.menus === JSON.stringify(menus);
    if (viewTab === 1 && !compare) {
      localStorage.setItem("menus", JSON.stringify(menus));
      fetch(API_URL_MENU, {
        method: "POST",
        body: new URLSearchParams({
          row: user === "xuan" ? 1 : 2,
          value: JSON.stringify(menus),
        }),
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
      <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
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
        <Dropdown
          menu={{
            items: [
              {
                label: "Thoát",
                key: "logout",
                onClick: () => {
                  localStorage.clear();
                  window.location.href = "/";
                },
              },
            ],
          }}
          placement="bottomRight"
          overlayStyle={{ right: "2px !important" }}
        >
          <Avatar>{user.charAt(0).toUpperCase()}</Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

export default MenuHeader;
