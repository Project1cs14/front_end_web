"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

const getToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    : null;

// ── Info Row Component ─────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-[#f4f6fb] flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  </div>
);

// ── Detail Sidebar ─────────────────────────────────────────────────────────
function DonationDetailSidebar({ donation, isOpen, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const info = donation || {};

  return (
    <>
      <div
        className={"fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <div className={"fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out " + (isOpen ? "translate-x-0" : "translate-x-full")}>
        {/* Header with Image */}
        <div className="relative h-48 bg-gradient-to-br from-[#1a1f5e] to-[#141852] overflow-hidden">
          {info?.photo_url ? (
            <img src={info.photo_url} alt={info.titre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title and Status */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">{info?.titre || "—"}</h2>
            <p className="text-sm text-gray-500 mt-2">{info?.description || "—"}</p>
            <div className="flex gap-2 mt-3">
              <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " +
                (info?.status === "active" ? "bg-emerald-50 text-emerald-600" :
                  info?.status === "reserved" ? "bg-amber-50 text-amber-600" :
                    info?.status === "completed" ? "bg-sky-50 text-sky-600" :
                      info?.status === "cancelled" ? "bg-rose-50 text-rose-500" :
                        "bg-gray-100 text-gray-600")
              }>
                <span className={"w-1.5 h-1.5 rounded-full " +
                  (info?.status === "active" ? "bg-emerald-500" :
                    info?.status === "reserved" ? "bg-amber-500" :
                      info?.status === "completed" ? "bg-sky-500" :
                        info?.status === "cancelled" ? "bg-rose-500" :
                          "bg-gray-400")
                } />
                {info?.status === "active" ? "Active" :
                  info?.status === "reserved" ? "Reserved" :
                    info?.status === "completed" ? "Completed" :
                      info?.status === "cancelled" ? "Cancelled" :
                        (info?.status ? info.status.charAt(0).toUpperCase() + info.status.slice(1) : "Unknown")}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Donation Details</p>
            <div className="space-y-5">
              <InfoRow
                label="Quantity"
                value={`${info?.quantite || 0} ${info?.unite || ""}`}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
              />
              <InfoRow
                label="Category"
                value={`Category ${info?.categorie_id || "—"}`}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
              />
              <InfoRow
                label="Expiration Date"
                value={info?.date_expiration ? new Date(info.date_expiration).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Donor Information</p>
            <div className="space-y-5">
              <InfoRow
                label="Donor ID"
                value={info?.user_id || "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
              <InfoRow
                label="Location"
                value={info?.localisation || "Not specified"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Timeline</p>
            <div className="space-y-5">
              <InfoRow
                label="Created"
                value={info?.created_at ? new Date(info.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ── Confirm Delete Modal ───────────────────────────────────────────────────
function DeleteConfirmModal({ isOpen, onClose, onConfirm, donationTitle, isLoading }) {
  return (
    <>
      <div
        className={"fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-w-sm w-full mx-4 overflow-hidden transition-all duration-300 " + (isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Donation?</h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-700">"{donationTitle}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function DonationsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donations, setDonations] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [toast, setToast] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, donation: null });
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchDonations = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL + "/admin/donation", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) throw new Error("Failed to load donations");
      const data = await res.json();

      let list = [];
      if (data?.user_donations || data?.asso_donations) {
        list = [...(data.user_donations || []), ...(data.asso_donations || [])];
      } else if (Array.isArray(data)) {
        list = data;
      } else if (data?.don && Array.isArray(data.don)) {
        list = data.don;
      } else if (data?.donations && Array.isArray(data.donations)) {
        list = data.donations;
      } else if (data?.data && Array.isArray(data.data)) {
        list = data.data;
      }

      list = list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      setDonations(list);
    } catch (err) {
      setError(err.message || "Failed to load donations.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setIsAuthenticated(true);
    fetchDonations();
    const onFocus = () => { if (getToken()) fetchDonations(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchDonations, router]);

  const handleDeleteDonation = async () => {
    if (!deleteModal.donation) return;

    const token = getToken();
    setDeleting(true);

    try {
      const res = await fetch(`${BASE_URL}/don/delete/${deleteModal.donation.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(responseData.message || `Delete failed (HTTP ${res.status})`);
      }

      setDonations((prev) => prev.filter((d) => d.id !== deleteModal.donation.id));
      showToast(responseData.message || "Donation deleted successfully", "success");
      setDeleteModal({ isOpen: false, donation: null });
      await fetchDonations();
    } catch (err) {
      showToast(err.message || "Failed to delete donation", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openSidebar = (donation) => {
    setSelectedDonation(donation);
    setSidebarOpen(true);
  };

  const filtered = donations.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      d.titre?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.user_id?.toString().includes(q);
    const matchStatus = statusFilter === "All" || d.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const stats = {
    total: donations.length,
    active: donations.filter((d) => d.status === "active").length,
    reserved: donations.filter((d) => d.status === "reserved").length,
    completed: donations.filter((d) => d.status === "completed").length,
    cancelled: donations.filter((d) => d.status === "cancelled").length,
  };

  if (!isAuthenticated) return <div className="min-h-screen bg-[#f4f6fb] w-full" />;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#1a1f5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading donations...</p>
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
            <button onClick={fetchDonations} className="px-4 py-2 bg-[#1a1f5e] text-white rounded-xl text-sm">Retry</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb] p-6">

        {/* HEADER SECTION */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight mb-4">Donations Management</h1>

          {/* Header Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[250px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search donations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] transition"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 cursor-pointer min-w-[120px]"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="reserved">Reserved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Export
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchDonations}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total Donations", value: stats.total, color: "text-[#1a1f5e]", bg: "bg-blue-50" },
            { label: "Active", value: stats.active, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Reserved", value: stats.reserved, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Completed", value: stats.completed, color: "text-sky-500", bg: "bg-sky-50" },
            { label: "Cancelled", value: stats.cancelled, color: "text-rose-500", bg: "bg-rose-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 border border-gray-200`}>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M7 12l8 4m0 0l8-4" />
                      </svg>
                      <p className="text-gray-400 text-sm">No donations found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((donation, index) => (
                  <tr key={donation.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 py-3.5 text-gray-400 text-xs font-medium">{index + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {donation.photo_url ? (
                          <img src={donation.photo_url} alt={donation.titre} className="w-full h-full object-cover" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-800">{donation.titre || "—"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{donation.quantite} {donation.unite}</p>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{donation.donateur_name}</td>
                    <td className="px-4 py-3.5 text-gray-600">{donation.donateur_email}</td>
                    <td className="px-4 py-3.5 text-gray-600">{donation.localisation || "Not specified"}</td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {new Date(donation.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={"inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full " +
                        (donation.status === "active" ? "bg-emerald-50 text-emerald-600" :
                          donation.status === "reserved" ? "bg-amber-50 text-amber-600" :
                            donation.status === "completed" ? "bg-sky-50 text-sky-600" :
                              donation.status === "cancelled" ? "bg-rose-50 text-rose-500" :
                                "bg-gray-100 text-gray-600")
                      }>
                        <span className={"w-1.5 h-1.5 rounded-full " +
                          (donation.status === "active" ? "bg-emerald-500" :
                            donation.status === "reserved" ? "bg-amber-500" :
                              donation.status === "completed" ? "bg-sky-500" :
                                donation.status === "cancelled" ? "bg-rose-500" :
                                  "bg-gray-400")
                        } />
                        {donation.status ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) : "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        {/* View Details */}
                        <button
                          onClick={() => openSidebar(donation)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-[#1a1f5e] hover:border-[#1a1f5e] hover:text-white text-gray-500 transition-all"
                          title="View details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, donation })}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-rose-600 hover:border-rose-600 hover:text-white text-gray-500 transition-all"
                          title="Delete donation"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {donations.length} donations
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className={"fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium " + (toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white")}>
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            )}
            {toast.msg}
          </div>
        )}

        {/* Detail Sidebar */}
        <DonationDetailSidebar
          donation={selectedDonation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, donation: null })}
          onConfirm={handleDeleteDonation}
          donationTitle={deleteModal.donation?.titre || ""}
          isLoading={deleting}
        />
      </div>
    </AdminLayout>
  );
}