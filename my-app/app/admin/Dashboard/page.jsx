"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "../../components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");
}

async function apiFetch(path) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed: ${path}`);
  return res.json();
}

/* ─────────────────────────── SVG Icon Library ─────────────────────────── */

const Icon = {
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Gift: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  Leaf: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22c0 0 0-10 10-10s10-10 10-10c0 0-10 0-20 20z"/>
    </svg>
  ),
  Utensils: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="2" x2="3" y2="22"/><path d="M7 2v6a4 4 0 0 1-4 4"/>
      <line x1="21" y1="2" x2="21" y2="22"/><path d="M17 2v4a4 4 0 0 0 4 4"/>
    </svg>
  ),
  Wind: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Star: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

/* ──────────────────────────── Sub-components ──────────────────────────── */

function StatCard({ icon: IconComp, label, value, delta, negative, accent }) {
  const isPositive = !negative;
  return (
    <div className="stat-card" style={{ "--accent": accent || "#0d1b6e" }}>
      <div className="stat-icon-ring">
        <IconComp />
      </div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value?.toLocaleString() ?? <span className="skel-inline" />}</span>
        <span className={`stat-delta ${isPositive ? "pos" : "neg"}`}>
          {isPositive ? <Icon.TrendUp /> : <Icon.TrendDown />}
          {delta}
        </span>
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.total, 0);
  const palette = ["#0d1b6e", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899"];

  // Build arc paths with a small gap between segments
  const CX = 80, CY = 80, R = 58, SW = 16;
  const GAP_DEG = 2.5; // degrees of gap between segments
  const GAP_RAD = (GAP_DEG * Math.PI) / 180;

  const toXY = (angleDeg, radius) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
  };

  const segments = data.reduce((acc, d, i) => {
    const pct = total > 0 ? d.total / total : 0;
    const sweep = pct * 360 - GAP_DEG;
    const startAngle = acc.angle;
    const seg = { ...d, i, pct, startAngle, sweep, color: palette[i % palette.length] };
    acc.items.push(seg);
    acc.angle += pct * 360;
    return acc;
  }, { angle: 0, items: [] }).items;

  const activeItem = hovered !== null ? segments[hovered] : null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      {/* SVG Donut */}
      <div style={{ position: "relative", flexShrink: 0, width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Background track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={SW} />
          {segments.map((seg) => {
            if (seg.sweep <= 0) return null;
            const r1 = (seg.startAngle);
            const r2 = (seg.startAngle + seg.sweep);
            const [x1, y1] = toXY(r1, R);
            const [x2, y2] = toXY(r2, R);
            const largeArc = seg.sweep > 180 ? 1 : 0;
            const isHov = hovered === seg.i;
            const rOuter = isHov ? R + 3 : R;
            const [hx1, hy1] = toXY(r1, rOuter);
            const [hx2, hy2] = toXY(r2, rOuter);
            return (
              <path
                key={seg.i}
                d={`M ${hx1} ${hy1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${hx2} ${hy2}`}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHov ? SW + 4 : SW}
                strokeLinecap="round"
                style={{ transition: "all 0.2s ease", cursor: "pointer", filter: isHov ? `drop-shadow(0 0 6px ${seg.color}55)` : "none" }}
                onMouseEnter={() => setHovered(seg.i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
        {/* Center label */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {activeItem ? (
            <>
              <span style={{ fontSize: 18, fontWeight: 900, color: activeItem.color, letterSpacing: "-0.5px", lineHeight: 1 }}>
                {((activeItem.pct) * 100).toFixed(1)}%
              </span>
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginTop: 3, textAlign: "center", maxWidth: 70, lineHeight: 1.3 }}>
                {activeItem.name}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.7px", lineHeight: 1.1, marginTop: 2 }}>
                {total.toLocaleString()}
              </span>
              <span style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 600, marginTop: 2 }}>donations</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        {segments.map((seg) => {
          const isHov = hovered === seg.i;
          const pct = (seg.pct * 100).toFixed(1);
          return (
            <div
              key={seg.i}
              onMouseEnter={() => setHovered(seg.i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 10,
                background: isHov ? `${seg.color}08` : "transparent",
                border: `1px solid ${isHov ? seg.color + "22" : "transparent"}`,
                cursor: "pointer", transition: "all 0.15s ease",
              }}
            >
              <span style={{
                width: 10, height: 10, borderRadius: 3,
                background: seg.color, flexShrink: 0,
                boxShadow: isHov ? `0 0 0 3px ${seg.color}22` : "none",
                transition: "box-shadow 0.15s ease",
              }} />
              <span style={{ fontSize: 12.5, color: isHov ? "#0f172a" : "#475569", flex: 1, fontWeight: isHov ? 600 : 500, transition: "color 0.15s ease" }}>
                {seg.name}
              </span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: isHov ? seg.color : "#0f172a", transition: "color 0.15s ease" }}>{pct}%</span>
                <span style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 500 }}>{seg.total.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CityBar({ city, max, rank }) {
  const pct = Math.max((city.totalDonations / max) * 100, 3);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: rank <= 1 ? "#0d1b6e" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: rank <= 1 ? "#fff" : "#64748b", flexShrink: 0 }}>{rank}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{city.Quartiers}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{city.totalDonations.toLocaleString()}</span>
        </div>
        <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: rank <= 1 ? "#0d1b6e" : rank <= 2 ? "#3b82f6" : "#93c5fd", borderRadius: 99, transition: "width 0.9s cubic-bezier(.16,1,.3,1)" }} />
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, size = 36 }) {
  const initials = (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const hues = [218, 145, 25, 280, 340];
  const hue = hues[(name?.charCodeAt(0) || 0) % hues.length];
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.32, background: `hsl(${hue},60%,92%)`, border: `1.5px solid hsl(${hue},50%,82%)`, display: "flex", alignItems: "center", justifyContent: "center", color: `hsl(${hue},60%,35%)`, fontSize: size * 0.34, fontWeight: 800, flexShrink: 0, letterSpacing: "-0.02em" }}>
      {initials}
    </div>
  );
}

function ContribRow({ name, sub, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
      <Avatar name={name} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{sub}</div>
      </div>
      {badge}
    </div>
  );
}

/* ──────────────────────────── Main Dashboard ──────────────────────────── */

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = getToken();
    const ud = localStorage.getItem("user") || sessionStorage.getItem("user");
    let u = null;
    if (token && ud) { try { u = JSON.parse(ud); } catch {} }
    setUser(u);
    setInitializing(false);
  }, []);

  const [core, setCore] = useState(null);
  const [impact, setImpact] = useState(null);
  const [donations, setDonations] = useState([]);
  const [cities, setCities] = useState([]);
  const [contributors, setContributors] = useState(null);
  const [reports, setReports] = useState(null);
  const [pending, setPending] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [reloading, setReloading] = useState(false);

  const refreshDashboard = async () => {
    if (!user) return;
    setLoadError(false);
    setReloading(true);

    try {
      const results = await Promise.allSettled([
        apiFetch("/statistics/CoreMetrics"),
        apiFetch("/statistics/ImpactMetrics"),
        apiFetch("/statistics/DonationsByCategory"),
        apiFetch("/statistics/top-cities"),
        apiFetch("/statistics/top-contributors"),
        apiFetch("/statistics/ReportsInfo"),
        apiFetch("/statistics/pendingsAndSuspiciousAndApprouved"),
      ]);

      const [coreData, impactData, donationsData, citiesData, contributorsData, reportsData, pendingData] =
        results.map((result) => result.status === "fulfilled" ? result.value : null);

      setCore(coreData);
      setImpact(impactData);
      setDonations(Array.isArray(donationsData) ? donationsData : []);
      setCities(Array.isArray(citiesData) ? citiesData : []);
      setContributors(contributorsData);
      setReports(reportsData);
      setPending(pendingData);
      setLoadError(results.some((result) => result.status === "rejected"));
    } catch (error) {
      setLoadError(true);
    } finally {
      setReloading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    refreshDashboard();
  }, [user]);

  useEffect(() => {
    if (!initializing && !user) router.push("/LoginScreen");
  }, [initializing, user, router]);

  const handleLogout = async () => {
    try { await fetch(`${BASE_URL}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } }); } catch {}
    ["accessToken", "refreshToken", "user"].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
    router.push("/LoginScreen");
  };

  if (initializing) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#94a3b8", fontSize: 14 }}>Loading dashboard…</div>;
  if (!user) return null;

  const maxCity = cities.length ? Math.max(...cities.map(c => c.totalDonations)) : 1;
  const pendingCount = pending?.pendingAssociations?.length ?? 0;
  const approvedCount = pending?.ApprouvedAssociations?.length ?? 0;
  const suspiciousCount = pending?.suspicious?.length ?? 0;

  return (
    <AdminLayout>
      <style>{css}</style>
      <div className="db-page">

        {loadError && (
          <div className="error-banner">
            <Icon.AlertTriangle />
            <span>Some data failed to load. Please check your connection and refresh.</span>
            <button className="refresh-btn" type="button" onClick={refreshDashboard} disabled={reloading}>
              {reloading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        )}

        {/* ── Page Header ── */}
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Welcome back, {user?.name}</p>
            <h1 className="page-title">Dashboard Overview</h1>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign out</button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="stats-grid">
          <StatCard icon={Icon.Users}    label="Total Users"        value={core?.totalUsers}                   delta="+12%" accent="#0d1b6e" />
          <StatCard icon={Icon.Building} label="Total Associations" value={core?.totalAssociations}            delta="+5%"  accent="#2563eb" />
          <StatCard icon={Icon.Shield}   label="Total Mayors"       value={core?.totalMayors}                  delta="-2%" negative accent="#ef4444" />
          <StatCard icon={Icon.Gift}     label="Donations / Beneficiaries" value={core?.total_donateurs_beneficiaires} delta="+24%" accent="#16a34a" />
        </div>

        {/* ── Impact Banner ── */}
        <div className="impact-banner">
          <div className="impact-bg-grid" />
          <div className="impact-content">
            <div className="impact-tag">
              <Icon.Leaf />
              Live Impact Metrics
            </div>
            <h2 className="impact-title">Global Sustainability Impact</h2>
            <p className="impact-desc">
              Our collective efforts in food waste management are transforming urban ecosystems.
              Track real-time environmental preservation metrics below.
            </p>
            <div className="impact-metrics">
              <div className="impact-metric">
                <div className="impact-metric-icon"><Icon.Utensils /></div>
                <div>
                  <div className="impact-metric-label">Meals Saved</div>
                  <div className="impact-metric-value">{impact?.donationsCompleted?.toLocaleString() ?? "—"}</div>
                </div>
              </div>
              <div className="impact-divider" />
              <div className="impact-metric">
                <div className="impact-metric-icon"><Icon.Wind /></div>
                <div>
                  <div className="impact-metric-label">CO₂ Avoided</div>
                  <div className="impact-metric-value">{impact?.co2Saved ? `${Number(impact.co2Saved).toLocaleString()} kg` : "—"}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="impact-image-col">
            <Image src="/tree.png" alt="Impact" width={240} height={200} style={{ objectFit: "contain", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.28))" }} />
          </div>
        </div>

        {/* ── Mid Row ── */}
        <div className="two-col">
          {/* Donations by Category */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <span className="card-title">Donations by Category</span>
                <span className="card-subtitle">{donations.length} categories tracked</span>
              </div>
              <button className="pill-btn" onClick={() => router.push("/admin/Content/Donations")}>
                View all <Icon.ArrowRight />
              </button>
            </div>
            {donations.length > 0 ? <DonutChart data={donations} /> : <div className="skeleton" style={{ height: 140 }} />}
          </div>

          {/* Top Cities */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <span className="card-title">Top Active Cities</span>
                <span className="card-subtitle">Ranked by donations</span>
              </div>
              <button className="pill-btn" onClick={() => router.push("/admin/analytics")}>
                View all <Icon.ArrowRight />
              </button>
            </div>
            {cities.length > 0
              ? cities.slice(0, 5).map((c, i) => <CityBar key={c.Quartiers} city={c} max={maxCity} rank={i + 1} />)
              : <div className="skeleton" style={{ height: 140 }} />}
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="two-col">
          {/* Reports */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <span className="card-title">Reports Overview</span>
                <span className="card-subtitle">Platform moderation status</span>
              </div>
              <button className="pill-btn" onClick={() => router.push("/admin/Content/reports")}>
                View all <Icon.ArrowRight />
              </button>
            </div>
            <div className="reports-kpis">
              <div className="kpi-box red">
                <div className="kpi-top">
                  <Icon.AlertTriangle />
                  <span className="kpi-badge">Action needed</span>
                </div>
                <div className="kpi-num">{pendingCount}</div>
                <div className="kpi-label">Pending Review</div>
              </div>
              <div className="kpi-box amber">
                <div className="kpi-top">
                  <Icon.Activity />
                  <span className="kpi-badge amber-badge">Flagged</span>
                </div>
                <div className="kpi-num">{suspiciousCount}</div>
                <div className="kpi-label">Suspicious Users</div>
              </div>
              <div className="kpi-box green">
                <div className="kpi-top">
                  <Icon.CheckCircle />
                  <span className="kpi-badge green-badge">Verified</span>
                </div>
                <div className="kpi-num">{approvedCount}</div>
                <div className="kpi-label">Approved Assoc.</div>
              </div>
            </div>
            <div className="reports-total-row">
              <Icon.FileText />
              <span>Total reports filed</span>
              <span className="reports-total-val">{reports?.total ?? "—"}</span>
            </div>
            <button className="review-btn" onClick={() => router.push("/admin/Content/reports")}>
              <Icon.FileText />
              Review Reports
            </button>
          </div>

          {/* Contributors */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <span className="card-title">Top Contributors</span>
                <span className="card-subtitle">Donors, associations & food savers</span>
              </div>
              <button className="pill-btn" onClick={() => router.push("/admin/analytics")}>
                View all <Icon.ArrowRight />
              </button>
            </div>
            {contributors ? (
              <div className="contrib-scroll">
                <div className="contrib-section-label">Top Donors</div>
                {contributors.topDonors?.slice(0, 2).map(d => (
                  <ContribRow key={d.id} name={d.name}
                    sub={`${d.totalDonations} donations · ${d.totalQuantity} items`}
                    badge={<Icon.CheckCircle />} />
                ))}
                <div className="contrib-section-label" style={{ marginTop: 14 }}>Top Associations</div>
                {contributors.topAssociations?.slice(0, 2).map(a => (
                  <ContribRow key={a.id} name={a.nom_association}
                    sub={`${a.totalReceived} received`}
                    badge={<Icon.CheckCircle />} />
                ))}
                <div className="contrib-section-label" style={{ marginTop: 14 }}>Food Savers</div>
                {contributors.topFoodSavers?.slice(0, 2).map(f => (
                  <ContribRow key={f.id} name={f.name}
                    sub={`${f.total_points} pts · ${f.total_trusted_users} trusted users`}
                    badge={<Icon.Star />} />
                ))}
              </div>
            ) : <div className="skeleton" style={{ height: 200 }} />}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="card" style={{ marginBottom: 32 }}>
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-title">Recent Activity</span>
              <span className="card-subtitle">Latest platform events</span>
            </div>
            <button className="pill-btn" onClick={() => router.push("/admin/Content/reports")}>
              View history <Icon.ArrowRight />
            </button>
          </div>
          {pending ? (
            <div className="activity-list">
              {pending.pendingAssociations?.slice(0, 2).map(a => (
                <div key={a.id} className="activity-row">
                  <div className="activity-dot green-dot" />
                  <div className="activity-icon-wrap green-wrap"><Icon.Building /></div>
                  <div className="activity-body">
                    <span className="activity-text">
                      <strong>{a.nom_association}</strong> is pending approval for {a.zones_intervention?.join(", ")}.
                    </span>
                    <div className="activity-meta"><Icon.Clock /> <span>Pending review</span><span className="meta-sep">·</span><Icon.MapPin /><span>{a.adresse?.split(",")[1]?.trim() ?? "Algeria"}</span></div>
                  </div>
                  <span className="activity-chip pending-chip">Pending</span>
                </div>
              ))}
              {pending.suspicious?.slice(0, 2).map(u => (
                <div key={u.id} className="activity-row">
                  <div className="activity-dot red-dot" />
                  <div className="activity-icon-wrap red-wrap"><Icon.AlertTriangle /></div>
                  <div className="activity-body">
                    <span className="activity-text">
                      User <strong>{u.name}</strong> ({u.email}) flagged as suspicious.
                    </span>
                    <div className="activity-meta"><Icon.Clock /><span>{new Date(u.created_at).toLocaleDateString()}</span><span className="meta-sep">·</span><Icon.MapPin /><span>{u.wilaya}</span></div>
                  </div>
                  <span className="activity-chip suspicious-chip">Suspicious</span>
                </div>
              ))}
              {pending.ApprouvedAssociations?.slice(0, 1).map(a => (
                <div key={`app-${a.id}`} className="activity-row" style={{ borderBottom: "none" }}>
                  <div className="activity-dot blue-dot" />
                  <div className="activity-icon-wrap blue-wrap"><Icon.CheckCircle /></div>
                  <div className="activity-body">
                    <span className="activity-text">
                      <strong>{a.nom_association}</strong> was approved and is now operational.
                    </span>
                    <div className="activity-meta"><Icon.Clock /><span>Approved</span><span className="meta-sep">·</span><Icon.MapPin /><span>{a.zones_intervention?.join(", ")}</span></div>
                  </div>
                  <span className="activity-chip approved-chip">Approved</span>
                </div>
              ))}
            </div>
          ) : <div className="skeleton" style={{ height: 120 }} />}
        </div>

      </div>
    </AdminLayout>
  );
}

/* ──────────────────────────── CSS ──────────────────────────── */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.db-page {
  padding: 28px 32px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #0f172a;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
}
.page-eyebrow {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 6px;
  letter-spacing: 0.01em;
}
.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #0d1b6e;
  margin: 0;
  letter-spacing: -0.6px;
}
.logout-btn {
  padding: 8px 18px;
  border-radius: 8px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.18s ease;
}
.logout-btn:hover { background: #f8fafc; color: #ef4444; border-color: #fca5a5; }

/* Error Banner */
.error-banner {
  display: flex; align-items: center; gap: 10px;
  background: #fef2f2; border: 1px solid #fecaca;
  border-radius: 10px; padding: 12px 16px;
  margin-bottom: 20px; font-size: 13px; color: #b91c1c; font-weight: 500;
}
.refresh-btn {
  margin-left: auto;
  min-width: 96px;
  border: 1px solid #fca5a5;
  border-radius: 999px;
  background: #ffffff;
  color: #b91c1c;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;
}
.refresh-btn:hover:not(:disabled) {
  background: #fee2e2;
}
.refresh-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Stat Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.03);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(15,23,42,0.08); }
.stat-icon-ring {
  width: 44px; height: 44px; border-radius: 12px;
  background: color-mix(in srgb, var(--accent) 10%, white);
  border: 1px solid color-mix(in srgb, var(--accent) 18%, white);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent); flex-shrink: 0;
}
.stat-body { display: flex; flex-direction: column; gap: 2px; }
.stat-label { font-size: 11.5px; font-weight: 600; color: #94a3b8; letter-spacing: 0.01em; text-transform: uppercase; }
.stat-value { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.7px; line-height: 1.1; margin: 4px 0; }
.stat-delta {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 700;
}
.stat-delta.pos { color: #16a34a; }
.stat-delta.neg { color: #dc2626; }
.skel-inline { display: inline-block; width: 60px; height: 22px; background: #f1f5f9; border-radius: 4px; }

/* Impact Banner */
.impact-banner {
  position: relative;
  background: linear-gradient(120deg, #0d1b6e 0%, #1e3a8a 45%, #1d4ed8 100%);
  border-radius: 18px;
  padding: 32px 36px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  min-height: 200px;
}
.impact-bg-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}
.impact-content { position: relative; z-index: 1; flex: 1; max-width: 520px; }
.impact-tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 99px; padding: 4px 12px 4px 8px;
  font-size: 11.5px; font-weight: 700; color: rgba(255,255,255,0.9);
  letter-spacing: 0.03em; text-transform: uppercase;
  margin-bottom: 14px;
}
.impact-title { color: #fff; font-size: 20px; font-weight: 800; margin: 0 0 10px; letter-spacing: -0.3px; }
.impact-desc { color: rgba(255,255,255,0.65); font-size: 13.5px; line-height: 1.65; margin: 0 0 22px; }
.impact-metrics { display: flex; align-items: center; gap: 0; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; overflow: hidden; width: fit-content; backdrop-filter: blur(8px); }
.impact-metric { display: flex; align-items: center; gap: 14px; padding: 14px 22px; color: #fff; }
.impact-metric-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; }
.impact-metric-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
.impact-metric-value { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
.impact-divider { width: 1px; height: 52px; background: rgba(255,255,255,0.15); }
.impact-image-col { position: relative; z-index: 1; flex-shrink: 0; margin-left: 24px; }

/* Layout */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

/* Card */
.card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(15,23,42,0.04);
}
.card-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 18px; gap: 12px;
}
.card-title-group { display: flex; flex-direction: column; gap: 3px; }
.card-title { font-size: 14.5px; font-weight: 800; color: #0f172a; }
.card-subtitle { font-size: 12px; color: #94a3b8; font-weight: 500; }
.pill-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 13px; border-radius: 99px;
  background: #eff6ff; color: #1d4ed8;
  border: 1px solid #bfdbfe;
  font-family: inherit; font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
  transition: background 0.15s ease;
}
.pill-btn:hover { background: #dbeafe; }

/* Reports KPIs */
.reports-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
.kpi-box { border-radius: 12px; padding: 14px 14px 12px; border: 1.5px solid; }
.kpi-box.red { background: #fff5f5; border-color: #fecaca; }
.kpi-box.amber { background: #fffbeb; border-color: #fde68a; }
.kpi-box.green { background: #f0fdf4; border-color: #bbf7d0; }
.kpi-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.kpi-badge {
  font-size: 10px; font-weight: 700; border-radius: 99px;
  padding: 2px 7px; background: #fee2e2; color: #b91c1c; letter-spacing: 0.02em; text-transform: uppercase;
}
.amber-badge { background: #fef3c7; color: #92400e; }
.green-badge { background: #dcfce7; color: #15803d; }
.kpi-num { font-size: 28px; font-weight: 900; color: #0f172a; line-height: 1; letter-spacing: -1px; }
.kpi-label { font-size: 11.5px; color: #64748b; font-weight: 600; margin-top: 4px; }
.reports-total-row {
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border-radius: 9px; padding: 10px 14px;
  font-size: 13px; color: #475569; font-weight: 600; margin-bottom: 12px;
}
.reports-total-val { margin-left: auto; font-weight: 800; color: #0f172a; font-size: 15px; }
.review-btn {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 0; border-radius: 10px;
  background: #0d1b6e; color: #fff;
  border: none; font-family: inherit; font-size: 13.5px; font-weight: 700;
  cursor: pointer; transition: background 0.18s ease;
}
.review-btn:hover { background: #1e3a8a; }

/* Contributors */
.contrib-scroll { overflow: auto; }
.contrib-section-label {
  font-size: 10.5px; font-weight: 800; color: #cbd5e1;
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;
}

/* Activity */
.activity-list { display: flex; flex-direction: column; }
.activity-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 0; border-bottom: 1px solid #f8fafc;
}
.activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.green-dot { background: #22c55e; box-shadow: 0 0 0 3px #dcfce7; }
.red-dot   { background: #ef4444; box-shadow: 0 0 0 3px #fee2e2; }
.blue-dot  { background: #3b82f6; box-shadow: 0 0 0 3px #dbeafe; }
.activity-icon-wrap {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.green-wrap { background: #f0fdf4; color: #16a34a; }
.red-wrap   { background: #fff5f5; color: #dc2626; }
.blue-wrap  { background: #eff6ff; color: #2563eb; }
.activity-body { flex: 1; min-width: 0; }
.activity-text { font-size: 13px; color: #334155; line-height: 1.5; display: block; }
.activity-meta {
  display: flex; align-items: center; gap: 5px;
  margin-top: 4px; font-size: 11.5px; color: #94a3b8; font-weight: 500;
}
.meta-sep { color: #cbd5e1; }
.activity-chip {
  flex-shrink: 0; font-size: 11px; font-weight: 700; padding: 3px 10px;
  border-radius: 99px; letter-spacing: 0.02em; text-transform: uppercase;
}
.pending-chip    { background: #fef3c7; color: #92400e; }
.suspicious-chip { background: #fee2e2; color: #b91c1c; }
.approved-chip   { background: #dcfce7; color: #15803d; }

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e9eef5 50%, #f1f5f9 75%);
  background-size: 400% 100%;
  border-radius: 10px;
  animation: shimmer 1.6s ease-in-out infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .impact-image-col { display: none; }
}
@media (max-width: 640px) {
  .db-page { padding: 16px; }
  .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .reports-kpis { grid-template-columns: 1fr; }
}
`;
