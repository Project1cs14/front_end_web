"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://back-end-sawu.onrender.com";

const COLORS = ["#032B5B", "#5C7AC9", "#8FB9FF", "#C7E1FF", "#FFB74D", "#FF8A65", "#9C27B0"];

// ─── Minimal icon set ───────────────────────────────────────────────────────
const IC = 18;
const S = "#1A1C1E";
const icon = (d, extra = "") => (
  <svg width={IC} height={IC} viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...(extra ? { style: { display: "inline-flex" } } : {})}>
    {d}
  </svg>
);

const Icons = {
  users: () => icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  building: () => icon(<><path d="M3 21V3h18v18" /><path d="M9 21V12h6v9" /><path d="M7 8h1M11 8h1M15 8h1M7 12h1M11 12h1M15 12h1M7 16h1M11 16h1M15 16h1" /></>),
  shield: () => icon(<><path d="M12 3l7 4v5c0 4-3 8-7 9-4-1-7-5-7-9V7l7-4z" /></>),
  leaf: () => icon(<><path d="M17 8c-2.5 0-4.5 2-5 4.4C10.5 8 8.5 6 6 6c2 2 4 4 10 10" /><path d="M6 18c2.5 0 4.5-2 5-4.4C12.5 18 14.5 20 17 20c-2-2-4-4-10-10" /></>),
  drop: () => icon(<><path d="M12 2c0 0-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" /></>),
  check: () => icon(<><path d="M5 13l4 4L19 7" /></>),
  bolt: () => icon(<><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></>),
  cal: () => icon(<><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  star: () => icon(<><path d="M12 2l3 7h7l-5.5 4.2L18 22l-6-4-6 4 1.5-8.8L2 9h7z" /></>),
  trophy: () => icon(<><path d="M6 4h12v4a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V4z" /><path d="M6 4L4 2M18 4l2-2M8 21h8M12 11v10" /></>),
  alert: () => icon(<><path d="M12 9v4M12 17h.01M4.93 19H19.07L12 4 4.93 19z" /></>),
  pie: () => icon(<><path d="M21 12A9 9 0 1 1 12 3v9h9z" /></>),
  pin: () => icon(<><path d="M12 21s-6-4.35-6-10A6 6 0 0 1 12 5a6 6 0 0 1 6 6c0 5.65-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></>),
  trend: () => icon(<><path d="M4 17l4-4 4 4 8-8M4 21h16" /></>),
  utensils: () => icon(<><path d="M3 3v18M7 3v6a4 4 0 0 1-4 4M21 3c0 0 0 6-4 6V3M17 21V9" /></>),
};

// ─── Helpers ────────────────────────────────────────────────────────────────
async function fetchJSON(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function fmt(n) { return n != null ? Number(n).toLocaleString() : "—"; }

// ─── Small reusable components ───────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #EFEFEF",
      ...style,
    }}>
      {children}
    </div>
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

function StatCard({ label, value, icon: Ic, color = "#2E7D32", trend, sub }) {
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
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1C1E", lineHeight: 1.2 }}>{value ?? "—"}</div>
        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{label}</div>
        {trend != null && (
          <div style={{ fontSize: 11, color: trend >= 0 ? "#2E7D32" : "#BA1A1A", marginTop: 3, fontWeight: 600 }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
        {sub && <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{sub}</div>}
      </div>
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
  return <div style={{ padding: "24px 0", textAlign: "center", color: "#aaa", fontSize: 13 }}>Loading…</div>;
}

function Err({ msg }) {
  return <div style={{ color: "#BA1A1A", fontSize: 12, padding: "6px 0" }}>Error: {msg}</div>;
}

// Active user comparison bar row
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

// Health metric row
function HealthBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: "#F0F0F0", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 6 }} />
      </div>
    </div>
  );
}

// Rank medal
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

