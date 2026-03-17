"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";
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
      <Image width={full} height={full} src={url} alt={name} style={{ ...s, borderRadius:8, objectFit:"cover", border:"1px solid rgba(0,0,0,0.08)" }} />
      <button onClick={() => setShow(false)}
        style={{ position:"absolute", top:-4, right:-4, width:14, height:14, borderRadius:"50%", background:"#6B7280", color:"#fff", fontSize:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"none" }}>✕</button>
    </div>
  );

  return (
    <button onClick={() => url && setShow(true)}
      style={{ ...s, flexShrink:0, borderRadius:8, background:p.bg, color:p.fg, fontSize:size*0.38, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", cursor:url?"pointer":"default", border:"none", fontFamily:"Fraunces,serif" }}>
      {letter}
    </button>
  );
}

// ── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({ association, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, zIndex:150, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(10,10,14,0.5)", backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#FAFAF7", border:"1px solid #DDD9D2", borderRadius:20, width:"100%", maxWidth:432, boxShadow:"0 28px 80px rgba(0,0,0,0.18)", overflow:"hidden" }}>
        <div style={{ height:3, background:"linear-gradient(90deg,#B91C1C,#EF4444)" }} />
        <div style={{ padding:"28px 28px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:"#FEF2F2", border:"1px solid #FECACA", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:17, color:"#1C1C1C", margin:0 }}>Reject Association</h3>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#9CA3AF", marginTop:3 }}>{association?.nom_association}</p>
            </div>
          </div>

          <label style={{ fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.12em", color:"#6B7280", display:"block", marginBottom:8 }}>
            Reason <span style={{ color:"#DC2626" }}>*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a clear reason for rejection…"
            rows={4}
            style={{
              width:"100%", border:`1.5px solid ${reason.trim()?"#FCA5A5":"#DDD9D2"}`,
              borderRadius:12, padding:"12px 14px", fontSize:14, color:"#1C1C1C",
              fontFamily:"Fraunces,serif", resize:"none", outline:"none", background:"#fff",
              boxSizing:"border-box", boxShadow: reason.trim()?"0 0 0 3px rgba(252,165,165,0.18)":"none",
              transition:"all .15s",
            }}
          />

          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button onClick={onCancel}
              style={{ flex:1, padding:"11px 0", borderRadius:12, border:"1.5px solid #DDD9D2", background:"#fff", color:"#6B7280", fontSize:13, fontWeight:700, fontFamily:"Fraunces,serif", cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={() => onConfirm(reason)} disabled={!reason.trim() || loading}
              style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", background:"#DC2626", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"Fraunces,serif", cursor:!reason.trim()||loading?"not-allowed":"pointer", opacity:!reason.trim()||loading?0.45:1 }}>
              {loading ? "Processing…" : "Confirm Rejection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Drawer / Bottom Sheet ──────────────────────────────────────────────
function DetailDrawer({ assoc, onClose, onApprove, onReject, actionLoading, isMobile }) {
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
  ];

  const panelStyle = isMobile ? {
    position:"fixed", left:0, right:0, bottom:0, zIndex:50,
    maxHeight:"88vh",
    background:"#FAFAF7", borderTop:"1px solid #DDD9D2",
    borderRadius:"20px 20px 0 0",
    boxShadow:"0 -8px 40px rgba(0,0,0,0.14)",
    display:"flex", flexDirection:"column",
    animation:"sheetUp .3s cubic-bezier(.16,1,.3,1) forwards",
  } : {
    position:"fixed", top:0, right:0, bottom:0, width:370, zIndex:50,
    background:"#FAFAF7", borderLeft:"1px solid #DDD9D2",
    boxShadow:"-10px 0 40px rgba(0,0,0,0.10)",
    display:"flex", flexDirection:"column",
    animation:"drawerIn .28s cubic-bezier(.16,1,.3,1) forwards",
  };

  const backdropStyle = isMobile ? {
    position:"fixed", inset:0, zIndex:40,
    background:"rgba(10,10,14,0.4)", backdropFilter:"blur(2px)",
  } : {
    position:"fixed", top:0, right:0, bottom:0, left:240, zIndex:40,
    background:"rgba(10,10,14,0.28)", backdropFilter:"blur(2px)",
  };

  return (
    <>
      <div onClick={onClose} style={backdropStyle} />

      <div style={panelStyle}>
        <style>{`
          @keyframes drawerIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
          @keyframes sheetUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        `}</style>

        {isMobile
          ? <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px", flexShrink:0 }}>
              <div style={{ width:36, height:4, borderRadius:99, background:"#D8D6D0" }} />
            </div>
          : <div style={{ height:3, flexShrink:0, background:"linear-gradient(90deg,#1e2d78,#6A85D0)" }} />
        }

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid #EEECE6", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
            <Avatar name={assoc.nom_association} url={assoc.logo_url} size={38} />
            <div style={{ minWidth:0 }}>
              <p style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:14, color:"#1C1C1C", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {assoc.nom_association}
              </p>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#B0ADB8", marginTop:2 }}>
                #{assoc.registration_number}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ width:32, height:32, borderRadius:8, border:"1px solid #E4E2DC", background:"transparent", color:"#9CA3AF", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:20, WebkitOverflowScrolling:"touch" }}>
          <section>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.16em", color:"#B0ADB8", marginBottom:10 }}>
              Information
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {infoItems.map(({ label, value }) => (
                <div key={label} style={{ background:"#F2F0EA", border:"1px solid #E8E6E0", borderRadius:12, padding:"10px 14px" }}>
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"#B0ADB8", margin:"0 0 4px" }}>{label}</p>
                  <p style={{ fontFamily:"Fraunces,serif", fontSize:13, fontWeight:600, color:"#2C2C2C", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value || "—"}</p>
                </div>
              ))}
            </div>
          </section>

          {zones.length > 0 && (
            <section>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.16em", color:"#B0ADB8", marginBottom:10 }}>
                Zones d intervention
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {zones.map((z, i) => (
                  <span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:500, padding:"4px 10px", borderRadius:99, background:"#EEF1F8", color:"#1e2d78", border:"1px solid #D0D9EE" }}>{z}</span>
                ))}
              </div>
            </section>
          )}

          {assoc.website_url && (
            <section>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.16em", color:"#B0ADB8", marginBottom:8 }}>
                Website
              </p>
              <a href={assoc.website_url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:"Fraunces,serif", fontSize:13, fontWeight:600, color:"#1e2d78", wordBreak:"break-all", textDecoration:"none" }}>
                {assoc.website_url}
              </a>
            </section>
          )}

          {docs.length > 0 && (
            <section>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.16em", color:"#B0ADB8", marginBottom:10 }}>
                Documents
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {docs.map((doc) => (
                  <button key={doc.label} onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#F2F0EA", border:"1px solid #E8E6E0", borderRadius:12, cursor:"pointer", textAlign:"left", transition:"border-color .15s, background .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="#ECEAE2"; e.currentTarget.style.borderColor="#D0D8EE"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="#F2F0EA"; e.currentTarget.style.borderColor="#E8E6E0"; }}>
                    <div style={{ width:34, height:34, borderRadius:8, background:"#E4E1D6", border:"1px solid #D8D5CA", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7C7A74" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:13, color:"#1C1C1C", margin:0 }}>{doc.label}</p>
                      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#9CA3AF", margin:"3px 0 0" }}>Opens in new tab</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4C2BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <div style={{ padding:"16px 20px", borderTop:"1px solid #EEECE6", display:"flex", gap:10, flexShrink:0,
          paddingBottom: isMobile ? "max(16px, env(safe-area-inset-bottom))" : 16 }}>
          <button onClick={() => onReject(assoc)} disabled={isLoading}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"1.5px solid #FECACA", background:"#FFF8F8", color:"#DC2626", fontSize:13, fontWeight:700, fontFamily:"Fraunces,serif", cursor:isLoading?"not-allowed":"pointer", opacity:isLoading?0.4:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Reject
          </button>
          <button onClick={() => onApprove(assoc.id)} disabled={isLoading}
            style={{ flex:1, padding:"12px 0", borderRadius:12, border:"none", background:"#1e2d78", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"Fraunces,serif", cursor:isLoading?"not-allowed":"pointer", opacity:isLoading?0.5:1, boxShadow:"0 4px 18px rgba(30,45,120,.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {isLoading
              ? <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.25)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
              : <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Approve
                </>}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Mobile Card ─────────────────────────────────────────────────────────────
function MobileCard({ assoc, idx, onView, onReject, onApprove, actionLoading }) {
  const isRowLoading = actionLoading === assoc.id;
  const zones = parseZones(assoc.zones_intervention);

  return (
    <div style={{ background:"#fff", border:"1.5px solid #E4E2DC", borderRadius:16, padding:"16px", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <Avatar name={assoc.nom_association} url={assoc.logo_url} size={42} />
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:15, color:"#1C1C1C", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {assoc.nom_association}
          </p>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#B0ADB8", marginTop:2 }}>
            #{assoc.registration_number}
          </p>
        </div>
        {/* CHANGED: pending dot → grey square tick-box look */}
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#6B7280", border:"1px solid #DDD9D2", padding:"3px 8px", borderRadius:4, flexShrink:0 }}>
          pending
        </span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {[
          { label:"Founded",  value: assoc.year_founded },
          { label:"Capacity", value: assoc.capacite },
          { label:"Address",  value: assoc.adresse },
          { label:"Hours",    value: assoc.horaires },
        ].map(({ label, value }) => value ? (
          <div key={label}>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#B0ADB8", margin:"0 0 2px" }}>{label}</p>
            <p style={{ fontFamily:"Fraunces,serif", fontSize:12, fontWeight:600, color:"#4B4B4B", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value}</p>
          </div>
        ) : null)}
      </div>

      {zones.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {zones.slice(0, 3).map((z, i) => (
            <span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:"3px 8px", borderRadius:99, background:"#EEF1F8", color:"#1e2d78", border:"1px solid #D0D9EE" }}>{z}</span>
          ))}
          {zones.length > 3 && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#9CA3AF" }}>+{zones.length-3}</span>}
        </div>
      )}

      <div style={{ display:"flex", gap:8, paddingTop:4 }}>
        {/* CHANGED: View → neutral grey, no blue tint */}
        <button onClick={() => onView(assoc)}
          style={{ flex:1, padding:"9px 0", borderRadius:10, border:"1.5px solid #DDD9D2", background:"transparent", color:"#4B4B4B", fontSize:12, fontWeight:700, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          View
        </button>
        <button onClick={() => onReject(assoc)} disabled={isRowLoading}
          style={{ flex:1, padding:"9px 0", borderRadius:10, border:"1.5px solid #FECACA", background:"#FFF8F8", color:"#DC2626", fontSize:12, fontWeight:700, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.4:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Reject
        </button>
        {/* CHANGED: Approve → solid dark, not navy blue with shadow */}
        <button onClick={() => onApprove(assoc.id)} disabled={isRowLoading}
          className="pa-approve-btn"
          style={{ flex:1, padding:"9px 0", borderRadius:10, border:"1px solid #1C1C1C", background:"#1C1C1C", color:"#fff", fontSize:12, fontWeight:700, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.4:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
          {isRowLoading
            ? <span style={{ width:12, height:12, border:"2px solid rgba(255,255,255,.25)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
            : <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Approve
              </>}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function PendingAssociationsPage() {
  const router = useRouter();
  const [associations, setAssociations] = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [sortKey, setSortKey]           = useState("id");
  const [sortDir, setSortDir]           = useState("asc");
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);
  const [toast, setToast]               = useState(null);
  const [windowWidth, setWindowWidth]   = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const fn = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const isMobile  = windowWidth < 640;
  const isTablet  = windowWidth >= 640 && windowWidth < 1024;
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
      const res = await fetch(`${BASE_URL}/admin/associations/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAssociations(data.associations || []);
    } catch { setError("Failed to load associations."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAssociations(); }, []);

  useEffect(() => {
    let list = [...associations];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        a.nom_association?.toLowerCase().includes(q) ||
        a.registration_number?.toLowerCase().includes(q) ||
        a.adresse?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const va = String(a[sortKey] ?? "");
      const vb = String(b[sortKey] ?? "");
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    setFiltered(list);
  }, [search, associations, sortKey, sortDir]);

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
      setAssociations((prev) => prev.filter((a) => a.id !== id));
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
      setAssociations((prev) => prev.filter((a) => a.id !== rejectTarget.id));
      setDetailTarget(null);
      showToast("Association rejected.", "error");
      setRejectTarget(null);
    } catch { showToast("Failed to reject.", "error"); }
    finally { setRejectLoading(false); }
  };

  const desktopColumns = [
    { key: "nom_association",      label: "Association" },
    { key: "registration_number",  label: "Reg. No." },
    { key: "adresse",              label: "Address" },
    { key: "year_founded",         label: "Founded" },
    { key: "capacite",             label: "Capacity" },
  ];
  const tabletColumns = [
    { key: "nom_association",      label: "Association" },
    { key: "registration_number",  label: "Reg. No." },
    { key: "year_founded",         label: "Founded" },
  ];
  const columns = isTablet ? tabletColumns : desktopColumns;

  const TH = ({ children, sortable, col }) => (
    <th
      onClick={sortable ? () => toggleSort(col) : undefined}
      style={{
        padding: isMobile ? "10px 12px" : "12px 16px",
        textAlign:"left", whiteSpace:"nowrap",
        fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700,
        textTransform:"uppercase", letterSpacing:"0.15em",
        color: sortable && sortKey === col ? "#1e2d78" : "#A8A6A0",
        cursor: sortable ? "pointer" : "default",
        userSelect:"none", background:"transparent",
        borderBottom:"1.5px solid #E4E2DC",
      }}>
      {sortable
        ? <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            {children}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: sortKey === col ? 1 : 0.25 }}>
              {sortKey === col && sortDir === "desc"
                ? <path d="M12 5v14M5 12l7 7 7-7"/>
                : <path d="M12 19V5M5 12l7-7 7 7"/>}
            </svg>
          </span>
        : children}
    </th>
  );

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes toastIn { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .pa-tr:hover td { background:#F2F0EA !important; }
        .pa-search:focus { border-color:#1e2d78 !important; box-shadow:0 0 0 3px rgba(30,45,120,.09) !important; outline:none; }
        .pa-approve-btn { transition:all .18s; }
        .pa-approve-btn:not(:disabled):hover { opacity:.85 !important; transform:translateY(-1px); }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      `}</style>

      <div style={{ fontFamily:"Fraunces,serif", width:"100%", maxWidth: isDesktop ? 1100 : "100%" }}>

        {toast && (
          <div style={{
            position:"fixed", top:20, right:20, zIndex:180,
            display:"flex", alignItems:"center", gap:10,
            padding:"12px 18px", borderRadius:12, maxWidth:"calc(100vw - 40px)",
            fontSize:13, fontWeight:600, fontFamily:"Fraunces,serif",
            background: toast.type==="success" ? "#1e2d78" : "#DC2626",
            color:"#fff",
            boxShadow: toast.type==="success" ? "0 10px 36px rgba(30,45,120,.38)" : "0 10px 36px rgba(220,38,38,.38)",
            animation:"toastIn .28s cubic-bezier(.16,1,.3,1) forwards",
          }}>
            {toast.type==="success"
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
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
          />
        )}

        <div style={{ display:"flex", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent:"space-between", marginBottom: isMobile ? 20 : 28, flexWrap:"wrap", gap:12 }}>
          <div>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.18em", color:"#B0ADB8", marginBottom:6 }}>
              Admin · Associations
            </p>
            <h1 style={{ fontFamily:"Fraunces,serif", fontSize: isMobile ? 24 : 30, fontWeight:700, letterSpacing:"-0.025em", color:"#1C1C1C", margin:0, lineHeight:1 }}>
              Pending Review
            </h1>
            {!loading && (
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#B0ADB8", marginTop:6 }}>
                {filtered.length} of {associations.length} records awaiting action
              </p>
            )}
          </div>
          <button onClick={fetchAssociations}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 16px", borderRadius:10, border:"1.5px solid #DDD9D2", background:"#F5F3EE", color:"#6B7280", fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.1em", cursor:"pointer", flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>

        <div style={{ position:"relative", marginBottom:18 }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#C4C2BC" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search associations…"
            className="pa-search"
            style={{ width:"100%", paddingLeft:40, paddingRight:36, paddingTop:11, paddingBottom:11, border:"1.5px solid #DDD9D2", borderRadius:10, fontSize: isMobile ? 14 : 13, color:"#1C1C1C", background:"#FAFAF7", fontFamily:"Fraunces,serif", transition:"border-color .15s, box-shadow .15s" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:20, height:20, borderRadius:"50%", background:"#EAE8E2", border:"none", color:"#9CA3AF", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {isMobile && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {loading && [...Array(4)].map((_, i) => (
              <div key={i} style={{ background:"#fff", border:"1.5px solid #E4E2DC", borderRadius:16, padding:16 }}>
                {[["100%", 16], ["60%", 12], ["80%", 11]].map(([w, h], j) => (
                  <div key={j} style={{ height:h, width:w, borderRadius:6, background:"#ECEAE4", marginBottom:j<2?10:0, animation:`pulse 1.6s ${i*0.1}s ease-in-out infinite` }} />
                ))}
              </div>
            ))}

            {!loading && !error && filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"48px 24px" }}>
                <p style={{ fontFamily:"Fraunces,serif", fontWeight:600, fontSize:14, color:"#6B7280", margin:0 }}>
                  {search ? "No records match your search" : "Nothing pending right now"}
                </p>
                {search && (
                  <button onClick={() => setSearch("")}
                    style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:700, color:"#1e2d78", background:"none", border:"none", cursor:"pointer", textDecoration:"underline", marginTop:8 }}>
                    Clear filter
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filtered.map((assoc, idx) => (
              <MobileCard
                key={assoc.id}
                assoc={assoc}
                idx={idx}
                onView={(a) => setDetailTarget(a)}
                onReject={(a) => setRejectTarget(a)}
                onApprove={handleApprove}
                actionLoading={actionLoading}
              />
            ))}

            {!loading && error && (
              <div style={{ textAlign:"center", padding:"48px 24px" }}>
                <p style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:15, color:"#1C1C1C", margin:"0 0 6px" }}>Unable to load</p>
                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#9CA3AF", margin:"0 0 16px" }}>{error}</p>
                <button onClick={fetchAssociations}
                  style={{ padding:"10px 22px", borderRadius:10, border:"none", background:"#1e2d78", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"Fraunces,serif", cursor:"pointer" }}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {!isMobile && (
          <div style={{ borderRadius:18, border:"1.5px solid #DDD9D2", background:"#FAFAF7", overflow:"hidden", boxShadow:"0 2px 18px rgba(0,0,0,0.04)" }}>
            <div style={{ overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
                <colgroup>
                  {isTablet ? (<>
                    <col style={{ width:36 }} />
                    <col style={{ width:"35%" }} />
                    <col style={{ width:"20%" }} />
                    <col style={{ width:72 }} />
                    <col style={{ width:90 }} />
                    <col style={{ width:130 }} />
                  </>) : (<>
                    <col style={{ width:44 }} />
                    <col style={{ width:"20%" }} />
                    <col style={{ width:"11%" }} />
                    <col style={{ width:"13%" }} />
                    <col style={{ width:68 }} />
                    <col style={{ width:78 }} />
                    <col style={{ width:116 }} />
                    <col style={{ width:240 }} />
                  </>)}
                </colgroup>

                <thead style={{ background:"#F2F0EA" }}>
                  <tr>
                    <th style={{ padding:"12px 16px", borderBottom:"1.5px solid #E4E2DC" }}>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:"#C4C2BC" }}>#</span>
                    </th>
                    {columns.map((col) => <TH key={col.key} sortable col={col.key}>{col.label}</TH>)}
                    <TH>Status</TH>
                    <th style={{ padding:"12px 16px", textAlign:"right", fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:"#A8A6A0", borderBottom:"1.5px solid #E4E2DC" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && [...Array(6)].map((_, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #ECEAE4" }}>
                      {(isTablet ? [32,180,100,55,68,170] : [32,200,110,120,55,60,68,180]).map((w, j) => (
                        <td key={j} style={{ padding:"14px 16px" }}>
                          <div style={{ height:11, width:w, borderRadius:6, background:"#ECEAE4", animation:`pulse 1.6s ${i*0.07}s ease-in-out infinite` }} />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {!loading && !error && filtered.length === 0 && (
                    <tr>
                      <td colSpan={isTablet ? 6 : 8} style={{ padding:"72px 24px", textAlign:"center" }}>
                        <p style={{ fontFamily:"Fraunces,serif", fontWeight:600, fontSize:14, color:"#6B7280", margin:0 }}>
                          {search ? "No records match your search" : "Nothing pending right now"}
                        </p>
                        {search && (
                          <button onClick={() => setSearch("")}
                            style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:700, color:"#1e2d78", background:"none", border:"none", cursor:"pointer", textDecoration:"underline", marginTop:8 }}>
                            Clear filter
                          </button>
                        )}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && filtered.map((assoc, idx) => {
                    const isRowLoading = actionLoading === assoc.id;
                    const zones = parseZones(assoc.zones_intervention);

                    return (
                      <tr key={assoc.id} className="pa-tr" style={{ borderBottom:"1px solid #ECEAE4" }}>

                        <td style={{ padding:"14px 16px" }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#D0CEC8" }}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </td>

                        <td style={{ padding:"14px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                            <Avatar name={assoc.nom_association} url={assoc.logo_url} size={30} />
                            <div style={{ minWidth:0, flex:1 }}>
                              <p style={{ fontFamily:"Fraunces,serif", fontWeight:600, fontSize:13, color:"#1C1C1C", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                {assoc.nom_association}
                              </p>
                              {!isTablet && zones.length > 0 && (
                                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:4 }}>
                                  {zones.slice(0, 2).map((z, i) => (
                                    <span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:"2px 8px", borderRadius:99, background:"#EEF1F8", color:"#1e2d78", border:"1px solid #D0D9EE" }}>{z}</span>
                                  ))}
                                  {zones.length > 2 && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#9CA3AF" }}>+{zones.length-2}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td style={{ padding:"14px 16px" }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, padding:"3px 8px", borderRadius:6, background:"#F2F0EA", color:"#6B6860", border:"1px solid #E4E2DC", whiteSpace:"nowrap", display:"inline-block", maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis" }}>
                            {assoc.registration_number || "—"}
                          </span>
                        </td>

                        {isDesktop && (
                          <td style={{ padding:"14px 16px" }}>
                            <p style={{ fontFamily:"Fraunces,serif", fontSize:12, color:"#9CA3AF", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {assoc.adresse || "—"}
                            </p>
                          </td>
                        )}

                        <td style={{ padding:"14px 16px" }}>
                          <span style={{ fontFamily:"Fraunces,serif", fontSize:13, fontWeight:600, color:"#4B4B4B" }}>{assoc.year_founded || "—"}</span>
                        </td>

                        {isDesktop && (
                          <td style={{ padding:"14px 16px" }}>
                            <span style={{ fontFamily:"Fraunces,serif", fontSize:13, fontWeight:600, color:"#4B4B4B" }}>{assoc.capacite || "—"}</span>
                          </td>
                        )}

                        {/* CHANGED: Status — plain text badge, no amber/yellow */}
                        <td style={{ padding:"14px 12px 14px 16px", whiteSpace:"nowrap" }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#6B7280", border:"1px solid #DDD9D2", padding:"3px 8px", borderRadius:4, display:"inline-block" }}>
                            pending
                          </span>
                        </td>

                        <td style={{ padding:"14px 16px", whiteSpace:"nowrap" }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap: isTablet ? 4 : 6 }}>
                            {/* CHANGED: View — neutral grey, no blue tint */}
                            <button onClick={() => setDetailTarget(assoc)}
                              style={{ display:"flex", alignItems:"center", gap:5, padding: isTablet ? "6px 9px" : "6px 10px", borderRadius:8, border:"1.5px solid #DDD9D2", background:"transparent", color:"#4B4B4B", fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer", whiteSpace:"nowrap" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                              </svg>
                              {!isTablet && "View"}
                            </button>
                            <button onClick={() => setRejectTarget(assoc)} disabled={isRowLoading}
                              style={{ display:"flex", alignItems:"center", gap:5, padding: isTablet ? "6px 9px" : "6px 10px", borderRadius:8, border:"1.5px solid #FECACA", background:"#FFF8F8", color:"#DC2626", fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.4:1, whiteSpace:"nowrap" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                              {!isTablet && "Reject"}
                            </button>
                            {/* CHANGED: Approve — solid dark #1C1C1C, no navy blue shadow */}
                            <button onClick={() => handleApprove(assoc.id)} disabled={isRowLoading}
                              className="pa-approve-btn"
                              style={{ display:"flex", alignItems:"center", gap:5, padding: isTablet ? "6px 9px" : "6px 10px", borderRadius:8, border:"1px solid #1C1C1C", background:"#1C1C1C", color:"#fff", fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", cursor:isRowLoading?"not-allowed":"pointer", opacity:isRowLoading?0.4:1, whiteSpace:"nowrap" }}>
                              {isRowLoading
                                ? <span style={{ width:13, height:13, border:"2px solid rgba(255,255,255,.25)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
                                : <>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    {!isTablet && "Approve"}
                                  </>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* CHANGED: Error state — neutral grey icon, no red circle */}
            {!loading && error && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"64px 24px", textAlign:"center" }}>
                <div style={{ width:46, height:46, borderRadius:13, background:"#F2F0EA", border:"1px solid #E4E2DC", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:15, color:"#1C1C1C", margin:"0 0 6px" }}>Unable to load</p>
                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#9CA3AF", margin:"0 0 18px" }}>{error}</p>
                <button onClick={fetchAssociations}
                  style={{ padding:"10px 22px", borderRadius:10, border:"none", background:"#1e2d78", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"Fraunces,serif", cursor:"pointer", boxShadow:"0 4px 18px rgba(30,45,120,.3)" }}>
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", borderTop:"1px solid #ECEAE4" }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#C4C2BC" }}>
                  {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                </span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#D8D6D0" }}>
                  sorted by {sortKey} · {sortDir}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}