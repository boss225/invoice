"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, Dropdown, Button, Space } from "antd";
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { useMessageStore } from "../store";

export default function UserNav({ user, profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const success = useMessageStore((s) => s.success);
  const error = useMessageStore((s) => s.error);

  const onLogout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      success("Đã đăng xuất");
      router.push("/login");
      router.refresh();
    } catch {
      error("Có lỗi khi đăng xuất");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Space>
        <Link href="/login">
          <Button icon={<LoginOutlined />}>Đăng nhập</Button>
        </Link>
        <Link href="/register">
          <Button type="primary">Đăng ký</Button>
        </Link>
      </Space>
    );
  }

  const items = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link href="/profile">Hồ sơ</Link>,
    },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
  ];

  const name = profile?.full_name || "User";
  const email = profile?.email || "";

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => {
          if (key === "logout") onLogout();
        },
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Space style={{ cursor: "pointer" }}>
        <Avatar src={profile?.avatar_url} size="small">
          {name?.[0]?.toUpperCase()}
        </Avatar>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{email}</div>
        </div>
      </Space>
    </Dropdown>
  );
}
