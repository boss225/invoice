"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";

/**
 * AntdRegistry wraps children with css-in-js StyleProvider to ensure
 * styles are generated consistently during SSR and hydration.
 */
export default function AntdRegistry({ children }) {
  const [cache] = React.useState(() => createCache());

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}


