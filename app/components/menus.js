"use client";
import React, { useState, useEffect } from "react";
import Invoice from "./Invoice";
import "../globals.css";
import { Button, Input, InputNumber, Table } from "antd";

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [data, setData] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [viewInvoice, setViewInvoice] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const menusStr = localStorage.getItem("menus");
    if (menusStr && menusStr.length > 0) {
      try {
        setMenus(JSON.parse(menusStr));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("menus", JSON.stringify(menus));
  }, [menus]);

  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => (
        <div className="d-flex align-items-center">
          <span
            style={{
              marginRight: "0.5rem",
              color: "red",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => setData(data.filter((_, i) => i !== index))}
          >
            ×
          </span>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "SL",
      dataIndex: "qty",
      key: "qty",
      render: (qty) => qty.toLocaleString(),
    },
    {
      title: "TT",
      key: "total",
      render: (_, record) => (record.price * record.qty).toLocaleString(),
    },
  ];

  const dataSource = data.map((item, index) => ({
    ...item,
    key: index,
  }));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "23rem",
        minHeight: "100vh",
        margin: "0 auto",
      }}
    >
      {!viewInvoice ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
            <h1 className="mb-0">
              <strong>MENU</strong>
            </h1>
            <Button
              type="primary"
              onClick={() =>
                setMenus([...menus, { name: "", price: 0, qty: 1 }])
              }
            >
              Thêm món
            </Button>
          </div>
          {menus.map((menu, index) => (
            <div
              key={index + "menu"}
              className="d-flex align-items-center mb-1"
              style={{ gap: "0.5rem" }}
            >
              <div>
                <label>
                  <strong
                    style={{
                      marginRight: "0.5rem",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setMenus(menus.filter((m, i) => i !== index))
                    }
                  >
                    x
                  </strong>
                  <small>Tên món</small>
                </label>
                <Input
                  value={menu.name}
                  onChange={(e) =>
                    setMenus(
                      menus.map((m, i) =>
                        i === index ? { ...m, name: e.target.value } : m
                      )
                    )
                  }
                />
              </div>
              <div>
                <label>
                  <small>Giá</small>
                </label>
                <InputNumber
                  style={{ width: "6rem" }}
                  value={menu.price}
                  min={0}
                  controls={false}
                  onChange={(val) =>
                    setMenus(
                      menus.map((m, i) =>
                        i === index ? { ...m, price: Number(val || 0) } : m
                      )
                    )
                  }
                />
              </div>
              <div>
                <label>
                  <small>SL</small>
                </label>
                <InputNumber
                  style={{ width: "3rem" }}
                  value={menu.qty}
                  min={0}
                  controls={false}
                  onChange={(val) =>
                    setMenus(
                      menus.map((m, i) =>
                        i === index ? { ...m, qty: Number(val || 0) } : m
                      )
                    )
                  }
                />
              </div>
              <Button
                disabled={
                  menu.name === "" || menu.price === 0 || menu.qty === 0
                }
                style={{ marginTop: "1.15rem" }}
                onClick={() => {
                  const found = data.find((item) => item.name === menu.name);
                  if (found) {
                    setData(
                      data.map((item) =>
                        item.name === menu.name
                          ? {
                              ...item,
                              qty: Number(menu.qty),
                              price: Number(menu.price),
                            }
                          : item
                      )
                    );
                  } else {
                    setData([
                      ...data,
                      {
                        ...menu,
                        qty: Number(menu.qty),
                        price: Number(menu.price),
                      },
                    ]);
                  }
                }}
              >
                +
              </Button>
            </div>
          ))}
          <div
            className="invoice w-100"
            style={{ padding: 0, maxWidth: "initial" }}
          >
            <h2 className="text-center">Danh sách món</h2>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size="small"
              className="mt-2"
              bordered
            />
            <div style={{ margin: "1rem 0" }}>
              <div className="d-flex justify-content-between align-items-center">
                <p>
                  <strong>Giảm Giá:</strong>
                </p>
                <InputNumber
                  style={{ width: "6rem" }}
                  value={discount}
                  min={0}
                  controls={false}
                  onChange={(val) => setDiscount(Number(val || 0))}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <p>
                  <strong>Tổng Thanh Toán:</strong>
                </p>
                <strong style={{ fontSize: "1rem" }}>
                  {(
                    data.reduce((sum, item) => sum + item.price * item.qty, 0) -
                    discount
                  ).toLocaleString()}
                </strong>
              </div>
            </div>
            <div className="d-flex">
              <Input
                placeholder="Địa chỉ ship"
                className="w-100"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Button disabled={data.length === 0} onClick={() => setData([])}>
                Xóa danh sách
              </Button>
              <Button
                type="primary"
                disabled={data.length === 0 || address === ""}
                onClick={() => {
                  if (data.length > 0) {
                    setViewInvoice(!viewInvoice);
                  }
                }}
              >
                Xem hóa đơn
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Invoice
          data={data}
          discount={discount}
          address={address}
          setViewInvoice={setViewInvoice}
        />
      )}
    </div>
  );
};

export default Menus;
