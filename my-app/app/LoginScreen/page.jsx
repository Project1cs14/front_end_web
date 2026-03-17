"use client";

// Place this file at: app/login/page.jsx  (or app/LoginScreen/page.jsx)

import BrandPanel from "../components/BrandPanel";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#e8e8e8] px-5 py-10">
      <div className="flex flex-col md:flex-row gap-5 w-full max-w-[960px]">
        <BrandPanel />
        <LoginForm />
      </div>
    </div>
  );
}