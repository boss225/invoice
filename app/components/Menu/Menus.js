"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Invoice } from "../";
import "../../globals.css";
import MenuHeader from "./MenuHeader";
import MenuItemRow from "./MenuItemRow";
import OrderSummary from "./OrderSummary";
import { API_URL_MENU } from "../helper";

const Menus = ({ user }) => {
  const [menus, setMenus] = useState([]);
  const [data, setData] = useState([]);
  const [viewTab, setViewTab] = useState(0);
  const [address, setAddress] = useState("");

  const getDataInit = async () => {
    const menusStr = JSON.parse(localStorage?.menus || "[]");

    if (menusStr?.length > 0) {
      return setMenus(menusStr);
    }

    const resMenu = await fetch(
      `${API_URL_MENU}?row=${user === "xuan" ? 1 : 2}`
    ).then((e) => e.json());
    const menusRes = JSON.parse(resMenu?.value || "[]");

    if (menusRes?.length > 0) {
      localStorage.setItem("menus", resMenu?.value);
      return setMenus(menusRes);
    }
  };

  useEffect(() => {
    getDataInit();
  }, []);

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

  const handleAddToData = useCallback(
    (arr) => {
      const arrMenu = arr.map((e) => menus[e]);
      setData((prevData) => {
        const newData = [...prevData];
        arrMenu.forEach((menu) => {
          const found = newData.find((item) => item?.name === menu?.name);
          if (!found) {
            newData.push({
              ...menu,
              key: Date.now(),
              qty: 1,
              discount: 0,
              price: Number(menu?.price || 0),
            });
          }
        });
        return newData;
      });
    },
    [menus]
  );

  const handleChangeData = useCallback((items) => setData(items), []);

  const handleAddNewMenu = useCallback(() => {
    setMenus((prevMenus) => [...prevMenus, { name: "", price: 0 }]);
  }, []);

  const handleClearData = useCallback(() => {
    setData([]);
  }, []);

  const handleViewInvoice = useCallback(() => {
    if (data.length > 0) {
      setViewTab(2);
    }
  }, [data.length]);

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
      {viewTab !== 2 && (
        <MenuHeader
          user={user}
          menus={menus}
          viewTab={viewTab}
          setViewTab={setViewTab}
          onAddNewMenu={handleAddNewMenu}
        />
      )}
      {viewTab === 1 &&
        menus.map((menu, index) => (
          <MenuItemRow
            key={`menu-${index}`}
            menu={menu}
            index={index}
            onRemove={handleRemoveMenu}
            onNameChange={handleMenuNameChange}
            onPriceChange={handleMenuPriceChange}
          />
        ))}
      {!viewTab && (
        <OrderSummary
          menus={menus}
          data={data}
          handleChangeData={handleChangeData}
          address={address}
          onAddToData={handleAddToData}
          onRemoveDataItem={handleRemoveDataItem}
          onAddressChange={handleAddressChange}
          onClearData={handleClearData}
          onViewInvoice={handleViewInvoice}
        />
      )}
      {viewTab === 2 && (
        <Invoice data={data} address={address} setViewTab={setViewTab} />
      )}
    </div>
  );
};

export default Menus;
