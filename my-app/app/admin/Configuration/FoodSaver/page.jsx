"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

const getToken = () =>
  typeof window === "undefined"
    ? null
    : localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

const formatNum = (n = 0) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1).replace(".0", "") + "M"
    : n >= 1_000
      ? (n / 1_000).toFixed(1).replace(".0", "") + "k"
      : String(n);

function groupByWilaya(list) {
  return list.reduce((map, quartier) => {
    const wilaya = quartier.top3?.find((u) => u.willaya)?.willaya ?? "Autre";
    (map[wilaya] ??= []).push(quartier);
    return map;
  }, {});
}

/* ── Icons ── */
const Ico = {
  Check: ({ s = 13, c = "currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M2 7l3.5 3.5L12 3" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Pin: ({ s = 13 }) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.49-2.01-4.5-4.5-4.5zm0 6.1a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2z" fill="currentColor" />
    </svg>
  ),
  Globe: ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
    </svg>
  ),
  Chevron: ({ s = 13, up = false }) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none"
      style={{ transform: up ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", display: "block" }}>
      <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Upload: ({ s = 15 }) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 1v10M4 5l4-4 4 4M2 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Refresh: ({ s = 15, spin = false }) => (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none"
      style={spin ? { animation: "spin 0.8s linear infinite" } : {}}>
      <path d="M15.5 9A6.5 6.5 0 1 1 9 2.5M9 2.5L12.5 6M9 2.5L12.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Spinner: ({ s = 14, dark = false }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke={dark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)"} strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={dark ? "#1E3A5F" : "#fff"} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  Shield: ({ s = 12 }) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L2 4v4c0 3.3 2.6 6.4 6 7.1 3.4-.7 6-3.8 6-7.1V4L8 1.5z" fill="currentColor" />
      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trophy: ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 13c-3.3 0-6-2.7-6-6V3h12v4c0 3.3-2.7 6-6 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 5H2a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3M16 5h2a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 13v3M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Users: ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 3c1.7 0 3 1.3 3 3s-1.3 3-3 3M18 17c0-2.2-1.3-4.1-3-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Star: ({ s = 15 }) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6L8 9.6l-3.2 1.8.6-3.6L2.8 5.3l3.6-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Map: ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M1 4l6-3 6 3 6-3v15l-6 3-6-3-6 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 1v15M13 4v15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  X: ({ s = 10 }) => (
    <svg width={s} height={s} viewBox="0 0 12 12" fill="none">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

const RANK_COLORS = { 1: "#F59E0B", 2: "#94A3B8", 3: "#CD7C4B" };

/* ── Avatar ── */
function Avatar({ src, name, size = 60 }) {
  return src ? (
    <img src={src} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid #E2E8F0", display: "block" }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 700, color: "#64748B" }}>
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

/* ── Stat pill ── */
function StatPill({ label, value }) {
  return (
    <div style={{ flex: "1 1 0", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{value}</div>
    </div>
  );
}

/* ── Contributor Card ── */
function ContributorCard({ user, rank, onSelect, isFoodSaver, isLoading }) {
  const [hovered, setHovered] = useState(false);

  const borderColor = isFoodSaver ? "#16A34A" : hovered ? "#94A3B8" : "#E2E8F0";
  const borderWidth = isFoodSaver ? "2px" : "1.5px";
  const bg = isFoodSaver ? "linear-gradient(160deg,#F0FDF4 0%,#fff 60%)" : "#fff";
  const shadow = isFoodSaver
    ? "0 0 0 4px rgba(22,163,74,0.08)"
    : hovered
      ? "0 4px 16px rgba(0,0,0,0.06)"
      : "none";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flex: "1 1 0", minWidth: 0, borderRadius: 14, border: `${borderWidth} solid ${borderColor}`, background: bg, padding: "16px 13px 14px", boxShadow: shadow, transition: "all 0.2s", position: "relative" }}
    >
      {/* Rank tag */}
      <div style={{ position: "absolute", top: 10, left: 11, width: 20, height: 20, borderRadius: "50%", background: RANK_COLORS[rank] ?? "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
        {rank}
      </div>

      {/* Food saver badge top-right */}
      {isFoodSaver && (
        <div style={{ position: "absolute", top: 10, right: 11, display: "flex", alignItems: "center", gap: 4, background: "#DCFCE7", borderRadius: 20, padding: "3px 8px 3px 6px" }}>
          <span style={{ color: "#16A34A" }}><Ico.Shield s={10} /></span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: "#15803D", letterSpacing: "0.04em", textTransform: "uppercase" }}>Food Saver</span>
        </div>
      )}

      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 10px" }}>
        <div style={{ position: "relative" }}>
          <Avatar src={user.profile_image} name={user.name} size={58} />
          {isFoodSaver && (
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
              <Ico.Check s={10} c="#fff" />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div style={{ textAlign: "center", marginBottom: 11 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1E293B", lineHeight: 1.3 }}>{user.name}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{user.quartier_nom}</div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 5, marginBottom: 5 }}>
        <StatPill label="Monthly" value={formatNum(user.points_mensuel)} />
        <StatPill label="Total" value={formatNum(user.points)} />
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 13 }}>
        <StatPill label="Donations" value={user.nb_dons_completes ?? 0} />
        <StatPill label="Reserv." value={user.nb_reservations_honorees ?? 0} />
      </div>

      {/* CTA */}
      {isFoodSaver ? (
        <div style={{ background: "#16A34A", borderRadius: 10, padding: "9px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Ico.Check s={13} c="#fff" />
          <span style={{ color: "#fff", fontSize: 12.5, fontWeight: 700 }}>Confirmed Food Saver</span>
        </div>
      ) : (
        <button
          onClick={() => onSelect(user.id)}
          disabled={isLoading}
          onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "#163558"; }}
          onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = "#1E3A5F"; }}
          style={{ width: "100%", padding: "9px 0", borderRadius: 10, border: "none", background: isLoading ? "#94A3B8" : "#1E3A5F", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.15s", fontFamily: "inherit" }}
        >
          {isLoading ? <><Ico.Spinner s={13} /> Selecting…</> : "Select as Food Saver"}
        </button>
      )}
    </div>
  );
}

/* ── Quartier Section ── */
function QuartierSection({ quartier, selectedUserId, onSelect, loadingId }) {
  const [open, setOpen] = useState(true);

  // A user is the food saver if: the API returned is_food_saver=1 on them,
  // OR the admin just selected them this session (selectedUserId).
  const isFoodSaverUser = (user) =>
    user.is_food_saver === 1 || user.id === selectedUserId;

  const hasFoodSaver = quartier.top3.some(isFoodSaverUser);

  return (
    <div style={{ border: "1.5px solid #E2E8F0", borderRadius: 12, background: "#fff", marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#94A3B8" }}><Ico.Pin s={13} /></span>
          <span style={{ fontWeight: 700, fontSize: 13.5, color: "#1E293B" }}>{quartier.quartier_nom}</span>
          <span style={{ background: "#F1F5F9", color: "#475569", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>TOP {quartier.top3.length}</span>
          {hasFoodSaver && (
            <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10, fontWeight: 700, padding: "2px 9px 2px 7px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
              <Ico.Shield s={9} /> Assigned
            </span>
          )}
        </div>
        <span style={{ color: "#CBD5E1" }}><Ico.Chevron s={13} up={open} /></span>
      </button>

      {open && (
        <div style={{ padding: "0 13px 13px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {quartier.top3.map((user, idx) => (
              <ContributorCard
                key={user.id}
                user={user}
                rank={idx + 1}
                onSelect={onSelect}
                isFoodSaver={isFoodSaverUser(user)}
                isLoading={loadingId === user.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Wilaya Section ── */
function WilayaSection({ wilayaName, quartiers, selectedMap, onSelect, loadingId }) {
  const [open, setOpen] = useState(true);
  const assignedCount = quartiers.filter((q) => {
    const fsId = selectedMap[q.quartier_id];
    return fsId || q.top3.some((u) => u.is_food_saver === 1);
  }).length;
  const allAssigned = assignedCount === quartiers.length && quartiers.length > 0;

  return (
    <div style={{ border: "1.5px solid #E2E8F0", borderRadius: 16, background: "#fff", marginBottom: 14, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "17px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F8FAFC", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", flexShrink: 0 }}>
            <Ico.Globe s={16} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 800, fontSize: 15.5, color: "#0F172A" }}>{wilayaName} Wilaya</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
              {quartiers.length} commune{quartiers.length !== 1 ? "s" : ""}
              {assignedCount > 0 && (
                <span style={{ marginLeft: 8, color: "#16A34A", fontWeight: 600 }}>
                  • {assignedCount}/{quartiers.length} assigned
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {allAssigned && (
            <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>All Assigned</span>
          )}
          <span style={{ color: "#CBD5E1" }}><Ico.Chevron s={14} up={open} /></span>
        </div>
      </button>

      {open && (
        <div style={{ padding: "4px 16px 14px", borderTop: "1px solid #F1F5F9" }}>
          {quartiers.map((q) => (
            <QuartierSection
              key={q.quartier_id}
              quartier={q}
              selectedUserId={selectedMap[q.quartier_id] ?? null}
              onSelect={onSelect}
              loadingId={loadingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Header Stats ── */
function HeaderStats({ classement, selectedMap, monthLabel }) {
  const totalCommunes = classement.length;
  const totalWilayas = new Set(
    classement.flatMap((q) => q.top3?.find((u) => u.willaya)?.willaya ?? "Autre")
  ).size;
  const totalContributors = classement.reduce((a, q) => a + (q.top3?.length ?? 0), 0);
  const assignedCount = classement.filter((q) =>
    selectedMap[q.quartier_id] || q.top3.some((u) => u.is_food_saver === 1)
  ).length;
  const pct = totalCommunes > 0 ? Math.round((assignedCount / totalCommunes) * 100) : 0;
  const remaining = totalCommunes - assignedCount;

  const stats = [
    {
      icon: <Ico.Map s={18} />,
      label: "Wilayas",
      value: totalWilayas,
      sub: "regions covered",
      accent: "#EFF6FF",
      accentText: "#1D4ED8",
      iconBg: "#DBEAFE",
    },
    {
      icon: <Ico.Pin s={18} />,
      label: "Communes",
      value: totalCommunes,
      sub: `${remaining} pending`,
      accent: "#F5F3FF",
      accentText: "#6D28D9",
      iconBg: "#EDE9FE",
    },
    {
      icon: <Ico.Users s={18} />,
      label: "Contributors",
      value: totalContributors,
      sub: "qualified candidates",
      accent: "#FFF7ED",
      accentText: "#C2410C",
      iconBg: "#FFEDD5",
    },
    {
      icon: <Ico.Shield s={18} />,
      label: "Food Savers",
      value: assignedCount,
      sub: `${pct}% assigned`,
      accent: "#F0FDF4",
      accentText: "#15803D",
      iconBg: "#DCFCE7",
      progress: { pct, total: totalCommunes, done: assignedCount },
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
      {stats.map(({ icon, label, value, sub, accent, accentText, iconBg, progress }) => (
        <div key={label} style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
          {/* Faint tinted corner */}
          <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, borderRadius: "0 14px 0 100%", background: accent, pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: accentText }}>
              {icon}
            </div>
            {progress && (
              <span style={{ fontSize: 12, fontWeight: 700, color: accentText, background: accent, padding: "3px 9px", borderRadius: 20, marginTop: 2 }}>
                {progress.pct}%
              </span>
            )}
          </div>

          <div style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1, marginBottom: 4 }}>{value}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 11.5, color: "#94A3B8" }}>{sub}</div>

          {progress && (
            <div style={{ marginTop: 12, height: 4, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress.pct}%`, background: "#16A34A", borderRadius: 4, transition: "width 0.5s ease" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Toast ── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#16A34A" : "#DC2626", color: "#fff", padding: "11px 18px", borderRadius: 12, fontWeight: 600, fontSize: 13.5, boxShadow: "0 8px 30px rgba(0,0,0,0.18)", animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", gap: 8 }}>
      {toast.type === "success" ? <Ico.Check s={14} c="#fff" /> : <Ico.X s={10} />}
      {toast.msg}
    </div>
  );
}

/* ── Page ── */
export default function FoodSaver() {
  const router = useRouter();
  const [classement, setClassement] = useState([]);
  const [wilayaGroups, setWilayaGroups] = useState({});
  const [uniqueWilayas, setUniqueWilayas] = useState([]);
  const [filterWilaya, setFilterWilaya] = useState("all");
  const [filterQuartier, setFilterQuartier] = useState("all");
  const [selectedMap, setSelectedMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [monthLabel, setMonthLabel] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    setFetching(true);
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); return; }

    try {
      const res = await fetch(`${BASE_URL}/api/classement`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      if (!data || typeof data !== "object") { setClassement([]); return; }

      const list = data.classement_global ?? [];
      setClassement(list);

      if (data.month) {
        const d = new Date(String(data.month).trim() + "-01");
        setMonthLabel(
          !isNaN(d.getTime())
            ? d.toLocaleString("en", { month: "long", year: "numeric" })
            : new Date().toLocaleString("en", { month: "long", year: "numeric" })
        );
      }

      const groups = groupByWilaya(list);
      setWilayaGroups(groups);
      setUniqueWilayas(Object.keys(groups).sort());

      const pre = {};
      list.forEach((q) => {
        const fs = q.top3.find((u) => u.is_food_saver === 1);
        if (fs) pre[q.quartier_id] = fs.id;
      });
      setSelectedMap(pre);
    } catch (err) {
      console.error(err);
      showToast(`Failed to load: ${err.message}`, "error");
      setClassement([]);
    } finally {
      setFetching(false);
    }
  }, [router, showToast]);

  useEffect(() => { load(); }, [load]);

  async function handleSelect(userId) {
    setLoadingId(userId);
    const token = getToken();
    if (!token) { router.push("/LoginScreen"); setLoadingId(null); return; }

    try {
      const res = await fetch(`${BASE_URL}/admin/makeFoodSaver/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { router.push("/LoginScreen"); return; }
      const data = await res.json();

      // Find which quartier owns this user and update selectedMap directly
      const owningQuartier = classement.find((q) => q.top3.some((u) => u.id === userId));
      if (owningQuartier) {
        setSelectedMap((prev) => ({ ...prev, [owningQuartier.quartier_id]: userId }));
      }

      showToast(data.message ?? "Food Saver selected!", "success");
    } catch (err) {
      showToast(`Failed to select: ${err.message}`, "error");
    } finally {
      setLoadingId(null);
    }
  }

  async function handlePublish() {
    setPublishLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPublishLoading(false);
    showToast("Monthly list published successfully!");
  }

  const communeOptions =
    filterWilaya === "all" ? classement : (wilayaGroups[filterWilaya] ?? []);

  const visibleGroups = Object.entries(wilayaGroups)
    .filter(([name]) => filterWilaya === "all" || name === filterWilaya)
    .map(([name, quartiers]) => ({
      name,
      quartiers: filterQuartier === "all"
        ? quartiers
        : quartiers.filter((q) => String(q.quartier_id) === filterQuartier),
    }))
    .filter(({ quartiers }) => quartiers.length > 0);

  const selectStyle = { border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "9px 34px 9px 13px", fontSize: 13.5, color: "#1E293B", background: "#fff", appearance: "none", cursor: "pointer", fontWeight: 500, fontFamily: "inherit" };

  return (
    <AdminLayout>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        * { box-sizing: border-box; }
      `}</style>

      <Toast toast={toast} />

      <div style={{ padding: "28px 32px", fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>

        {/* ── Page Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase" }}>Active Session</span>
              {monthLabel && (
                <span style={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase" }}>{monthLabel}</span>
              )}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 5px" }}>Monthly Food Saver Qualification</h1>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: 0 }}>Review top contributors per commune and assign this month's Food Savers.</p>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishLoading}
            style={{ background: publishLoading ? "#475569" : "#1E3A5F", color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 700, fontSize: 14, cursor: publishLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s", flexShrink: 0, fontFamily: "inherit" }}
          >
            {publishLoading ? <Ico.Spinner s={15} /> : <Ico.Upload s={15} />}
            {publishLoading ? "Publishing…" : "Publish Monthly List"}
          </button>
        </div>

        {/* ── Stats Cards ── */}
        {!fetching && classement.length > 0 && (
          <HeaderStats classement={classement} selectedMap={selectedMap} monthLabel={monthLabel} />
        )}

        {/* ── Filters ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { label: "Wilaya", value: filterWilaya, onChange: (v) => { setFilterWilaya(v); setFilterQuartier("all"); }, options: [{ value: "all", label: "All Wilayas" }, ...uniqueWilayas.map((w) => ({ value: w, label: w }))], minWidth: 165 },
            { label: "Commune", value: filterQuartier, onChange: (v) => setFilterQuartier(v), options: [{ value: "all", label: "All Communes" }, ...communeOptions.map((q) => ({ value: String(q.quartier_id), label: q.quartier_nom }))], minWidth: 200 },
          ].map(({ label, value, onChange, options, minWidth }) => (
            <div key={label} style={{ position: "relative" }}>
              <label style={{ position: "absolute", top: -9, left: 12, fontSize: 9.5, color: "#94A3B8", background: "#F8FAFC", padding: "0 4px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
              <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...selectStyle, minWidth }}>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94A3B8" }}><Ico.Chevron s={11} /></span>
            </div>
          ))}
          <button onClick={load} title="Refresh" style={{ border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", color: "#475569" }}>
            <Ico.Refresh s={15} spin={fetching} />
          </button>
        </div>

        {/* ── Content ── */}
        {fetching ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#64748B" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite", display: "block", margin: "0 auto 14px" }}>
              <circle cx="12" cy="12" r="10" stroke="#E2E8F0" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Loading classement…</div>
          </div>
        ) : visibleGroups.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#94A3B8", fontWeight: 600, fontSize: 14 }}>
            No data found for the selected filters.
          </div>
        ) : (
          visibleGroups.map(({ name, quartiers }) => (
            <WilayaSection key={name} wilayaName={name} quartiers={quartiers} selectedMap={selectedMap} onSelect={handleSelect} loadingId={loadingId} />
          ))
        )}

        {/* ── Footer ── */}
        {!fetching && classement.length > 0 && (
          <div style={{ padding: "14px 4px", color: "#94A3B8", fontSize: 12.5 }}>
            Showing {visibleGroups.reduce((a, g) => a + g.quartiers.length, 0)} of {classement.length} communes
          </div>
        )}
      </div>
    </AdminLayout>
  );
}