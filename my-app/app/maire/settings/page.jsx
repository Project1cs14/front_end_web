"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MaireLayout from "@/app/components/MayorLayout";
import { User, Shield, Phone, Eye, EyeOff, Save, RefreshCw } from "lucide-react";

const API_BASE = "https://back-end-sawu.onrender.com";

// Improved token and user retrieval with validation
const getToken = () => {
  const token = localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");
  if (!token) {
    console.warn("No token found in storage");
    return null;
  }
  return token;
};

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
};

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", wilaya: "" });
  const [originalProfile, setOriginalProfile] = useState({});
  const [userId, setUserId] = useState(null);
  const [profileRole, setProfileRole] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [countryCode, setCountryCode] = useState("+213");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirm_password: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const canUpdateProfile = profileRole !== "maire";

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken();
    if (!token) {
      router.push("/LoginScreen");
      return;
    }

    const user = getStoredUser();
    const resolvedUserId = user.user_id || user.id || user._id;
    if (!user || !resolvedUserId) {
      console.error("No user ID found in storage");
      router.push("/LoginScreen");
      return;
    }
    
    setUserId(resolvedUserId);
    const role = user.role || user.type || null;
    setProfileRole(role);
    if (role === "maire") {
      setProfileMsg({
        type: "info",
        text: "The current API docs only expose profile updates for admin and admin_sec accounts. Password updates are available for maire accounts.",
      });
    }
    
    // Parse phone number to extract country code if it exists
    let phoneNumber = user.phone || "";
    let extractedCode = "+213";
    let extractedNumber = phoneNumber;
    
    if (phoneNumber.startsWith("+")) {
      // Try to extract country code (assume codes are 3-4 digits)
      const match = phoneNumber.match(/^(\+\d{1,4})(.*)$/);
      if (match) {
        extractedCode = match[1];
        extractedNumber = match[2].trim();
      }
    }
    
    setCountryCode(extractedCode);
    
    const userProfile = {
      name: user.name || "",
      email: user.email || "",
      phone: extractedNumber,
      wilaya: user.wilaya || "",
    };
    setProfile(userProfile);
    setOriginalProfile(userProfile);
  }, [router]);

  const handleProfileSave = async () => {
    if (!canUpdateProfile) {
      setProfileMsg({
        type: "error",
        text: "Profile updates are not exposed for maire accounts in the current API. You can still update your password.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      setProfileMsg({ type: "error", text: "Session expired. Please login again." });
      setTimeout(() => router.push("/LoginScreen"), 2000);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profile.email && !emailRegex.test(profile.email)) {
      setProfileMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setProfileLoading(true);
    setProfileMsg(null);
    
    // Build update object with only fields that have changed
    const updateData = {};
    if (profile.name && profile.name.trim() !== originalProfile.name) {
      updateData.name = profile.name.trim();
    }
    if (profile.email && profile.email.trim() !== originalProfile.email) {
      updateData.email = profile.email.trim();
    }
    
    // Combine country code with phone number
    const fullPhoneNumber = profile.phone ? `${countryCode}${profile.phone.trim()}` : "";
    if (fullPhoneNumber !== (originalProfile.phone ? `${countryCode}${originalProfile.phone}` : "")) {
      updateData.phone = fullPhoneNumber;
    }
    
    if (profile.wilaya && profile.wilaya.trim() !== originalProfile.wilaya) {
      updateData.wilaya = profile.wilaya.trim();
    }
    
    if (Object.keys(updateData).length === 0) {
      setProfileMsg({ type: "error", text: "No changes to update." });
      setProfileLoading(false);
      return;
    }
    
    try {
      console.log("Updating profile with data:", updateData);
      console.log("User ID:", userId);
      console.log("Full URL:", `${API_BASE}/admin/update/${userId}`);
      
      const response = await fetch(`${API_BASE}/admin/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      
      console.log("Response status:", response.status);
      
      // Try to get the response text
      const responseText = await response.text();
      console.log("Response raw:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        data = { message: responseText || "Unknown error" };
      }
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.message || "Invalid data. Please check your email format.");
        } else if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("user");
          throw new Error("Session expired. Please login again.");
        } else if (response.status === 409) {
          throw new Error("Email already exists. Please use a different email address.");
        } else {
          throw new Error(data.message || `Server error: ${response.status}`);
        }
      }
      
      // Update storage with new data
      const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
      const stored = getStoredUser();
      if (stored) {
        const updatedUser = { ...stored, ...updateData };
        storage.setItem("user", JSON.stringify(updatedUser));
        setOriginalProfile({ ...profile });
      }
      
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile. Please try again." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const token = getToken();
    if (!token) {
      setPasswordMsg({ type: "error", text: "Session expired. Please login again." });
      setTimeout(() => router.push("/LoginScreen"), 2000);
      return;
    }

    if (passwords.newPassword !== passwords.confirm_password) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (!passwords.currentPassword) {
      setPasswordMsg({ type: "error", text: "Current password is required." });
      return;
    }
    
    setPasswordLoading(true);
    setPasswordMsg(null);
    
    try {
      const response = await fetch(`${API_BASE}/auth/web/changepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirm_password: passwords.confirm_password,
        }),
      });
      
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { message: responseText };
      }
      
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
        throw new Error("Session expired. Please login again.");
      }
      
      if (!response.ok) throw new Error(data.message || "Failed to update password");
      
      setPasswordMsg({ type: "success", text: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirm_password: "" });
      
      setTimeout(() => setPasswordMsg(null), 3000);
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Don't render if no userId (will redirect)
  if (!userId) {
    return (
      <MaireLayout>
        <div style={styles.page}>
          <div style={styles.card}>
            <p>Loading...</p>
          </div>
        </div>
      </MaireLayout>
    );
  }

  return (
    <MaireLayout>
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Account Settings</h1>
          <p style={styles.subtitle}>Manage your personal information and security preferences.</p>
        </div>

        {/* Profile Information Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <User size={20} color="#1e2d6b" />
            <h2 style={styles.cardTitle}>Profile Information</h2>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Email"
                type="email"
              />
            </div>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone</label>
              <input
                style={styles.input}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Phone number (optional)"
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Wilaya</label>
              <input
                style={styles.input}
                value={profile.wilaya}
                onChange={(e) => setProfile({ ...profile, wilaya: e.target.value })}
                placeholder="Wilaya (optional)"
              />
            </div>
          </div>

          {profileMsg && (
              <p style={profileMsg.type === "success" ? styles.successMsg : profileMsg.type === "info" ? styles.infoMsg : styles.errorMsg}>
              {profileMsg.text}
            </p>
          )}

          <div style={styles.actionRow}>
            <button
            style={(profileLoading || !canUpdateProfile) ? { ...styles.btnPrimary, ...styles.btnDisabled } : styles.btnPrimary}
            onClick={handleProfileSave}
            disabled={profileLoading || !canUpdateProfile}
            >
              {profileLoading ? <RefreshCw size={16} style={styles.spin} /> : <Save size={16} />}
            <span>{!canUpdateProfile ? "Profile Update Unavailable" : profileLoading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Security Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Shield size={20} color="#1e2d6b" />
            <h2 style={styles.cardTitle}>Security</h2>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Current Password</label>
              <div style={styles.inputWrap}>
                <input
                  style={styles.inputWithIcon}
                  type={showCurrent ? "text" : "password"}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="Current password"
                />
                <button style={styles.eyeBtn} onClick={() => setShowCurrent(!showCurrent)} type="button">
                  {showCurrent ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </button>
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>New Password</label>
              <div style={styles.inputWrap}>
                <input
                  style={styles.inputWithIcon}
                  type={showNew ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Minimum 8 characters"
                />
                <button style={styles.eyeBtn} onClick={() => setShowNew(!showNew)} type="button">
                  {showNew ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ ...styles.fieldRow, maxWidth: "50%" }}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                style={styles.input}
                type="password"
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {passwordMsg && (
            <p style={passwordMsg.type === "success" ? styles.successMsg : styles.errorMsg}>
              {passwordMsg.text}
            </p>
          )}

          <div style={styles.actionRow}>
            <button
              style={passwordLoading ? { ...styles.btnOutline, ...styles.btnDisabled } : styles.btnOutline}
              onClick={handlePasswordUpdate}
              disabled={passwordLoading}
            >
              {passwordLoading ? <RefreshCw size={16} style={styles.spin} /> : null}
              <span>{passwordLoading ? "Updating..." : "Update Password"}</span>
            </button>
          </div>
        </div>

        {/* Contact Information Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Phone size={20} color="#1e2d6b" />
            <h2 style={styles.cardTitle}>Contact Information</h2>
          </div>

          <div style={{ maxWidth: "50%" }}>
            <label style={styles.label}>Phone Number</label>
            <div style={styles.phoneRow}>
              <select 
                style={styles.select} 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+213">+213 (Algeria)</option>
                <option value="+1">+1 (USA/Canada)</option>
                <option value="+33">+33 (France)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+49">+49 (Germany)</option>
                <option value="+34">+34 (Spain)</option>
                <option value="+39">+39 (Italy)</option>
                <option value="+971">+971 (UAE)</option>
                <option value="+966">+966 (Saudi Arabia)</option>
                <option value="+20">+20 (Egypt)</option>
                <option value="+212">+212 (Morocco)</option>
                <option value="+216">+216 (Tunisia)</option>
              </select>
              <input
                style={{ ...styles.input, flex: 1 }}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Phone number (e.g., 555123456)"
              />
            </div>
            <small style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
              Example: 555123456 will be saved as {countryCode}555123456
            </small>
          </div>

          <div style={styles.actionRow}>
            <button
            style={(profileLoading || !canUpdateProfile) ? { ...styles.btnPrimary, ...styles.btnDisabled } : styles.btnPrimary}
            onClick={handleProfileSave}
            disabled={profileLoading || !canUpdateProfile}
            >
              {profileLoading ? <RefreshCw size={16} style={styles.spin} /> : <Save size={16} />}
            <span>{!canUpdateProfile ? "Profile Update Unavailable" : profileLoading ? "Updating..." : "Update Contact"}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </MaireLayout>
  );
}

const styles = {
  page: {
    padding: "32px 24px",
    maxWidth: 900,
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: 700, color: "#1e2d6b", margin: 0 },
  subtitle: { fontSize: 14, color: "#64748b", marginTop: 6 },
  card: {
    background: "#ffffff",
    border: "1px solid #e8edf5",
    borderRadius: 16,
    padding: "28px 32px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingBottom: 4,
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: { fontSize: 18, fontWeight: 600, color: "#1e2d6b", margin: 0 },
  fieldRow: { display: "flex", gap: 20, flexWrap: "wrap" },
  fieldGroup: {
    flex: 1,
    minWidth: 200,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: { fontSize: 13, fontWeight: 500, color: "#374151" },
  input: {
    padding: "10px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    color: "#1e293b",
    background: "#f8fafc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputWithIcon: {
    padding: "10px 40px 10px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    color: "#1e293b",
    background: "#f8fafc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  phoneRow: { display: "flex", gap: 10 },
  select: {
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    color: "#1e293b",
    background: "#f8fafc",
    outline: "none",
    cursor: "pointer",
    minWidth: 120,
  },
  actionRow: { display: "flex", justifyContent: "flex-end", paddingTop: 4 },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 22px",
    background: "#1e2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnOutline: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 22px",
    background: "#fff",
    color: "#1e2d6b",
    border: "1.5px solid #1e2d6b",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
  successMsg: {
    color: "#16a34a",
    fontSize: 13,
    margin: 0,
    padding: "8px 12px",
    background: "#f0fdf4",
    borderRadius: 6,
    border: "1px solid #bbf7d0",
  },
  errorMsg: {
    color: "#dc2626",
    fontSize: 13,
    margin: 0,
    padding: "8px 12px",
    background: "#fef2f2",
    borderRadius: 6,
    border: "1px solid #fecaca",
  },
  infoMsg: {
    color: "#1d4ed8",
    fontSize: 13,
    margin: 0,
    padding: "8px 12px",
    background: "#eff6ff",
    borderRadius: 6,
    border: "1px solid #bfdbfe",
  },
  spin: { animation: "spin 1s linear infinite" },
};
