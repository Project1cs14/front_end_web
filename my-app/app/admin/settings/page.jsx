"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";

const BASE_URL = "https://back-end-sawu.onrender.com";

export default function AdminSettings() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    // General Settings
    platform_name: "Food Waste Management",
    platform_description: "Track and reduce food waste across your organization",
    support_email: "support@foodwaste.com",
    support_phone: "+213 550 001 818",

    // Email Settings
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_username: "noreply@foodwaste.com",
    smtp_password: "",
    email_from_name: "Food Waste Manager",

    // Security Settings
    two_factor_enabled: true,
    password_expiry_days: 90,
    session_timeout_minutes: 30,
    max_login_attempts: 5,

    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    daily_digest: true,
    weekly_report: true,

    // API Settings
    api_rate_limit: 1000,
    api_timeout_seconds: 30,
    api_key_rotation_days: 90,
  });

  const [editingSection, setEditingSection] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Utility Functions
  const getToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Effects
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/LoginScreen");
      return;
    }
    setIsAuthenticated(true);
    // Simulate loading settings
    setTimeout(() => setLoading(false), 800);
  }, [getToken, router]);

  // Handlers
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    const token = getToken();
    if (!token) {
      showToast("No token found. Please login again.", "error");
      return;
    }

    try {
      // In a real app, this would call the API
      // const res = await fetch(`${BASE_URL}/admin/settings`, {
      //   method: "POST",
      //   headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      //   body: JSON.stringify(settings),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast("Settings saved successfully", "success");
      setUnsavedChanges(false);
      setEditingSection(null);
    } catch (err) {
      showToast(err.message || "Failed to save settings", "error");
    }
  };

  const handleResetSettings = () => {
    // Reset to previous state
    setUnsavedChanges(false);
    setEditingSection(null);
  };

  // Render States
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#f5f5f0] w-full" />;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#1a1f5e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb] p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight">Settings</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage platform configuration and preferences.</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <nav className="divide-y divide-gray-100">
                {[
                  { id: "general", label: "General Settings", icon: "⚙️" },
                  { id: "email", label: "Email Configuration", icon: "✉️" },
                  { id: "security", label: "Security Settings", icon: "🔒" },
                  { id: "notifications", label: "Notifications", icon: "🔔" },
                  { id: "api", label: "API Settings", icon: "🔌" },
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full px-5 py-3.5 text-left text-sm font-medium transition-all ${
                      activeTab === id
                        ? "bg-[#1a1f5e]/5 text-[#1a1f5e] border-l-2 border-[#1a1f5e]"
                        : "text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    <span className="mr-2">{icon}</span>
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <SettingsSection
                title="General Settings"
                description="Configure basic platform information"
                fields={[
                  { key: "platform_name", label: "Platform Name", type: "text" },
                  { key: "platform_description", label: "Platform Description", type: "textarea" },
                  { key: "support_email", label: "Support Email", type: "email" },
                  { key: "support_phone", label: "Support Phone", type: "tel" },
                ]}
                settings={settings}
                onChange={handleSettingChange}
                isEditing={editingSection === "general"}
                onEdit={() => setEditingSection("general")}
                onSave={handleSaveSettings}
                onCancel={handleResetSettings}
                unsavedChanges={unsavedChanges}
              />
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <SettingsSection
                title="Email Configuration"
                description="Configure SMTP settings for email notifications"
                fields={[
                  { key: "smtp_host", label: "SMTP Host", type: "text" },
                  { key: "smtp_port", label: "SMTP Port", type: "number" },
                  { key: "smtp_username", label: "SMTP Username", type: "text" },
                  { key: "smtp_password", label: "SMTP Password", type: "password" },
                  { key: "email_from_name", label: "From Name", type: "text" },
                ]}
                settings={settings}
                onChange={handleSettingChange}
                isEditing={editingSection === "email"}
                onEdit={() => setEditingSection("email")}
                onSave={handleSaveSettings}
                onCancel={handleResetSettings}
                unsavedChanges={unsavedChanges}
              />
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-400 mt-1">Manage security policies and configurations</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 mt-1">Require 2FA for all admin accounts</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("two_factor_enabled", !settings.two_factor_enabled)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.two_factor_enabled ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.two_factor_enabled ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Password Expiry */}
                    <div className="border-t border-gray-100 pt-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        value={settings.password_expiry_days}
                        onChange={(e) => handleSettingChange("password_expiry_days", parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e]"
                      />
                      <p className="text-xs text-gray-400 mt-2">Users must change password every {settings.password_expiry_days} days</p>
                    </div>

                    {/* Session Timeout */}
                    <div className="border-t border-gray-100 pt-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.session_timeout_minutes}
                        onChange={(e) => handleSettingChange("session_timeout_minutes", parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e]"
                      />
                      <p className="text-xs text-gray-400 mt-2">Sessions expire after {settings.session_timeout_minutes} minutes of inactivity</p>
                    </div>

                    {/* Max Login Attempts */}
                    <div className="border-t border-gray-100 pt-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.max_login_attempts}
                        onChange={(e) => handleSettingChange("max_login_attempts", parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e]"
                      />
                      <p className="text-xs text-gray-400 mt-2">Lock account after {settings.max_login_attempts} failed attempts</p>
                    </div>

                    {/* Save Button */}
                    {unsavedChanges && (
                      <div className="border-t border-gray-100 pt-6 flex gap-3">
                        <button
                          onClick={handleSaveSettings}
                          className="flex-1 px-4 py-2.5 bg-[#1a1f5e] text-white rounded-lg font-semibold hover:bg-[#141852] transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleResetSettings}
                          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-400 mt-1">Configure notification channels and frequency</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Email Notifications */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500 mt-1">Send notifications via email</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("email_notifications", !settings.email_notifications)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.email_notifications ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.email_notifications ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* SMS Notifications */}
                    <div className="border-t border-gray-100 pt-6 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-500 mt-1">Send critical alerts via SMS</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("sms_notifications", !settings.sms_notifications)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.sms_notifications ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.sms_notifications ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Daily Digest */}
                    <div className="border-t border-gray-100 pt-6 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Daily Digest</h3>
                        <p className="text-sm text-gray-500 mt-1">Send daily summary at 9:00 AM</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("daily_digest", !settings.daily_digest)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.daily_digest ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.daily_digest ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Weekly Report */}
                    <div className="border-t border-gray-100 pt-6 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Weekly Report</h3>
                        <p className="text-sm text-gray-500 mt-1">Send weekly analytics report on Monday</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("weekly_report", !settings.weekly_report)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.weekly_report ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.weekly_report ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Save Button */}
                    {unsavedChanges && (
                      <div className="border-t border-gray-100 pt-6 flex gap-3">
                        <button
                          onClick={handleSaveSettings}
                          className="flex-1 px-4 py-2.5 bg-[#1a1f5e] text-white rounded-lg font-semibold hover:bg-[#141852] transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleResetSettings}
                          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* API Settings */}
            {activeTab === "api" && (
              <SettingsSection
                title="API Configuration"
                description="Manage API access and rate limiting"
                fields={[
                  { key: "api_rate_limit", label: "Rate Limit (requests/hour)", type: "number" },
                  { key: "api_timeout_seconds", label: "Request Timeout (seconds)", type: "number" },
                  { key: "api_key_rotation_days", label: "API Key Rotation (days)", type: "number" },
                ]}
                settings={settings}
                onChange={handleSettingChange}
                isEditing={editingSection === "api"}
                onEdit={() => setEditingSection("api")}
                onSave={handleSaveSettings}
                onCancel={handleResetSettings}
                unsavedChanges={unsavedChanges}
              />
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all ${
              toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            )}
            {toast.msg}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Reusable Settings Section Component
function SettingsSection({
  title,
  description,
  fields,
  settings,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  unsavedChanges,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        {!isEditing && !unsavedChanges && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-semibold text-[#1a1f5e] hover:bg-[#1a1f5e]/5 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
              {type === "textarea" ? (
                <textarea
                  value={settings[key] || ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm transition-all ${
                    isEditing
                      ? "bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e]"
                      : "bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                />
              ) : (
                <input
                  type={type}
                  value={settings[key] || ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm transition-all ${
                    isEditing
                      ? "bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1f5e]/15 focus:border-[#1a1f5e]"
                      : "bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {unsavedChanges && (
          <div className="border-t border-gray-100 mt-6 pt-6 flex gap-3">
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2.5 bg-[#1a1f5e] text-white rounded-lg font-semibold hover:bg-[#141852] transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}