"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Invoice } from "../";
import { Button, Input, InputNumber, Table } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import "../../globals.css";

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [data, setData] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [viewInvoice, setViewInvoice] = useState(false);
  const [address, setAddress] = useState("");

  // Load menus from localStorage on component mount
  useEffect(() => {
    const menusStr = localStorage.getItem("menus");
    if (menusStr && menusStr.length > 0) {
      try {
        setMenus(JSON.parse(menusStr));
      } catch (error) {
        console.warn("Failed to parse menus from localStorage:", error);
      }
    }
  }, []);

  // Save menus to localStorage whenever menus change
  useEffect(() => {
    localStorage.setItem("menus", JSON.stringify(menus));
  }, [menus]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleRemoveDataItem = useCallback((index) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  }, []);

  const handleRemoveMenu = useCallback((index) => {
    setMenus((prevMenus) => prevMenus.filter((_, i) => i !== index));
  }, []);

  const handleMenuNameChange = useCallback((index, value) => {
    setMenus((prevMenus) =>
      prevMenus.map((m, i) => (i === index ? { ...m, name: value } : m))
    );
  }, []);

  const handleMenuPriceChange = useCallback((index, value) => {
    setMenus((prevMenus) =>
      prevMenus.map((m, i) =>
        i === index ? { ...m, price: Number(value || 0) } : m
      )
    );
  }, []);

  const handleMenuQtyChange = useCallback((index, value) => {
    setMenus((prevMenus) =>
      prevMenus.map((m, i) =>
        i === index ? { ...m, qty: Number(value || 0) } : m
      )
    );
  }, []);

  const handleAddToData = useCallback(
    (menu) => {
      const found = data.find((item) => item.name === menu.name);
      if (found) {
        setData((prevData) =>
          prevData.map((item) =>
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
        setData((prevData) => [
          ...prevData,
          {
            ...menu,
            qty: Number(menu.qty),
            price: Number(menu.price),
          },
        ]);
      }
    },
    [data]
  );

  const handleAddNewMenu = useCallback(() => {
    setMenus((prevMenus) => [...prevMenus, { name: "", price: 0, qty: 1 }]);
  }, []);

  const handleClearData = useCallback(() => {
    setData([]);
  }, []);

  const handleViewInvoice = useCallback(() => {
    if (data.length > 0) {
      setViewInvoice((prevState) => !prevState);
    }
  }, [data.length]);

  const handleDiscountChange = useCallback((value) => {
    setDiscount(Number(value || 0));
  }, []);

  const handleAddressChange = useCallback((e) => {
    setAddress(e.target.value);
  }, []);

  const columns = useMemo(
    () => [
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
              onClick={() => handleRemoveDataItem(index)}
            >
              <CloseOutlined style={{ fontSize: "0.8rem" }} />
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
    ],
    [handleRemoveDataItem]
  );

  // Memoized data source
  const dataSource = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        key: index,
      })),
    [data]
  );

  // Memoized total calculation
  const totalAmount = useMemo(
    () => data.reduce((sum, item) => sum + item.price * item.qty, 0) - discount,
    [data, discount]
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "25rem",
        minHeight: "100vh",
        margin: "0 auto",
        zoom: 0.9,
      }}
    >
      {!viewInvoice ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
            <h1 className="mb-0">
              <strong>MENU</strong>
            </h1>
            <Button type="primary" onClick={handleAddNewMenu}>
              Thêm món
            </Button>
          </div>
          {menus.map((menu, index) => (
            <div
              key={`menu-${index}`}
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
                    onClick={() => handleRemoveMenu(index)}
                  >
                    <CloseOutlined style={{ fontSize: "0.8rem" }} />
                  </strong>
                  <small>Tên món</small>
                </label>
                <Input
                  value={menu.name}
                  onChange={(e) => handleMenuNameChange(index, e.target.value)}
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
                  onChange={(val) => handleMenuPriceChange(index, val)}
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
                  onChange={(val) => handleMenuQtyChange(index, val)}
                />
              </div>
              <Button
                disabled={
                  menu.name === "" || menu.price === 0 || menu.qty === 0
                }
                style={{ marginTop: "1.15rem", paddingInline: "0.4rem" }}
                onClick={() => handleAddToData(menu)}
                type="primary"
                danger
                icon={<PlusOutlined />}
              />
            </div>
          ))}
          <div
            className="invoice w-100"
            style={{ padding: 0, maxWidth: "initial", marginTop: "1rem" }}
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
                  onChange={handleDiscountChange}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <p>
                  <strong>Tổng Thanh Toán:</strong>
                </p>
                <strong style={{ fontSize: "1rem" }}>
                  {totalAmount.toLocaleString()}
                </strong>
              </div>
            </div>
            <div className="d-flex">
              <Input
                placeholder="Địa chỉ ship"
                className="w-100"
                value={address}
                onChange={handleAddressChange}
              />
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Button disabled={data.length === 0} onClick={handleClearData}>
                Xóa danh sách
              </Button>
              <Button
                type="primary"
                disabled={data.length === 0 || address === ""}
                onClick={handleViewInvoice}
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
