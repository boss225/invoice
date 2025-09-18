"use client";

import { create } from "zustand";
import { message as antdMessage } from "antd";

const normalizeOptions = (contentOrOptions, options) => {
  if (typeof contentOrOptions === "string") {
    return { content: contentOrOptions, ...(options || {}) };
  }
  return contentOrOptions || {};
};

const useMessageStore = create((set, get) => ({
  api: null,
  setApi: (api) => set({ api }),

  showMessage: (type, contentOrOptions, options) => {
    const api = get().api;
    const target = api || antdMessage;
    const normalized = normalizeOptions(contentOrOptions, options);

    if (type && typeof target[type] === "function") {
      return target[type](normalized);
    }
    return target.open({ type: type || "info", ...normalized });
  },

  success: (contentOrOptions, options) =>
    get().showMessage("success", contentOrOptions, options),
  error: (contentOrOptions, options) =>
    get().showMessage("error", contentOrOptions, options),
  info: (contentOrOptions, options) =>
    get().showMessage("info", contentOrOptions, options),
  warning: (contentOrOptions, options) =>
    get().showMessage("warning", contentOrOptions, options),
  loading: (contentOrOptions, options) =>
    get().showMessage("loading", contentOrOptions, options),
}));

export default useMessageStore;


