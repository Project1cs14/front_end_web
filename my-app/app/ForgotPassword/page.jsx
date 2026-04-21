"use client";

// Place this file at: app/forgot-password/page.jsx
// This single page manages all 3 steps:
//   Step 1 → Enter email   (ForgotPasswordForm)
//   Step 2 → Enter OTP     (VerifyOtpForm)
//   Step 3 → New password  (ResetPasswordForm)

import { useState } from "react";
import BrandPanel from "../components/BrandPanel";
import ForgotPasswordForm from "../components/Forgotpasswordform";
import VerifyOtpForm from "../components/Verifyotpform";
import ResetPasswordForm from "../components/Resetpasswordform";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);   // 1 | 2 | 3
  const [email, setEmail] = useState(""); // carried across all steps

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#e8e8e8] px-5 py-10">
      <div className="flex flex-col md:flex-row gap-5 w-full max-w-[900px]">
        <BrandPanel />

        {step === 1 && (
          <ForgotPasswordForm
            onSuccess={(submittedEmail) => {
              setEmail(submittedEmail);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <VerifyOtpForm
            email={email}
            onSuccess={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <ResetPasswordForm email={email} />
        )}
      </div>
    </div>
  );
}