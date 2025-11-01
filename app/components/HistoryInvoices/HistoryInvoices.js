import React, { memo, useMemo, useEffect, useState } from "react";
import {
  Table,
  Switch,
  Input,
  Modal,
  List,
  Divider,
  Select,
  Button,
  DatePicker,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { API_URL_INVOICES } from "../helper";
import { useMessageStore } from "../../store";
import { formatCurrencyVND, formatNumber } from "../helper";

const HistoryInvoices = (props) => {
  const {} = props;
  const success = useMessageStore((s) => s.success);
  const error = useMessageStore((s) => s.error);

  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState(null);
  const [doneFilter, setDoneFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const getDataInit = async (search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        col: localStorage.getItem("user") === "xuan" ? "A" : "B",
        page: page,
        limit: 100,
      });
      if (search) {
        params.set("search", search);
      }
      const resInvoices = await fetch(
        `${API_URL_INVOICES}?${params.toString()}`
      ).then((e) => e.json());

      if (resInvoices?.data) {
        setInvoices(
          resInvoices.data.map((e, i) => ({
            ...JSON.parse(e),
            id: Date.now() + i,
          }))
        );
        setSummary({
          ...(resInvoices?.unpaid || {}),
          totalMoney: resInvoices?.totalMoney || 0,
        });
        setTotal(resInvoices?.total || 0);
      }
    } catch (error) {
      error("Lấy dữ liệu thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataInit();
  }, [page]);

  const handleChangeDone = (index, item) => {
    setInvoices((prev) =>
      prev.map((e, i) => (i === index ? { ...e, done: item.done ? 1 : 0 } : e))
    );

    fetch(API_URL_INVOICES, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({
        col: localStorage.getItem("user") === "xuan" ? "A" : "B",
        row: (page - 1) * 100 + index + 2,
        value: JSON.stringify(item),
      }),
    })
      .then((e) => e.json())
      .then((res) => {
        if (res.result === "success") {
          success("Cập nhật thành công");
        } else {
          setInvoices((prev) =>
            prev.map((e, i) =>
              i === index ? { ...e, done: item.done ? 1 : 0 } : e
            )
          );
          error("Cập nhật thất bại");
        }
      })
      .catch((error) => {
        error("Cập nhật thất bại");
      });
  };

  const handleFilter = () => {
    const obj = {};
    doneFilter !== "" && (obj.done = doneFilter);
    !!addressFilter.trim() && (obj.address = addressFilter);
    !!dateFilter &&
      (obj.date = dateFilter.startsWith("0")
        ? dateFilter.slice(1)
        : dateFilter);
    getDataInit(
      Object.keys(obj)
        .map((e) => `${e}=${obj[e]}`)
        .join("&")
    );
  };

  const columns = useMemo(
    () => [
      {
        title: "Hóa đơn",
        key: "invoice",
        render: (_, record) => {
          const total = record.data.reduce(
            (sum, item) => sum + (item.price - item.discount) * item.qty,
            0
          );
          return (
            <div>
              <a onClick={() => setDetailInvoice(record)}>
                <p className="mb-0">
                  <strong>{record.address}</strong>
                </p>
              </a>
              <p className="mb-0 mr-1">
                <strong style={{ color: "red" }}>
                  {formatCurrencyVND(total)}
                </strong>{" "}
                / <span>{record.date}</span>
              </p>
            </div>
          );
        },
      },
      {
        title: "Done",
        dataIndex: "done",
        key: "done",
        width: 60,
        align: "center",
        render: (_, record, index) => {
          return (
            <Switch
              size="small"
              checked={record.done}
              onChange={(checked) =>
                handleChangeDone(index, { ...record, done: checked ? 1 : 0 })
              }
            />
          );
        },
      },
    ],
    [invoices]
  );

  return (
    <div className="history-invoices">
      <div className="summary-invoices">
        <div className="card-sum">
          <p>
            Tổng HĐ <strong style={{ color: "green" }}>{total}</strong>
          </p>
          <p className="mb-0">{formatNumber(summary?.totalMoney)}</p>
        </div>
        <div className="card-sum" style={{ flex: 0.7 }}>
          <p>Chưa Trả</p>
          <p className="mb-0">{summary?.total || 0}</p>
        </div>
        <div className="card-sum">
          <p>Công Nợ</p>
          <p className="mb-0" style={{ color: "red" }}>
            {formatNumber(summary?.money)}
          </p>
        </div>
      </div>
      <div
        className="d-flex align-items-center mb-1"
        style={{ gap: "0.2rem", overflow: "hidden" }}
      >
        <Input
          className="flex-1"
          size="small"
          placeholder="Nơi nhận..."
          value={addressFilter}
          onChange={(e) => setAddressFilter(e.target.value)}
        />
        <DatePicker
          className="flex-1"
          size="small"
          style={{ width: "15rem" }}
          format="DD/MM/YYYY"
          placeholder="Ngày"
          onChange={(date, dateString) => setDateFilter(dateString)}
        />
        <Select
          className="flex-1"
          style={{ width: "11rem", minHeight: "1.44rem" }}
          size="small"
          placeholder="Trạng thái"
          value={doneFilter}
          options={[
            { label: "Tất cả", value: "" },
            { label: "Đã trả", value: 1 },
            { label: "Chưa trả", value: 0 },
          ]}
          onChange={(value) => setDoneFilter(value)}
        />

        <Button
          disabled={loading}
          type="primary"
          size="small"
          icon={<SearchOutlined />}
          style={{ width: "1.8rem" }}
          onClick={handleFilter}
        />
      </div>
      <Table
        size="small"
        bordered={true}
        pagination={{ pageSize: 100 }}
        columns={columns}
        scroll={{ y: 500 }}
        rowKey="id"
        dataSource={invoices}
        loading={loading}
      />
      <Modal
        open={!!detailInvoice}
        onCancel={() => setDetailInvoice(null)}
        footer={null}
        centered
        title="Chi tiết hóa đơn"
        width={350}
        className="detail-invoice-modal"
      >
        <p className="mb-0">
          <strong>{detailInvoice?.address}</strong>
        </p>
        <Divider className="mb-0 mt-1" />
        <List
          className="detail-invoice"
          itemLayout="horizontal"
          dataSource={detailInvoice?.data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`(${item.price} - ${item.discount}) x ${
                  item.qty
                } = ${formatCurrencyVND(
                  (item.price - item.discount) * item.qty
                )}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default memo(HistoryInvoices);
