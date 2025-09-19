"use client";

import { Card, Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMessageStore } from "../../store";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/";
  const success = useMessageStore((s) => s.success);
  const error = useMessageStore((s) => s.error);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: values.identifier,
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");

      success("Đăng nhập thành công");
      router.push(redirect);
    } catch (e) {
      error(e.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "6rem auto", padding: 16 }}>
      <Card>
        <Typography.Title level={3} style={{ marginBottom: 24 }}>
          Đăng nhập
        </Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="identifier"
            label="Tên đăng nhập hoặc Email"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập hoặc email" },
            ]}
          >
            <Input prefix={<UserOutlined />} autoComplete="username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              autoComplete="current-password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>

          <Typography.Paragraph style={{ marginTop: 12 }}>
            Chưa có tài khoản?{" "}
            <Link href={`/register?redirect=${encodeURIComponent(redirect)}`}>
              Đăng ký
            </Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
