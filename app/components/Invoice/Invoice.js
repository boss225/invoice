"use client";
import React, {
  useEffect,
  forwardRef,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as htmlToImage from "html-to-image";
import { parseToTimestamp, formatCurrencyVND, formatNumber } from "../helper";
import { Button, message, Table, Divider, Image } from "antd";
import { isMobileUserAgent } from "../../utils/device";

const InvoiceContentInner = forwardRef((props, ref) => {
  const date = useMemo(() => new Date().toLocaleString("vi-VN"), []);
  const { timestamp, day, month } = useMemo(
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

  const [qrGenerated, setQrGenerated] = useState("");

  const drawQRCode = useCallback(() => {
    const qrUrl = `https://api.vietqr.io/image/970436-0651000791618-h6uAjiQ.jpg?accountName=NGUYEN%20THI%20XUAN&amount=${total}&addInfo=MAY${day}${month}x${timestamp}`;

    fetch(qrUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setQrGenerated(reader.result);
        reader.readAsDataURL(blob); // => base64 string
      });
  }, [data, day, month, timestamp, total]);

  useEffect(() => drawQRCode(), [data]);

  return (
    <div ref={ref} className="invoice" style={{ paddingInline: "3rem" }}>
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
        className="table-invoice"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
        bordered
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
          src={qrGenerated}
          width={100}
          height={100}
          alt="QR Thanh toán"
          crossOrigin="anonymous"
          preview={false}
          fallback="data:image/png;base64,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"
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
      const canvas = await htmlToImage.toCanvas(node, {
        cacheBust: true,
        backgroundColor: "#fff",
        pixelRatio: Math.min(2, window.devicePixelRatio || 1) * 1.2,
        useCORS: true,
        allowTaint: true,
      });

      // Crop 20px from left and right
      const croppedCanvas = document.createElement("canvas");
      const ctx = croppedCanvas.getContext("2d");
      const cropAmount = 80;

      croppedCanvas.width = Math.max(0, canvas.width - cropAmount * 2);
      croppedCanvas.height = canvas.height;

      ctx.drawImage(
        canvas,
        cropAmount,
        0, // source x, y
        croppedCanvas.width,
        croppedCanvas.height, // source width, height
        0,
        0, // destination x, y
        croppedCanvas.width,
        croppedCanvas.height // destination width, height
      );

      const blob = await new Promise((resolve) =>
        croppedCanvas.toBlob(resolve, "image/png")
      );

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
