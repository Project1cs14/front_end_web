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

// ── Confirmation Modal ─────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmText, cancelText, onConfirm, onCancel, isDanger = false, loading = false, icon = null }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden" }}>
        <div style={{ padding: "24px" }}>
          {icon && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: isDanger ? "#fef2f2" : "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDanger ? "#dc2626" : "#16a34a",
              }}>
                {icon}
              </div>
            </div>
          )}
          
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0", textAlign: "center" }}>{title}</h3>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px 0", lineHeight: 1.6, textAlign: "center" }}>{message}</p>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#6b7280",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "system-ui",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s",
                opacity: loading ? 0.6 : 1,
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
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                border: "none",
                background: isDanger ? "#dc2626" : "#16a34a",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "system-ui",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all .2s",
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

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name, url, size = 32 }) {
  const [show, setShow] = useState(false);
  const letter = name?.charAt(0)?.toUpperCase() || "?";
  const seed = (name || "")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const palettes = [
    { bg: "#E9EDF5", fg: "#2E4080" },
    { bg: "#EEE9E3", fg: "#6B4A28" },
    { bg: "#E4EDE8", fg: "#235A38" },
    { bg: "#EDE4E8", fg: "#6A2840" },
    { bg: "#E8E4EE", fg: "#3D2870" },
    { bg: "#EBE9E0", fg: "#4A5228" },
  ];
  const p = palettes[seed % palettes.length];
  const s = { width: size, height: size };

  if (url && show)
    return (
      <div style={{ ...s, position: "relative", flexShrink: 0 }}>
        <Image
          width={size}
          height={size}
          src={url}
          alt={name}
          style={{
            ...s,
            borderRadius: 6,
            objectFit: "cover",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        />
        <button
          onClick={() => setShow(false)}
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#6B7280",
            color: "#fff",
            fontSize: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "none",
          }}
        >
          ✕
        </button>
      </div>
    );

  return (
    <button
      onClick={() => url && setShow(true)}
      style={{
        ...s,
        flexShrink: 0,
        borderRadius: 6,
        background: p.bg,
        color: p.fg,
        fontSize: size * 0.4,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: url ? "pointer" : "default",
        border: "none",
        fontFamily: "system-ui",
      }}
    >
      {letter}
    </button>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────
function DetailDrawer({ user, onClose, isMobile }) {
  const panelStyle = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        maxHeight: "88vh",
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        animation: "sheetUp .3s ease-out forwards",
      }
    : {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        zIndex: 50,
        background: "#fff",
        borderLeft: "1px solid #e5e7eb",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        animation: "drawerIn .3s ease-out forwards",
      };

  const backdropStyle = isMobile
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(2px)",
      }
    : {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 240,
        zIndex: 40,
        background: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(2px)",
      };

  const isActive = user.is_active === 1;

  return (
    <>
      <div onClick={onClose} style={backdropStyle} />

      <div style={panelStyle}>
        <style>{`
          @keyframes drawerIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
          @keyframes sheetUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        `}</style>

        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
            <div style={{ width: 32, height: 4, borderRadius: 99, background: "#d1d5db" }} />
          </div>
        )}

        {/* Header with close button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #f3f4f6",
          flexShrink: 0,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: 0 }}>
            User Profile
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "transparent",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {/* Profile Section */}
          <div style={{
            textAlign: "center",
            paddingBottom: 20,
            borderBottom: "1px solid #f3f4f6",
          }}>
            <Avatar name={user.name} url={user.avatar_url} size={80} />
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1f2937",
              margin: "12px 0 4px 0",
            }}>
              {user.name}
            </h2>
            <p style={{
              fontSize: 13,
              color: "#9ca3af",
              margin: "0 0 8px 0",
            }}>
              {user.email}
            </p>
            <div style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 6,
              background: isActive ? "#dcfce7" : "#fee2e2",
              color: isActive ? "#166534" : "#991b1b",
              fontSize: 12,
              fontWeight: 500,
            }}>
              {isActive ? "Active" : "Suspended"}
            </div>
          </div>

          {/* Information Section */}
          <section>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Contact Information
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}>
                  <p style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#9ca3af",
                    margin: 0,
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                    margin: 0,
                  }}>
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Statistics Section */}
          <section>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Account Statistics
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Role", value: user.role || "User" },
                { label: "Verified", value: user.is_verified === 1 ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: "10px 12px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}>
                  <p style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#9ca3af",
                    margin: "0 0 4px 0",
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                    margin: 0,
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Dates Section */}
          <section>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Account Timeline
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  label: "Joined",
                  value: user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "—",
                },
                {
                  label: "Last Active",
                  value: user.updated_at
                    ? new Date(user.updated_at).toLocaleDateString()
                    : "—",
                },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}>
                  <p style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#9ca3af",
                    margin: 0,
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#374151",
                    margin: 0,
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {user.bio && (
            <section>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#9ca3af",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
              }}>
                Bio
              </p>
              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "#374151",
                margin: 0,
                padding: "10px 12px",
                background: "#f9fafb",
                borderRadius: 8,
              }}>
                {user.bio}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

