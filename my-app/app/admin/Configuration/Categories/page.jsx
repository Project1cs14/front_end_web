"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

// ── Category Detail Sidebar ────────────────────────────────────────────────
function CategoryDetailSidebar({ category, isOpen, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const info = category || {};

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
          <h2 className="text-lg font-bold text-white leading-tight">{info?.name || "—"}</h2>
          <p className="text-blue-200 text-xs mt-0.5">Category #{info?.id}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <p className="text-sm text-gray-600">{info?.description || "No description"}</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Category Details</p>
            <div className="space-y-5">
              <InfoRow
                label="Category ID"
                value={info?.id || "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
              />
              <InfoRow
                label="Created"
                value={info?.created_at ? new Date(info.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1a1f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
              {info?.photo_url && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Image</p>
                  <img src={info.photo_url} alt={info.name} className="w-full rounded-lg" />
                </div>
              )}
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

// ── Create/Edit Category Modal ─────────────────────────────────────────────
function CategoryFormModal({ isOpen, onClose, onSubmit, editingCategory, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        photo: null,
      });
      setPreviewUrl(editingCategory.photo_url || null);
    } else {
      setFormData({ name: "", description: "", photo: null });
      setPreviewUrl(null);
    }
  }, [editingCategory, isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onload = (event) => setPreviewUrl(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      <div
        className={"fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-w-md w-full mx-4 overflow-y-auto max-h-[90vh] transition-all duration-300 " + (isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none")}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
              <p className="text-sm text-gray-500 mt-1">Define a new classification for your system.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fruits & Vegetables"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this category..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e]"
              />
            </div>

            {/* Category Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category Image</label>
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#1a1f5e] hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-[#1a1f5e] text-white rounded-lg font-semibold hover:bg-[#141852] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────
function DeleteConfirmModal({ isOpen, onClose, onConfirm, categoryName, isLoading }) {
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
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Category?</h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-700">"{categoryName}"</span>? This action cannot be undone.
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
export default function CategoriesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [formModal, setFormModal] = useState({ isOpen: false, editing: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCategories = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL + "/categorie", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      let list = Array.isArray(data) ? data : data?.categories || data?.data || [];
      setCategories(list);
    } catch (err) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setIsAuthenticated(true);
    fetchCategories();
  }, [fetchCategories, router]);

  const handleCreateOrUpdate = async (formData) => {
    const token = getToken();
    setIsSubmitting(true);

    try {
      const url = formModal.editing
        ? `${BASE_URL}/categorie/update/${formModal.editing.id}`
        : `${BASE_URL}/categorie`;

      const method = formModal.editing ? "PATCH" : "POST";

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (formData.photo) {
        formDataToSend.append("photo_url", formData.photo);
      }

      const res = await fetch(url, {
        method,
        headers: { Authorization: "Bearer " + token },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Operation failed (HTTP ${res.status})`);
      }

      showToast(
        formModal.editing ? "Category updated successfully" : "Category created successfully",
        "success"
      );
      setFormModal({ isOpen: false, editing: null });
      await fetchCategories();
    } catch (err) {
      showToast(err.message || "Failed to save category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteModal.category) return;
    const token = getToken();
    setIsDeleting(true);

    try {
      const res = await fetch(`${BASE_URL}/categorie/delete/${deleteModal.category.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Delete failed (HTTP ${res.status})`);
      }

      setCategories((prev) => prev.filter((c) => c.id !== deleteModal.category.id));
      showToast("Category deleted successfully", "success");
      setDeleteModal({ isOpen: false, category: null });
      await fetchCategories();
    } catch (err) {
      showToast(err.message || "Failed to delete category", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = categories.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  if (!isAuthenticated) return <div className="min-h-screen bg-[#f4f6fb] w-full" />;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#1a1f5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading categories...</p>
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
            <button onClick={fetchCategories} className="px-4 py-2 bg-[#1a1f5e] text-white rounded-xl text-sm">Retry</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb] p-6">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6 w-full">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight">Categories Management</h1>
            <p className="text-gray-400 mt-1 text-sm">Create, manage, and organize donation categories.</p>
          </div>
          <button
            onClick={() => setFormModal({ isOpen: true, editing: null })}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1f5e] text-white rounded-xl text-sm font-semibold hover:bg-[#141852] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>

        {/* STATS CARD */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Categories</p>
          <p className="text-4xl font-bold text-[#1a1f5e]">{categories.length}</p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e] transition"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-[#1a1f5e] to-[#2d2a6b]">
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <p className="text-gray-500 text-sm font-medium">No categories found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors group">
                    <td className="px-6 py-4 text-gray-500 font-semibold text-xs">{index + 1}</td>

                    {/* ── Image Column ── */}
                    <td className="px-6 py-4">
                      {category.photo_url ? (
                        <img
                          src={category.photo_url}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{category.name || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs max-w-xs truncate">{category.description || "—"}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                      {new Date(category.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setFormModal({ isOpen: true, editing: category })}
                          className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white text-blue-600 transition-all duration-200"
                          title="Edit category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, category })}
                          className="w-8 h-8 flex items-center justify-center border border-rose-200 rounded-lg hover:bg-rose-600 hover:border-rose-600 hover:text-white text-rose-600 transition-all duration-200"
                          title="Delete category"
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
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 font-medium">
              Showing {filtered.length} of {categories.length} categories
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

        {/* Category Detail Sidebar */}
        <CategoryDetailSidebar
          category={selectedCategory}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Category Form Modal */}
        <CategoryFormModal
          isOpen={formModal.isOpen}
          onClose={() => setFormModal({ isOpen: false, editing: null })}
          onSubmit={handleCreateOrUpdate}
          editingCategory={formModal.editing}
          isLoading={isSubmitting}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, category: null })}
          onConfirm={handleDeleteCategory}
          categoryName={deleteModal.category?.name || ""}
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}