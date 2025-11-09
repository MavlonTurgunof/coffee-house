import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import request from "../../components/config";

export default function SignInForm() {
  const nav = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await request.post("/auth/login", { login, password });
      const token = data?.data?.access_token;
      if (token) localStorage.setItem("access_token", token);
      nav("/");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#ecdccf] flex items-start justify-center px-4 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <h1 className="text-5xl font-bold text-center mb-10">Sign In</h1>

        <label className="block mb-1">Login</label>
        <input
          className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none mb-4"
          placeholder="Placeholder"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="w-full rounded-2xl border border-[#8b7f77]/40 bg-white/30 px-4 py-3 outline-none mb-6"
          placeholder="Placeholder"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <p className="mb-4 text-red-600">{err}</p>}

        <div className="flex justify-center">
          <button
            disabled={loading}
            className="px-8 py-3 rounded-full border border-[#2d2a26] hover:bg-white/40 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </section>
  );
}