// ── Mobile Card ─────────────────────────────────────────────────────────
function MobileUserCard({ user, idx, onView }) {
  const isActive = user.is_active === 1;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={user.first_name || user.name} url={user.avatar_url} size={40} />
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#1f2937",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.name || "User"}
            </p>
            <p style={{
              fontSize: 11,
              color: "#9ca3af",
              marginTop: 2,
              margin: 0,
            }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Role", value: user.role },
          { label: "Status", value: isActive ? "Active" : "Suspended" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#9ca3af",
              margin: "0 0 2px 0",
              textTransform: "uppercase",
            }}>
              {label}
            </p>
            <p style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#374151",
              margin: 0,
            }}>
              {value || "—"}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onView(user)}
        style={{
          width: "100%",
          padding: "8px 0",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          background: "#fff",
          color: "#374151",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all .2s",
        }}
        onMouseEnter={(e) => e.target.style.background = "#f9fafb"}
      >
        View Details
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("first_name");
  const [sortDir, setSortDir] = useState("asc");
  const [detailTarget, setDetailTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
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

  const fetchUsers = async () => {
    const token = getToken();
    if (!token) {
      router.push("/LoginScreen");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      
      console.log("API Response:", data);
      
      // Handle different API response formats
      let usersList = [];
      if (Array.isArray(data)) {
        usersList = data;
      } else if (data.users && Array.isArray(data.users)) {
        usersList = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        usersList = data.data;
      } else if (data.user && Array.isArray(data.user)) {
        usersList = data.user;
      } else {
        console.warn("Unexpected data format:", data);
        usersList = [];
      }
      
      console.log("Extracted users:", usersList);
      setUsers(usersList || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          (u.first_name?.toLowerCase().includes(q)) ||
          (u.last_name?.toLowerCase().includes(q)) ||
          (u.name?.toLowerCase().includes(q)) ||
          (u.email?.toLowerCase().includes(q)) ||
          (u.phone?.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      const aVal = String(a[sortKey] || a.first_name || a.name || "").toLowerCase();
      const bVal = String(b[sortKey] || b.first_name || b.name || "").toLowerCase();
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    setFiltered(list);
  }, [search, users, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleSuspendUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmModal({
      type: "suspend",
      userId,
      title: "Suspend User Account",
      message: `Are you sure you want to suspend ${user?.first_name || user?.name}? They will be unable to access their account until reactivated.`,
      confirmText: "Suspend Account",
      cancelText: "Cancel",
      isDanger: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l12 0M9 5h6M10 14h4M8 19h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
        </svg>
      ),
    });
  };

  const handleResumeUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmModal({
      type: "resume",
      userId,
      title: "Reactivate User Account",
      message: `Are you sure you want to reactivate ${user?.first_name || user?.name}? They will regain access to their account.`,
      confirmText: "Reactivate Account",
      cancelText: "Cancel",
      isDanger: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    });
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmModal({
      type: "delete",
      userId,
      title: "Delete User Account Permanently",
      message: `This will permanently delete ${user?.first_name || user?.name}'s account and all associated data. This action cannot be undone.`,
      confirmText: "Delete Permanently",
      cancelText: "Cancel",
      isDanger: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      ),
    });
  };

  const executeConfirmAction = async () => {
    if (!confirmModal) return;

    const token = getToken();
    if (!token) {
      showToast("No token found. Please login again.", "error");
      return;
    }

    setActionLoading(confirmModal.userId);
    try {
      let endpoint = "";
      let method = "PATCH";

      if (confirmModal.type === "suspend") {
        endpoint = `${BASE_URL}/admin/deactivate/${confirmModal.userId}`;
      } else if (confirmModal.type === "resume") {
        endpoint = `${BASE_URL}/admin/activate/${confirmModal.userId}`;
      } else if (confirmModal.type === "delete") {
        endpoint = `${BASE_URL}/admin/delete/${confirmModal.userId}`;
        method = "DELETE";
      }

      console.log(`Making ${method} request to: ${endpoint}`);

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: confirmModal.type === "suspend" ? JSON.stringify({ reason: "Account suspended by administrator" }) : null,
      });

      console.log(`Response status: ${res.status}`);
      
      const contentType = res.headers.get("content-type");
      let data = {};

      // Check if response is JSON
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text.substring(0, 300));
        
        if (res.status === 401) {
          throw new Error("Unauthorized: Your token has expired. Please login again.");
        } else if (res.status === 404) {
          throw new Error("Endpoint not found. Your backend may not have implemented this feature yet.");
        } else if (res.status === 500) {
          throw new Error("Server error. Please contact your backend team.");
        } else {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
      }

      if (!res.ok) {
        const errorMsg = data.error || data.message || data.msg || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMsg);
      }

      if (confirmModal.type === "delete") {
        setUsers((prev) => prev.filter((u) => u.id !== confirmModal.userId));
        setDetailTarget(null);
        showToast("User account deleted successfully", "success");
      } else if (confirmModal.type === "suspend") {
        setUsers((prev) =>
          prev.map((u) => (u.id === confirmModal.userId ? { ...u, is_active: 0 } : u))
        );
        showToast("User suspended successfully", "success");
      } else if (confirmModal.type === "resume") {
        setUsers((prev) =>
          prev.map((u) => (u.id === confirmModal.userId ? { ...u, is_active: 1 } : u))
        );
        showToast("User reactivated successfully", "success");
      }

      setConfirmModal(null);
    } catch (err) {
      console.error("Error details:", err);
      showToast(err.message || "Operation failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const desktopColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
  ];

  const TH = ({ children, sortable, col }) => (
    <th
      onClick={sortable ? () => toggleSort(col) : undefined}
      style={{
        padding: "12px 16px",
        textAlign: "left",
        whiteSpace: "nowrap",
        fontSize: 12,
        fontWeight: 500,
        color: "#6b7280",
        cursor: sortable ? "pointer" : "default",
        userSelect: "none",
        background: "transparent",
        borderBottom: "1px solid #e5e7eb",
        fontFamily: "system-ui",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {children}
        {sortable && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ opacity: sortKey === col ? 1 : 0.25 }}
          >
            {sortKey === col && sortDir === "desc" ? (
              <path d="M12 5v14M5 12l7 7 7-7" />
            ) : (
              <path d="M12 19V5M5 12l7-7 7 7" />
            )}
          </svg>
        )}
      </span>
    </th>
  );

  return (
    <SecAdminLayout>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .users-tr:hover td { background:#f9fafb !important; }
        .users-search:focus { border-color:#3b82f6 !important; outline:none; }
        @media (prefers-reduced-motion: no-preference) {
          .toast { animation: toastIn .3s ease-out; }
        }
      `}</style>

      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", width: "100%", maxWidth: isDesktop ? 1200 : "100%" }}>

        {confirmModal && (
          <ConfirmModal
            title={confirmModal.title}
            message={confirmModal.message}
            confirmText={confirmModal.confirmText}
            cancelText={confirmModal.cancelText}
            isDanger={confirmModal.isDanger}
            loading={actionLoading === confirmModal.userId}
            icon={confirmModal.icon}
            onConfirm={executeConfirmAction}
            onCancel={() => setConfirmModal(null)}
          />
        )}

        {toast && (
          <div className="toast" style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 180,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            background: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}>
            {toast.type === "success" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            {toast.message}
          </div>
        )}

        {detailTarget && (
          <DetailDrawer
            user={detailTarget}
            onClose={() => setDetailTarget(null)}
            isMobile={isMobile || isTablet}
          />
        )}

        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px 0", fontWeight: 500 }}>
            Dashboard / USERS
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <h1 style={{ fontSize: isMobile ? 28 : 32, fontWeight: 700, color: "#000", margin: 0 }}>
              All Users
            </h1>
            <button
              onClick={fetchUsers}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#6b7280",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, phone…"
            className="users-search"
            style={{
              width: "100%",
              paddingLeft: 40,
              paddingRight: 16,
              paddingTop: 10,
              paddingBottom: 10,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 14,
              color: "#1f2937",
              background: "#fff",
              fontFamily: "system-ui",
              transition: "border-color .2s",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "none",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {!isMobile && (
          <div style={{
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <tr>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#9ca3af",
                    fontFamily: "system-ui",
                  }}>
                    #
                  </th>
                  {desktopColumns.map((col) => (
                    <TH key={col.key} sortable col={col.key}>
                      {col.label}
                    </TH>
                  ))}
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#6b7280",
                    fontFamily: "system-ui",
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && [...Array(6)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    {[36, 140, 180, 100, 60].map((w, j) => (
                      <td key={j} style={{ padding: "12px 16px" }}>
                        <div style={{
                          height: 12,
                          width: w,
                          borderRadius: 4,
                          background: "#e5e7eb",
                          animation: `pulse 1.5s ${i * 0.05}s ease-in-out infinite`,
                        }} />
                      </td>
                    ))}
                  </tr>
                ))}

                {!loading && !error && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "60px 24px", textAlign: "center" }}>
                      <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                        {search ? "No users match your search" : "No users found"}
                      </p>
                    </td>
                  </tr>
                )}

                {!loading && !error && filtered.map((user, idx) => {
                  const isActive = user.is_active === 1;

                  return (
                    <tr key={user.id} className="users-tr" style={{
                      borderBottom: "1px solid #e5e7eb",
                      transition: "all .2s",
                    }}>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        color: "#9ca3af",
                        fontSize: 12,
                      }}>
                        {String(idx + 1).padStart(2, "0")}
                      </td>

                      <td style={{ padding: "12px 16px" }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          minWidth: 0,
                        }}>
                          <Avatar name={user.first_name || user.name} url={user.avatar_url} size={28} />
                          <p style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#1f2937",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.name || user.email}
                          </p>
                        </div>
                      </td>

                      <td style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#374151",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 200,
                      }}>
                        {user.email || "—"}
                      </td>

                      <td style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#374151",
                      }}>
                        {user.phone || "—"}
                      </td>

                      <td style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#374151",
                      }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: isActive ? "#dcfce7" : "#fee2e2",
                          color: isActive ? "#166534" : "#991b1b",
                          fontSize: 12,
                          fontWeight: 500,
                        }}>
                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>

                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                          <button
                            onClick={() => setDetailTarget(user)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              border: "1px solid #d1d5db",
                              background: "#fff",
                              color: "#6b7280",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "all .2s",
                            }}
                            onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; }}
                            title="View profile"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          {isActive ? (
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              disabled={actionLoading === user.id}
                              title="Suspend user"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                border: "1px solid #fed7aa",
                                background: "#fffbeb",
                                color: "#92400e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: actionLoading === user.id ? "not-allowed" : "pointer",
                                transition: "all .2s",
                                opacity: actionLoading === user.id ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) => { if (actionLoading !== user.id) e.target.style.background = "#fed7aa"; }}
                              onMouseLeave={(e) => { e.target.style.background = "#fffbeb"; }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9l12 0M9 5h6M10 14h4M8 19h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleResumeUser(user.id)}
                              disabled={actionLoading === user.id}
                              title="Reactivate user"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                border: "1px solid #dcfce7",
                                background: "#f0fdf4",
                                color: "#166534",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: actionLoading === user.id ? "not-allowed" : "pointer",
                                transition: "all .2s",
                                opacity: actionLoading === user.id ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) => { if (actionLoading !== user.id) e.target.style.background = "#dcfce7"; }}
                              onMouseLeave={(e) => { e.target.style.background = "#f0fdf4"; }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={actionLoading === user.id}
                            title="Delete user permanently"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              color: "#dc2626",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: actionLoading === user.id ? "not-allowed" : "pointer",
                              transition: "all .2s",
                              opacity: actionLoading === user.id ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => { if (actionLoading !== user.id) e.target.style.background = "#fee2e2"; }}
                            onMouseLeave={(e) => { e.target.style.background = "#fef2f2"; }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!loading && error && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 24px",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" }}>
                  Unable to load users
                </p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px 0" }}>{error}</p>
                <button
                  onClick={fetchUsers}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    background: "#3b82f6",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderTop: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: 12,
                color: "#9ca3af",
              }}>
                <span>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
                <span>sorted by {sortKey} · {sortDir}</span>
              </div>
            )}
          </div>
        )}

        {isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {loading && [...Array(4)].map((_, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 14,
              }}>
                {[["100%", 14], ["70%", 11], ["50%", 10]].map(([w, h], j) => (
                  <div key={j} style={{
                    height: h,
                    width: w,
                    borderRadius: 4,
                    background: "#e5e7eb",
                    marginBottom: j < 2 ? 10 : 0,
                    animation: `pulse 1.5s ${i * 0.1}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            ))}

            {!loading && !error && filtered.map((user, idx) => (
              <MobileUserCard key={user.id} user={user} idx={idx} onView={(u) => setDetailTarget(u)} />
            ))}

            {!loading && !error && filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                  {search ? "No users match your search" : "No users found"}
                </p>
              </div>
            )}

            {!loading && error && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 8px 0" }}>
                  Unable to load
                </p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 12px 0" }}>{error}</p>
                <button
                  onClick={fetchUsers}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    background: "#3b82f6",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
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
