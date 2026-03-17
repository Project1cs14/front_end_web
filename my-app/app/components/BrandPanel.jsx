"use client";
import Image from "next/image";

export default function BrandPanel() {
  return (
    <div className="flex-1 bg-gray-100 rounded-3xl flex flex-col items-center justify-center py-14 shadow-sm min-h-[560px]">

      {/* Logo */}
      <div className="mb-2 bg-gray-100 rounded-2xl flex items-center justify-center">
        <Image
          alt="ZeroWaste Logo"
          src="./../adminlogo.svg"
          className="ml-2"
          width={200}
          height={200}
        />
      </div>

      {/* Divider with dot */}
      <div className="flex items-center gap-2 w-4/5 mb-3">
        <div className="flex-1 h-[1.5px] bg-[#0d1b6e] opacity-40" />
        <div className="w-5 h-5 bg-[#0d1b6e] rounded-full" />
        <div className="flex-1 h-[1.5px] bg-[#0d1b6e] opacity-40" />
      </div>

      {/* Brand name */}
      <h1 className="text-4xl font-extrabold text-[#0d1b6e] tracking-tight mb-6">
        ZeroWaste
      </h1>

      {/* Tagline */}
      <p className="text-sm text-gray-500 italic text-center">
        &quot;Welcome Back! Let&apos;s Get To Work.&quot;
      </p>

    </div>
  );
}