"use client";

import React, { useEffect } from "react";
import { message } from "antd";
import useMessageStore from "../store/useMessageStore";

const MessageProvider = ({ children }) => {
  const [api, contextHolder] = message.useMessage();
  const setApi = useMessageStore((s) => s.setApi);

  useEffect(() => {
    setApi(api);
  }, [api, setApi]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default MessageProvider;


