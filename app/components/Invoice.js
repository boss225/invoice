"use client";
import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { parseToTimestamp } from "./helper";
import "../globals.css";

const InvoiceContent = React.forwardRef((props, ref) => {
  const date = new Date().toLocaleString("vi-VN");
  const { day, month, timestamp } = parseToTimestamp(date);
  const discount = props.discount;

  const subtotal = props.data.reduce((sum, item) => {
    const lineTotal = item.qty * item.price;
    return sum + lineTotal;
  }, 0);

  const total = subtotal - discount;

  const invoiceInfo = {
    shopName: "BẾP MẸ MÂY",
    invoiceId: timestamp,
    date,
    address: props.address || "Lễ tân",
    items: props.data,
    subtotal,
    qrUrl: `https://img.vietqr.io/image/vcb-0651000791618-qr_only.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`,
  };

  return (
    <div ref={ref} className="invoice">
      <h3 className="text-center">{invoiceInfo.shopName}</h3>
      <h4 className="text-center">HÓA ĐƠN THANH TOÁN</h4>
      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Số:</strong>
        </p>{" "}
        <p>{invoiceInfo.invoiceId}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Điện thoại:</strong>
        </p>
        <p>0916.320.245</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Ngày:</strong>
        </p>{" "}
        <p>{invoiceInfo.date}</p>
      </div>
      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Địa chỉ:</strong>
        </p>{" "}
        <p>
          <strong>{props.address}</strong>
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>SL</th>
            <th>ĐG</th>
            <th>TT</th>
          </tr>
        </thead>
        <tbody>
          {invoiceInfo.items.map((item, i) => {
            const lineTotal = item.qty * item.price;
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price.toLocaleString()}</td>
                <td>{lineTotal.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Tổng tiền:</strong>
        </p>{" "}
        <p>{invoiceInfo.subtotal.toLocaleString()} đ</p>
      </div>
      <div className="d-flex justify-content-between">
        <p>
          <strong>Giảm giá:</strong>
        </p>{" "}
        <p>{discount.toLocaleString()} đ</p>
      </div>
      <hr />
      <div className="d-flex justify-content-between mt-1">
        <p>
          <strong>Tổng thanh toán:</strong>
        </p>{" "}
        <p>
          <strong>{total.toLocaleString()} đ</strong>
        </p>
      </div>
      <div className="qr-container">
        <img src={invoiceInfo.qrUrl} alt="QR Thanh toán" />
        <p>Quét mã để thanh toán</p>
      </div>
    </div>
  );
});

const Invoice = (props) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const captureScreenshot = async () => {
    if (contentRef.current) {
      setIsCapturing(true);
      try {
        const canvas = await html2canvas(contentRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        });

        canvas.toBlob(async (blob) => {
          try {
            // Trên mobile, kiểm tra xem có hỗ trợ clipboard API không
            if (isMobile() && navigator.share) {
              // Sử dụng Web Share API cho mobile
              const file = new File([blob], `hoa-don-${Date.now()}.png`, { type: 'image/png' });
              await navigator.share({
                title: 'Hóa đơn',
                files: [file]
              });
              alert('Đã chia sẻ hình ảnh!');
            } else if (navigator.clipboard && navigator.clipboard.write) {
              // Clipboard API cho desktop
              await navigator.clipboard.write([
                new ClipboardItem({
                  'image/png': blob
                })
              ]);
              alert('Đã sao chép hình ảnh vào clipboard!');
            } else {
              // Fallback: Tải xuống file
              const image = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.download = `hoa-don-${Date.now()}.png`;
              link.href = image;
              link.click();
              
              if (isMobile()) {
                alert('Đã tải xuống hình ảnh! Bạn có thể tìm thấy trong thư mục Downloads và sao chép từ đó.');
              } else {
                alert('Không thể sao chép vào clipboard, đã tải xuống file thay thế!');
              }
            }
          } catch (error) {
            console.error('Lỗi khi xử lý hình ảnh:', error);
            
            // Fallback cuối cùng: Tải xuống
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `hoa-don-${Date.now()}.png`;
            link.href = image;
            link.click();
            
            if (isMobile()) {
              alert('Đã tải xuống hình ảnh! Vào thư mục Downloads để tìm file và chia sẻ.');
            } else {
              alert('Đã tải xuống hình ảnh!');
            }
          }
        }, 'image/png');
      } catch (error) {
        console.error("Lỗi khi chụp màn hình:", error);
        alert('Lỗi khi chụp màn hình!');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <InvoiceContent ref={contentRef} {...props} />
      <div
        className="d-flex justify-content-center mt-2"
        style={{ gap: "1rem" }}
      >
        <button onClick={() => props.setViewInvoice(false)}>← menu</button>
        <button
          onClick={() => {
            setIsPrinting(true);
            setTimeout(() => {
              reactToPrintFn();
              setIsPrinting(false);
            }, 100);
          }}
        >
          In hóa đơn
        </button>
        <button onClick={captureScreenshot} disabled={isCapturing}>
          {isCapturing ? "Đang chụp..." : isMobile() ? "Chụp & chia sẻ" : "Chụp & sao chép"}
        </button>
      </div>
    </div>
  );
};

export default Invoice;
