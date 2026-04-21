"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

// ── Suspend Modal ──────────────────────────────────────────────────────────
function SuspendModal({ admin, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Suspend Mayor Account</h3>
          <p className="text-sm text-gray-400 text-center mb-5">
            <span className="font-semibold text-gray-600">{admin?.name}</span> will be notified by email with the suspension details.
          </p>

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Suspension Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Violation of platform policies, suspicious activity, account compromise…"
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-400 bg-gray-50 transition"
          />
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email notification will be sent to <span className="font-medium text-gray-500">{admin?.email}</span>
          </p>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim() || loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Suspending…</>
              ) : "Suspend & Notify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Activate Modal ─────────────────────────────────────────────────────────
function ActivateModal({ admin, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Activate Mayor Account</h3>
          <p className="text-sm text-gray-500 mb-1 leading-relaxed">
            You are about to reactivate <span className="font-semibold text-gray-700">{admin?.name}</span>'s account.
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-6">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            A confirmation email will be sent to <span className="font-medium text-gray-500 ml-0.5">{admin?.email}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Activating…</>
              ) : "Activate & Notify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    : null;

// ── Enhanced Mayor Detail Sidebar ──────────────────────────────────────────
function MaireDetailSidebar({ maire, isOpen, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const info = maire || {};
  const isActive = info?.is_active === 1;

  const InfoRow = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 pb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1f5e]/10 to-[#1a1f5e]/5 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800 break-words">{value || "—"}</p>
      </div>
    </div>
  );

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-6 h-6 rounded-lg ${color} flex items-center justify-center text-white`}>
          {icon}
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-lg font-bold text-gray-900">{value || "—"}</p>
    </div>
  );

  return (
    <>
      <div
        className={"fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <div className={"fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out " + (isOpen ? "translate-x-0" : "translate-x-full")}>

        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-[#1a1f5e] via-[#1f2566] to-[#141852] px-6 pt-8 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Avatar with initials */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 border-4 border-white/20 flex items-center justify-center mb-4 shadow-xl">
            <span className="text-3xl font-bold text-white">
              {info?.name ? info.name.charAt(0).toUpperCase() : "M"}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white leading-tight mb-1">{info?.name || "Mayor"}</h2>
          <p className="text-blue-100 text-sm mb-4">{info?.email || "—"}</p>
          
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className={"inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full " + (isActive ? "bg-emerald-400/25 text-emerald-100" : "bg-rose-400/25 text-rose-100")}>
              <span className={"w-2 h-2 rounded-full " + (isActive ? "bg-emerald-300" : "bg-rose-300")} />
              {isActive ? "Active" : "Suspended"}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Contact & Location Overview */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Overview</p>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Phone"
                value={info?.phone || "—"}
                icon={<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                color="bg-blue-500"
              />
              <StatCard
                label="Account Type"
                value="Mayor"
                icon={<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>}
                color="bg-indigo-500"
              />
            </div>
          </div>

          {/* Detailed Information */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Information</p>
            <div className="space-y-1">
              <InfoRow
                label="Full Name"
                value={info?.name}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
              <InfoRow
                label="Email Address"
                value={info?.email}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              />
              <InfoRow
                label="Phone Number"
                value={info?.phone}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Jurisdiction</p>
            <div className="space-y-1">
              <InfoRow
                label="Wilaya"
                value={info?.wilaya}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              />
              <InfoRow
                label="Commune"
                value={info?.quartier_nom || info?.commune}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
              />
            </div>
          </div>

          {/* System Information */}
          <div className="px-6 py-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">System Information</p>
            <div className="space-y-1">
              <InfoRow
                label="Mayor ID"
                value={info?.id ? "#" + info.id : "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z M7.67 16.5h8.66M3 20h18" /></svg>}
              />
              <InfoRow
                label="User ID"
                value={info?.user_id ? "#" + info.user_id : "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <InfoRow
                label="Member Since"
                value={info?.created_at ? new Date(info.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
            </div>
          </div>
        </div>

        {/* Footer with action button */}
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50/50 flex gap-2">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white hover:border-gray-300 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MairesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maires, setMaires] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [wilayaFilter, setWilayaFilter] = useState("All");
  const [communeFilter, setCommuneFilter] = useState("All");

  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  const [selectedMaire, setSelectedMaire] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Suspend Modal state
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendingMaire, setSuspendingMaire] = useState(null);
  const [suspendLoading, setSuspendLoading] = useState(false);

  // Activate Modal state
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activatingMaire, setActivatingMaire] = useState(null);
  const [activateLoading, setActivateLoading] = useState(false);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wilayas, setWilayas] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [loadingQuartiers, setLoadingQuartiers] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", wilaya: "", quartier_id: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMaires = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/admin/maire`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) throw new Error("Failed to load mayors");
      const data = await res.json();
      setMaires(data.maires || data.mayors || []);
    } catch (err) {
      setError(err.message || "Failed to load mayors.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setIsAuthenticated(true);
    fetchMaires();
    const onFocus = () => { if (getToken()) fetchMaires(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchMaires, router]);

  // Fetch wilayas when modal opens
  useEffect(() => {
    if (!showCreateModal) return;
    const token = getToken();
    fetch(`${BASE_URL}/api/quartiers/wilayas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.wilayas || data.data || [];
        setWilayas(raw.map((w) => (typeof w === "string" ? w : w.name || w.nom || w.wilaya || String(w))));
      })
      .catch(console.error);
  }, [showCreateModal]);

  // Fetch quartiers when wilaya changes
  useEffect(() => {
    if (!form.wilaya) return;
    const token = getToken();
    setQuartiers([]);
    setForm((f) => ({ ...f, quartier_id: "" }));
    setLoadingQuartiers(true);
    fetch(`${BASE_URL}/api/quartiers?wilaya=${encodeURIComponent(form.wilaya)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.quartiers || data.data || [];
        setQuartiers(raw);
      })
      .catch(console.error)
      .finally(() => setLoadingQuartiers(false));
  }, [form.wilaya]);

  // Check if commune already has a mayor
  const communeHasMayor = (quartier_id) => {
    return maires.some((m) => m.quartier_id === parseInt(quartier_id) || m.id === parseInt(quartier_id));
  };

  // Handle suspend with reason
  const handleSuspendClick = (maire) => {
    setSuspendingMaire(maire);
    setShowSuspendModal(true);
  };

  const handleConfirmSuspend = async (reason) => {
    const token = getToken();
    const targetId = suspendingMaire.user_id || suspendingMaire.id;
    const candidateUrls = [
      `${BASE_URL}/admin/maire/${targetId}/deactivate`,
      `${BASE_URL}/admin/maire/deactivate/${targetId}`,
      `${BASE_URL}/admin/deactivate/${targetId}`,
    ];

    setSuspendLoading(true);
    try {
      let res = null;
      for (const url of candidateUrls) {
        for (const method of ["PATCH", "PUT", "POST"]) {
          res = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              reason: reason,
              suspend_reason: reason,
              suspension_reason: reason,
            }),
          });
          if (res.ok || res.status === 404) break;
        }
        if (res?.ok) break;
      }

      if (!res?.ok) throw new Error("Failed to suspend mayor");

      setMaires((prev) =>
        prev.map((m) =>
          (m.id || m.user_id) === targetId ? { ...m, is_active: 0 } : m
        )
      );

      showToast("Mayor suspended successfully. Email notification sent.", "success");
      setShowSuspendModal(false);
      setSuspendingMaire(null);
      await fetchMaires();
    } catch (err) {
      showToast(err.message || "Failed to suspend mayor", "error");
    } finally {
      setSuspendLoading(false);
    }
  };

  // Handle activate
  const handleActivateClick = (maire) => {
    setActivatingMaire(maire);
    setShowActivateModal(true);
  };

  const handleConfirmActivate = async () => {
    const token = getToken();
    const targetId = activatingMaire.user_id || activatingMaire.id;
    const candidateUrls = [
      `${BASE_URL}/admin/maire/${targetId}/activate`,
      `${BASE_URL}/admin/maire/activate/${targetId}`,
      `${BASE_URL}/admin/activate/${targetId}`,
    ];

    setActivateLoading(true);
    try {
      let res = null;
      for (const url of candidateUrls) {
        for (const method of ["PATCH", "PUT", "POST"]) {
          res = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          });
          if (res.ok || res.status === 404) break;
        }
        if (res?.ok) break;
      }

      if (!res?.ok) throw new Error("Failed to activate mayor");

      setMaires((prev) =>
        prev.map((m) =>
          (m.id || m.user_id) === targetId ? { ...m, is_active: 1 } : m
        )
      );

      showToast("Mayor activated successfully. Confirmation email sent.", "success");
      setShowActivateModal(false);
      setActivatingMaire(null);
      await fetchMaires();
    } catch (err) {
      showToast(err.message || "Failed to activate mayor", "error");
    } finally {
      setActivateLoading(false);
    }
  };

 const handleCreateMaire = async (e) => {
  e.preventDefault();
  const token = getToken();

  if (!form.quartier_id) {
    setCreateError("Please select a commune.");
    return;
  }

  if (communeHasMayor(form.quartier_id)) {
    setCreateError("This commune already has a mayor assigned.");
    return;
  }

  setCreating(true);
  setCreateError(null);

  try {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      wilaya: form.wilaya,
      quartier_id: Number(form.quartier_id),
    };

    console.log("Sending payload:", payload); // 🔥 DEBUG

    const res = await fetch(`${BASE_URL}/admin/maire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create mayor");
    }

    setShowCreateModal(false);
    setForm({ name: "", email: "", phone: "", wilaya: "", quartier_id: "" });
    setQuartiers([]);

    showToast("Mayor created successfully. Email sent.", "success");

    await fetchMaires();
  } catch (err) {
    console.error(err);
    setCreateError(err.message);
  } finally {
    setCreating(false);
  }
};

  const closeModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setForm({ name: "", email: "", phone: "", wilaya: "", quartier_id: "" });
    setQuartiers([]);
  };

  const openSidebar = (maire) => { setSelectedMaire(maire); setSidebarOpen(true); };

  // Derived filter options
  const uniqueWilayas = ["All", ...new Set(maires.map((m) => m.wilaya).filter(Boolean))];
  const uniqueCommunes = ["All", ...new Set(maires.map((m) => m.quartier_nom || m.commune).filter(Boolean))];

  const filtered = maires.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.commune?.toLowerCase().includes(q) ||
      m.quartier_nom?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && m.is_active === 1) ||
      (statusFilter === "Suspended" && m.is_active === 0);
    const matchWilaya = wilayaFilter === "All" || m.wilaya === wilayaFilter;
    const matchCommune = communeFilter === "All" || (m.quartier_nom || m.commune) === communeFilter;
    return matchSearch && matchStatus && matchWilaya && matchCommune;
  });

  const totalMaires = maires.length;
  const activeNow = maires.filter((m) => m.is_active === 1).length;
  const suspendedCount = maires.filter((m) => m.is_active === 0).length;

  if (!isAuthenticated) return <div className="min-h-screen bg-[#f4f6fb] w-full" />;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#1a1f5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading mayors...</p>
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
            <button onClick={fetchMaires} className="px-4 py-2 bg-[#1a1f5e] text-white rounded-xl text-sm">Retry</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb] p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 w-full">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight">Mayor Management</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage and monitor commune-level mayors across the platform.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#1a1f5e] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-[#141852] active:scale-95 transition-all shadow-lg shadow-[#1a1f5e]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Mayor
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Mayors", value: totalMaires, color: "text-[#1a1f5e]" },
            { label: "Active Now", value: activeNow, color: "text-emerald-500" },
            { label: "Suspended", value: suspendedCount, color: "text-rose-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
              <p className={"text-4xl font-bold " + color}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email or commune..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] transition"
            />
          </div>

          {[
            { value: wilayaFilter, setter: setWilayaFilter, options: uniqueWilayas, label: "Wilaya" },
            { value: communeFilter, setter: setCommuneFilter, options: uniqueCommunes, label: "Commune" },
            { value: statusFilter, setter: setStatusFilter, options: ["All Status", "Active", "Suspended"], label: "Status" },
          ].map(({ value, setter, options, label }) => (
            <div key={label} className="relative">
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 cursor-pointer min-w-[120px]"
              >
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ))}

          <button onClick={fetchMaires} className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="w-10 px-4 py-3.5"><input type="checkbox" className="rounded border-gray-300 accent-[#1a1f5e]" /></th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-10">#</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mayor Full Name</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Wilaya</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Commune</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-400 text-sm">No mayors found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((maire, index) => {
                  const isActive = maire.is_active === 1;
                  const targetId = maire.user_id || maire.id;
                  const commune = maire.quartier_nom || maire.commune || "—";
                  return (
                    <tr key={maire.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-4 py-3.5"><input type="checkbox" className="rounded border-gray-300 accent-[#1a1f5e]" /></td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{index + 1}</td>
                      <td className="px-4 py-3.5 font-semibold text-gray-800">{maire.name || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-500">{maire.email || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600">{maire.wilaya || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600">{commune}</td>
                      <td className="px-4 py-3.5">
                        <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " + (isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500")}>
                          <span className={"w-1.5 h-1.5 rounded-full " + (isActive ? "bg-emerald-500" : "bg-rose-500")} />
                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 justify-end">
                          {/* View */}
                          <button
                            onClick={() => openSidebar(maire)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-[#1a1f5e] hover:border-[#1a1f5e] hover:text-white text-gray-500 transition-all"
                            title="View details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Suspend / Activate */}
                          <button
                            onClick={() => isActive ? handleSuspendClick(maire) : handleActivateClick(maire)}
                            disabled={togglingId === targetId || suspendLoading || activateLoading}
                            className={"w-8 h-8 flex items-center justify-center border rounded-lg transition-all disabled:opacity-50 " + (isActive ? "border-amber-200 text-amber-500 hover:bg-amber-500 hover:border-amber-500 hover:text-white" : "border-emerald-200 text-emerald-500 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white")}
                            title={isActive ? "Suspend mayor" : "Activate mayor"}
                          >
                            {togglingId === targetId || suspendLoading || activateLoading ? (
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
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {totalMaires} mayors
            </div>
          )}
        </div>

        {/* Create Mayor Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 px-7 pt-7 pb-4 border-b border-gray-100 bg-white">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="pr-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Mayor</h2>
                  <p className="text-sm text-gray-500 mt-1">Assign a qualified administrator to a commune. One mayor per city.</p>
                </div>
              </div>

              <form onSubmit={handleCreateMaire} className="px-7 py-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Full Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmed Benali"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/20 focus:border-[#1a1f5e] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    placeholder="maire@commune.dz"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/20 focus:border-[#1a1f5e] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Phone Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="0550001818"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/20 focus:border-[#1a1f5e] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Wilaya <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select
                      required
                      value={form.wilaya}
                      onChange={(e) => setForm((f) => ({ ...f, wilaya: e.target.value }))}
                      className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/20 focus:border-[#1a1f5e] focus:bg-white transition cursor-pointer"
                    >
                      <option value="">Select a wilaya...</option>
                      {wilayas.map((w, i) => <option key={w + i} value={w}>{w}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {form.wilaya && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Commune <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        value={form.quartier_id}
                        onChange={(e) => setForm((f) => ({ ...f, quartier_id: e.target.value }))}
                        disabled={loadingQuartiers}
                        className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/20 focus:border-[#1a1f5e] focus:bg-white transition cursor-pointer disabled:opacity-60 disabled:bg-gray-100"
                      >
                        <option value="">{loadingQuartiers ? "Loading communes..." : "Select a commune..."}</option>
                        {quartiers.map((q) => {
                          const hasmayor = communeHasMayor(q.id);
                          return (
                            <option key={q.id} value={q.id} disabled={hasmayor}>
                              {q.nom || q.name}{hasmayor ? " (Has Mayor)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      <svg className="w-3.5 h-3.5 inline mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      One mayor can be assigned per commune
                    </p>
                  </div>
                )}

                {createError && (
                  <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    <p className="text-sm text-rose-700">{createError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={creating}
                    className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !form.name || !form.email || !form.phone || !form.wilaya || !form.quartier_id}
                    className="flex-1 py-3 bg-[#1a1f5e] text-white rounded-xl font-bold text-sm hover:bg-[#141852] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Mayor
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Suspend Modal */}
        {showSuspendModal && suspendingMaire && (
          <SuspendModal
            admin={suspendingMaire}
            onConfirm={handleConfirmSuspend}
            onCancel={() => {
              setShowSuspendModal(false);
              setSuspendingMaire(null);
            }}
            loading={suspendLoading}
          />
        )}

        {/* Activate Modal */}
        {showActivateModal && activatingMaire && (
          <ActivateModal
            admin={activatingMaire}
            onConfirm={handleConfirmActivate}
            onCancel={() => {
              setShowActivateModal(false);
              setActivatingMaire(null);
            }}
            loading={activateLoading}
          />
        )}

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
        <MaireDetailSidebar
          maire={selectedMaire}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </AdminLayout>
  );
}