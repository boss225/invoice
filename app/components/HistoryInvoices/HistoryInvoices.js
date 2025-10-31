import React, { memo, useMemo, useEffect, useState, useRef } from "react";
import { Table, Switch, Input, Modal, List, Divider } from "antd";
import {
  CalendarOutlined,
  CheckSquareOutlined,
  CheckSquareFilled,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { API_URL_INVOICES } from "../helper";
import { useMessageStore } from "../../store";
import { formatCurrencyVND } from "../helper";

const HistoryInvoices = (props) => {
  const {} = props;
  const success = useMessageStore((s) => s.success);
  const error = useMessageStore((s) => s.error);
  const tableRef = useRef(null);

  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState(null);
  const [doneFilter, setDoneFilter] = useState(0);
  const [addressFilter, setAddressFilter] = useState("");

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
        setInvoices(resInvoices?.data.map((e) => JSON.parse(e)));
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

  useEffect(() => {
    const tableElement = tableRef.current?.querySelector(".ant-table-body");
    if (!tableElement) return;

    const handleWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = tableElement;
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      if (
        (isScrollingDown && scrollTop + clientHeight >= scrollHeight) ||
        (isScrollingUp && scrollTop === 0)
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      tableElement.scrollTop += e.deltaY;
    };

    tableElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      tableElement.removeEventListener("wheel", handleWheel);
    };
  }, [invoices]);

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

  const handleChangeAddressFilter = debounce((value) => {
    const obj = { address: value.trim() };
    !!doneFilter && (obj.done = doneFilter);
    getDataInit(new URLSearchParams(obj));
  }, 500);

  const handleChangeDoneFilter = debounce((value) => {
    const obj = {};
    !!value && (obj.done = value);
    !!addressFilter.trim() && (obj.address = addressFilter);
    getDataInit(new URLSearchParams(obj));
  }, 500);

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
    <div style={{ position: "relative" }}>
      <div className="d-flex align-items-center mb-1" style={{ gap: "0.5rem" }}>
        <div
          className="d-flex align-items-center"
          style={{ maxWidth: "12rem", gap: "0.5rem" }}
        >
          <Input
            size="small"
            placeholder="Nơi nhận..."
            value={addressFilter}
            onChange={(e) => {
              setAddressFilter(e.target.value);
              handleChangeAddressFilter(e.target.value);
            }}
          />
          <div
            style={{ cursor: "pointer", paddingTop: "1px" }}
            onClick={() => {
              setDoneFilter(doneFilter ? 0 : 1);
              handleChangeDoneFilter(doneFilter ? 0 : 1);
            }}
          >
            {!doneFilter ? (
              <CheckSquareOutlined
                style={{ fontSize: "1.5rem", color: "gainsboro" }}
              />
            ) : (
              <CheckSquareFilled
                style={{ color: "#1677ff", fontSize: "1.5rem" }}
              />
            )}
          </div>
        </div>
        <p className="mb-0 text-right flex-1">Tổng số: {total}</p>
      </div>
      <div ref={tableRef}>
        <Table
          size="small"
          bordered={true}
          virtual
          pagination={{ pageSize: 100 }}
          columns={columns}
          scroll={{ y: 500 }}
          rowKey="date"
          dataSource={invoices}
          loading={loading}
        />
      </div>
      <Modal
        open={!!detailInvoice}
        onCancel={() => setDetailInvoice(null)}
        footer={null}
        centered
        title="Chi tiết hóa đơn"
        width={350}
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
