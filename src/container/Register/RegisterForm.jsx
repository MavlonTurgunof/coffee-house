// src/pages/Register.jsx
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import request from "../../components/config";

export default function RegisterForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    login: "",
    password: "",
    confirmPassword: "",
    city: "",
    street: "",
    houseNumber: "",
    paymentMethod: "cash",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        houseNumber: Number(form.houseNumber || 0),
      };
      const { data } = await request.post("/auth/register", payload);

      const token = data?.data?.access_token;
      if (token) localStorage.setItem("access_token", token);
      nav("/signin");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#e7d6c8] flex items-start justify-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-4xl bg-[#e7d6c8] text-[#2d2a26]"
      >
        <h1 className="text-5xl font-bold text-center mb-10">Registration</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block mb-1">Login</label>
            <input
              name="login"
              value={form.login}
              onChange={onChange}
              placeholder="Placeholder"
              className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Placeholder"
              className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Placeholder"
              className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1">City</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="Placeholder"
              className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Street</label>
            <input
              name="street"
              value={form.street}
              onChange={onChange}
              placeholder="Placeholder"
              className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">House number</label>
            <input
              type="number"
              name="houseNumber"
              value={form.houseNumber}
              onChange={onChange}
              placeholder="Placeholder"
              className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block mb-2">Pay by</label>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={form.paymentMethod === "cash"}
                  onChange={onChange}
                />
                <span>Cash</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={form.paymentMethod === "card"}
                  onChange={onChange}
                />
                <span>Card</span>
              </label>
            </div>
          </div>
        </div>

        {err && <p className="mt-4 text-red-600">{err}</p>}

        <div className="flex justify-center">
          <button
            disabled={loading}
            className="mt-8 px-8 py-3 rounded-full border border-[#2d2a26] hover:bg-white/40 transition"
          >
            {loading ? "Registering..." : "Registration"}
          </button>
        </div>
      </form>
    </section>
  );
}
