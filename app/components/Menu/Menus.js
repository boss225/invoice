"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Invoice } from "../";
import "../../globals.css";
import MenuHeader from "./MenuHeader";
import MenuItemRow from "./MenuItemRow";
import OrderSummary from "./OrderSummary";

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
      } catch (error) {
        console.warn("Failed to parse menus from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("menus", JSON.stringify(menus));
  }, [menus]);

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
          <MenuHeader onAddNewMenu={handleAddNewMenu} />
          {menus.map((menu, index) => (
            <MenuItemRow
              key={`menu-${index}`}
              menu={menu}
              index={index}
              onRemove={handleRemoveMenu}
              onNameChange={handleMenuNameChange}
              onPriceChange={handleMenuPriceChange}
              onQtyChange={handleMenuQtyChange}
              onAddToData={handleAddToData}
            />
          ))}
          <OrderSummary
            data={data}
            discount={discount}
            address={address}
            onRemoveDataItem={handleRemoveDataItem}
            onDiscountChange={handleDiscountChange}
            onAddressChange={handleAddressChange}
            onClearData={handleClearData}
            onViewInvoice={handleViewInvoice}
          />
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
