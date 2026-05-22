"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../../components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com/api";

const SEVERITY_CONFIG = {
  high: { label: "HIGH", dot: "#ef4444", bg: "#fef2f2", text: "#ef4444" },
  medium: { label: "MEDIUM", dot: "#f97316", bg: "#fff7ed", text: "#f97316" },
  low: { label: "LOW", dot: "#22c55e", bg: "#f0fdf4", text: "#22c55e" },
};

const RAISON_LABELS = {
  produit_dangereux: "Potential health hazard; expired content",
  mauvaise_categorie: "Incorrect category",
  arnaque: "Fraud or scam",
  comportement_abusif: "Abusive behavior",
  autre: "Other reason",
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);
const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconUserX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="18" y1="8" x2="23" y2="13"/>
    <line x1="23" y1="8" x2="18" y2="13"/>
  </svg>
);
const IconScale = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="3" x2="12" y2="21"/>
    <path d="M3 6l9-3 9 3"/>
    <path d="M3 6c0 3.31 2.69 6 6 6s6-2.69 6-6"/>
    <path d="M9 18c0 3.31 2.69 6 6 6s6-2.69 6-6"/>
  </svg>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, badge, badgeColor, accentColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex-1 shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accentColor ? `${accentColor}15` : "#f8fafc", color: accentColor || "#64748b" }}
        >
          {icon}
        </div>
        {badge && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: badgeColor?.bg, color: badgeColor?.text }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color: accentColor || "#1e293b" }}>
        {value ?? "—"}
      </p>
    </div>
  );
}

// ─── Severity Badge ───────────────────────────────────────────────────────────
function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
  return (
    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
      <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
      <span style={{ color: cfg.text }}>{cfg.label}</span>
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const isDon = type === "report_don";
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: isDon ? "#e0f2fe" : "#f3e8ff",
        color: isDon ? "#0369a1" : "#7c3aed",
      }}
    >
      {isDon ? "DONATION" : "USER ACCOUNT"}
    </span>
  );
}

