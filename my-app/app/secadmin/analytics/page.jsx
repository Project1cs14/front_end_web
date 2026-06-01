"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecAdminLayout from "@/app/components/SecAdminLayout";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://back-end-sawu.onrender.com";
const COLORS = ["#032B5B", "#5C7AC9", "#8FB9FF", "#C7E1FF", "#FFB74D", "#FF8A65", "#9C27B0"];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IC = 18;
const S = "#1A1C1E";
const icon = (d) => (
  <svg width={IC} height={IC} viewBox="0 0 24 24" fill="none"
    stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const Icons = {
  users: () => icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  building: () => icon(<><path d="M3 21V3h18v18" /><path d="M9 21V12h6v9" /><path d="M7 8h1M11 8h1M15 8h1M7 12h1M11 12h1M15 12h1M7 16h1M11 16h1M15 16h1" /></>),
  shield: () => icon(<><path d="M12 3l7 4v5c0 4-3 8-7 9-4-1-7-5-7-9V7l7-4z" /></>),
  leaf: () => icon(<><path d="M17 8c-2.5 0-4.5 2-5 4.4C10.5 8 8.5 6 6 6c2 2 4 4 10 10" /><path d="M6 18c2.5 0 4.5-2 5-4.4C12.5 18 14.5 20 17 20c-2-2-4-4-10-10" /></>),
  check: () => icon(<><path d="M5 13l4 4L19 7" /></>),
  star: () => icon(<><path d="M12 2l3 7h7l-5.5 4.2L18 22l-6-4-6 4 1.5-8.8L2 9h7z" /></>),
  trophy: () => icon(<><path d="M6 4h12v4a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V4z" /><path d="M6 4L4 2M18 4l2-2M8 21h8M12 11v10" /></>),
  alert: () => icon(<><path d="M12 9v4M12 17h.01M4.93 19H19.07L12 4 4.93 19z" /></>),
  pie: () => icon(<><path d="M21 12A9 9 0 1 1 12 3v9h9z" /></>),
  pin: () => icon(<><path d="M12 21s-6-4.35-6-10A6 6 0 0 1 12 5a6 6 0 0 1 6 6c0 5.65-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></>),
  utensils: () => icon(<><path d="M3 3v18M7 3v6a4 4 0 0 1-4 4M21 3c0 0 0 6-4 6V3M17 21V9" /></>),
  clock: () => icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>),
  ban: () => icon(<><circle cx="12" cy="12" r="9" /><path d="M4.93 4.93l14.14 14.14" /></>),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function fetchJSON(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function fmt(n) { return n != null ? Number(n).toLocaleString() : "—"; }

function getQuartierId(user) {
  return user?.quartier_id || user?.quartierId || user?.quartier?.id || user?.admin_sec?.quartier_id || null;
}

function scopedStatsPath(path, user) {
  const quartierId = getQuartierId(user);
  if (!quartierId || !path.startsWith("/statistics/")) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}quartier_id=${encodeURIComponent(quartierId)}`;
}

function asArray(value) { return Array.isArray(value) ? value : []; }

// ─── UI Components (original sizes, SVG-style content) ───────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #EFEFEF",
      ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ icon: Ic, children }) {
  return (
    <h2 style={{
      fontSize: 15, fontWeight: 700, color: "#1A1C1E",
      margin: "28px 0 12px", display: "flex", alignItems: "center", gap: 8,
    }}>
      {Ic && <span style={{ opacity: 0.6 }}><Ic /></span>}
      {children}
    </h2>
  );
}

// SVG-style stat card: colored icon circle + big value + label + optional progress bar
function StatCard({ label, value, icon: Ic, color = "#2E7D32", badgeText, badgeColor, sub }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "18px 20px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #EFEFEF",
      flex: "1 1 160px", minWidth: 0,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11, background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {Ic && <Ic />}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1C1E", lineHeight: 1.2 }}>{value ?? "—"}</div>
        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{sub}</div>}
      </div>
      {/* SVG-style colored badge pill on the right */}
      {badgeText && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: badgeColor || color,
          background: (badgeColor || color) + "18",
          borderRadius: 20, padding: "3px 10px", flexShrink: 0,
        }}>{badgeText}</span>
      )}
    </div>
  );
}

// SVG-style row: avatar circle + label/sub + right badge — used INSIDE cards
function DataRow({ initials, avatarBg, avatarColor, primary, secondary, badge, badgeColor }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: avatarBg || "#001F5C14",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: avatarColor || "#001F5C" }}>{initials}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1C1E" }}>{primary}</div>
        {secondary && <div style={{ fontSize: 11, color: "#757681" }}>{secondary}</div>}
      </div>
      {badge != null && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: badgeColor || "#001F5C",
          background: (badgeColor || "#001F5C") + "18",
          borderRadius: 20, padding: "3px 10px", flexShrink: 0,
        }}>{badge}</span>
      )}
    </div>
  );
}

function Badge({ children, color = "#2E7D32" }) {
  return (
    <span style={{
      display: "inline-block", background: color + "18", color,
      borderRadius: 8, padding: "2px 10px", fontSize: 12, fontWeight: 600,
    }}>{children}</span>
  );
}

function LoadSpin() {
  return <div style={{ padding: "24px 0", textAlign: "center", color: "#aaa", fontSize: 13 }}>Chargement…</div>;
}

function Err({ msg }) {
  return <div style={{ color: "#BA1A1A", fontSize: 12, padding: "6px 0" }}>Erreur : {msg}</div>;
}

function ActiveBar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 80, fontSize: 12, color: "#555", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 10, background: "#F0F0F0", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width .4s ease" }} />
      </div>
      <div style={{ width: 46, fontSize: 12, fontWeight: 700, color: "#1A1C1E", textAlign: "right" }}>
        {value >= 1000 ? (value / 1000).toFixed(1) + "k" : value}
      </div>
    </div>
  );
}

function HealthBar({ label, value, color }) {
  const safeVal = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color }}>{safeVal}%</span>
      </div>
      <div style={{ height: 8, background: "#F0F0F0", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${safeVal}%`, height: "100%", background: color, borderRadius: 6 }} />
      </div>
    </div>
  );
}

