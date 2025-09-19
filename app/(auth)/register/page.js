"use client";

import { Card, Form, Input, Button, Typography } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMessageStore } from "../../store";

export default function RegisterPage() {
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          nick_name: values.nick_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");

      success(data.message || "Đăng ký thành công");
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
          Tạo tài khoản
        </Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="nick_name"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập" },
              { min: 6, message: "Tối thiểu 6 ký tự" },
              { max: 30, message: "Tối đa 30 ký tự" },
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<MailOutlined />} autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Tối thiểu 6 ký tự" },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Nhập lại mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              autoComplete="new-password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng ký
          </Button>

          <Typography.Paragraph style={{ marginTop: 12 }}>
            Đã có tài khoản?{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirect)}`}>
              Đăng nhập
            </Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
