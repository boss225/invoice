"use client";
import React, {
  forwardRef,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  scrollTo,
} from "react";
import html2canvas from "html2canvas";
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
      <div className="d-flex justify-content-between mt-1">
        <Table
          className="w-100 table-invoice"
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
          crossOrigin="anonymous"
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

  const handleCapture = async () => {
    if (contentRef.current) {
      setIsCapturing(true);
      try {
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
                title: "Hóa đơn",
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
              // Fallback: Tải xuống file
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
