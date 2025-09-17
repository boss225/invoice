"use client";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { parseToTimestamp, formatCurrencyVND, formatNumber } from "./helper";
import Image from "next/image";
import { Button, message, Table, Divider } from "antd";
import { isMobileUserAgent } from "../utils/device";

const InvoiceContentInner = React.forwardRef((props, ref) => {
  const date = useMemo(() => new Date().toLocaleString("vi-VN"), []);
  const { day, month, timestamp } = useMemo(
    () => parseToTimestamp(date),
    [date]
  );
  const { discount = 0, data = [], address = "Lễ tân" } = props;

  const subtotal = useMemo(() => {
    return data.reduce((sum, item) => {
      const lineTotal = (item.qty || 0) * (item.price || 0);
      return sum + lineTotal;
    }, 0);
  }, [data]);

  const total = useMemo(
    () => Math.max(0, subtotal - discount),
    [subtotal, discount]
  );

  const invoiceInfo = useMemo(
    () => ({
      shopName: "BẾP MẸ MÂY",
      invoiceId: timestamp,
      date,
      address,
      items: data,
      subtotal,
      qrUrl: `https://api.vietqr.io/image/970415-113366668888-h6uAjiQ.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`,
    }),
    [timestamp, date, address, data, subtotal, total, day, month]
  );

  const columns = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 20,
        render: (_, __, index) => index + 1,
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "SL",
        dataIndex: "qty",
        key: "qty",
        width: 30,
        align: "center",
      },
      {
        title: "ĐG",
        dataIndex: "price",
        key: "price",
        align: "right",
        render: (price) => formatNumber(price),
      },
      {
        title: "TT",
        key: "total",
        align: "right",
        render: (_, record) =>
          formatNumber((record.qty || 0) * (record.price || 0)),
      },
    ],
    []
  );

  const dataSource = useMemo(
    () =>
      invoiceInfo.items.map((item, index) => ({
        ...item,
        key: index,
      })),
    [invoiceInfo.items]
  );

  return (
    <div ref={ref} className="invoice">
      <h3 className="text-center" style={{ fontWeight: 600 }}>
        {invoiceInfo.shopName}
      </h3>
      <p className="text-center">Liên hệ: 0916.320.245</p>
      <h4 className="text-center mt-1" style={{ fontWeight: 600 }}>
        HÓA ĐƠN THANH TOÁN
      </h4>

      <div className="d-flex justify-content-between mt-2">
        <p>
          <strong>Số:</strong>
        </p>
        <p>{invoiceInfo.invoiceId}</p>
      </div>

      <div className="d-flex justify-content-between">
        <p>
          <strong>Ngày:</strong>
        </p>
        <p>{invoiceInfo.date}</p>
      </div>

      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Nơi nhận:</strong>
        </p>
        <p>
          <strong>{invoiceInfo.address}</strong>
        </p>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
        className="mt-2"
        bordered
        style={{ fontSize: "12px", zoom: 0.8 }}
      />

      <div className="d-flex justify-content-between mt-2">
        <p>
          <strong>Tổng tiền:</strong>
        </p>
        <p>{formatCurrencyVND(invoiceInfo.subtotal)}</p>
      </div>

      <div className="d-flex justify-content-between">
        <p>
          <strong>Giảm giá:</strong>
        </p>
        <p>{formatCurrencyVND(discount)}</p>
      </div>

      <Divider className="mt-1 mb-1" />

      <div className="d-flex justify-content-between">
        <p>
          <strong>Tổng thanh toán:</strong>
        </p>
        <p>
          <strong>{formatCurrencyVND(total)}</strong>
        </p>
      </div>

      <div className="qr-container">
        <Image
          src={invoiceInfo.qrUrl}
          alt="QR Thanh toán"
          width={100}
          height={100}
          priority={false}
          unoptimized={true}
        />
        <p>Quét mã để thanh toán</p>
      </div>
    </div>
  );
});

InvoiceContentInner.displayName = "InvoiceContentInner";

const InvoiceContent = React.memo(InvoiceContentInner);
InvoiceContent.displayName = "InvoiceContent";

const Invoice = (props) => {
  const { setViewInvoice, data = [] } = props;
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const contentRef = useRef(null);

  const handleBeforePrint = useCallback(() => {
    const images = contentRef.current?.querySelectorAll("img");
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalImages = images?.length || 0;

      if (totalImages === 0) {
        resolve();
        return;
      }

      const handleImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.onload = handleImageLoad;
          img.onerror = handleImageLoad;
        }
      });
    });
  }, []);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    onBeforePrint: handleBeforePrint,
  });

  const isMobile = useCallback(() => isMobileUserAgent(), []);

  const handlePrint = useCallback(() => {
    setIsPrinting(true);
    setTimeout(() => {
      try {
        reactToPrintFn();
      } catch (error) {
        console.error("Print error:", error);
        message.error("Lỗi khi in hóa đơn!");
      } finally {
        setIsPrinting(false);
      }
    }, 100);
  }, [reactToPrintFn]);

  const captureScreenshot = useCallback(async () => {
    if (!contentRef.current) return;

    setIsCapturing(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
          "image/png"
        );
      });

      // Try mobile sharing first
      if (isMobile() && navigator.share) {
        const file = new File([blob], `hoa-don-${Date.now()}.png`, {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Hóa đơn",
            files: [file],
          });
          message.success("Đã chia sẻ hình ảnh!");
          return;
        }
      }

      // Try clipboard API
      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);
          message.success("Đã sao chép hình ảnh vào clipboard!");
          return;
        } catch (clipboardError) {
          console.warn("Clipboard write failed:", clipboardError);
        }
      }

      // Fallback to download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `hoa-don-${Date.now()}.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const successMessage = isMobile()
        ? "Đã tải xuống hình ảnh! Kiểm tra thư mục Downloads."
        : "Không thể sao chép, đã tải xuống file thay thế!";

      message.success(successMessage);
    } catch (error) {
      console.error("Screenshot capture error:", error);
      message.error("Lỗi khi chụp màn hình!");
    } finally {
      setIsCapturing(false);
    }
  }, [isMobile]);

  const handleBackToMenu = useCallback(() => {
    if (setViewInvoice) {
      setViewInvoice(false);
    }
  }, [setViewInvoice]);

  const captureButtonText = useMemo(() => {
    if (isCapturing) return "Đang chụp...";
    return isMobile() ? "Chụp & chia sẻ" : "Chụp & sao chép";
  }, [isCapturing, isMobile]);

  return (
    <div style={{ textAlign: "center" }}>
      <InvoiceContent ref={contentRef} {...props} />

      <div className="d-flex justify-content-center mt-2 gap-2">
        <Button
          htmlType="button"
          onClick={handleBackToMenu}
          disabled={isPrinting || isCapturing}
        >
          ← menu
        </Button>

        <Button
          type="primary"
          loading={isPrinting}
          onClick={handlePrint}
          disabled={isCapturing || data.length === 0}
        >
          In hóa đơn
        </Button>

        <Button
          htmlType="button"
          danger
          onClick={captureScreenshot}
          disabled={isCapturing || isPrinting || data.length === 0}
        >
          {captureButtonText}
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