// ─── Handled Status Badge ─────────────────────────────────────────────────────
function HandledBadge({ status }) {
  const cfg = {
    warned:   { bg: "#fff7ed", color: "#c2410c", label: "⚠️ Warned" },
    deleted:  { bg: "#fef2f2", color: "#dc2626", label: "🗑 Donation Deleted" },
    suspended:{ bg: "#fee2e2", color: "#dc2626", label: "🚫 Suspended" },
    dismissed:{ bg: "#f1f5f9", color: "#475569", label: "✓ Dismissed" },
  }[status] || { bg: "#f8fafc", color: "#64748b", label: status };
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Report Card ──────────────────────────────────────────────────────────────
function ReportCard({ report, onReview }) {
  const isDon = report.type === "report_don";
  const isHigh = report.severity === "high";
  const isHandled = !!report._handledStatus;

  return (
    <div
      className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border transition-all duration-200 hover:shadow-md cursor-pointer"
      style={{
        borderColor: isHandled ? "#e2e8f0" : isHigh ? "#fca5a5" : "#e2e8f0",
        opacity: isHandled ? 0.75 : 1,
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: isHigh && !isHandled ? "#fef2f2" : "#f8fafc" }}
      >
        {isDon ? (
          report.reported_don_photo ? (
            <img src={report.reported_don_photo} alt="" className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <span className="text-2xl">🍱</span>
          )
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
            👤
          </div>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <TypeBadge type={report.type} />
          <SeverityBadge severity={report.severity} />
          {isHandled && <HandledBadge status={report._handledStatus} />}
        </div>
        <p className="font-semibold text-gray-900 truncate">
          {isDon ? report.reported_don_titre : report.reported_user_name}
        </p>
        <p className="text-xs text-gray-400">ID: #REP-{report.id}</p>
      </div>

      {/* Reason */}
      <div className="hidden sm:block w-44 flex-shrink-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Reason</p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {RAISON_LABELS[report.raison] || report.raison}
        </p>
      </div>

      {/* Reporter */}
      <div className="hidden md:block w-32 flex-shrink-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Reporter</p>
        <div className="flex items-center gap-2">
          {report.reporter_avatar ? (
            <img src={report.reporter_avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              {report.reporter_name?.[0]}
            </div>
          )}
          <span className="text-sm text-gray-700 truncate">{report.reporter_name}</span>
        </div>
      </div>

      {/* Date */}
      <div className="hidden lg:block w-24 flex-shrink-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Date</p>
        <p className="text-sm text-gray-500">
          {new Date(report.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onReview(report.id); }}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{ background: isHandled ? "#64748b" : "#1e3a5f" }}
        >
          {isHandled ? "View" : "Review"}
        </button>
      </div>
    </div>
  );
}

// ─── System Policy Modal ──────────────────────────────────────────────────────
function SystemPolicyModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#1e3a5f15", color: "#1e3a5f" }}>
              <IconScale />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">System Moderation Policy</h2>
              <p className="text-xs text-gray-400">ZeroWaste Platform — Admin Guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
          >✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-gray-700">
          <section>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#1e3a5f" }}>1</span>
              Report Severity Classification
            </h3>
            <div className="space-y-2 ml-7">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#ef4444" }} />
                <p><strong>High:</strong> Health hazards, fraud/scams, expired food, dangerous products. Requires immediate action within 24 hours.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#f97316" }} />
                <p><strong>Medium:</strong> Abusive behavior, misclassified donations. Action within 72 hours.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#22c55e" }} />
                <p><strong>Low:</strong> Minor policy violations, incorrect categories. Review within 7 days.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#1e3a5f" }}>2</span>
              Available Admin Actions
            </h3>
            <div className="space-y-3 ml-7">
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                <p className="font-semibold text-orange-700">⚠️ Warn User</p>
                <p className="text-orange-600 mt-0.5">Sends an official warning notification. Warnings accumulate and may trigger automatic suspension after 3 warnings within 30 days.</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="font-semibold text-red-700">🗑 Delete Donation</p>
                <p className="text-red-600 mt-0.5">Permanently removes the donation listing. Donor is notified with the reason. Use for health hazards, expired content, or fraudulent listings.</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="font-semibold text-red-700">🚫 Suspend User</p>
                <p className="text-red-600 mt-0.5">Temporarily or permanently disables the user account. Reserved for repeat offenders, confirmed scams, or severe abuse. Requires documented evidence.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-semibold text-slate-700">✓ Dismiss Report</p>
                <p className="text-slate-600 mt-0.5">Close an unfounded or duplicate report without action. An admin note is required. The report is archived and visible in history.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#1e3a5f" }}>3</span>
              Escalation Protocol
            </h3>
            <div className="ml-7 space-y-1.5">
              <p>• A user with <strong>3+ active warnings</strong> should be reviewed for suspension.</p>
              <p>• Reports involving <strong>minors or illegal content</strong> must be escalated to the legal team immediately.</p>
              <p>• High-severity reports unresolved for <strong>48h+</strong> are automatically flagged to senior admins.</p>
              <p>• All moderation actions are <strong>logged and auditable</strong>. Reversals require senior admin approval.</p>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#1e3a5f" }}>4</span>
              Data & Privacy
            </h3>
            <div className="ml-7 space-y-1.5">
              <p>• Reporter identities are <strong>never disclosed</strong> to reported users.</p>
              <p>• Moderation logs are retained for <strong>24 months</strong> per GDPR compliance.</p>
              <p>• Admin actions are attributed to your account. Use shared accounts only with manager approval.</p>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90"
            style={{ background: "#1e3a5f" }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ reportId, onClose, token, onActionSuccess, onReportHandled }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [handledAlert, setHandledAlert] = useState(null); // { type, message }
  const [dismissNote, setDismissNote] = useState("");
  const [showDismissInput, setShowDismissInput] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/signalements/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load report");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [reportId, token]);

  const sig = data?.signalement;
  const reporter = data?.reporterInfo;
  const modHistory = data?.moderationHistory;
  const isDon = sig?.type === "report_don";

  const handleSuspend = async () => {
    if (!sig) return;
    const userId = isDon ? null : sig.reported_user_id;
    if (!userId) return showToast("No user to suspend for this report.", "error");
    setActionLoading("suspend");
    try {
      const res = await fetch(`${BASE_URL}/signalements/suspend/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: RAISON_LABELS[sig.raison] || sig.raison, signalement_id: sig.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to suspend");
      setHandledAlert({ type: "suspended", message: json.message || "User has been suspended successfully." });
      onReportHandled(reportId, "suspended");
      onActionSuccess();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDon = async () => {
    if (!sig?.reported_don_id) return showToast("No donation to delete.", "error");
    setActionLoading("delete");
    try {
      const res = await fetch(`${BASE_URL}/signalements/don/${sig.reported_don_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: RAISON_LABELS[sig.raison] || sig.raison, signalement_id: sig.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete donation");
      setHandledAlert({ type: "deleted", message: json.message || "Donation has been deleted successfully." });
      onReportHandled(reportId, "deleted");
      onActionSuccess();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleWarn = async () => {
    if (!sig) return;
    const userId = isDon ? sig.reporter_id : sig.reported_user_id;
    if (!userId) return showToast("No user to warn.", "error");
    setActionLoading("warn");
    try {
      const res = await fetch(`${BASE_URL}/signalements/warn/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: RAISON_LABELS[sig.raison] || sig.raison, signalement_id: sig.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to warn user");
      setHandledAlert({ type: "warned", message: json.message || "User has been warned. The report remains in the system for tracking." });
      onReportHandled(reportId, "warned");
      onActionSuccess();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async () => {
    if (!dismissNote.trim()) return showToast("Please provide an admin note before dismissing.", "error");
    setActionLoading("dismiss");
    try {
      const res = await fetch(`${BASE_URL}/signalements/${reportId}/dismiss`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ admin_note: dismissNote.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to dismiss report");
      setHandledAlert({ type: "dismissed", message: json.message || "Report has been dismissed without action." });
      onReportHandled(reportId, "dismissed");
      onActionSuccess();
      setShowDismissInput(false);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const alertConfig = {
    warned:   { bg: "#fff7ed", border: "#fed7aa", icon: "⚠️", title: "User Warned", color: "#c2410c" },
    deleted:  { bg: "#fef2f2", border: "#fecaca", icon: "🗑", title: "Donation Deleted", color: "#dc2626" },
    suspended:{ bg: "#fef2f2", border: "#fecaca", icon: "🚫", title: "User Suspended", color: "#dc2626" },
    dismissed:{ bg: "#f8fafc", border: "#cbd5e1", icon: "✓", title: "Report Dismissed", color: "#475569" },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Toast */}
        {toast && (
          <div
            className="absolute top-4 left-4 right-4 z-10 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all"
            style={{
              background: toast.type === "error" ? "#fee2e2" : "#dcfce7",
              color: toast.type === "error" ? "#dc2626" : "#16a34a",
            }}
          >
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {loading ? "Loading..." : `Review Report #${sig?.id}`}
            </h2>
            {sig && (
              <div className="flex items-center gap-2 mt-1">
                <SeverityBadge severity={sig.severity} />
                <span className="text-xs text-gray-400">
                  {new Date(sig.created_at).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
          >✕</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500 px-6 text-center">{error}</div>
        ) : sig ? (
          <div className="flex-1 flex flex-col gap-5 px-6 py-5">

            {/* ─── Handled Alert Banner ─── */}
            {handledAlert && (() => {
              const cfg = alertConfig[handledAlert.type] || alertConfig.dismissed;
              return (
                <div
                  className="p-4 rounded-xl border"
                  style={{ background: cfg.bg, borderColor: cfg.border }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{cfg.icon}</span>
                    <p className="font-bold text-sm" style={{ color: cfg.color }}>{cfg.title}</p>
                  </div>
                  <p className="text-sm" style={{ color: cfg.color }}>{handledAlert.message}</p>
                  {handledAlert.type === "warned" && (
                    <p className="text-xs mt-2 text-gray-500">
                      This report remains visible in the system for record-keeping and future reference.
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Reporter Info */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Reporter Info</p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {sig.reporter_name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{sig.reporter_name}</p>
                  <p className="text-xs text-gray-400">{sig.reporter_email}</p>
                  <p className="text-xs text-gray-400">
                    Member since{" "}
                    {reporter?.memberSince
                      ? new Date(reporter.memberSince).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                      : "—"}
                    {reporter?.successfulPickups != null && ` · ${reporter.successfulPickups} pickups`}
                  </p>
                </div>
                {reporter?.trustScore != null && (
                  <div className="flex flex-col items-center px-3 py-2 bg-white rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400">Trust</span>
                    <span className="text-lg font-bold text-green-600">{reporter.trustScore}%</span>
                  </div>
                )}
              </div>
            </section>

            {/* Reported Content */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Reported Content</p>
              <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                {isDon ? (
                  <>
                    {sig.reported_don_photo && (
                      <img src={sig.reported_don_photo} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{sig.reported_don_titre}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-3">{sig.reported_don_description}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#fef9c3", color: "#a16207" }}>
                        {sig.reported_don_status?.toUpperCase()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">👤</div>
                    <div>
                      <p className="font-semibold text-gray-900">{sig.reported_user_name || "Unknown User"}</p>
                      <p className="text-xs text-gray-400">Reported user account</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Reason */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Reason for Report</p>
              <div className="p-4 rounded-xl border-l-4" style={{ background: "#fef2f2", borderColor: "#ef4444" }}>
                <p className="text-sm text-gray-700">{sig.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#fee2e2", color: "#dc2626" }}>
                  {RAISON_LABELS[sig.raison] || sig.raison}
                </span>
              </div>
            </section>

            {/* Moderation History */}
            {modHistory && (
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Moderation History</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-xs text-gray-400 mb-1">Previous Warnings</p>
                    <p className="text-2xl font-bold text-orange-500">{modHistory.previousWarnings}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-xs text-gray-400 mb-1">Account Status</p>
                    <span
                      className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        background: modHistory.accountStatus === "active" ? "#dcfce7" : "#fee2e2",
                        color: modHistory.accountStatus === "active" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {modHistory.accountStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Dismiss Input */}
            {showDismissInput && (
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Admin Note (required)</p>
                <textarea
                  value={dismissNote}
                  onChange={(e) => setDismissNote(e.target.value)}
                  placeholder="e.g. Report unfounded after verification — duplicate of #REP-42."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </section>
            )}
          </div>
        ) : null}

        {/* Action buttons */}
        {sig && !loading && !handledAlert && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-3 bg-white">
            {isDon ? (
              <>
                <button
                  onClick={handleDeleteDon}
                  disabled={!!actionLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                  style={{ background: "#1e3a5f" }}
                >
                  {actionLoading === "delete" ? "Deleting…" : "Delete Donation"}
                </button>
                <button
                  onClick={handleWarn}
                  disabled={!!actionLoading}
                  className="w-full py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                >
                  {actionLoading === "warn" ? "Warning…" : "Warn User"}
                </button>
                <button
                  onClick={handleSuspend}
                  disabled={!!actionLoading}
                  className="w-full py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "#fee2e2", color: "#dc2626" }}
                >
                  {actionLoading === "suspend" ? "Suspending…" : "Suspend User"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleWarn}
                  disabled={!!actionLoading}
                  className="w-full py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                >
                  {actionLoading === "warn" ? "Warning…" : "Warn User"}
                </button>
                <button
                  onClick={handleSuspend}
                  disabled={!!actionLoading}
                  className="w-full py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "#fee2e2", color: "#dc2626" }}
                >
                  {actionLoading === "suspend" ? "Suspending…" : "Suspend User"}
                </button>
              </>
            )}

            {/* Dismiss */}
            {!showDismissInput ? (
              <button
                onClick={() => setShowDismissInput(true)}
                disabled={!!actionLoading}
                className="w-full py-2.5 rounded-xl font-semibold border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Dismiss Report
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDismiss}
                  disabled={!!actionLoading || !dismissNote.trim()}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#475569" }}
                >
                  {actionLoading === "dismiss" ? "Dismissing…" : "Confirm Dismiss"}
                </button>
                <button
                  onClick={() => { setShowDismissInput(false); setDismissNote(""); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Close
            </button>
          </div>
        )}

        {/* Handled — just show close */}
        {sig && !loading && handledAlert && (
          <div className="px-6 py-5 border-t border-gray-100 bg-white">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ background: "#1e3a5f" }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportsModeration() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPolicy, setShowPolicy] = useState(false);

  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  // track handled status per report id locally without removing them
  const [handledStatuses, setHandledStatuses] = useState({});

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      const u = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!t || !u) { router.push("/LoginScreen"); return; }
      try {
        setUser(JSON.parse(u));
        setToken(t);
      } catch {
        router.push("/LoginScreen");
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/signalements/stats`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStats(await res.json());
    } catch {}
  }, [token]);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    setReportsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/signalements`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setReports(json.rows || []);
      }
    } catch {} finally {
      setReportsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) { fetchStats(); fetchReports(); }
  }, [token, fetchStats, fetchReports]);

  const handleActionSuccess = () => {
    fetchStats();
    fetchReports();
  };

  // Mark report as handled locally (keep it in list with a status badge)
  const handleReportHandled = (id, status) => {
    setHandledStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const enrichedReports = reports.map((r) => ({
    ...r,
    _handledStatus: handledStatuses[r.id] || null,
  }));

  const filteredReports = enrichedReports.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      r.reported_don_titre?.toLowerCase().includes(searchLower) ||
      r.reported_user_name?.toLowerCase().includes(searchLower) ||
      r.reporter_name?.toLowerCase().includes(searchLower) ||
      `rep-${r.id}`.includes(searchLower);
    const matchesType = filterType === "all" || r.type === filterType;
    const matchesSeverity = filterSeverity === "all" || r.severity === filterSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Full-width container */}
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports &amp; Moderation</h1>
            <p className="text-gray-500 mt-1">
              Manage and resolve platform reports across the ZeroWaste ecosystem.
            </p>
          </div>
          <button
            onClick={() => setShowPolicy(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#1e3a5f" }}
          >
            <IconScale />
            System Policy
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <StatCard
            icon={<IconClipboard />}
            label="Pending Reports"
            value={stats?.pendingCount}
            badge="+12%"
            badgeColor={{ bg: "#dcfce7", text: "#16a34a" }}
          />
          <StatCard
            icon={<IconAlertTriangle />}
            label="High Severity"
            value={stats?.highSeverityCount}
            badge="URGENT"
            badgeColor={{ bg: "#fee2e2", text: "#dc2626" }}
            accentColor="#ef4444"
          />
          <StatCard
            icon={<IconCheckCircle />}
            label="Resolved Today"
            value={stats?.resolvedToday}
            badge="TODAY"
            badgeColor={{ bg: "#f0fdf4", text: "#16a34a" }}
            accentColor="#16a34a"
          />
          <StatCard
            icon={<IconUserX />}
            label="Suspended Users"
            value={stats?.suspendedUsers}
            badge="TOTAL"
            badgeColor={{ bg: "#f1f5f9", text: "#64748b" }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search reports, users, or items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700"
          >
            <option value="all">All Types</option>
            <option value="report_don">Donation</option>
            <option value="report_user">User Account</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700"
          >
            <option value="all">All Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Reports list */}
        <div className="flex flex-col gap-3">
          {reportsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-24 animate-pulse border border-gray-100" />
            ))
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="font-medium">No reports found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onReview={(id) => setSelectedReportId(id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedReportId && token && (
        <ReviewModal
          reportId={selectedReportId}
          token={token}
          onClose={() => setSelectedReportId(null)}
          onActionSuccess={handleActionSuccess}
          onReportHandled={handleReportHandled}
        />
      )}

      {/* System Policy Modal */}
      {showPolicy && <SystemPolicyModal onClose={() => setShowPolicy(false)} />}
    </AdminLayout>
  );
}