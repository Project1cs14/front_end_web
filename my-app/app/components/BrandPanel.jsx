"use client";
import Image from "next/image";

export default function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-1 bg-white rounded-[20%] flex-col items-center justify-center py-14 shadow-sm min-h-[700px]">

      {/* Logo */}
      <div className="mb-2 flex items-center justify-center">
        <Image
          alt="ZeroWaste Logo"
          src="./../adminlogo.svg"
          className="ml-2"
          width={200}
          height={200}
        />
      </div>

      {/* Tagline */}
      <p className="text-sm text-gray-500 italic text-center">
        &quot;Welcome Back! Let&apos;s Get To Work.&quot;
      </p>

    </div>
  );
}