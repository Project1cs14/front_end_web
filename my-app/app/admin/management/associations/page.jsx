"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    : null;

const parseZones = (z) => {
  try { return typeof z === "string" ? JSON.parse(z) : z || []; }
  catch { return []; }
};

// ── Info Row ───────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-[#f4f6fb] flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">{value || "—"}</p>
    </div>
  </div>
);

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name, url, size = 34 }) {
  const letter = name?.charAt(0)?.toUpperCase() || "?";
  const seed = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const palettes = [
    { bg: "#E9EDF5", fg: "#2E4080" }, { bg: "#EEE9E3", fg: "#6B4A28" },
    { bg: "#E4EDE8", fg: "#235A38" }, { bg: "#EDE4E8", fg: "#6A2840" },
    { bg: "#E8E4EE", fg: "#3D2870" }, { bg: "#EBE9E0", fg: "#4A5228" },
  ];
  const p = palettes[seed % palettes.length];

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: 8, background: p.bg, color: p.fg,
      fontSize: size * 0.38, fontWeight: 700, display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }}>
      {letter}
    </div>
  );
}

// ── Reject Modal ───────────────────────────────────────────────────────────
function RejectModal({ association, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-7 pt-7 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Reject Association</h3>
          <p className="text-sm text-gray-400 mt-0.5">{association?.nom_association}</p>
        </div>
        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a clear reason for rejection…"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] focus:bg-white transition resize-none"
            />
          </div>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim() || loading}
            className="w-full py-3.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing…
              </span>
            ) : "Confirm Rejection"}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Sidebar ─────────────────────────────────────────────────────────
