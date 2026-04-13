"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecAdminLayout from "@/app/components/SecAdminLayout";
import Image from "next/image";

const BASE_URL = "https://back-end-sawu.onrender.com";

const getToken = () =>
  (typeof window !== "undefined" &&
    (localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken"))) ||
  null;

const parseZones = (z) => {
  try { return typeof z === "string" ? JSON.parse(z) : z || []; }
  catch { return []; }
};

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name, url, size = 34 }) {
  const [show, setShow] = useState(false);
  const letter = name?.charAt(0)?.toUpperCase() || "?";
  const seed = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const palettes = [
    { bg:"#E9EDF5", fg:"#2E4080" }, { bg:"#EEE9E3", fg:"#6B4A28" },
    { bg:"#E4EDE8", fg:"#235A38" }, { bg:"#EDE4E8", fg:"#6A2840" },
    { bg:"#E8E4EE", fg:"#3D2870" }, { bg:"#EBE9E0", fg:"#4A5228" },
  ];
  const p = palettes[seed % palettes.length];
  const s = { width: size, height: size };

  if (url && show) return (
    <div style={{ ...s, position:"relative", flexShrink:0 }}>
      <Image width={size} height={size} src={url} alt={name} style={{ ...s, borderRadius:8, objectFit:"cover", border:"1px solid rgba(0,0,0,0.08)" }} />
      <button onClick={() => setShow(false)}
        style={{ position:"absolute", top:-4, right:-4, width:14, height:14, borderRadius:"50%", background:"#6B7280", color:"#fff", fontSize:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"none" }}>✕</button>
    </div>
  );

  return (
    <button onClick={() => url && setShow(true)}
      style={{ ...s, flexShrink:0, borderRadius:8, background:p.bg, color:p.fg, fontSize:size*0.38, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", cursor:url?"pointer":"default", border:"none", fontFamily:"system-ui, -apple-system, sans-serif" }}>
      {letter}
    </button>
  );
}

// ── Reject Modal ──────────────────────────────────────────────────────────
function RejectModal({ association, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, zIndex:150, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}>
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,0.12)", overflow:"hidden" }}>
        <div style={{ padding:"24px" }}>
          <h3 style={{ fontSize:18, fontWeight:600, color:"#1f2937", margin:"0 0 8px 0" }}>Reject Association</h3>
          <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 16px 0" }}>{association?.nom_association}</p>

          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>
            Reason <span style={{ color:"#ef4444" }}>*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a clear reason…"
            rows={4}
            style={{
              width:"100%", border:"1px solid #d1d5db",
              borderRadius:8, padding:"10px 12px", fontSize:13, color:"#1f2937",
              fontFamily:"system-ui", resize:"none", outline:"none", background:"#fff",
              boxSizing:"border-box",
              transition:"border-color .2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />

          <div style={{ display:"flex", gap:12, marginTop:20 }}>
            <button onClick={onCancel}
              style={{ flex:1, padding:"10px 0", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", color:"#6b7280", fontSize:13, fontWeight:600, fontFamily:"system-ui", cursor:"pointer", transition:"all .2s" }}
              onMouseEnter={(e) => { e.target.style.background = "#f3f4f6"; }}
              onMouseLeave={(e) => { e.target.style.background = "#fff"; }}>
              Cancel
            </button>
            <button onClick={() => onConfirm(reason)} disabled={!reason.trim() || loading}
              style={{ flex:1, padding:"10px 0", borderRadius:8, border:"none", background: !reason.trim() || loading ? "#d1d5db" : "#ef4444", color:"#fff", fontSize:13, fontWeight:600, fontFamily:"system-ui", cursor:!reason.trim()||loading?"not-allowed":"pointer" }}>
              {loading ? "Processing…" : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────
function DetailDrawer({ assoc, onClose, onApprove, onReject, actionLoading, isMobile, isPending }) {
  const isLoading = actionLoading === assoc.id;
  const zones = parseZones(assoc.zones_intervention);

  const docs = [
    { label: "Statuts",    url: assoc.doc_statuts_url },
    { label: "Certificat", url: assoc.doc_certificat_url },
    { label: "Membres",    url: assoc.doc_membres_url },
  ].filter((d) => d.url);

  const infoItems = [
    { label: "Founded",  value: assoc.year_founded },
    { label: "Capacity", value: assoc.capacite },
    { label: "Hours",    value: assoc.horaires },
    { label: "Address",  value: assoc.adresse },
    { label: "Registration", value: assoc.registration_number },
    { label: "Website", value: assoc.website_url },
  ];

  const panelStyle = isMobile ? {
    position:"fixed", left:0, right:0, bottom:0, zIndex:50,
    maxHeight:"88vh",
    background:"#fff", borderTop:"1px solid #e5e7eb",
    borderRadius:"20px 20px 0 0",
    boxShadow:"0 -10px 40px rgba(0,0,0,0.1)",
    display:"flex", flexDirection:"column",
    animation:"sheetUp .3s ease-out forwards",
  } : {
    position:"fixed", top:0, right:0, bottom:0, width:400, zIndex:50,
    background:"#fff", borderLeft:"1px solid #e5e7eb",
    boxShadow:"-10px 0 40px rgba(0,0,0,0.08)",
    display:"flex", flexDirection:"column",
    animation:"drawerIn .3s ease-out forwards",
  };

  const backdropStyle = isMobile ? {
    position:"fixed", inset:0, zIndex:40,
    background:"rgba(0,0,0,0.3)", backdropFilter:"blur(2px)",
  } : {
    position:"fixed", top:0, right:0, bottom:0, left:240, zIndex:40,
    background:"rgba(0,0,0,0.2)", backdropFilter:"blur(2px)",
  };

  return (
    <>
      <div onClick={onClose} style={backdropStyle} />

      <div style={panelStyle}>
        <style>{`
          @keyframes drawerIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
          @keyframes sheetUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        `}</style>

        {isMobile && (
          <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px", flexShrink:0 }}>
            <div style={{ width:32, height:4, borderRadius:99, background:"#d1d5db" }} />
          </div>
        )}

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #f3f4f6", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
            <Avatar name={assoc.nom_association} url={assoc.logo_url} size={40} />
            <div style={{ minWidth:0 }}>
              <p style={{ fontSize:14, fontWeight:600, color:"#1f2937", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {assoc.nom_association}
              </p>
              <p style={{ fontSize:11, color:"#9ca3af", marginTop:2, margin:0 }}>
                #{assoc.registration_number}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ width:32, height:32, borderRadius:6, border:"1px solid #e5e7eb", background:"transparent", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all .2s" }}
            onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:20 }}>
          {/* Organization Info */}
          <section>
            <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", margin:"0 0 12px 0", textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Organization Information
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {infoItems.map(({ label, value }) => (
                <div key={label} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 12px" }}>
                  <p style={{ fontSize:10, fontWeight:600, color:"#9ca3af", margin:"0 0 4px 0", textTransform:"uppercase" }}>{label}</p>
                  <p style={{ fontSize:12, fontWeight:500, color:"#374151", margin:0, wordBreak:"break-word" }}>{value || "—"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Zones */}
          {zones.length > 0 && (
            <section>
              <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", margin:"0 0 12px 0", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                Intervention Zones
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {zones.map((z, i) => (
                  <span key={i} style={{ fontSize:12, fontWeight:500, padding:"4px 10px", borderRadius:6, background:"#eff6ff", color:"#0369a1", border:"1px solid #bfdbfe" }}>{z}</span>
                ))}
              </div>
            </section>
          )}

          {/* Documents / Certifications */}
          {docs.length > 0 && (
            <section>
              <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", margin:"0 0 12px 0", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                Certifications & Documents
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {docs.map((doc) => (
                  <button key={doc.label} onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, cursor:"pointer", textAlign:"left", transition:"all .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}>
                    <div style={{ width:32, height:32, borderRadius:6, background:"#e5e7eb", border:"1px solid #d1d5db", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:12, fontWeight:600, color:"#1f2937", margin:0 }}>{doc.label}</p>
                      <p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0 0" }}>Click to view</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Status */}
          <section>
            <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", margin:"0 0 12px 0", textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Status
            </p>
            <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:"12px" }}>
              <p style={{ fontSize:12, fontWeight:500, color:"#374151", margin:0 }}>
                {isPending ? "🔄 Pending Approval" : "✅ Approved"}
              </p>
            </div>
          </section>
        </div>

        {isPending && (
          <div style={{ padding:"16px 20px", borderTop:"1px solid #f3f4f6", display:"flex", gap:10, flexShrink:0 }}>
            <button onClick={() => onReject(assoc)} disabled={isLoading}
              style={{ flex:1, padding:"10px 0", borderRadius:8, border:"1px solid #fecaca", background:"#fef2f2", color:"#dc2626", fontSize:13, fontWeight:600, cursor:isLoading?"not-allowed":"pointer", opacity:isLoading?0.5:1, transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Reject
            </button>
            <button onClick={() => onApprove(assoc.id)} disabled={isLoading}
              style={{ flex:1, padding:"10px 0", borderRadius:8, border:"none", background:"#3b82f6", color:"#fff", fontSize:13, fontWeight:600, cursor:isLoading?"not-allowed":"pointer", opacity:isLoading?0.5:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              {isLoading ? <span style={{ animation:"spin .7s linear infinite" }}>⟳</span> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Approve</>}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Mobile Card ───────────────────────────────────────────────────────────
function MobileCard({ assoc, isPending, onView, onReject, onApprove, actionLoading }) {
  const isRowLoading = actionLoading === assoc.id;
  const zones = parseZones(assoc.zones_intervention);

  return (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"14px", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <Avatar name={assoc.nom_association} url={assoc.logo_url} size={40} />
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:14, fontWeight:600, color:"#1f2937", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {assoc.nom_association}
          </p>
          <p style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
            #{assoc.registration_number}
          </p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {[
          { label:"Founded",  value: assoc.year_founded },
          { label:"Capacity", value: assoc.capacite },
        ].map(({ label, value }) => value ? (
          <div key={label}>
            <p style={{ fontSize:10, fontWeight:600, color:"#9ca3af", margin:"0 0 2px 0", textTransform:"uppercase" }}>{label}</p>
            <p style={{ fontSize:13, fontWeight:500, color:"#374151", margin:0 }}>{value}</p>
          </div>
        ) : null)}
      </div>

      {zones.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {zones.slice(0, 2).map((z, i) => (
            <span key={i} style={{ fontSize:10, fontWeight:500, padding:"3px 8px", borderRadius:4, background:"#eff6ff", color:"#0369a1", border:"1px solid #bfdbfe" }}>{z}</span>
          ))}
          {zones.length > 2 && <span style={{ fontSize:10, color:"#9ca3af" }}>+{zones.length-2}</span>}
        </div>
      )}

      <div style={{ display:"flex", gap:8, paddingTop:4 }}>
        <button onClick={() => onView(assoc)}
          style={{ flex:1, padding:"8px 0", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", color:"#374151", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}
          onMouseEnter={(e) => e.target.style.background = "#f9fafb"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </button>
        {isPending ? (
          <>
            <button onClick={() => onReject(assoc)} disabled={isRowLoading}
              style={{ flex:1, padding:"8px 0", borderRadius:8, border:"1px solid #fecaca", background:"#fef2f2", color:"#dc2626", fontSize:11, fontWeight:600, cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.5:1, display:"flex", alignItems:"center", justifyContent:"center", gap:2 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Reject
            </button>
            <button onClick={() => onApprove(assoc.id)} disabled={isRowLoading}
              style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", background:"#3b82f6", color:"#fff", fontSize:11, fontWeight:600, cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.5:1, display:"flex", alignItems:"center", justifyContent:"center", gap:2 }}>
              {isRowLoading ? "..." : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Approve</>}
            </button>
          </>
        ) : (
          <button onClick={() => onView(assoc)}
            style={{ flex:1, padding:"8px 0", borderRadius:8, border:"1px solid #fecaca", background:"#fef2f2", color:"#dc2626", fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:2 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

// ── Desktop Table Row ──────────────────────────────────────────────────────
function TableRow({ assoc, isPending, onView, onReject, onApprove, actionLoading }) {
  const isRowLoading = actionLoading === assoc.id;

  return (
    <tr style={{ borderBottom:"1px solid #e5e7eb", transition:"all .2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
      <td style={{ padding:"12px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
          <Avatar name={assoc.nom_association} url={assoc.logo_url} size={28} />
          <p style={{ fontSize:13, fontWeight:500, color:"#1f2937", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {assoc.nom_association}
          </p>
        </div>
      </td>
      <td style={{ padding:"12px 16px", fontSize:13, color:"#374151" }}>
        {assoc.registration_number || "—"}
      </td>
      <td style={{ padding:"12px 16px", fontSize:13, color:"#6b7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>
        {assoc.adresse || "—"}
      </td>
      <td style={{ padding:"12px 16px", fontSize:13, color:"#374151" }}>
        {assoc.year_founded || "—"}
      </td>
      <td style={{ padding:"12px 16px", textAlign:"right" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8 }}>
          <button onClick={() => onView(assoc)}
            style={{ width:32, height:32, borderRadius:6, border:"1px solid #d1d5db", background:"#fff", color:"#6b7280", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; }}
            title="View details">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          {isPending ? (
            <>
              <button onClick={() => onReject(assoc)} disabled={isRowLoading}
                style={{ width:32, height:32, borderRadius:6, border:"1px solid #fecaca", background:"#fef2f2", color:"#dc2626", display:"flex", alignItems:"center", justifyContent:"center", cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.5:1, transition:"all .2s" }}
                title="Reject">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <button onClick={() => onApprove(assoc.id)} disabled={isRowLoading}
                style={{ width:32, height:32, borderRadius:6, border:"none", background:"#3b82f6", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.5:1, transition:"all .2s" }}
                title="Approve">
                {isRowLoading ? <span style={{ animation:"spin .7s linear infinite" }}>⟳</span> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            </>
          ) : (
            <button onClick={() => onView(assoc)}
              style={{ width:32, height:32, borderRadius:6, border:"1px solid #fecaca", background:"#fef2f2", color:"#dc2626", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .2s" }}
              title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function PendingAssociationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("nom_association");
  const [sortDir, setSortDir] = useState("asc");
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const fn = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAssociations = async () => {
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }
    setLoading(true); setError(null);
    try {
      const pendingRes = await fetch(`${BASE_URL}/admin/associations/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!pendingRes.ok) throw new Error("Failed to load pending associations");
      const pendingData = await pendingRes.json();
      setPending(pendingData.associations || []);

      const approvedRes = await fetch(`${BASE_URL}/admin/associations/approved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (approvedRes.ok) {
        const approvedData = await approvedRes.json();
        setApproved(approvedData.associations || []);
      }
    } catch { setError("Failed to load associations."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAssociations(); }, []);

  const currentList = activeTab === "pending" ? pending : approved;

  useEffect(() => {
    // Just re-render when list changes
  }, [currentList, search, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleApprove = async (id) => {
    const token = getToken(); if (!token) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${BASE_URL}/admin/associations/${id}/approve`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setPending((prev) => prev.filter((a) => a.id !== id));
      setDetailTarget(null);
      showToast("Association approved.", "success");
    } catch { showToast("Failed to approve.", "error"); }
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
      setDetailTarget(null);
      showToast("Association rejected.", "error");
      setRejectTarget(null);
    } catch { showToast("Failed to reject.", "error"); }
    finally { setRejectLoading(false); }
  };

  const filteredList = currentList
    .filter((a) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return a.nom_association?.toLowerCase().includes(q) ||
             a.registration_number?.toLowerCase().includes(q) ||
             a.adresse?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const va = String(a[sortKey] ?? "");
      const vb = String(b[sortKey] ?? "");
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  return (
    <SecAdminLayout>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .pa-tr:hover td { background:#f9fafb !important; }
        .pa-search:focus { border-color:#3b82f6 !important; outline:none; }
        @media (prefers-reduced-motion: no-preference) {
          .toast { animation: toastIn .3s ease-out; }
        }
      `}</style>

      <div style={{ fontFamily:"system-ui, -apple-system, sans-serif", width:"100%", maxWidth: isDesktop ? 1200 : "100%" }}>

        {toast && (
          <div className="toast" style={{
            position:"fixed", top:20, right:20, zIndex:180,
            display:"flex", alignItems:"center", gap:10,
            padding:"12px 16px", borderRadius:8,
            fontSize:13, fontWeight:500,
            background: toast.type==="success" ? "#10b981" : "#ef4444",
            color:"#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}>
            {toast.type==="success"
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
            {toast.message}
          </div>
        )}

        {rejectTarget && (
          <RejectModal association={rejectTarget} onConfirm={handleRejectConfirm} onCancel={() => setRejectTarget(null)} loading={rejectLoading} />
        )}
        {detailTarget && !rejectTarget && (
          <DetailDrawer
            assoc={detailTarget}
            onClose={() => setDetailTarget(null)}
            onApprove={handleApprove}
            onReject={(a) => setRejectTarget(a)}
            actionLoading={actionLoading}
            isMobile={isMobile || isTablet}
            isPending={activeTab === "pending"}
          />
        )}

        <div style={{ marginBottom:28 }}>
          <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 8px 0", fontWeight:500 }}>
            Dashboard / ASSOCIATIONS
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
            <h1 style={{ fontSize: isMobile ? 28 : 32, fontWeight:700, color:"#000", margin:0 }}>
              Associations
            </h1>
            <button onClick={fetchAssociations}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:6, border:"1px solid #d1d5db", background:"#fff", color:"#6b7280", fontSize:12, fontWeight:500, cursor:"pointer", transition:"all .2s" }}
              onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>



        <div style={{ display:"flex", gap:32, marginBottom:24, borderBottom:"1px solid #e5e7eb", paddingBottom:0 }}>
          <button
            onClick={() => setActiveTab("pending")}
            style={{
              padding:"12px 0",
              borderBottom:`2px solid ${activeTab === "pending" ? "#3b82f6" : "transparent"}`,
              background:"none",
              borderTop:"none",
              borderLeft:"none",
              borderRight:"none",
              color: activeTab === "pending" ? "#374151" : "#6b7280", fontSize:14, fontWeight:500,
              cursor:"pointer", transition:"all .2s",
              fontFamily:"system-ui",
              display:"flex", alignItems:"center", gap:8
            }}>
            Pending Association
            <span style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width:20, height:20, borderRadius:"50%",
              background:"#ef4444", color:"#fff",
              fontSize:11, fontWeight:700
            }}>{pending.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            style={{
              padding:"12px 0",
              borderBottom:`2px solid ${activeTab === "approved" ? "#3b82f6" : "transparent"}`,
              background:"none",
              borderTop:"none",
              borderLeft:"none",
              borderRight:"none",
              color: activeTab === "approved" ? "#374151" : "#6b7280", fontSize:14, fontWeight:500,
              cursor:"pointer", transition:"all .2s",
              fontFamily:"system-ui",
              display:"flex", alignItems:"center", gap:8
            }}>
            Approved Associations
          </button>
        </div>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:20 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="pa-search"
            style={{
              width:"100%", paddingLeft:40, paddingRight:16,
              paddingTop:10, paddingBottom:10,
              border:"1px solid #d1d5db", borderRadius:8,
              fontSize:14, color:"#1f2937", background:"#fff",
              fontFamily:"system-ui", transition:"border-color .2s",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:18, height:18, borderRadius:"50%", background:"none", border:"none", color:"#9ca3af", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Desktop Table */}
        {!isMobile && (
          <div style={{ borderRadius:10, border:"1px solid #e5e7eb", background:"#fff", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead style={{ background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
                <tr>
                  <th onClick={() => toggleSort("nom_association")} style={{ padding:"12px 16px", textAlign:"left", fontSize:12, fontWeight:500, color:"#6b7280", cursor:"pointer", userSelect:"none", fontFamily:"system-ui" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                      Association Name
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: sortKey === "nom_association" ? 1 : 0.25 }}>
                        {sortKey === "nom_association" && sortDir === "desc" ? <path d="M12 5v14M5 12l7 7 7-7"/> : <path d="M12 19V5M5 12l7-7 7 7"/>}
                      </svg>
                    </span>
                  </th>
                  <th onClick={() => toggleSort("registration_number")} style={{ padding:"12px 16px", textAlign:"left", fontSize:12, fontWeight:500, color:"#6b7280", cursor:"pointer", userSelect:"none", fontFamily:"system-ui" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                      Reg. No.
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: sortKey === "registration_number" ? 1 : 0.25 }}>
                        {sortKey === "registration_number" && sortDir === "desc" ? <path d="M12 5v14M5 12l7 7 7-7"/> : <path d="M12 19V5M5 12l7-7 7 7"/>}
                      </svg>
                    </span>
                  </th>
                  <th onClick={() => toggleSort("adresse")} style={{ padding:"12px 16px", textAlign:"left", fontSize:12, fontWeight:500, color:"#6b7280", cursor:"pointer", userSelect:"none", fontFamily:"system-ui" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                      Address
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: sortKey === "adresse" ? 1 : 0.25 }}>
                        {sortKey === "adresse" && sortDir === "desc" ? <path d="M12 5v14M5 12l7 7 7-7"/> : <path d="M12 19V5M5 12l7-7 7 7"/>}
                      </svg>
                    </span>
                  </th>
                  <th onClick={() => toggleSort("year_founded")} style={{ padding:"12px 16px", textAlign:"left", fontSize:12, fontWeight:500, color:"#6b7280", cursor:"pointer", userSelect:"none", fontFamily:"system-ui" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                      Founded
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: sortKey === "year_founded" ? 1 : 0.25 }}>
                        {sortKey === "year_founded" && sortDir === "desc" ? <path d="M12 5v14M5 12l7 7 7-7"/> : <path d="M12 19V5M5 12l7-7 7 7"/>}
                      </svg>
                    </span>
                  </th>
                  <th style={{ padding:"12px 16px", textAlign:"right", fontSize:12, fontWeight:500, color:"#6b7280", fontFamily:"system-ui" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #e5e7eb" }}>
                    {[150, 100, 140, 80, 100].map((w, j) => (
                      <td key={j} style={{ padding:"12px 16px" }}>
                        <div style={{ height:12, width:w, borderRadius:4, background:"#e5e7eb", animation:`pulse 1.5s ${i*0.05}s ease-in-out infinite` }} />
                      </td>
                    ))}
                  </tr>
                ))}

                {!loading && !error && filteredList.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding:"60px 24px", textAlign:"center" }}>
                      <p style={{ fontSize:14, color:"#6b7280", margin:0 }}>
                        {search ? "No records match your search" : activeTab === "pending" ? "No pending associations" : "No approved associations"}
                      </p>
                    </td>
                  </tr>
                )}

                {!loading && !error && filteredList.map((assoc) => (
                  <TableRow key={assoc.id} assoc={assoc} isPending={activeTab === "pending"} onView={(a) => setDetailTarget(a)} onReject={(a) => setRejectTarget(a)} onApprove={handleApprove} actionLoading={actionLoading} />
                ))}
              </tbody>
            </table>

            {!loading && error && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 24px", textAlign:"center" }}>
                <p style={{ fontSize:16, fontWeight:600, color:"#1f2937", margin:"0 0 8px 0" }}>Unable to load</p>
                <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 16px 0" }}>{error}</p>
                <button onClick={fetchAssociations}
                  style={{ padding:"8px 16px", borderRadius:6, border:"none", background:"#3b82f6", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Cards */}
        {isMobile && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {loading && [...Array(4)].map((_, i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:14 }}>
                {[["100%", 14], ["70%", 11], ["50%", 10]].map(([w, h], j) => (
                  <div key={j} style={{ height:parseInt(h), width:w, borderRadius:4, background:"#e5e7eb", marginBottom:j<2?10:0, animation:`pulse 1.5s ${i*0.1}s ease-in-out infinite` }} />
                ))}
              </div>
            ))}

            {!loading && !error && filteredList.map((assoc) => (
              <MobileCard key={assoc.id} assoc={assoc} isPending={activeTab === "pending"} onView={(a) => setDetailTarget(a)} onReject={(a) => setRejectTarget(a)} onApprove={handleApprove} actionLoading={actionLoading} />
            ))}

            {!loading && !error && filteredList.length === 0 && (
              <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <p style={{ fontSize:14, color:"#6b7280", margin:0 }}>
                  {search ? "No records match your search" : activeTab === "pending" ? "No pending associations" : "No approved associations"}
                </p>
              </div>
            )}

            {!loading && error && (
              <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <p style={{ fontSize:15, fontWeight:600, color:"#1f2937", margin:"0 0 8px 0" }}>Unable to load</p>
                <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 12px 0" }}>{error}</p>
                <button onClick={fetchAssociations}
                  style={{ padding:"8px 16px", borderRadius:6, border:"none", background:"#3b82f6", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </SecAdminLayout>
  );
}