// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { getCart, updateQty, removeFromCart } from "../../utils/cart";
import Logo from "../../assets/logo.svg";
import { MenuImages } from "../../Data/MenuData";
import { Link, useNavigate } from "react-router-dom";

const imgByName = (name) => MenuImages?.[name?.toLowerCase?.() || ""] || Logo;

const toMoney = (n) => `$${Number(n).toFixed(2)}`;

export default function CartList() {
  const [cart, setCart] = useState([]);

  const refresh = () => setCart(getCart());
  useEffect(() => {
    refresh();
  }, []);

  const nav = useNavigate();
  const onPlaceOrder = () => {
    const token = localStorage.getItem("access_token");
    nav(token ? "/order" : "/signin");
  };

  const subTotal = cart.reduce((s, x) => s + x.unitPrice * x.qty, 0);

  return (
    <section className="max-w-4xl mx-auto p-6 text-text1">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.lineId}
              className="flex items-center gap-4 p-4 border rounded-2xl bg-card text-card-foreground"
            >
              <img
                src={imgByName(item.imageKey)}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-contain bg-bg"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm opacity-80">
                  {item.sizeLabel ? `Size: ${item.sizeLabel}` : "Default size"}
                  {item.additives?.length
                    ? ` • Additives: ${item.additives.join(", ")}`
                    : ""}
                </div>
                <div className="text-sm">{toMoney(item.unitPrice)} each</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 rounded-full border"
                  onClick={() => {
                    const q = Math.max(1, item.qty - 1);
                    setCart(updateQty(item.lineId, q));
                  }}
                >
                  −
                </button>
                <span className="w-8 text-center">{item.qty}</span>
                <button
                  className="w-8 h-8 rounded-full border"
                  onClick={() => {
                    setCart(updateQty(item.lineId, item.qty + 1));
                  }}
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right font-semibold">
                {toMoney(item.unitPrice * item.qty)}
              </div>

              <button
                className="ml-2 px-3 py-1 rounded-lg border hover:bg-bg"
                onClick={() => setCart(removeFromCart(item.lineId))}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-end text-xl font-bold">
            Subtotal: {toMoney(subTotal)}
          </div>
          <button
            onClick={onPlaceOrder}
            className="border border-secondary hover:text-text2 hover:bg-secondary px-4 py-2"
          >
            Place order
          </button>
        </div>
      )}
    </section>
  );
}
