import React, { memo, useMemo, useEffect, useState } from "react";
import { Table, Switch } from "antd";
import { API_URL_INVOICES } from "../helper";

const HistoryInvoices = (props) => {
  const { user } = props;

  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getDataInit = async () => {
    try {
      setLoading(true);
      const resInvoices = await fetch(
        `${API_URL_INVOICES}?col=${
          user === "xuan" ? "A" : "B"
        }&page=${page}&limit=100`
      ).then((e) => e.json());
      console.log(resInvoices);

      if (resInvoices?.data?.length > 0) {
        setInvoices(resInvoices?.data.map((e) => JSON.parse(e)));
        setTotal(resInvoices?.total || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataInit();
  }, [page]);

  const columns = useMemo(
    () => [
      {
        title: "Hóa đơn",
        key: "invoice",
        render: (text, record) => JSON.stringify(record),
      },
      {
        title: "Done",
        dataIndex: "done",
        key: "done",
        width: 55,
        render: (text, record) => <Switch size="small" checked={record.done} />,
      },
    ],
    []
  );

  return (
    <div style={{ position: "relative" }}>
      <label style={{ position: "absolute", top: "18px", right: 0 }}>
        Tổng số: {total}
      </label>
      <Table
        pagination={{ position: ["top"], pageSize: 100 }}
        size="small"
        bordered={false}
        virtual
        columns={columns}
        scroll={{ x: 300, y: 300 }}
        rowKey="date"
        dataSource={invoices}
        loading={loading}
      />
    </div>
  );
};

export default memo(HistoryInvoices);
