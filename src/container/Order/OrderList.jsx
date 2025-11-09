// src/pages/OrderList.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.svg";
import { MenuImages } from "../../Data/MenuData";
import request from "../../components/config";

const imgByName = (name) => MenuImages?.[name?.toLowerCase?.() || ""] || Logo;
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");
const money = (n) => `$${Number(n).toFixed(2)}`;

export default function OrderList() {
  const nav = useNavigate();
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const user = getUser();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return nav("/signin");
    setCart(getCart());
  }, [nav]);

  const totalPrice = useMemo(
    () => cart.reduce((s, x) => s + x.unitPrice * x.qty, 0),
    [cart]
  );

  const body = {
    items: cart.map((x) => ({
      productId: x.id,
      size: x.sizeKey || null,
      additives: x.additives || [],
      quantity: x.qty ?? 1,
    })),
    totalPrice: Number(totalPrice.toFixed(2)),
  };

  const confirm = async () => {
    try {
      setSubmitting(true);
      const { data } = await request.post("/orders/confirm", body);
      nav(`/order/confirmed/${data?.data?.orderId}`, {
        state: {
          orderId: data?.data?.orderId,
          items: body.items,
          totalPrice: body.totalPrice,
          placedAt: new Date().toISOString(),
          user,
        },
      });
      localStorage.setItem("cart", "[]");
    } catch (e) {
      alert(e?.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.length) {
    return (
      <section className="max-w-4xl mx-auto p-6 text-text1">
        <h1 className="text-3xl font-semibold mb-6">Order</h1>
        <p>Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-6 text-text1">
      <h1 className="text-3xl font-semibold mb-6">Order</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.lineId}
            className="flex items-center gap-4 p-4 border rounded-2xl bg-card text-card-foreground"
          >
            <img
              src={imgByName(item.imageKey)}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-contain bg-bg"
            />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm opacity-80">
                {item.sizeLabel ? `Size: ${item.sizeLabel}` : "Default size"}
                {item.additives?.length
                  ? ` • Additives: ${item.additives.join(", ")}`
                  : ""}
              </div>
            </div>
            <div className="text-sm w-24 text-right opacity-60 line-through"></div>
            <div className="w-24 text-right font-semibold">
              {money(item.unitPrice * item.qty)}
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 pt-4">
          <div className="font-semibold">Total:</div>
          <div className="col-span-1 sm:col-start-3 text-right font-semibold">
            {money(totalPrice)}
          </div>

          <div className="font-semibold">Address:</div>
          <div className="col-span-2 sm:col-span-1 text-right">
            {user.city && user.street
              ? `${user.city}, ${user.street}, ${user.houseNumber ?? ""}`
              : "—"}
          </div>

          <div className="font-semibold">Pay by:</div>
          <div className="col-span-2 sm:col-span-1 text-right capitalize">
            {user.paymentMethod || "—"}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={confirm}
            disabled={submitting}
            className="px-8 py-3 rounded-full border border-[#2d2a26] hover:bg-white/40 transition"
          >
            {submitting ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </section>
  );
}
