"use client";

import { useEffect, useState, useCallback } from "react";

const BASE_URL = "https://back-end-sawu.onrender.com";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-[#f4f6fb] flex items-center justify-center flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  </div>
);

export default function AdminDetailSidebar({ admin, isOpen, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!admin?.user_id) return;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
        : null;
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "/admin/users/" + admin.user_id, {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        const data = await res.json();
        setDetail(data.user || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [admin?.user_id]);

  useEffect(() => {
    if (isOpen && admin) {
      setDetail(null);
      fetchDetail();
    }
  }, [isOpen, admin, fetchDetail]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const info = detail || admin;
  const isActive = info?.is_active === 1;

  return (
    <>
      {/* Backdrop */}
      <div
        className={"fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={"fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out " + (isOpen ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header */}
        <div className="bg-[#1a1f5e] px-6 pt-8 pb-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">
              {info?.name ? info.name.charAt(0).toUpperCase() : "?"}
            </span>
          </div>

          {loading ? (
            <div className="h-6 w-40 bg-white/10 rounded-lg animate-pulse mb-1" />
          ) : (
            <h2 className="text-lg font-bold text-white leading-tight">{info?.name || "Admin"}</h2>
          )}
          <p className="text-blue-200 text-xs mt-0.5">{info?.email || ""}</p>

          <div className="mt-3">
            <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " + (isActive ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300")}>
              <span className={"w-1.5 h-1.5 rounded-full " + (isActive ? "bg-emerald-400" : "bg-rose-400")} />
              {isActive ? "Active" : "Suspended"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-gray-100 rounded w-16 animate-pulse" />
                    <div className="h-3.5 bg-gray-100 rounded w-32 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 space-y-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Information</p>

              <InfoRow
                label="Full Name"
                value={info?.name}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
              <InfoRow
                label="Email"
                value={info?.email}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              />
              <InfoRow
                label="Phone"
                value={info?.phone}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
              />

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Location</p>
                <div className="space-y-5">
                  <InfoRow
                    label="Wilaya"
                    value={info?.wilaya}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  />
                  <InfoRow
                    label="Commune (Quartier)"
                    value={info?.quartier_nom}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">System</p>
                <div className="space-y-5">
                  <InfoRow
                    label="Admin ID"
                    value={info?.id ? "#" + info.id : "—"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
                  />
                  <InfoRow
                    label="Account Type"
                    value={info?.type === "admin_sec" ? "Secondary Admin" : info?.type || "Admin"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  />
                  <InfoRow
                    label="Member Since"
                    value={info?.created_at ? new Date(info.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}