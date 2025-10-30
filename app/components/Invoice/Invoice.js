"use client";
import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import html2canvas from "html2canvas";
import { parseToTimestamp } from "../helper";
import { Button } from "antd";
import { useMessageStore } from "../../store";
import { isMobileUserAgent } from "../../utils/device";
import InvoiceContent from "./InvoiceContent";
import { API_URL_INVOICES } from "../helper";

const Invoice = (props) => {
  const { user, setViewTab, address, data = [] } = props;

  const [isCapturing, setIsCapturing] = useState(false);
  const success = useMessageStore((s) => s.success);
  const error = useMessageStore((s) => s.error);
  const contentRef = useRef(null);

  const date = useMemo(() => new Date().toLocaleString("vi-VN"), []);
  const dateTime = useMemo(() => parseToTimestamp(date), [date]);

  const isMobile = useCallback(() => isMobileUserAgent(), []);

  const handleBackToMenu = useCallback(() => {
    setViewTab?.(0);
  }, []);

  const captureButtonText = useMemo(() => {
    if (isCapturing) return "Đang chụp...";
    return isMobile() ? "Chụp & chia sẻ" : "Chụp & sao chép";
  }, [isCapturing, isMobile]);

  const handleCapture = async () => {
    if (contentRef.current) {
      setIsCapturing(true);
      try {
        fetch(API_URL_INVOICES, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: new URLSearchParams({
            col: user === "xuan" ? "A" : "B",
            row: "new",
            value: JSON.stringify({ data, done: 0, date, address }),
          }),
        });

        const canvas = await html2canvas(contentRef.current, {
          backgroundColor: "#ffffff",
          scale: 1.5,
          useCORS: true,
        });

        canvas.toBlob(async (blob) => {
          try {
            if (isMobile() && navigator.share) {
              const file = new File([blob], `hoa-don-${Date.now()}.png`, {
                type: "image/png",
              });
              await navigator.share({
                title: `Hóa đơn ${dateTime?.timestamp || Date.now()}`,
                files: [file],
              });
              success("Đã chia sẻ hình ảnh!");
            } else if (navigator.clipboard && navigator.clipboard.write) {
              // Clipboard API cho desktop
              await navigator.clipboard.write([
                new ClipboardItem({
                  "image/png": blob,
                }),
              ]);
              success("Đã sao chép hình ảnh vào clipboard!");
            } else {
              const image = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.download = `hoa-don-${Date.now()}.png`;
              link.href = image;
              link.click();

              if (isMobile()) {
                success(
                  "Đã tải xuống hình ảnh! Bạn có thể tìm thấy trong thư mục Downloads và sao chép từ đó."
                );
              } else {
                error(
                  "Không thể sao chép vào clipboard, đã tải xuống file thay thế!"
                );
              }
            }
          } catch (error) {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `hoa-don-${Date.now()}.png`;
            link.href = image;
            link.click();

            if (isMobile()) {
              success(
                "Đã tải xuống hình ảnh! Vào thư mục Downloads để tìm file và chia sẻ."
              );
            } else {
              success("Đã tải xuống hình ảnh!");
            }
          }
        }, "image/png");
      } catch (error) {
        error("Lỗi khi chụp màn hình!");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <InvoiceContent ref={contentRef} date={date} {...props} {...dateTime} />

      <div className="d-flex justify-content-center mt-2 gap-2">
        <Button
          htmlType="button"
          onClick={handleBackToMenu}
          disabled={isCapturing}
        >
          ← menu
        </Button>

        <Button
          htmlType="button"
          danger
          disabled={isCapturing || data.length === 0}
          onClick={handleCapture}
        >
          {captureButtonText}
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
