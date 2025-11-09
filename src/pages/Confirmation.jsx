// OrderConfirmed.jsx
import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";

const money = (n) => `$${Number(n).toFixed(2)}`;

export default function Confirmation() {
  const { orderId } = useParams();
  const { state } = useLocation() || {};
  const { items = [], totalPrice = 0, placedAt } = state || {};

  return (
    <section className="min-h-screen flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white/40 backdrop-blur rounded-2xl p-6 text-[#2d2a26]">
        <h1 className="text-3xl font-bold text-center mb-4">Receipt</h1>
        <div className="text-sm opacity-80 mb-6">
          <div>
            Order ID: <span className="font-mono">{orderId}</span>
          </div>
          <div>Date: {new Date(placedAt || Date.now()).toLocaleString()}</div>
        </div>

        <div className="space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-start justify-between border-b pb-2"
            >
              <div className="text-sm">
                <div className="font-medium">Product #{it.productId}</div>
                {it.size && <div>Size: {it.size.toUpperCase()}</div>}
                {it.additives?.length > 0 && (
                  <div>Additives: {it.additives.join(", ")}</div>
                )}
                <div>Qty: {it.quantity}</div>
              </div>
              {/* price per line is unknown from API; optional: compute from cart if you passed it */}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 text-lg font-semibold">
          <span>Total</span>
          <span>{money(totalPrice)}</span>
        </div>

        <p className="mt-6 text-center text-green-700 font-semibold">
          Your order is confirmed
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="px-6 py-2 rounded-full border hover:bg-white/50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
