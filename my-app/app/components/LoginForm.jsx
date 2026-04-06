"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialLoginButtons from "./SocialLoginButtons";

async function loginUser({ email, password }) {
  const res = await fetch("https://back-end-sawu.onrender.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
}

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

  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        router.push("/admin/Dashboard");
        break;
      case "admin_sec":
        router.push("/secadmin/Dashboard");
        break;
      case "maire":
        router.push("/maire/Dashboard");
        break;
      default:
        router.push("/admin/Dashboard");
    }
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

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("accessToken", data.accessToken);
      storage.setItem("refreshToken", data.refreshToken);
      storage.setItem("user", JSON.stringify(data.user));

      redirectByRole(data.user?.role);
      console.log(data.user?.role);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-3xl flex flex-col justify-center min-h-[560px] shadow-sm px-2 py-10">
      <div className="w-[80%] mx-auto flex flex-col gap-5">

        <h2 className="text-3xl font-bold text-[#0d1b6e] text-center mb-2">
          Log In
        </h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#0d1b6e] cursor-pointer"
              />
              Remember me
            </label>
            <a
              href="/ForgotPassword"
              className="text-sm text-[#0d1b6e] underline hover:opacity-70 transition-opacity"
            >
              Forgot password
            </a>
          </div>


          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2.5 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0d1b6e] text-white font-bold text-base rounded-xl hover:bg-[#1a2d8f] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-1"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              "Login"
            )}
          </button>

          <SocialLoginButtons />

        </form>

      </div>
    </div>
  );
}