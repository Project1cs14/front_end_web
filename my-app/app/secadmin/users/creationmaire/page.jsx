"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecAdminLayout from "@/app/components/SecAdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

const getToken = () =>
  (typeof window !== "undefined" &&
    (localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken"))) ||
  null;

// ── Confirmation Modal ─────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmText, cancelText, onConfirm, onCancel, isDanger = false, loading = false }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden", animation: "modalIn 0.3s ease-out" }}>
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div style={{ padding: "24px" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0", textAlign: "center" }}>{title}</h3>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px 0", lineHeight: 1.6, textAlign: "center" }}>{message}</p>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff",
                color: "#6b7280", fontSize: 13, fontWeight: 600, fontFamily: "system-ui", cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s", opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.background = "#f3f4f6"; }}
              onMouseLeave={(e) => { e.target.style.background = "#fff"; }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                background: isDanger ? "#dc2626" : "#3b82f6", color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "system-ui",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "all .2s",
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Modal ─────────────────────────────────────────────────────────
function CreateModal({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    commune: "",
    code_commune: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14,
    color: "#1f2937", background: "#f9fafb", fontFamily: "system-ui", outline: "none", transition: "border-color 0.2s"
  };

  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };
  const groupStyle = { marginBottom: 16 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 140, display: "flex", alignItems: "center", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 450, height: "100%", boxShadow: "-10px 0 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", animation: "drawerIn .3s ease-out forwards" }}>
        
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", margin: 0 }}>Create Maire</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <form id="createMaireForm" onSubmit={handleSubmit}>
            <div style={groupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Jean Dupont" style={inputStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. jean@commune.dz" style={inputStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +213..." style={inputStyle} />
            </div>
            
            <div style={groupStyle}>
              <label style={labelStyle}>Password</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Secure password" style={inputStyle} />
            </div>

            <div style={{ height: 1, background: "#e5e7eb", margin: "24px 0" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Commune Details</h3>

            <div style={groupStyle}>
              <label style={labelStyle}>Commune Name</label>
              <input required type="text" name="commune" value={formData.commune} onChange={handleChange} placeholder="e.g. Alger Centre" style={inputStyle} />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Code Commune</label>
              <input required type="text" name="code_commune" value={formData.code_commune} onChange={handleChange} placeholder="e.g. 1601" style={inputStyle} />
            </div>
          </form>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", gap: 12 }}>
          <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, padding: "12px", background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, color: "#374151", fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
          <button type="submit" form="createMaireForm" disabled={loading} style={{ flex: 1, padding: "12px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating..." : "Create Maire"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function CreationMairePage() {
  const router = useRouter();
  const [maires, setMaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMaires = async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/maire`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load maires");
      const data = await res.json();
      
      // Data extraction depending on the returned JSON object format
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data.maires && Array.isArray(data.maires)) list = data.maires;
      else if (data.data && Array.isArray(data.data)) list = data.data;
      
      setMaires(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaires(); }, []);

  const handleCreate = async (formData) => {
    const token = getToken();
    if (!token) return;
    
    setCreateLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/maire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create");
      
      showToast("Maire created successfully!");
      setShowCreateModal(false);
      fetchMaires();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = getToken();
    if (!token) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/maire/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      showToast("Maire deleted successfully!");
      setMaires((prev) => prev.filter(m => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <SecAdminLayout>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes toastIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drawerIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .toast { animation: toastIn .3s ease-out; }
      `}</style>

      {toast && (
        <div className="toast" style={{
          position: "fixed", top: 20, right: 20, zIndex: 180, display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: toast.type === "success" ? "#10b981" : "#ef4444", color: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}>
          {toast.message}
        </div>
      )}

      {showCreateModal && (
        <CreateModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} loading={createLoading} />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Maire"
          message={`Are you sure you want to delete ${deleteTarget.name || 'this maire'}? This will also remove the associated commune. This action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          isDanger={true}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div style={{ width: "100%", maxWidth: 1200, fontFamily: "system-ui" }}>
        
        <div style={{ marginBottom: 30, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Dashboard / Maires</p>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>Collectivités Locales</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 8, margin: "8px 0 0 0" }}>Manage municipality representatives.</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: "#3b82f6", color: "#fff", border: "none", padding: "12px 20px",
              borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", gap: 8, transition: "all .2s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Maire
          </button>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 180, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <div style={{ width: "60%", height: 20, background: "#f3f4f6", borderRadius: 4, marginBottom: 12 }} />
                <div style={{ width: "40%", height: 16, background: "#f3f4f6", borderRadius: 4, marginBottom: 24 }} />
                <div style={{ width: "100%", height: 60, background: "#f9fafb", borderRadius: 8 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" }}>Failed to load data</p>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 16px 0" }}>{error}</p>
            <button onClick={fetchMaires} style={{ padding: "8px 16px", background: "#e5e7eb", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Retry</button>
          </div>
        ) : maires.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 12, border: "1px dashed #d1d5db" }}>
            <div style={{ width: 64, height: 64, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" }}>No Maires found</h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px 0", maxWidth: 400, marginInline: "auto" }}>There are currently no maires registered in the system. Create one to get started.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {maires.map((maire) => (
              <div key={maire.id} style={{
                background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
                overflow: "hidden", display: "flex", flexDirection: "column",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all .2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ padding: "20px", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>
                        {maire.name || maire.first_name || "Nom inconnu"}
                      </h3>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{maire.email}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(maire)}
                      style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s" }}
                      title="Delete Maire"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>

                <div style={{ padding: "16px 20px", background: "#f9fafb", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 4px 0" }}>Commune</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: 0 }}>{maire.commune || "—"}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 4px 0" }}>Code Commune</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: 0 }}>{maire.code_commune || "—"}</p>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 4px 0" }}>Phone</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: 0 }}>{maire.phone || "—"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SecAdminLayout>
  );
}
