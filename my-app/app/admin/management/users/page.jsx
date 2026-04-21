"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    : null;

const getMyId = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id || parsed?.user_id || null;
  } catch { return null; }
};

// ── Star Rating Display ────────────────────────────────────────────────────
function StarRating({ stars = 0, size = "sm" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} xmlns="http://www.w3.org/2000/svg"
          className={`${sz} ${s <= stars ? "text-amber-400" : "text-gray-200"} transition-colors`}
          viewBox="0 0 24 24" fill={s <= stars ? "currentColor" : "none"}
          stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
      {stars > 0 && (
        <span className="text-xs text-gray-400 ml-1">{Number(stars).toFixed(1)}</span>
      )}
    </div>
  );
}

// ── Tag Pill ───────────────────────────────────────────────────────────────
function TagPill({ label, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[color]}`}>
      {label}
    </span>
  );
}

// ── Detail Sidebar ─────────────────────────────────────────────────────────
function UserDetailSidebar({ user, isOpen, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const info = user || {};
  const isActive = info?.is_active === 1;
  const displayName = info.name || (info.first_name && info.last_name ? `${info.first_name} ${info.last_name}` : "User");
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const InfoRow = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[#f0f2fa] flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate mt-0.5">{value || <span className="text-gray-300">—</span>}</p>
      </div>
    </div>
  );

  const SectionTitle = ({ children }) => (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-4 pb-1">{children}</p>
  );

  return (
    <>
      <div
        className={"fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40 transition-opacity duration-300 " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <div className={"fixed top-0 right-0 h-full w-full max-w-[360px] bg-white z-50 flex flex-col transition-transform duration-300 ease-out shadow-[−4px_0_40px_rgba(0,0,0,0.10)] " + (isOpen ? "translate-x-0" : "translate-x-full")}>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a1f5e] to-[#2d3490] px-6 pt-10 pb-6 relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white leading-tight truncate">{displayName}</h2>
              <p className="text-blue-200 text-xs mt-0.5 truncate">{info?.email || ""}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " + (isActive ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300")}>
              <span className={"w-1.5 h-1.5 rounded-full " + (isActive ? "bg-emerald-400" : "bg-rose-400")} />
              {isActive ? "Active" : "Suspended"}
            </span>
            {info.is_food_saver === 1 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300">
                🌿 Food Saver
              </span>
            )}
            {info.stars > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-yellow-300">
                ★ {Number(info.stars).toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <SectionTitle>Contact</SectionTitle>
          <InfoRow label="Email" value={info?.email} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          } />
          <InfoRow label="Phone" value={info?.phone} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          } />
          <InfoRow label="Address" value={info?.adresse} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          } />

          <SectionTitle>Location</SectionTitle>
          <InfoRow label="Wilaya" value={info?.quartier_wilaya} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          } />
          <InfoRow label="Commune" value={info?.quartier_nom} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          } />
          {info?.search_distance && (
            <InfoRow label="Search Radius" value={`${(info.search_distance / 1000).toFixed(1)} km`} icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35"/></svg>
            } />
          )}

          <SectionTitle>Preferences</SectionTitle>
          {info?.dietary_restrictions?.length > 0 && (
            <div className="py-2.5 border-b border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dietary Restrictions</p>
              <div className="flex flex-wrap gap-1.5">
                {info.dietary_restrictions.map((d) => <TagPill key={d} label={d} color="emerald" />)}
              </div>
            </div>
          )}
          {info?.allergies?.length > 0 && (
            <div className="py-2.5 border-b border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Allergies</p>
              <div className="flex flex-wrap gap-1.5">
                {info.allergies.map((a) => <TagPill key={a} label={a} color="rose" />)}
              </div>
            </div>
          )}

          <SectionTitle>Account</SectionTitle>
          <InfoRow label="Points" value={info?.points != null ? `${info.points} pts` : null} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          } />
          <InfoRow label="Role" value={info?.role || "User"} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          } />
          <InfoRow label="Verified" value={info?.is_verified === 1 ? "Yes ✓" : "No"} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          } />
          <InfoRow
            label="Member Since"
            value={info?.created_at ? new Date(info.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : null}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ── Suspend Modal ──────────────────────────────────────────────────────────
function SuspendModal({ user, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  const displayName = user?.name || user?.email || "this user";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Suspend User</h3>
          <p className="text-sm text-gray-400 text-center mb-5">
            Provide a suspension reason for <span className="font-semibold text-gray-600">{displayName}</span>.
          </p>

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Suspension Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Violation of platform policy, suspicious activity..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-400 bg-gray-50 transition"
          />
          <div className="flex gap-3 mt-5">
            <button onClick={onCancel} disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60">
              Cancel
            </button>
            <button onClick={() => onConfirm(reason)} disabled={!reason.trim() || loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Suspending…</>) : "Suspend & Notify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Activate Modal ─────────────────────────────────────────────────────────
function ActivateModal({ user, onConfirm, onCancel, loading }) {
  const displayName = user?.name || user?.email || "this user";
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Activate User</h3>
          <p className="text-sm text-gray-500 mb-1 leading-relaxed">
            You are about to reactivate <span className="font-semibold text-gray-700">{displayName}</span>.
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-6">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            A confirmation email will be sent to the user.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Activating…</>) : "Activate & Notify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ─────────────────────────────────────────────────────────
function DeleteUserModal({ user, onConfirm, onCancel, loading }) {
  const displayName = user?.name || user?.email || "this user";
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User</h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            You are about to permanently delete <span className="font-semibold text-gray-700">{displayName}</span>. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting…</>) : "Delete User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function UserAvatar({ name, size = "sm" }) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
  ];
  const color = colors[(name || "").charCodeAt(0) % colors.length];
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} ${color} rounded-lg flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function UsersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [wilayaFilter, setWilayaFilter] = useState("All");
  const [communeFilter, setCommuneFilter] = useState("All");

  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [activateTarget, setActivateTarget] = useState(null);
  const [activateLoading, setActivateLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.users)) list = data.users;
      else if (Array.isArray(data.data)) list = data.data;

      const myId = getMyId();
      if (myId) list = list.filter((u) => (u.id || u.user_id) !== myId);

      setUsers(list);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setIsAuthenticated(true);
    fetchUsers();
    const onFocus = () => { if (getToken()) fetchUsers(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchUsers, router]);

  const handleSuspendConfirm = async (reason) => {
    if (!suspendTarget) return;
    const token = getToken();
    const targetId = suspendTarget.user_id || suspendTarget.id;
    setSuspendLoading(true);
    setTogglingId(targetId);
    try {
      const res = await fetch(`${BASE_URL}/admin/deactivate/${targetId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Suspend failed");
      
      setUsers((prev) => prev.map((u) =>
        (u.id || u.user_id) === targetId ? { ...u, is_active: 0 } : u
      ));
      showToast(`${suspendTarget.name || suspendTarget.email} suspended successfully`, "success");
      setSuspendTarget(null);
    } catch (err) {
      showToast(err.message || "Failed to suspend user", "error");
    } finally {
      setSuspendLoading(false);
      setTogglingId(null);
    }
  };

  const handleActivateConfirm = async () => {
    if (!activateTarget) return;
    const token = getToken();
    const targetId = activateTarget.user_id || activateTarget.id;
    setActivateLoading(true);
    setTogglingId(targetId);
    try {
      const res = await fetch(`${BASE_URL}/admin/activate/${targetId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Activation failed");
      
      setUsers((prev) => prev.map((u) =>
        (u.id || u.user_id) === targetId ? { ...u, is_active: 1 } : u
      ));
      showToast(`${activateTarget.name || activateTarget.email} activated successfully`, "success");
      setActivateTarget(null);
    } catch (err) {
      showToast(err.message || "Failed to activate user", "error");
    } finally {
      setActivateLoading(false);
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const token = getToken();
    const targetId = deleteTarget.user_id || deleteTarget.id;
    setDeleteLoading(true);
    setTogglingId(targetId);
    try {
      const res = await fetch(`${BASE_URL}/admin/delete/${targetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      
      setUsers((prev) => prev.filter((u) => (u.id || u.user_id) !== targetId));
      showToast(`${deleteTarget.name || deleteTarget.email} deleted successfully`, "success");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || "Failed to delete user", "error");
    } finally {
      setDeleteLoading(false);
      setTogglingId(null);
    }
  };

  const openSidebar = (user) => { setSelectedUser(user); setSidebarOpen(true); };

  // FIX: Use quartier_wilaya (not wilaya) for filter options — matches the API response
  const uniqueWilayas = ["All", ...new Set(users.map((u) => u.quartier_wilaya).filter(Boolean))];
  const uniqueCommunes = ["All", ...new Set(users.map((u) => u.quartier_nom).filter(Boolean))];

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && u.is_active === 1) ||
      (statusFilter === "Suspended" && u.is_active === 0);
    // FIX: Filter by quartier_wilaya (not wilaya)
    const matchWilaya = wilayaFilter === "All" || u.quartier_wilaya === wilayaFilter;
    const matchCommune = communeFilter === "All" || u.quartier_nom === communeFilter;
    return matchSearch && matchStatus && matchWilaya && matchCommune;
  });

  const totalUsers = users.length;
  const activeNow = users.filter((u) => u.is_active === 1).length;
  const suspendedCount = users.filter((u) => u.is_active === 0).length;
  const foodSavers = users.filter((u) => u.is_food_saver === 1).length;

  if (!isAuthenticated) return <div className="min-h-screen bg-[#f4f6fb] w-full" />;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#1a1f5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="text-center">
            <p className="text-red-500 font-medium mb-3">{error}</p>
            <button onClick={fetchUsers} className="px-4 py-2 bg-[#1a1f5e] text-white rounded-xl text-sm">Retry</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb]">

        {/* Modals */}
        {suspendTarget && (
          <SuspendModal user={suspendTarget} onConfirm={handleSuspendConfirm}
            onCancel={() => setSuspendTarget(null)} loading={suspendLoading} />
        )}
        {activateTarget && (
          <ActivateModal user={activateTarget} onConfirm={handleActivateConfirm}
            onCancel={() => setActivateTarget(null)} loading={activateLoading} />
        )}
        {deleteTarget && (
          <DeleteUserModal user={deleteTarget} onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6 w-full">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight">User Management</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage and monitor all registered users across the platform.</p>
          </div>
          <button onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards — 4 cards now including Food Savers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: totalUsers, color: "text-[#1a1f5e]", bg: "bg-[#1a1f5e]/5", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )},
            { label: "Active Now", value: activeNow, color: "text-emerald-600", bg: "bg-emerald-50", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )},
            { label: "Suspended", value: suspendedCount, color: "text-rose-600", bg: "bg-rose-50", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            )},
            { label: "Food Savers", value: foodSavers, color: "text-amber-600", bg: "bg-amber-50", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            )},
          ].map(({ label, value, color, bg, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`text-2xl font-bold ${color} mt-0.5`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" placeholder="Search by name, email or phone..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] transition" />
          </div>

          {[
            { value: wilayaFilter, setter: setWilayaFilter, options: uniqueWilayas, label: "Wilaya" },
            { value: communeFilter, setter: setCommuneFilter, options: uniqueCommunes, label: "Commune" },
            { value: statusFilter, setter: setStatusFilter, options: ["All Status", "Active", "Suspended"], label: "Status" },
          ].map(({ value, setter, options, label }) => (
            <div key={label} className="relative">
              <select value={value} onChange={(e) => setter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 cursor-pointer min-w-[120px]">
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="w-10 px-4 py-3.5"><input type="checkbox" className="rounded border-gray-300 accent-[#1a1f5e]" /></th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-10">#</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3.5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-400 text-sm">No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, index) => {
                    const isActive = user.is_active === 1;
                    const targetId = user.user_id || user.id;
                    // FIX: Use stars directly from API (no manual override needed)
                    const stars = user.stars || 0;
                    const displayName = user.name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";
                    // FIX: Use quartier_wilaya for display in table
                    const locationDisplay = [user.quartier_nom, user.quartier_wilaya].filter(Boolean).join(", ") || "—";

                    return (
                      <tr key={user.id || user.user_id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300 accent-[#1a1f5e]" /></td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-medium">{index + 1}</td>

                        {/* User cell: avatar + name + email */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={displayName} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email || "—"}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{user.phone || "—"}</td>

                        {/* Location: commune + wilaya */}
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <span className="truncate max-w-[140px] block" title={locationDisplay}>{locationDisplay}</span>
                        </td>

                        {/* Points badge */}
                        <td className="px-4 py-3">
                          {user.points != null ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              {user.points}
                            </span>
                          ) : <span className="text-gray-300 text-sm">—</span>}
                        </td>

                        <td className="px-4 py-3">
                          <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " + (isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500")}>
                            <span className={"w-1.5 h-1.5 rounded-full " + (isActive ? "bg-emerald-400" : "bg-rose-400")} />
                            {isActive ? "Active" : "Suspended"}
                          </span>
                        </td>

                        {/* Rating stars — from API */}
                        <td className="px-4 py-3">
                          <StarRating stars={stars} />
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 justify-end">
                            {/* View */}
                            <button onClick={() => openSidebar(user)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-[#1a1f5e] hover:border-[#1a1f5e] hover:text-white text-gray-400 transition-all"
                              title="View details">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Suspend / Activate */}
                            <button
                              onClick={() => isActive ? setSuspendTarget(user) : setActivateTarget(user)}
                              disabled={togglingId === targetId}
                              className={"w-8 h-8 flex items-center justify-center border rounded-lg transition-all disabled:opacity-50 " + (isActive ? "border-amber-200 text-amber-500 hover:bg-amber-500 hover:border-amber-500 hover:text-white" : "border-emerald-200 text-emerald-500 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white")}
                              title={isActive ? "Suspend user" : "Activate user"}>
                              {togglingId === targetId ? (
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : isActive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(user)}
                              disabled={togglingId === targetId}
                              className="w-8 h-8 flex items-center justify-center border border-rose-100 rounded-lg text-rose-400 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-all disabled:opacity-50"
                              title="Delete user">
                              {togglingId === targetId ? (
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{totalUsers}</span> users
              </p>
              {search || statusFilter !== "All Status" || wilayaFilter !== "All" || communeFilter !== "All" ? (
                <button
                  onClick={() => { setSearch(""); setStatusFilter("All Status"); setWilayaFilter("All"); setCommuneFilter("All"); }}
                  className="text-xs text-[#1a1f5e] font-medium hover:underline"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className={"fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium " + (toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white")}>
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            )}
            {toast.msg}
          </div>
        )}

        {/* Detail Sidebar */}
        <UserDetailSidebar user={selectedUser} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </AdminLayout>
  );
}