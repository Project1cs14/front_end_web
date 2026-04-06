"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";

// ── Reset password fetch ───────────────────────────────────────────────────────
// POST /auth/resetpassword  →  { email, password, confirm_password }
// Success (200): { message: "Mot de passe réinitialisé avec succès." }
async function sendResetPassword({ email, password, confirm_password }) {
  const res = await fetch("https://back-end-sawu.onrender.com/auth/web/resetpassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirm_password }),
  });

  const data = await res.json();

  if (!res.ok) {
    // 400: { message: "Les mots de passe ne correspondent pas." }
    throw new Error(data.message || "Password reset failed.");
  }

  return data;
}

// ── Component ──────────────────────────────────────────────────────────────────
// Props:
//   email — passed from parent (set during forgot password step)
export default function ResetPasswordForm({ email }) {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendResetPassword({
        email,
        password: form.password,
        confirm_password: form.confirmPassword,
      });

      // Redirect to login after successful reset
      router.push("/LoginScreen?reset=true");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-3xl flex flex-col justify-center min-h-[480px] shadow-sm">
      <div className="w-3/4 mx-auto flex flex-col gap-4">

        <h2 className="text-3xl font-bold text-[#0d1b6e] text-center mb-1">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-3">
          Set a new password for <span className="font-medium text-[#0d1b6e]">{email}</span>
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">

          <InputField
            type="password"
            name="password"
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
          />

          <InputField
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 text-center">
              {error}
            </div>
          )}

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
              "Reset Password"
            )}
          </button>

        </form>

      </div>
    </div>
  );
}