// ─── Main component ──────────────────────────────────────────────────────────
export default function Analytics() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(undefined);

  const [core, setCoreMetrics] = useState(null);
  const [impact, setImpact] = useState(null);
  const [categories, setCategories] = useState(null);
  const [topCities, setTopCities] = useState(null);
  const [health, setHealth] = useState(null);
  const [contributors, setContributors] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [reports, setReports] = useState(null);
  const [pending, setPending] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!accessToken || !userData) { setUser(null); setToken(null); return; }
      try { setUser(JSON.parse(userData)); setToken(accessToken); }
      catch { setUser(null); setToken(null); }
    });
  }, []);

  useEffect(() => { if (user === null) router.push("/LoginScreen"); }, [user, router]);

  useEffect(() => {
    if (!token || user === undefined) return;
    const fetchers = [
      { key: "core", fn: () => fetchJSON("/statistics/CoreMetrics", token), setter: setCoreMetrics },
      { key: "impact", fn: () => fetchJSON("/statistics/ImpactMetrics", token), setter: setImpact },
      { key: "categories", fn: () => fetchJSON("/statistics/DonationsByCategory", token), setter: setCategories },
      { key: "topCities", fn: () => fetchJSON("/statistics/top-cities", token), setter: setTopCities },
      { key: "health", fn: () => fetchJSON("/statistics/platform-health", token), setter: setHealth },
      { key: "contributors", fn: () => fetchJSON("/statistics/top-contributors", token), setter: setContributors },
      { key: "growth", fn: () => fetchJSON("/statistics/GrowthMetrics", token), setter: setGrowth },
      { key: "engagement", fn: () => fetchJSON("/statistics/EngagementMetrics", token), setter: setEngagement },
      { key: "reports", fn: () => fetchJSON("/statistics/ReportsInfo", token), setter: setReports },
      { key: "pending", fn: () => fetchJSON("/statistics/pendingsAndSuspiciousAndApprouved", token), setter: setPending },
    ];
    let hasAuthError = false;
    Promise.all(fetchers.map(({ key, fn, setter }) =>
      fn().then(setter).catch(e => {
        if (e.message === "HTTP 401") hasAuthError = true;
        setErrors(prev => ({ ...prev, [key]: e.message }));
      })
    )).then(() => {
      if (hasAuthError) router.push("/LoginScreen");
      else setLoading(false);
    });
  }, [token, user, router]);

  if (!user) return null;
  if (loading) return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontSize: 15, color: "#777" }}>
        Loading analytics…
      </div>
    </AdminLayout>
  );

  // Chart data
  const growthChartData = Array.from(
    { length: 31 },
    (_, i) => {
      const day = i + 1;

      return {
        name: `${day}`,

        Users:
          growth?.newUsersThisMonth?.find(
            (x) => x.day === day
          )?.count || 0,

        Donations:
          growth?.newDonationsThisMonth?.find(
            (x) => x.day === day
          )?.newDonations || 0,

        Assoc:
          growth?.newAssociationsThisMonth?.find(
            (x) => x.day === day
          )?.count || 0,
      };
    }
  ); const reportsOverTime =
    reports?.getReportsOverTime?.map((d) => ({
      name: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      totalReports: d.totalReports,
    })) ?? []; const categoryData = categories?.map(c => ({ name: c.name, total: c.total })) ?? [];

  const maxActive = Math.max(engagement?.activeToday ?? 0, engagement?.activeWeek ?? 0, engagement?.activeMonth ?? 0, 1);

  const successRate = parseFloat(health?.successRate ?? 0);
  const failureRate = parseFloat(health?.failureRate ?? 0);
  const pendingRate = parseFloat(health?.pendingRate ?? 0);

  return (
    <AdminLayout>
      <div style={{
        padding: "24px 28px", margin: "0 auto",
        background: "#F7F8FA", minHeight: "100vh",
      }}>

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1C1E", margin: 0 }}>Analytics Dashboard</h1>
          <p style={{ color: "#777", fontSize: 13, marginTop: 4 }}>Overview of platform metrics</p>
        </div>
        {/* ── ROW 2: Core metric stat cards ── */}
        <SectionTitle>Global Metrics</SectionTitle>
        {errors.core ? <Err msg={errors.core} /> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <StatCard label="Total Secondary Admins" value={fmt(core?.totalSecondaryAdmins)} icon={Icons.shield} color="#2E7D32" trend={8.9} />
            <StatCard label="Total Users" value={fmt(core?.totalUsers)} icon={Icons.users} color="#1565C0" trend={12.4} />
            <StatCard label="Associations" value={fmt(core?.totalAssociations)} icon={Icons.building} color="#6A1B9A" trend={5.2} />
            <StatCard label="Donors & Beneficiaries" value={fmt(core?.total_donateurs_beneficiaires)} icon={Icons.check} color="#00695C" trend={5.3} />
            <StatCard label="Total Mayors" value={fmt(core?.totalMayors)} icon={Icons.building} color="#E65100" trend={-2.1} />
          </div>
        )}

        {/* ── ROW 1: Monthly Growth + Platform Activity ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Monthly Growth chart */}
          {/* Monthly Growth chart */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1A1C1E",
                  }}
                >
                  Monthly Growth
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                  }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  }).toUpperCase()}
                </div>
              </div>
            </div>

            {errors.growth ? (
              <Err msg={errors.growth} />
            ) : (
              <>
                <ResponsiveContainer
                  width="100%"
                  height={160}
                >
                  <LineChart
                    data={growthChartData}
                    margin={{
                      top: 4,
                      right: 4,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#F5F5F5"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "#aaa",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis hide />

                    <Tooltip
                      contentStyle={{
                        fontSize: 11,
                        borderRadius: 8,
                        border: "1px solid #eee",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="Users"
                      stroke="#032B5B"
                      strokeWidth={2.5}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="Donations"
                      stroke="#5C7AC9"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="4 2"
                    />

                    <Line
                      type="monotone"
                      dataKey="Assoc"
                      stroke="#ccc"
                      strokeWidth={1.5}
                      dot={false}
                      strokeDasharray="2 3"
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    marginTop: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#032B5B",
                        fontWeight: 700,
                      }}
                    >
                      ● USERS
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {growth?.activeMonth || 0}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#5C7AC9",
                        fontWeight: 700,
                      }}
                    >
                      ● DONATIONS
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {
                        growth?.newDonationsThisMonth
                          ?.length
                      }
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#aaa",
                        fontWeight: 700,
                      }}
                    >
                      ● ASSOC.
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {
                        growth
                          ?.newAssociationsThisMonth
                          ?.length
                      }
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Platform Activity Trends */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 14 }}>Platform Activity Trends</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Active User Comparison</div>
            {errors.engagement ? <Err msg={errors.engagement} /> : (
              <>
                <ActiveBar label="Today" value={engagement?.activeToday ?? 0} max={maxActive} color="#032B5B" />
                <ActiveBar label="This Week" value={engagement?.activeWeek ?? 0} max={maxActive} color="#5C7AC9" />
                <ActiveBar label="This Month" value={engagement?.activeMonth ?? 0} max={maxActive} color="#C7DEFF" />
                {engagement?.engagementGrowthPct != null && (
                  <div style={{ marginTop: 12, fontSize: 12, color: "#2E7D32", fontWeight: 600 }}>
                    ↑ Engagement up {engagement.engagementGrowthPct}% from last period
                  </div>
                )}
              </>
            )}
          </Card>
        </div>



        {/* ── ROW 3: Donations by Category + Meals/CO2 cards + Top Cities ── */}
        <SectionTitle icon={Icons.pie}>Donations & Impact</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.5fr 1.4fr", gap: 16 }}>

          {/* Donut chart */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 8 }}>Donations by Category</div>
            {errors.categories ? <Err msg={errors.categories} /> : (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 120, height: 120, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="total" cx="50%" cy="50%"
                        outerRadius={52} innerRadius={34} paddingAngle={3} labelLine={false} label={false}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [v, "Donations"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 6 }}>100% GLOBAL</div>
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

          {/* Environmental Impact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Card
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#FFF3E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.utensils />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1A1C1E",
                  }}
                >
                  {impact?.donationsCompleted ?? "—"}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#888",
                  }}
                >
                  Donations Completed
                </div>
              </div>
            </Card>

            <Card
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#E8F5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.leaf />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1A1C1E",
                  }}
                >
                  {impact?.co2Saved ?? "—"} kg
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#888",
                  }}
                >
                  CO₂ Saved
                </div>
              </div>
            </Card>
          </div>


          {/* Top Cities table */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.pin /> Top Performing Cities
            </div>
            {errors.topCities ? <Err msg={errors.topCities} /> : !topCities?.length ? <LoadSpin /> : (
              <div>
                {topCities.slice(0, 5).map((r, i) => {
                  const maxPts = topCities[0]?.totalQuantity || 1;
                  const pct = Math.round((r.totalQuantity / maxPts) * 100);
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#aaa", width: 16 }}>0{i + 1}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1C1E" }}>{r.Quartiers}</span>
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

        {/* ── ROW 4: System Elite / Top Contributors ── */}
        <SectionTitle icon={Icons.trophy}>System Elite</SectionTitle>
        {errors.contributors ? <Err msg={errors.contributors} /> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            {/* Top Donors */}
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.star /> Top Donors
              </div>
              {contributors?.topDonors?.map((d, i) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Medal i={i} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{d.city || "—"}</div>
                  </div>
                  <Badge color="#032B5B">{d.totalDonations} donations</Badge>
                </div>
              ))}
            </Card>

            {/* Top Food Savers */}
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.leaf /> Top Food Savers
              </div>
              {contributors?.topFoodSavers?.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Medal i={i} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{s.community || "—"}</div>
                  </div>
                  <Badge color="#2E7D32">{fmt(s.total_points)}kg saved</Badge>
                </div>
              ))}
            </Card>

            {/* Top Associations */}
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1C1E", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.building /> Top Associations
              </div>
              {contributors?.topAssociations?.map((a, i) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, background: COLORS[i % COLORS.length] + "33",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: COLORS[i % COLORS.length], flexShrink: 0,
                  }}>{(a.nom_association || "?")[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nom_association}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{a.region || "International"}</div>
                  </div>
                  <Badge color="#5C7AC9">{a.totalReceived >= 1000 ? (a.totalReceived / 1000).toFixed(1) + "k" : a.totalReceived} members</Badge>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── ROW 5: Platform Health ── */}
        <SectionTitle icon={Icons.check}>Platform Health & Reliability</SectionTitle>
        <Card style={{ marginBottom: 16 }}>
          {errors.health ? <Err msg={errors.health} /> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
              <HealthBar label="Success Rate" value={successRate} color="#2E7D32" />
              <HealthBar label="Failure Rate" value={failureRate} color="#BA1A1A" />
              <HealthBar label="Pending Ratio" value={pendingRate} color="#F9A825" />
            </div>
          )}
        </Card>

        {/* ── ROW 6: Critical Oversight + Reports Over Time ── */}
        <SectionTitle icon={Icons.alert}>Reports & Alerts</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>

          {/* Critical Oversight */}
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#BA1A1A",
                marginBottom: 8,
              }}
            >
              <Icons.alert />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Critical Oversight
              </span>
            </div>

            <div
              style={{
                fontSize: 11,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              Active Reports
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#1A1C1E",
                marginBottom: 16,
              }}
            >
              {reports?.totalReports?.[0]
                ?.totalReports != null
                ? fmt(
                  reports.totalReports[0]
                    .totalReports
                )
                : "—"}
            </div>

            <button
              onClick={() =>
                router.push("/admin/reports")
              }
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#BA1A1A",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Access Safety Console
            </button>
          </Card>

          {/* Reports over time */}
          <Card>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1A1C1E",
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Reports Over Time

              <span style={{ fontSize: 11, color: "#666" }}>
                Total: {reports?.totalReports?.[0]?.totalReports || 0}
              </span>
            </div>

            {errors.reports ? (
              <Err msg={errors.reports} />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={reportsOverTime}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F5F5F5"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#aaa" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 10, fill: "#aaa" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 8,
                      border: "1px solid #eee",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="totalReports"
                    stroke="#BA1A1A"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>


        <div style={{ height: 48 }} />
      </div>
    </AdminLayout>
  );
}
