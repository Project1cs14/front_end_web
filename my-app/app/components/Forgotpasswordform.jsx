"use client";

import { useState } from "react";
import InputField from "./InputField";

// ── Forgot password fetch ──────────────────────────────────────────────────────
// POST /auth/forgotpassword  →  { email }
// Success: { message: "Un code de vérification a été envoyé à votre email." }
async function sendForgotPassword(email) {
  const res = await fetch(" https://back-end-sawu.onrender.com/auth/web/forgotpassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    // 404: { message: "Aucun compte associé à cet email" }
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ForgotPasswordForm({ onSuccess }) {
  // onSuccess(email) → parent navigates to OTP screen with the email
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await sendForgotPassword(email);
      setSuccess(data.message || "Verification code sent to your email.");
      // Pass email up so OTP screen knows which email to verify
      if (onSuccess) onSuccess(email);
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
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-3">
          Enter your email to receive a verification code.
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">

          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg py-2 text-center">
              {success}
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
              "Send Code"
            )}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <a href="/LoginScreen" className="text-[#0d1b6e] font-semibold hover:underline">
            Log In
          </a>
        </p>

      </div>
    </div>
  );
}