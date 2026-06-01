"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecAdminLayout from "@/app/components/SecAdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

// ✅ FIX: token lu dans les handlers, pas au moment du render
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || null;
}

// ── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmText, cancelText, onConfirm, onCancel, isDanger = false, loading = false }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden" }}>
        <style>{`@keyframes modalIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }`}</style>
        <div style={{ padding: 24, animation: "modalIn 0.3s ease-out" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0", textAlign: "center" }}>{title}</h3>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px 0", lineHeight: 1.6, textAlign: "center" }}>{message}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={onCancel} disabled={loading}
              style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm} disabled={loading}
              style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: isDanger ? "#dc2626" : "#3b82f6", color: "#fff", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Suppression…" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Modal ──────────────────────────────────────────────────────────────
function CreateModal({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    wilaya: "",
    quartier_id: "",
  });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8,
    fontSize: 14, color: "#1f2937", background: "#f9fafb", fontFamily: "system-ui", outline: "none",
  };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };
  const groupStyle = { marginBottom: 16 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 140, display: "flex", alignItems: "center", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}>
      <style>{`@keyframes drawerIn { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
      <div style={{ background: "#fff", width: "100%", maxWidth: 450, height: "100%", boxShadow: "-10px 0 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", animation: "drawerIn .3s ease-out forwards" }}>

        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", margin: 0 }}>Créer un Maire</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <form id="createMaireForm" onSubmit={handleSubmit}>
            <div style={groupStyle}>
              <label style={labelStyle}>Nom complet</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="ex. Jean Dupont" style={inputStyle} />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>Adresse email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ex. jean@commune.dz" style={inputStyle} />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>Téléphone</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="ex. +213..." style={inputStyle} />
            </div>
            <div style={{ height: 1, background: "#e5e7eb", margin: "24px 0" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
              Détails de la Commune
            </h3>

            <div style={groupStyle}>
              <label style={labelStyle}>Wilaya</label>
              <input required type="text" name="wilaya" value={formData.wilaya} onChange={handleChange} placeholder="ex. Alger" style={inputStyle} />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>ID de la commune</label>
              <input required type="number" name="quartier_id" value={formData.quartier_id} onChange={handleChange} placeholder="ex. 55" style={inputStyle} />
            </div>
          </form>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", gap: 12 }}>
          <button type="button" onClick={onClose} disabled={loading}
            style={{ flex: 1, padding: 12, background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, color: "#374151", fontWeight: 600, cursor: "pointer" }}>
            Annuler
          </button>
          <button type="submit" form="createMaireForm" disabled={loading}
            style={{ flex: 1, padding: 12, background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Création…" : "Créer le Maire"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
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
    setError(null);
    try {
      // ✅ Route correcte : GET /admin/maire
      const res = await fetch(`${BASE_URL}/admin/maire`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ FIX: gestion du 401 explicite
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) throw new Error(`Erreur ${res.status} — impossible de charger les maires`);

      const data = await res.json();

      // Extraction flexible selon le format retourné
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.maires)) list = data.maires;
      else if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.result)) list = data.result;

      setMaires(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaires(); }, []);

  // ── CREATE ──
  const handleCreate = async (formData) => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }

    setCreateLoading(true);
    try {
      // ✅ Route correcte : POST /admin/maire
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        wilaya: formData.wilaya,
        quartier_id: Number(formData.quartier_id),
      };
      const res = await fetch(`${BASE_URL}/admin/maire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // ✅ FIX: certaines APIs retournent 201 sans body JSON exploitable
      let data = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);

      showToast("Maire créé avec succès !");
      setShowCreateModal(false);
      fetchMaires(); // rafraîchit la liste
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreateLoading(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }

    const targetId = deleteTarget.user_id || deleteTarget.id;

    setDeleteLoading(true);
    try {
      // ✅ Route correcte : DELETE /admin/maire/{id}
      const res = await fetch(`${BASE_URL}/admin/maire/${targetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ FIX: DELETE retourne souvent 204 No Content — ne pas appeler res.json()
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) {
        // essaie de lire un message d'erreur si disponible
        let errMsg = `Erreur ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } catch { /* pas de body JSON */ }
        throw new Error(errMsg);
      }

      // Mise à jour optimiste de la liste sans re-fetch
      setMaires((prev) => prev.filter((m) => (m.user_id || m.id) !== targetId));
      setDeleteTarget(null);
      showToast("Maire supprimé avec succès !");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Render ──
  const getMaireName = (maire) =>
    maire.name || `${maire.first_name ?? ""} ${maire.last_name ?? ""}`.trim() || "Nom inconnu";

  return (
    <SecAdminLayout>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes toastIn  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drawerIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .toast { animation: toastIn .3s ease-out; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{
          position: "fixed", top: 20, right: 20, zIndex: 180,
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: toast.type === "success" ? "#10b981" : "#ef4444",
          color: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}>
          {toast.message}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          loading={createLoading}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Supprimer le Maire"
          message={`Êtes-vous sûr de vouloir supprimer ${getMaireName(deleteTarget)} ? Cette action supprimera également la commune associée et est irréversible.`}
          confirmText="Oui, Supprimer"
          cancelText="Annuler"
          isDanger
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div style={{ width: "100%", maxWidth: 1200, fontFamily: "system-ui" }}>

        {/* Header */}
        <div style={{ marginBottom: 30, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 0, marginRight: 0, marginBottom: 8, marginLeft: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>

              Dashboard / Maires
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 }}>Collectivités Locales</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 0, marginRight: 0, marginBottom: 16, marginLeft: 0 }}>Gérez les représentants des municipalités.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: "#3b82f6", color: "#fff", border: "none", padding: "12px 20px",
              borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)", display: "flex", alignItems: "center", gap: 8,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Créer un Maire
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 180, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <div style={{ width: "60%", height: 20, background: "#f3f4f6", borderRadius: 4, marginBottom: 12 }} />
                <div style={{ width: "40%", height: 16, background: "#f3f4f6", borderRadius: 4, marginBottom: 24 }} />
                <div style={{ width: "100%", height: 60, background: "#f9fafb", borderRadius: 8 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" }}>Échec du chargement</p>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 16px 0" }}>{error}</p>
            <button onClick={fetchMaires} style={{ padding: "8px 16px", background: "#e5e7eb", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>
              Réessayer
            </button>
          </div>
        ) : maires.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 12, border: "1px dashed #d1d5db" }}>
            <div style={{ width: 64, height: 64, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" }}>Aucun maire trouvé</h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px 0", maxWidth: 400, marginInline: "auto" }}>
              Aucun maire n'est encore enregistré dans le système. Créez-en un pour commencer.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {maires.map((maire) => (
              <div
                key={maire.id}
                style={{
                  background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ padding: 20, borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      {/* ✅ FIX: helper getMaireName gère tous les formats de nom */}
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>
                        {getMaireName(maire)}
                      </h3>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{maire.email || "—"}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(maire)}
                      title="Supprimer ce maire"
                      style={{
                        background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca",
                        width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer", transition: "all .2s", flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
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
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 4px 0" }}>Téléphone</p>
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