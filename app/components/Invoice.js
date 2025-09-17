"use client";
import React, { useState, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { parseToTimestamp, formatCurrencyVND, formatNumber } from "./helper";
import Image from "next/image";
import { Button, message, Table, Divider } from "antd";
import { isMobileUserAgent } from "../utils/device";

const InvoiceContentInner = (props, ref) => {
  const date = useMemo(() => new Date().toLocaleString("vi-VN"), []);
  const { day, month, timestamp } = parseToTimestamp(date);
  const discount = props.discount;

  const subtotal = useMemo(() => {
    return props.data.reduce((sum, item) => {
      const lineTotal = item.qty * item.price;
      return sum + lineTotal;
    }, 0);
  }, [props.data]);

  const total = useMemo(() => subtotal - discount, [subtotal, discount]);

  const invoiceInfo = {
    shopName: "BẾP MẸ MÂY",
    invoiceId: timestamp,
    date,
    address: props.address || "Lễ tân",
    items: props.data,
    subtotal,
    qrUrl: `https://img.vietqr.io/image/vcb-0651000791618-qr_only.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`,
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 20,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SL',
      dataIndex: 'qty',
      key: 'qty',
      width: 30,
      align: 'center',
    },
    {
      title: 'ĐG',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => formatNumber(price),
    },
    {
      title: 'TT',
      key: 'total',
      align: 'right',
      render: (_, record) => formatNumber(record.qty * record.price),
    },
  ];

  const dataSource = invoiceInfo.items.map((item, index) => ({
    ...item,
    key: index,
  }));

  return (
    <div ref={ref} className="invoice">
      <h3 className="text-center" style={{ fontWeight: 600 }}>{invoiceInfo.shopName}</h3>
      <p className="text-center">Liên hệ: 0916.320.245</p>
      <h4 className="text-center mt-1" style={{ fontWeight: 600 }}>HÓA ĐƠN THANH TOÁN</h4>
      <div className="d-flex justify-content-between mt-2">
        <p>
          <strong>Số:</strong>
        </p>{" "}
        <p>{invoiceInfo.invoiceId}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Ngày:</strong>
        </p>{" "}
        <p>{invoiceInfo.date}</p>
      </div>
      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Nơi nhận:</strong>
        </p>{" "}
        <p>
          <strong>{props.address}</strong>
        </p>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
        className="mt-2"
        bordered
        style={{ fontSize: '12px', zoom: 0.8 }}
      />

      <div className="d-flex justify-content-between mt-2">
        <p>
          <strong>Tổng tiền:</strong>
        </p>{" "}
        <p>{formatCurrencyVND(invoiceInfo.subtotal)}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Giảm giá:</strong>
        </p>{" "}
        <p>{formatCurrencyVND(discount)}</p>
      </div>
      <Divider className="mt-1 mb-1" />
      <div className="d-flex justify-content-between">
        <p>
          <strong>Tổng thanh toán:</strong>
        </p>{" "}
        <p>
          <strong>{formatCurrencyVND(total)}</strong>
        </p>
      </div>
      <div className="qr-container">
        <Image
          src={invoiceInfo.qrUrl}
          alt="QR Thanh toán"
          width={120}
          height={120}
          priority={false}
          unoptimized={true}
        />
        <p>Quét mã để thanh toán</p>
      </div>
    </div>
  );
};

const InvoiceContent = React.memo(React.forwardRef(InvoiceContentInner));

InvoiceContent.displayName = "InvoiceContent";

const Invoice = (props) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ 
    contentRef,
    onBeforePrint: () => {
      const images = contentRef.current?.querySelectorAll('img');
      return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = images?.length || 0;
        
        if (totalImages === 0) {
          resolve();
          return;
        }
        
        images.forEach((img) => {
          if (img.complete) {
            loadedCount++;
            if (loadedCount === totalImages) {
              resolve();
            }
          } else {
            img.onload = () => {
              loadedCount++;
              if (loadedCount === totalImages) {
                resolve();
              }
            };
            img.onerror = () => {
              loadedCount++;
              if (loadedCount === totalImages) {
                resolve();
              }
            };
          }
        });
      });
    }
  });

  const isMobile = isMobileUserAgent;

  const captureScreenshot = async () => {
    if (contentRef.current) {
      setIsCapturing(true);
      try {
        const canvas = await html2canvas(contentRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        });
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob null"))), "image/png");
        });

        try {
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

          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);
            message.success("Đã sao chép hình ảnh vào clipboard!");
            return;
          }

          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `hoa-don-${Date.now()}.png`;
          link.href = image;
          link.click();

          if (isMobile()) {
            message.success("Đã tải xuống hình ảnh! Kiểm tra thư mục Downloads.");
          } else {
            message.warning("Không thể sao chép, đã tải xuống file thay thế!");
          }
        } catch (error) {
          console.error("Lỗi khi xử lý hình ảnh:", error);
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `hoa-don-${Date.now()}.png`;
          link.href = image;
          link.click();
          message.success("Đã tải xuống hình ảnh!");
        }
      } catch (error) {
        console.error("Lỗi khi chụp màn hình:", error);
        message.error("Lỗi khi chụp màn hình!");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <InvoiceContent ref={contentRef} {...props} />
      <div className="d-flex justify-content-center mt-2 gap-2">
        <Button htmlType="button" onClick={() => props.setViewInvoice(false)}>← menu</Button>
        <Button
          type="primary"
          loading={isPrinting}
          onClick={() => {
            setIsPrinting(true);
            setTimeout(() => {
              reactToPrintFn();
              setIsPrinting(false);
            }, 100);
          }}
        >
          In hóa đơn
        </Button>
        <Button htmlType="button" danger onClick={captureScreenshot} disabled={isCapturing}>
          {isCapturing
            ? "Đang chụp..."
            : isMobile()
            ? "Chụp & chia sẻ"
            : "Chụp & sao chép"}
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
