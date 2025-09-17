import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import AntdRegistry from "./components/AntdRegistry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bếp mẹ mây",
  description: "Bếp mẹ mây chuyên làm các loại bánh handmade",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <ConfigProvider locale={viVN} theme={{ token: { colorPrimary: "#1677ff" } }}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
