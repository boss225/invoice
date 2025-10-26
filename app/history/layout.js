import "../globals.css";
import "antd/dist/reset.css";
import AntdRegistry from "../components/AntdRegistry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import MessageProvider from "../components/MessageProvider";

export default function HistoryLayout({ children }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={viVN}
        theme={{ token: { colorPrimary: "#1677ff" } }}
      >
        <MessageProvider>{children}</MessageProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
