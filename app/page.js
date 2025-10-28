"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { Menus } from "./components";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpen(true);
    } else {
      setUser(user);
    }
  }, []);

  return (
    <div>
      {!!user && !open && <Menus user={user} />}
      <Modal
        open={open}
        centered
        width={300}
        size="small"
        title="Người sử dụng"
        okText="Xác nhận"
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{
          disabled: !user,
          onClick: () => {
            localStorage.setItem("user", user.trim());
            setOpen(false);
          },
        }}
        closable={false}
      >
        <Input
          placeholder="Nhập tên người sử dụng"
          value={user}
          onChange={(e) => {
            const value = e.target.value;
            const onlyLetters = value.replace(/[^a-zA-Z]/g, "");
            setUser(onlyLetters);
          }}
        />
      </Modal>
    </div>
  );
}
