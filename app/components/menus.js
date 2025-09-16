"use client";
import React, { useState, useEffect } from "react";
import Invoice from "./Invoice";
import "../globals.css";

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [data, setData] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [viewInvoice, setViewInvoice] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const menus = localStorage.getItem("menus");
    if (menus && menus.length > 0) {
      setMenus(JSON.parse(menus));
    }
  }, []);

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {!viewInvoice ? (
        <div>
          <h1 className="d-flex justify-content-between align-items-center">
            <span>MENU</span>
            <button
              className="mt-2"
              onClick={() =>
                setMenus([...menus, { name: "", price: 0, qty: 1 }])
              }
            >
              Thêm món
            </button>
          </h1>
          {menus.map((menu, index) => (
            <div key={index + "menu"}>
              <div className="d-flex align-items-center mb-1">
                <div>
                  <label>
                    <strong
                      style={{ marginRight: "0.5rem", color: "red" }}
                      onClick={() =>
                        setMenus(menus.filter((m, i) => i !== index))
                      }
                    >
                      x
                    </strong>
                    <small>Tên món</small>
                  </label>
                  <input
                    type="text"
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
                  <input
                    style={{ width: "6rem" }}
                    type="number"
                    value={menu.price}
                    onChange={(e) =>
                      setMenus(
                        menus.map((m, i) =>
                          i === index ? { ...m, price: e.target.value } : m
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <label>
                    <small>SL</small>
                  </label>
                  <input
                    style={{ width: "3rem" }}
                    type="number"
                    value={menu.qty}
                    onChange={(e) =>
                      setMenus(
                        menus.map((m, i) =>
                          i === index ? { ...m, qty: e.target.value } : m
                        )
                      )
                    }
                  />
                </div>
                <button
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
                                qty: parseInt(menu.qty),
                                price: parseInt(menu.price),
                              }
                            : item
                        )
                      );
                    } else {
                      setData([
                        ...data,
                        {
                          ...menu,
                          qty: parseInt(menu.qty),
                          price: parseInt(menu.price),
                        },
                      ]);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="invoice w-100">
            <h3 className="text-center">Danh sách món</h3>
            <table className="mt-2">
              <thead>
                <tr>
                  <th>Tên món</th>
                  <th>Giá</th>
                  <th>SL</th>
                  <th>TT</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index + "data"}>
                    <td className="d-flex align-items-center">
                      <p
                        style={{
                          marginBottom: 0,
                          marginRight: "0.2rem",
                          color: "red",
                          fontWeight: "bold",
                        }}
                        onClick={() =>
                          setData(data.filter((item, i) => i !== index))
                        }
                      >
                        x
                      </p>
                      <p className="mb-0 w-100">{item.name}</p>
                    </td>
                    <td>{item.price.toLocaleString()}</td>
                    <td>{item.qty.toLocaleString()}</td>
                    <td>{(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ margin: "1rem 0" }}>
              <p className="d-flex justify-content-between align-items-center">
                <strong>Giảm Giá:</strong>
                <input
                  style={{ width: "6rem", textAlign: "center" }}
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value))}
                />
              </p>
              <p className="d-flex justify-content-between align-items-center mt-1">
                <strong>Tổng Thanh Toán:</strong>
                <strong>
                  {(
                    data.reduce((sum, item) => sum + item.price * item.qty, 0) -
                    discount
                  ).toLocaleString()}
                </strong>
              </p>
            </div>
            <hr />
            <div className="d-flex">
              <input
                placeholder="Địa chỉ ship"
                type="text"
                className="w-100"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between mt-2">
              <button disabled={data.length === 0} onClick={() => setData([])}>
                Xóa danh sách
              </button>
              <button
                disabled={data.length === 0 || address === ""}
                onClick={() => {
                  if (data.length > 0) {
                    localStorage.setItem("menus", JSON.stringify(menus));
                    setViewInvoice(!viewInvoice);
                  }
                }}
              >
                Xem hóa đơn
              </button>
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
