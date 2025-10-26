"use client";
import React, { forwardRef, useMemo } from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceMeta from "./InvoiceMeta";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceQR from "./InvoiceQR";

const InvoiceContent = forwardRef((props, ref) => {
  const { data = [], address = "Lễ tân", timestamp, day, month, date } = props;

  const subtotal = useMemo(() => {
    return data.reduce((sum, item) => {
      const lineTotal = (item.qty || 0) * (item.price || 0);
      return sum + lineTotal;
    }, 0);
  }, [data]);

  const discount = useMemo(
    () =>
      data.reduce(
        (sum, item) => sum + Number(item?.discount || 0) * item?.qty,
        0
      ),
    [data]
  );

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal]);

  const invoiceInfo = useMemo(
    () => ({
      shopName: "BẾP NHÀ MÂY",
      invoiceId: timestamp,
      date,
      address,
      items: data,
      subtotal,
      qrUrl: `https://img.vietqr.io/image/vcb-0651000791618-h6uAjiQ.jpg?amount=${total}&addInfo=MAY${day}${month}x${timestamp}`,
    }),
    [timestamp, date, address, data, subtotal, total, day, month]
  );

  return (
    <div ref={ref} className="invoice">
      <InvoiceHeader shopName={invoiceInfo.shopName} />
      <InvoiceMeta
        invoiceId={invoiceInfo.invoiceId}
        date={invoiceInfo.date}
        address={invoiceInfo.address}
      />
      <InvoiceItemsTable items={invoiceInfo.items} />
      <InvoiceSummary
        subtotal={invoiceInfo.subtotal}
        discount={discount}
        total={total}
      />
      <InvoiceQR qrUrl={invoiceInfo.qrUrl} />
    </div>
  );
});

InvoiceContent.displayName = "InvoiceContent";

export default InvoiceContent;
