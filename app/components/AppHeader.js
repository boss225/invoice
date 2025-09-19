"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Layout,
  Space,
  Avatar,
  Dropdown,
  Button,
  Typography,
  message,
  Spin,
} from "antd";
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";

export default function AppHeaderClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null); // { auth_user, profile }

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/api/users/me", { credentials: "include" });
        if (canceled) return;
        if (res.status === 401) {
          setMe(null);
        } else {
          const data = await res.json();
          setMe(data);
        }
      } catch {
        setMe(null);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      message.success("Đã đăng xuất");
      // nếu trang hiện tại là protected, middleware sẽ đẩy về /login
      router.refresh();
      router.replace("/login?redirect=" + encodeURIComponent(pathname));
    } catch {
      message.error("Có lỗi khi đăng xuất");
    }
  };

  const name =
    me?.profile?.nick_name ||
    me?.auth_user?.user_metadata?.nick_name ||
    me?.auth_user?.email?.split("@")?.[0] ||
    "User";
  const email = me?.profile?.email || me?.auth_user?.email || "";
  const avatar =
    me?.profile?.avatar_url || me?.auth_user?.user_metadata?.avatar_url || null;

  return (
    <Layout.Header
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        height: 64,
        lineHeight: "64px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Space size={16}>
          <Link
            href="/"
            style={{ fontWeight: 700, fontSize: 18, color: "#1677ff" }}
          >
            Invoice
          </Link>
          <Link href="/" style={{ color: "#555" }}>
            Trang chủ
          </Link>
          <Link href="/invoices" style={{ color: "#555" }}>
            Invoices
          </Link>
        </Space>

        {loading ? (
          <Spin size="small" />
        ) : me ? (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: <Link href="/profile">Hồ sơ</Link>,
                },
                { type: "divider" },
                { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
              ],
              onClick: ({ key }) => key === "logout" && onLogout(),
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar src={avatar} size="small">
                {name?.[0]?.toUpperCase()}
              </Avatar>
              <div style={{ lineHeight: 1 }}>
                <Typography.Text strong>{name}</Typography.Text>
                <div style={{ fontSize: 12, color: "#888", marginTop: -2 }}>
                  {email}
                </div>
              </div>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
              <Button icon={<LoginOutlined />}>Đăng nhập</Button>
            </Link>
          </Space>
        )}
      </div>
    </Layout.Header>
  );
}