function Medal({ i }) {
  const bg = i === 0 ? "#F9A825" : i === 1 ? "#9E9E9E" : "#6D4C41";
  return (
    <div style={{
      width: 26, height: 26, borderRadius: "50%", background: bg,
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, flexShrink: 0,
    }}>{i + 1}</div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Analytics() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(undefined);

  const [core, setCoreMetrics] = useState(null);
  const [impact, setImpact] = useState(null);
  const [foodSaved, setFoodSaved] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [health, setHealth] = useState(null);
  const [contributors, setContributors] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [reports, setReports] = useState(null);
  const [pending, setPending] = useState(null);
  const [pendingDonations, setPendingDonations] = useState(null);
  const [neighborhood, setNeighborhood] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // ── Auth init ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!accessToken || !userData) {
        setUser(null); setToken(null); setLoading(false); return;
      }
      try { setUser(JSON.parse(userData)); setToken(accessToken); }
      catch { setUser(null); setToken(null); setLoading(false); }
    });
  }, []);

  useEffect(() => { if (user === null) router.push("/LoginScreen"); }, [user, router]);

  // ── Data fetching ──
  useEffect(() => {
    if (!token || !user) return;
    setLoading(true);

    const fetchers = [
      { key: "core", path: "/statistics/CoreMetrics", setter: setCoreMetrics },
      { key: "impact", path: "/statistics/ImpactMetrics", setter: setImpact },
      { key: "foodSaved", path: "/statistics/FoodSavedPerQuartier", setter: setFoodSaved },
      { key: "categories", path: "/statistics/DonationsByCategory", setter: (d) => setCategories(asArray(d)) },
      { key: "topCities", path: "/statistics/top-cities", setter: (d) => setTopCities(asArray(d)) },
      { key: "health", path: "/statistics/platform-health", setter: setHealth },
      { key: "contributors", path: "/statistics/top-contributors", setter: setContributors },
      { key: "growth", path: "/statistics/GrowthMetrics", setter: setGrowth },
      { key: "engagement", path: "/statistics/EngagementMetrics", setter: setEngagement },
      { key: "reports", path: "/statistics/ReportsInfo", setter: setReports },
      { key: "pending", path: "/statistics/pendingsAndSuspiciousAndApprouved", setter: setPending },
      { key: "pendingDonations", path: "/statistics/PendingAndCancelledDonations", setter: setPendingDonations },
      { key: "neighborhood", path: "/statistics/NeighborhoodActivity", setter: (d) => setNeighborhood(asArray(d)) },
    ];

    let hasAuthError = false;
    const timeout = setTimeout(() => setLoading(false), 15000);

    Promise.all(
      fetchers.map(({ key, path, setter }) =>
        fetchJSON(scopedStatsPath(path, user), token)
          .then(setter)
          .catch((e) => {
            if (e.message === "HTTP 401") hasAuthError = true;
            setErrors((prev) => ({ ...prev, [key]: e.message }));
          })
      )
    ).finally(() => {
      clearTimeout(timeout);
      if (hasAuthError) router.push("/LoginScreen");
      else setLoading(false);
    });

    return () => clearTimeout(timeout);
  }, [token, user, router]);

  if (user === undefined) return null;
  if (loading) return (
    <SecAdminLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          border: "3px solid #001F5C22", borderTopColor: "#001F5C",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 14, color: "#aaa" }}>Chargement des analytics…</span>
      </div>
    </SecAdminLayout>
  );

  // ── Chart data ──
  const growthChartData = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
      name: `${day}`,
      Users: growth?.newUsersThisMonth?.find((x) => x.day === day)?.count || 0,
      Donations: growth?.newDonationsThisMonth?.find((x) => x.day === day)?.newDonations || 0,
      Assoc: growth?.newAssociationsThisMonth?.find((x) => x.day === day)?.count || 0,
    };
  });

  const totalUsersThisMonth = growth?.newUsersThisMonth?.reduce((s, x) => s + (x.count || 0), 0) ?? 0;
  const totalDonationsThisMonth = growth?.newDonationsThisMonth?.reduce((s, x) => s + (x.newDonations || 0), 0) ?? 0;
  const totalAssocThisMonth = growth?.newAssociationsThisMonth?.reduce((s, x) => s + (x.count || 0), 0) ?? 0;

  const reportSeries = asArray(reports?.overTime ?? reports?.getReportsOverTime ?? reports?.data);
  const reportTotal = reports?.total ?? reports?.totalReports?.[0]?.totalReports
    ?? reportSeries.reduce((s, d) => s + (d.totalReports ?? d.total ?? 0), 0) ?? 0;
  const reportsOverTime = reportSeries.map((d) => ({
    name: new Date(d.date || d.createdAt).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
    totalReports: d.totalReports ?? d.total ?? d.count ?? 0,
  }));

  const categoryData = categories.map((c) => ({
    name: c.name || c.category,
    total: c.total || c.count || 0,
  }));

  const maxActive = Math.max(
    engagement?.activeToday ?? 0,
    engagement?.activeWeek ?? 0,
    engagement?.activeMonth ?? 0,
    1
  );

  const successRate = Math.round(parseFloat(health?.successRate ?? 0));
  const failureRate = Math.round(parseFloat(health?.failureRate ?? 0));
  const pendingRate = Math.round(parseFloat(health?.pendingRate ?? 0));

  const pendingCount = pendingDonations?.pendingCount ?? pendingDonations?.pending ?? 0;
  const cancelledCount = pendingDonations?.cancelledCount ?? pendingDonations?.cancelled ?? 0;

  const neighborhoodChartData = neighborhood.slice(0, 8).map((n) => ({
    name: n.quartier || n.name || n.Quartier || "—",
    donations: n.totalDonations ?? n.donations ?? n.count ?? 0,
  }));

  return (
    <SecAdminLayout>
      <div style={{ padding: "24px 28px", background: "#F7F8FA", minHeight: "100vh" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1C1E", margin: 0 }}>Analytics Dashboard</h1>
          <p style={{ color: "#777", fontSize: 13, marginTop: 4 }}>Vue densemble des métriques de la plateforme</p>
        </div>

        {/* ══ Métriques Globales ══ */}
        <SectionTitle>Métriques Globales</SectionTitle>
        {errors.core ? <Err msg={errors.core} /> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <StatCard label="Utilisateurs Total" value={fmt(core?.totalUsers)} color="#1565C0" badgeText={fmt(core?.totalUsers)} badgeColor="#1565C0" />

            <StatCard label="Associations" value={fmt(core?.totalAssociations)} color="#6A1B9A" badgeText={fmt(core?.totalAssociations)} badgeColor="#6A1B9A" />
            <StatCard label="Donateurs & Bénéficiaires" value={fmt(core?.total_donateurs_beneficiaires)} color="#00695C" badgeText={fmt(core?.total_donateurs_beneficiaires)} badgeColor="#00695C" />
            <StatCard label="Maires Total" value={fmt(core?.totalMayors)} color="#E65100" badgeText={fmt(core?.totalMayors)} badgeColor="#E65100" />
          </div>
        )}

        {/* ══ Dons en attente / annulés ══ */}
        {!errors.pendingDonations && (pendingCount > 0 || cancelledCount > 0) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <StatCard label="Dons en Attente" value={fmt(pendingCount)} icon={Icons.clock} color="#F9A825" badgeText={fmt(pendingCount)} badgeColor="#F9A825" />
            <StatCard label="Dons Annulés" value={fmt(cancelledCount)} icon={Icons.ban} color="#BA1A1A" badgeText={fmt(cancelledCount)} badgeColor="#BA1A1A" />
          </div>
        )}

        {/* ══ Croissance + Activité ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E" }}>Croissance Mensuelle</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>
                  {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }).toUpperCase()}
                </div>
              </div>
            </div>
            {errors.growth ? <Err msg={errors.growth} /> : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={growthChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #eee" }} />
                    <Line type="monotone" dataKey="Users" stroke="#032B5B" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="Donations" stroke="#5C7AC9" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                    <Line type="monotone" dataKey="Assoc" stroke="#ccc" strokeWidth={1.5} dot={false} strokeDasharray="2 3" />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                  {[
                    { label: "USERS", value: totalUsersThisMonth, color: "#032B5B" },
                    { label: "DONS", value: totalDonationsThisMonth, color: "#5C7AC9" },
                    { label: "ASSOC.", value: totalAssocThisMonth, color: "#aaa" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color, fontWeight: 700 }}>● {label}</div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 14 }}>Tendances dActivité</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Utilisateurs Actifs
            </div>
            {errors.engagement ? <Err msg={errors.engagement} /> : (
              <>
                <ActiveBar label="Aujourd'hui" value={engagement?.activeToday ?? 0} max={maxActive} color="#032B5B" />
                <ActiveBar label="Cette semaine" value={engagement?.activeWeek ?? 0} max={maxActive} color="#5C7AC9" />
                <ActiveBar label="Ce mois" value={engagement?.activeMonth ?? 0} max={maxActive} color="#C7DEFF" />
                {engagement?.engagementGrowthPct != null && (
                  <div style={{ marginTop: 12, fontSize: 12, color: "#2E7D32", fontWeight: 600 }}>
                    ↑ Engagement +{engagement.engagementGrowthPct}% vs période précédente
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        {/* ══ Dons & Impact ══ */}
        <SectionTitle icon={Icons.pie}>Dons &amp; Impact</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.5fr 1.4fr", gap: 16 }}>

          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 8 }}>Dons par Catégorie</div>
            {errors.categories ? <Err msg={errors.categories} /> : !categoryData.length ? <LoadSpin /> : (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 120, height: 120, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="total" cx="50%" cy="50%"
                        outerRadius={52} innerRadius={34} paddingAngle={3} label={false}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [v, "Dons"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  {categoryData.map((c, i) => {
                    const total = categoryData.reduce((s, x) => s + x.total, 0);
                    const pct = total ? Math.round((c.total / total) * 100) : 0;
                    return (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "#555", flex: 1 }}>{c.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1A1C1E" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.utensils />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1C1E" }}>{impact?.donationsCompleted ?? "—"}</div>
                <div style={{ fontSize: 12, color: "#888" }}>Dons Complétés</div>
              </div>
            </Card>
            <Card style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.leaf />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1C1E" }}>{impact?.co2Saved ?? "—"} kg</div>
                <div style={{ fontSize: 12, color: "#888" }}>CO₂ Économisé</div>
              </div>
            </Card>
            {foodSaved != null && (
              <Card style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icons.leaf />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1C1E" }}>
                    {fmt(foodSaved?.totalFoodSaved ?? foodSaved?.total)} kg
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>Nourriture Économisée</div>
                </div>
              </Card>
            )}
          </div>

          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.pin /> Top Quartiers
            </div>
            {errors.topCities ? <Err msg={errors.topCities} /> : !topCities.length ? <LoadSpin /> : (
              <div>
                {topCities.slice(0, 5).map((r, i) => {
                  const maxPts = topCities[0]?.totalQuantity || 1;
                  const pct = Math.round((r.totalQuantity / maxPts) * 100);
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#aaa", width: 16 }}>0{i + 1}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1C1E" }}>{r.Quartiers || r.quartier || r.name}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#032B5B" }}>{fmt(r.totalQuantity)} pts</span>
                      </div>
                      <div style={{ height: 5, background: "#F0F0F0", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#032B5B", borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* ══ Activité par Quartier ══ */}
        {neighborhoodChartData.length > 0 && (
          <>
            <SectionTitle icon={Icons.pin}>Activité par Quartier</SectionTitle>
            <Card style={{ marginBottom: 16 }}>
              {errors.neighborhood ? <Err msg={errors.neighborhood} /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={neighborhoodChartData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                    <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #eee" }} />
                    <Bar dataKey="donations" fill="#032B5B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </>
        )}

        {/* ══ Système Élite ══ */}
        <SectionTitle icon={Icons.trophy}>Système Élite</SectionTitle>
        {errors.contributors ? <Err msg={errors.contributors} /> : !contributors ? <LoadSpin /> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.star /> Top Donateurs
              </div>
              {!contributors.topDonors?.length
                ? <div style={{ fontSize: 12, color: "#aaa" }}>Aucune donnée</div>
                : contributors.topDonors.map((d, i) => (
                  <div key={d.id ?? i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Medal i={i} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{d.city || "—"}</div>
                    </div>
                    <Badge color="#032B5B">{d.totalDonations} dons</Badge>
                  </div>
                ))
              }
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.leaf /> Top Food Savers
              </div>
              {!contributors.topFoodSavers?.length
                ? <div style={{ fontSize: 12, color: "#aaa" }}>Aucune donnée</div>
                : contributors.topFoodSavers.map((s, i) => (
                  <div key={s.id ?? i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Medal i={i} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{s.community || "—"}</div>
                    </div>
                    <Badge color="#2E7D32">{fmt(s.total_points)} kg</Badge>
                  </div>
                ))
              }
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.building /> Top Associations
              </div>
              {!contributors.topAssociations?.length
                ? <div style={{ fontSize: 12, color: "#aaa" }}>Aucune donnée</div>
                : contributors.topAssociations.map((a, i) => (
                  <div key={a.id ?? i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, background: COLORS[i % COLORS.length] + "33",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: COLORS[i % COLORS.length], flexShrink: 0,
                    }}>{(a.nom_association || "?")[0].toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nom_association}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{a.region || "International"}</div>
                    </div>
                    <Badge color="#5C7AC9">{a.totalReceived >= 1000 ? (a.totalReceived / 1000).toFixed(1) + "k" : a.totalReceived} membres</Badge>
                  </div>
                ))
              }
            </Card>
          </div>
        )}

        {/* ══ Santé de la Plateforme ══ */}
        <SectionTitle icon={Icons.check}>Santé de la Plateforme</SectionTitle>
        <Card style={{ marginBottom: 16 }}>
          {errors.health ? <Err msg={errors.health} /> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
              <HealthBar label="Taux de Succès" value={successRate} color="#2E7D32" />
              <HealthBar label="Taux d'Échec" value={failureRate} color="#BA1A1A" />
              <HealthBar label="Ratio en Attente" value={pendingRate} color="#F9A825" />
            </div>
          )}
        </Card>

        {/* ══ Associations & Utilisateurs Suspects ══ */}
        {!errors.pending && pending && (
          <>
            <SectionTitle icon={Icons.alert}>Associations &amp; Utilisateurs Suspects</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              {pending.pendingAssociations != null && (
                <StatCard label="Associations en Attente" value={fmt(pending.pendingAssociations?.length ?? pending.pendingAssociations)} icon={Icons.clock} color="#F9A825" badgeText="En attente" badgeColor="#F9A825" />
              )}
              {pending.suspicious != null && (
                <StatCard label="Utilisateurs Suspects" value={fmt(pending.suspicious?.length ?? pending.suspicious)} icon={Icons.alert} color="#BA1A1A" badgeText="Suspect" badgeColor="#BA1A1A" />
              )}
              {pending.ApprouvedAssociations != null && (
                <StatCard label="Associations Approuvées" value={fmt(pending.ApprouvedAssociations?.length ?? pending.ApprouvedAssociations)} icon={Icons.check} color="#2E7D32" badgeText="Approuvées" badgeColor="#2E7D32" />
              )}
            </div>
          </>
        )}

        {/* ══ Signalements & Alertes ══ */}
        <SectionTitle icon={Icons.alert}>Signalements &amp; Alertes</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#BA1A1A", marginBottom: 8 }}>
              <Icons.alert />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Supervision Critique</span>
            </div>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
              Signalements Actifs
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#1A1C1E", marginBottom: 16 }}>
              {reportTotal != null ? fmt(reportTotal) : "—"}
            </div>
            <button
              onClick={() => router.push("/secadmin/reports")}
              style={{
                width: "100%", padding: "10px 0", background: "#BA1A1A",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              Accéder à la Console Sécurité
            </button>
          </Card>

          <Card>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              Signalements dans le Temps
              <span style={{ fontSize: 11, color: "#666" }}>Total : {fmt(reportTotal)}</span>
            </div>
            {errors.reports ? <Err msg={errors.reports} /> : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={reportsOverTime} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #eee" }} />
                  <Line type="monotone" dataKey="totalReports" stroke="#BA1A1A" strokeWidth={3}
                    dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div style={{ height: 48 }} />
      </div>
    </SecAdminLayout>
  );
}