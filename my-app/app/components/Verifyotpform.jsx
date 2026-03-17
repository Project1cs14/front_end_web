"use client";

import { useState } from "react";
import InputField from "./InputField";

// ── Verify OTP fetch ───────────────────────────────────────────────────────────
// POST /auth/verifyotp  →  { email, otp }
// Success (201): { message: "Code vérifié avec succès.", verified: true }
async function sendVerifyOtp({ email, otp }) {
  const res = await fetch("https://back-end-sawu.onrender.com/auth/verifyotp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    // 400: { message: "Code invalide ou expiré" }
    throw new Error(data.message || "OTP verification failed.");
  }

  return data;
}

// ── Component ──────────────────────────────────────────────────────────────────
// Props:
//   email      — passed from ForgotPasswordForm via parent
//   onSuccess  — called when OTP verified, parent navigates to reset screen
export default function VerifyOtpForm({ email, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendVerifyOtp({ email, otp });
      // OTP verified — move to reset password screen
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-3xl flex flex-col justify-center min-h-[480px] shadow-sm">
      <div className="w-3/4 mx-auto flex flex-col gap-4">

        <h2 className="text-3xl font-bold text-[#0d1b6e] text-center mb-1">
          Verify Code
        </h2>
        <p className="text-sm text-gray-500 text-center mb-3">
          Enter the code sent to <span className="font-medium text-[#0d1b6e]">{email}</span>
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">

          <InputField
            type="text"
            name="otp"
            placeholder="Verification Code"
            value={otp}
            onChange={(e) => { setOtp(e.target.value); setError(""); }}
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
              "Verify Code"
            )}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500">
          Didn&apos;t receive the code?{" "}
          <a href="/ForgotPassword" className="text-[#0d1b6e] font-semibold hover:underline">
            Resend
          </a>
        </p>

      </div>
    </div>
  );
}