"use client";
import React, {
  forwardRef,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as htmlToImage from "html-to-image";
import { parseToTimestamp, formatCurrencyVND, formatNumber } from "../helper";
import { Button, message, Table, Divider } from "antd";
import { isMobileUserAgent } from "../../utils/device";

const InvoiceContentInner = forwardRef((props, ref) => {
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
      qrUrl: `https://img.vietqr.io/image/vcb-0651000791618-h6uAjiQ.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`,
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
    <div ref={ref} className="invoice" style={{paddingInline: "1rem"}}>
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
      <div>
        <Table
          className="table-invoice"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="small"
          bordered
        />
      </div>
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
        <img
          src={invoiceInfo.qrUrl}
          width={100}
          height={100}
          alt="QR Thanh toán"
        />
        <p>Quét mã để thanh toán</p>
      </div>
    </div>
  );
});
InvoiceContentInner.displayName = "InvoiceContentInner";

const Invoice = (props) => {
  const { setViewInvoice, data = [] } = props;
  const [isCapturing, setIsCapturing] = useState(false);
  const contentRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const success = useCallback(
    (message) => messageApi.success(message),
    [messageApi]
  );

  const error = useCallback(
    (message) => messageApi.error(message),
    [messageApi]
  );

  const isMobile = useCallback(() => isMobileUserAgent(), []);

  const handleBackToMenu = useCallback(() => {
    if (setViewInvoice) {
      setViewInvoice(false);
    }
  }, [setViewInvoice]);

  const captureButtonText = useMemo(() => {
    if (isCapturing) return "Đang chụp...";
    return isMobile() ? "Chụp & chia sẻ" : "Chụp & sao chép";
  }, [isCapturing, isMobile]);

  const waitForImages = useCallback(async (root) => {
    const imgs = Array.from(root.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          img.complete ||
          new Promise((res) => {
            img.onload = img.onerror = () => res(null);
          })
      )
    );
    if (document?.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {}
    }
  }, []);

  const copyBlobToClipboard = useCallback(async (blob) => {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error("Trình duyệt không hỗ trợ sao chép ảnh vào clipboard");
    }
    const item = new window.ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  }, []);

  const tryShareFile = useCallback(async (blob, filename) => {
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Hóa đơn thanh toán",
          text: "BẾP MẸ MÂY",
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const downloadBlob = useCallback((blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const handleCapture = useCallback(async () => {
    if (!contentRef.current) return;
    setIsCapturing(true);
    const node = contentRef.current;
    const filename = `hoa-don-${Date.now()}.png`;

    try {
      await waitForImages(node);

      const blob = await htmlToImage.toBlob(node, {
        cacheBust: true,
        backgroundColor: "#fff",
        pixelRatio: Math.min(2, window.devicePixelRatio || 1) * 1.5, // sắc nét hơn
      });

      if (!blob) throw new Error("Không thể tạo ảnh");

      if (isMobile()) {
        // Ưu tiên Share Sheet trên mobile
        const shared = await tryShareFile(blob, filename);
        if (shared) {
          success("Đang mở màn hình chia sẻ…");
        } else {
          // Fallback: copy vào clipboard, nếu không được thì tải ảnh
          try {
            await copyBlobToClipboard(blob);
            success("Đã sao chép ảnh vào clipboard");
          } catch {
            downloadBlob(blob, filename);
            success("Đã tải ảnh. Bạn có thể chia sẻ thủ công.");
          }
        }
      } else {
        // Desktop: copy vào clipboard
        await copyBlobToClipboard(blob);
        success("Đã sao chép ảnh vào clipboard. Dán vào Zalo/Email…");
      }
    } catch (e) {
      console.error(e);
      error(e?.message || "Có lỗi khi chụp ảnh");
    } finally {
      setIsCapturing(false);
    }
  }, [
    isMobile,
    waitForImages,
    copyBlobToClipboard,
    tryShareFile,
    downloadBlob,
    success,
    error,
  ]);

  return (
    <div style={{ textAlign: "center" }}>
      {contextHolder}
      <InvoiceContentInner ref={contentRef} {...props} />

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
