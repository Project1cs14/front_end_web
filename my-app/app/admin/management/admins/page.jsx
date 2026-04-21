"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../../components/AdminLayout";
import AdminDetailSidebar from "../../../components/AdminDetailSidebar";

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
          <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Suspend Admin Account</h3>
          <p className="text-sm text-gray-400 text-center mb-5">
            <span className="font-semibold text-gray-600">{admin?.name}</span> will be notified by email with the reason below.
          </p>

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Suspension Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Violation of platform policies, suspicious activity…"
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-400 bg-gray-50 transition"
          />
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            An email will be sent to <span className="font-medium text-gray-500">{admin?.email}</span>
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

// ── Activate Confirm Modal ─────────────────────────────────────────────────
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
          <h3 className="text-lg font-bold text-gray-900 mb-2">Activate Admin Account</h3>
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

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Admins() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [communeFilter, setCommuneFilter] = useState("All");
  const [wilayaFilter, setWilayaFilter] = useState("All");

  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [activateTarget, setActivateTarget] = useState(null);
  const [activateLoading, setActivateLoading] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wilayas, setWilayas] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [loadingQuartiers, setLoadingQuartiers] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", wilaya: "", quartier_id: "",
  });

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdmins = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL + "/admin/admin-sec", {
        headers: { Authorization: "Bearer " + token },
        cache: "no-store",
      });
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) throw new Error("Failed to load admins");
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (err) {
      setError(err.message || "Failed to load admins.");
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setIsAuthenticated(true);
    fetchAdmins();
    const onFocus = () => { if (getToken()) fetchAdmins(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchAdmins, getToken, router]);

  useEffect(() => {
    if (!showCreateModal) return;
    const token = getToken();
    fetch(BASE_URL + "/api/quartiers/wilayas", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.wilayas || data.data || [];
        setWilayas(raw.map((w) => (typeof w === "string" ? w : w.name || w.nom || w.wilaya || String(w))));
      })
      .catch(console.error);
  }, [showCreateModal, getToken]);

  useEffect(() => {
    if (!form.wilaya) return;
    const token = getToken();
    setQuartiers([]);
    setForm((f) => ({ ...f, quartier_id: "" }));
    setLoadingQuartiers(true);
    fetch(BASE_URL + "/api/quartiers?wilaya=" + encodeURIComponent(form.wilaya), { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((data) => setQuartiers(Array.isArray(data) ? data : data.quartiers || data.data || []))
      .catch(console.error)
      .finally(() => setLoadingQuartiers(false));
  }, [form.wilaya, getToken]);

  // ── Try multiple candidate URLs/methods ──
  const tryToggle = async (token, targetId, action) => {
    const candidateUrls = [
      `${BASE_URL}/admin/admin-sec/${targetId}/${action}`,
      `${BASE_URL}/admin/admin-sec/${action}/${targetId}`,
      `${BASE_URL}/admin/${action}/${targetId}`,
    ];
    let res = null;
    for (const url of candidateUrls) {
      for (const method of ["PATCH", "PUT", "POST"]) {
        res = await fetch(url, { method, headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" } });
        if (res.ok || res.status === 404) break;
      }
      if (res?.ok) break;
    }
    return res;
  };

  // ── Suspend with reason ────────────────────────────────────────────────
  const handleSuspendConfirm = async (reason) => {
    const token = getToken();
    const admin = suspendTarget;
    const targetId = admin.user_id || admin.id;
    setSuspendLoading(true);
    setTogglingId(targetId);
    try {
      // Try the dedicated suspend endpoint first (with reason body)
      const candidateUrls = [
        `${BASE_URL}/admin/admin-sec/${targetId}/deactivate`,
        `${BASE_URL}/admin/admin-sec/deactivate/${targetId}`,
        `${BASE_URL}/admin/deactivate/${targetId}`,
      ];
      let res = null;
      for (const url of candidateUrls) {
        for (const method of ["PATCH", "PUT", "POST"]) {
          res = await fetch(url, {
            method,
            headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
            body: JSON.stringify({ reason, notify_email: true }),
          });
          if (res.ok || res.status === 404) break;
        }
        if (res?.ok) break;
      }
      if (!res?.ok) throw new Error("Suspend failed");
      setAdmins((prev) => prev.map((a) => (a.user_id || a.id) === targetId ? { ...a, is_active: 0 } : a));
      showToast(`${admin.name} suspended — notification sent to ${admin.email}`, "success");
      setSuspendTarget(null);
      await fetchAdmins();
    } catch (err) {
      showToast(err.message || "Failed to suspend admin", "error");
    } finally {
      setSuspendLoading(false);
      setTogglingId(null);
    }
  };

  // ── Activate with email notification ──────────────────────────────────
  const handleActivateConfirm = async () => {
    const token = getToken();
    const admin = activateTarget;
    const targetId = admin.user_id || admin.id;
    setActivateLoading(true);
    setTogglingId(targetId);
    try {
      const res = await tryToggle(token, targetId, "activate");
      if (!res?.ok) throw new Error("Activation failed");
      setAdmins((prev) => prev.map((a) => (a.user_id || a.id) === targetId ? { ...a, is_active: 1 } : a));
      showToast(`${admin.name} activated — confirmation sent to ${admin.email}`, "success");
      setActivateTarget(null);
      await fetchAdmins();
    } catch (err) {
      showToast(err.message || "Failed to activate admin", "error");
    } finally {
      setActivateLoading(false);
      setTogglingId(null);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const token = getToken();
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch(BASE_URL + "/admin/admin-sec", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          password: form.password, wilaya: form.wilaya,
          quartier_id: Number(form.quartier_id),
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create admin");
      }
      setShowCreateModal(false);
      setForm({ name: "", email: "", phone: "", password: "", wilaya: "", quartier_id: "" });
      setQuartiers([]);
      showToast("Admin created successfully", "success");
      await fetchAdmins();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setForm({ name: "", email: "", phone: "", password: "", wilaya: "", quartier_id: "" });
    setQuartiers([]);
  };

  const openSidebar = (admin) => { setSelectedAdmin(admin); setSidebarOpen(true); };

  const uniqueCommunes = ["All", ...new Set(admins.map((a) => a.quartier_nom).filter(Boolean))];
  const uniqueWilayas = ["All", ...new Set(admins.map((a) => a.wilaya).filter(Boolean))];

  const filtered = admins.filter((admin) => {
    const matchesSearch =
      admin.name?.toLowerCase().includes(search.toLowerCase()) ||
      admin.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && admin.is_active === 1) ||
      (statusFilter === "Suspended" && admin.is_active === 0);
    const matchesCommune = communeFilter === "All" || admin.quartier_nom === communeFilter;
    const matchesWilaya = wilayaFilter === "All" || admin.wilaya === wilayaFilter;
    return matchesSearch && matchesStatus && matchesCommune && matchesWilaya;
  });

  const totalAdmins = admins.length;
  const activeNow = admins.filter((a) => a.is_active === 1).length;
  const suspendedCount = admins.filter((a) => a.is_active === 0).length;

  if (!isAuthenticated) return <div className="min-h-screen bg-[#f5f5f0] w-full" />;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#1a1f5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading admins...</p>
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
            <button onClick={fetchAdmins} className="px-4 py-2 bg-[#1a1f5e] text-white rounded-xl text-sm">Retry</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb] p-6">

        {/* Modals */}
        {suspendTarget && (
          <SuspendModal
            admin={suspendTarget}
            onConfirm={handleSuspendConfirm}
            onCancel={() => setSuspendTarget(null)}
            loading={suspendLoading}
          />
        )}
        {activateTarget && (
          <ActivateModal
            admin={activateTarget}
            onConfirm={handleActivateConfirm}
            onCancel={() => setActivateTarget(null)}
            loading={activateLoading}
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6 w-full">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight">Admin Management</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage and monitor commune-level administrators across the platform.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#1a1f5e] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-[#141852] active:scale-95 transition-all shadow-lg shadow-[#1a1f5e]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Admin
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Admins", value: totalAdmins, color: "text-[#1a1f5e]" },
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
              type="text" placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
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
                value={value} onChange={(e) => setter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 cursor-pointer min-w-[120px]"
              >
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ))}

          <button onClick={fetchAdmins} className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors" title="Refresh">
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
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Full Name</th>
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
                      <p className="text-gray-400 text-sm">No admins found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((admin, index) => {
                  const isActive = admin.is_active === 1;
                  const targetId = admin.user_id || admin.id;
                  return (
                    <tr key={targetId} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-4 py-3.5"><input type="checkbox" className="rounded border-gray-300 accent-[#1a1f5e]" /></td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{index + 1}</td>
                      <td className="px-4 py-3.5 font-semibold text-gray-800">{admin.name || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-500">{admin.email || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600">{admin.wilaya || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600">{admin.quartier_nom || "—"}</td>
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
                            onClick={() => openSidebar(admin)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-[#1a1f5e] hover:border-[#1a1f5e] hover:text-white text-gray-500 transition-all"
                            title="View details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Suspend → opens modal with reason | Activate → opens confirm modal */}
                          {isActive ? (
                            <button
                              onClick={() => setSuspendTarget(admin)}
                              disabled={togglingId === targetId}
                              className="w-8 h-8 flex items-center justify-center border border-amber-200 rounded-lg text-amber-500 hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all disabled:opacity-50"
                              title="Suspend admin"
                            >
                              {togglingId === targetId
                                ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                : <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>}
                            </button>
                          ) : (
                            <button
                              onClick={() => setActivateTarget(admin)}
                              disabled={togglingId === targetId}
                              className="w-8 h-8 flex items-center justify-center border border-emerald-200 rounded-lg text-emerald-500 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all disabled:opacity-50"
                              title="Activate admin"
                            >
                              {togglingId === targetId
                                ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                : <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>}
                            </button>
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
              Showing {filtered.length} of {totalAdmins} admins
            </div>
          )}
        </div>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="px-7 pt-7 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Create Admin</h2>
                <p className="text-sm text-gray-400 mt-0.5">Assign a new administrator to the regional network.</p>
              </div>
              <form onSubmit={handleCreateAdmin} className="px-7 py-5 space-y-4">
                {[
                  { label: "Full Name", field: "name", type: "text", placeholder: "e.g. Jean Dupont" },
                  { label: "Email Address", field: "email", type: "email", placeholder: "jean.d@foodwaste.org" },
                  { label: "Phone", field: "phone", type: "tel", placeholder: "0550001818" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} required value={form[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] focus:bg-white transition"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Wilaya</label>
                    <div className="relative">
                      <select required value={form.wilaya} onChange={(e) => setForm((f) => ({ ...f, wilaya: e.target.value }))}
                        className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] focus:bg-white transition cursor-pointer"
                      >
                        <option value="">Select...</option>
                        {wilayas.map((w, i) => <option key={w + i} value={w}>{w}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                {form.wilaya && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Commune</label>
                    <div className="relative">
                      <select required value={form.quartier_id} onChange={(e) => setForm((f) => ({ ...f, quartier_id: e.target.value }))}
                        disabled={loadingQuartiers}
                        className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] focus:bg-white transition cursor-pointer disabled:opacity-60"
                      >
                        <option value="">{loadingQuartiers ? "Loading..." : "Select commune"}</option>
                        {quartiers.map((q) => <option key={q.id} value={q.id}>{q.nom || q.name}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                )}
                {createError && <p className="text-sm text-rose-500 bg-rose-50 px-4 py-2.5 rounded-xl">{createError}</p>}
                <button type="submit" disabled={creating} className="w-full py-3.5 bg-[#1a1f5e] text-white rounded-xl font-bold text-sm hover:bg-[#141852] transition-colors disabled:opacity-60">
                  {creating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : "Save Administrator"}
                </button>
                <button type="button" onClick={closeModal} className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={"fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium " + (toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white")}>
            {toast.type === "success"
              ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>}
            {toast.msg}
          </div>
        )}

        {/* Detail Sidebar */}
        <AdminDetailSidebar
          admin={selectedAdmin}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </AdminLayout>
  );
}