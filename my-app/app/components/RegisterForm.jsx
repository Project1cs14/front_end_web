"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialLoginButtons from "./SocialLoginButtons";

// ── Login fetch ────────────────────────────────────────────────────────────────
// POST /auth/login  →  { email, password }
// Success (200): { message, user: { id, name, email, role }, accessToken, refreshToken }
async function loginUser({ email, password }) {
  const res = await fetch("https://back-end-sawu.onrender.com/auth/web/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    // 404: { message: "Aucun compte associé à cet email" }
    // 400: { message: "..." }
    throw new Error(data.message || "Login failed.");
  }

  return data;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email: form.email, password: form.password });

      // Persist tokens — localStorage if "remember me", sessionStorage otherwise
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("accessToken", data.accessToken);
      storage.setItem("refreshToken", data.refreshToken);
      storage.setItem("user", JSON.stringify(data.user));

      // Role-based redirect
      router.push(data.user?.role === "admin" ? "/admin/Dashboard" : "/user/Dashboard");

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-3xl flex flex-col justify-center min-h-[480px] shadow-sm">
      <div className="w-3/4 mx-auto flex flex-col gap-4">

        <h2 className="text-3xl font-bold text-[#0d1b6e] text-center mb-3">
          Log In
        </h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">

          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#0d1b6e] cursor-pointer"
              />
              Remember me
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-[#0d1b6e] underline hover:opacity-70 transition-opacity"
            >
              Forgot password
            </a>
          </div>

          {/* Error message from backend */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 text-center">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0d1b6e] text-white font-bold text-base rounded-xl hover:bg-[#1a2d8f] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              "Login"
            )}
          </button>

          <SocialLoginButtons />

        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-[#0d1b6e] font-semibold hover:underline">
            Sign Up
          </a>
        </p>

      </div>
    </div>
  );
}