function AssocDetailSidebar({ assoc, isOpen, onClose, onApprove, onReject, actionLoading, isPending }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!assoc) return null;
  const isLoading = actionLoading === assoc.id;
  const zones = parseZones(assoc.zones_intervention);

  const docs = [
    { label: "Statuts", url: assoc.doc_statuts_url },
    { label: "Certificat", url: assoc.doc_certificat_url },
    { label: "Membres", url: assoc.doc_membres_url },
  ].filter((d) => d.url);

  return (
    <>
      <div
        className={"fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <div className={"fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out " + (isOpen ? "translate-x-0" : "translate-x-full")}>

        {/* Header */}
        <div className="bg-[#1a1f5e] px-6 pt-8 pb-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="mb-4">
            <Avatar name={assoc.nom_association} url={assoc.logo_url} size={56} />
          </div>
          <h2 className="text-lg font-bold text-white leading-tight">{assoc.nom_association}</h2>
          <p className="text-blue-200 text-xs mt-0.5">{assoc.email || ""}</p>
          <div className="mt-3">
            <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " + (isPending ? "bg-amber-400/20 text-amber-300" : "bg-emerald-400/20 text-emerald-300")}>
              <span className={"w-1.5 h-1.5 rounded-full " + (isPending ? "bg-amber-400" : "bg-emerald-400")} />
              {isPending ? "Pending" : "Approved"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Organization Information</p>

          <InfoRow label="Association Name" value={assoc.nom_association} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          } />
          <InfoRow label="Email" value={assoc.email} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          } />
          <InfoRow label="Phone" value={assoc.phone} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          } />
          <InfoRow label="Registration No." value={assoc.registration_number} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          } />
          <InfoRow label="Year Founded" value={assoc.year_founded} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          } />
          <InfoRow label="Address" value={assoc.adresse} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          } />
          <InfoRow label="Capacity" value={assoc.capacite} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          } />
          <InfoRow label="Hours" value={assoc.horaires} icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          } />

          {assoc.website_url && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f4f6fb] flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Website</p>
                <a href={assoc.website_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline break-all">{assoc.website_url}</a>
              </div>
            </div>
          )}

          {/* Zones */}
          {zones.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Intervention Zones</p>
              <div className="flex flex-wrap gap-2">
                {zones.map((z, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{z}</span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {docs.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Documents</p>
              <div className="flex flex-col gap-2">
                {docs.map((doc) => (
                  <button
                    key={doc.label}
                    onClick={() => window.open(doc.url, "_blank", "noopener,noreferrer")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-left w-full"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{doc.label}</p>
                      <p className="text-xs text-gray-400">Click to view</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isPending ? (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-2">
            <button
              onClick={() => onReject(assoc)}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-sm font-semibold hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove(assoc.id)}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-[#1a1f5e] text-white text-sm font-semibold hover:bg-[#141852] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {isLoading ? "Approving…" : "Approve"}
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AssociationsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("All");
  const [communeFilter, setCommuneFilter] = useState("All");

  const [actionLoading, setActionLoading] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [selectedAssoc, setSelectedAssoc] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAssociations = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/associations/pending`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/admin/associations/approved`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!pendingRes.ok) throw new Error("Failed to load associations");
      const pendingData = await pendingRes.json();
      setPending(pendingData.associations || []);
      if (approvedRes.ok) {
        const approvedData = await approvedRes.json();
        setApproved(approvedData.associations || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load associations.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAssociations(); }, [fetchAssociations]);

  const handleApprove = async (id) => {
    const token = getToken(); if (!token) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${BASE_URL}/admin/associations/${id}/approve`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const approvedItem = pending.find((a) => a.id === id);
      setPending((prev) => prev.filter((a) => a.id !== id));
      if (approvedItem) setApproved((prev) => [...prev, { ...approvedItem, is_approved: 1 }]);
      setSidebarOpen(false);
      showToast("Association approved successfully.", "success");
    } catch { showToast("Failed to approve association.", "error"); }
    finally { setActionLoading(null); }
  };

  const handleRejectConfirm = async (reason) => {
    const token = getToken(); if (!token || !rejectTarget) return;
    setRejectLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/associations/${rejectTarget.id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      setPending((prev) => prev.filter((a) => a.id !== rejectTarget.id));
      setSidebarOpen(false);
      showToast("Association rejected.", "error");
      setRejectTarget(null);
    } catch { showToast("Failed to reject association.", "error"); }
    finally { setRejectLoading(false); }
  };

  const openSidebar = (assoc) => { setSelectedAssoc(assoc); setSidebarOpen(true); };

  const currentList = activeTab === "pending" ? pending : approved;

  // Derive wilaya/commune options from zones_intervention (zones) and adresse
  const uniqueWilayas = ["All", ...new Set(
    currentList.flatMap((a) => parseZones(a.zones_intervention)).filter(Boolean)
  )];
  const uniqueCommunes = ["All", ...new Set(
    currentList.map((a) => a.adresse).filter(Boolean)
  )];

  const filtered = currentList.filter((a) => {
    const q = search.toLowerCase();
    const zones = parseZones(a.zones_intervention);
    const matchSearch = !q ||
      a.nom_association?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.registration_number?.toLowerCase().includes(q) ||
      a.adresse?.toLowerCase().includes(q);
    const matchWilaya = wilayaFilter === "All" || zones.includes(wilayaFilter);
    const matchCommune = communeFilter === "All" || a.adresse === communeFilter;
    return matchSearch && matchWilaya && matchCommune;
  });

  const totalPending = pending.length;
  const totalApproved = approved.length;
  const totalAll = totalPending + totalApproved;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#1a1f5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading associations…</p>
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
            <button onClick={fetchAssociations} className="px-4 py-2 bg-[#1a1f5e] text-white rounded-xl text-sm">Retry</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb] ">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 w-full">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight">Associations</h1>
            <p className="text-gray-400 mt-1 text-sm">Review and manage association requests across the platform.</p>
          </div>
          <button
            onClick={fetchAssociations}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Associations", value: totalAll, color: "text-[#1a1f5e]" },
            { label: "Pending Review", value: totalPending, color: "text-amber-500" },
            { label: "Approved", value: totalApproved, color: "text-emerald-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
              <p className={"text-4xl font-bold " + color}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-5">
          {[
            { key: "pending", label: "Pending", count: totalPending, countColor: "bg-amber-500" },
            { key: "approved", label: "Approved", count: totalApproved, countColor: "bg-emerald-500" },
          ].map(({ key, label, count, countColor }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setWilayaFilter("All"); setCommuneFilter("All"); setSearch(""); }}
              className={"flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors " + (activeTab === key ? "border-[#1a1f5e] text-[#1a1f5e]" : "border-transparent text-gray-400 hover:text-gray-600")}
            >
              {label}
              <span className={"inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white " + countColor}>
                {count}
              </span>
            </button>
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
              placeholder="Search by name, email, or registration…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] transition"
            />
          </div>

          {[
            { value: wilayaFilter, setter: setWilayaFilter, options: uniqueWilayas, label: "Wilaya" },
            { value: communeFilter, setter: setCommuneFilter, options: uniqueCommunes, label: "Commune" },
          ].map(({ value, setter, options, label }) => (
            <div key={label} className="relative">
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 cursor-pointer min-w-[120px]"
              >
                {options.map((o, idx) => <option key={`${o}-${idx}`} value={o}>{o}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ))}

          <button onClick={fetchAssociations} className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors" title="Refresh">
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
                <th className="px-2 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-10">#</th>
                <th className="px-2 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo & Name</th>
                <th className="px-2 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-2 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Wilaya</th>
                <th className="px-2 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Commune</th>
                <th className="px-2 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year Founded</th>
                <th className="px-2 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-2 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-gray-400 text-sm">
                        {search ? "No associations match your search" : activeTab === "pending" ? "No pending associations" : "No approved associations"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((assoc, index) => {
                  const isPending = activeTab === "pending";
                  const zones = parseZones(assoc.zones_intervention);
                  const isRowLoading = actionLoading === assoc.id;
                  return (
                    <tr key={assoc.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-4 py-3.5"><input type="checkbox" className="rounded border-gray-300 accent-[#1a1f5e]" /></td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{index + 1}</td>

                      {/* Logo & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={assoc.nom_association} url={assoc.logo_url} size={32} />
                          <span className="font-semibold text-gray-800 whitespace-nowrap">{assoc.nom_association || "—"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-gray-500">{assoc.email || "—"}</td>

                      {/* Wilaya from zones_intervention */}
                      <td className="px-4 py-3.5 text-gray-600">
                        {zones.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {zones.slice(0, 2).map((z, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{z}</span>
                            ))}
                            {zones.length > 2 && <span className="text-xs text-gray-400">+{zones.length - 2}</span>}
                          </div>
                        ) : "—"}
                      </td>

                      {/* Commune = adresse */}
                      <td className="px-4 py-3.5 text-gray-600">{assoc.adresse || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600">{assoc.year_founded || "—"}</td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " + (isPending ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600")}>
                          <span className={"w-1.5 h-1.5 rounded-full " + (isPending ? "bg-amber-500" : "bg-emerald-500")} />
                          {isPending ? "Pending" : "Approved"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 justify-end">
                          {/* View */}
                          <button
                            onClick={() => openSidebar(assoc)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-[#1a1f5e] hover:border-[#1a1f5e] hover:text-white text-gray-500 transition-all"
                            title="View details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {isPending && (
                            <>
                              {/* Reject */}
                              <button
                                onClick={() => setRejectTarget(assoc)}
                                disabled={isRowLoading}
                                className="w-8 h-8 flex items-center justify-center border border-rose-200 rounded-lg text-rose-500 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all disabled:opacity-50"
                                title="Reject"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>

                              {/* Approve */}
                              <button
                                onClick={() => handleApprove(assoc.id)}
                                disabled={isRowLoading}
                                className="w-8 h-8 flex items-center justify-center border border-emerald-200 rounded-lg text-emerald-500 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all disabled:opacity-50"
                                title="Approve"
                              >
                                {isRowLoading ? (
                                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </>
                          )}
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
              Showing {filtered.length} of {currentList.length} associations
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className={"fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium " + (toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white")}>
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {toast.msg}
          </div>
        )}

        {/* Reject Modal */}
        {rejectTarget && (
          <RejectModal
            association={rejectTarget}
            onConfirm={handleRejectConfirm}
            onCancel={() => setRejectTarget(null)}
            loading={rejectLoading}
          />
        )}

        {/* Detail Sidebar */}
        <AssocDetailSidebar
          assoc={selectedAssoc}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onApprove={handleApprove}
          onReject={(a) => { setRejectTarget(a); }}
          actionLoading={actionLoading}
          isPending={activeTab === "pending"}
        />
      </div>
    </AdminLayout>
  );
}