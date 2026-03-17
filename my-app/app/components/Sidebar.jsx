"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/* ── Icons ── */
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <polyline points="9 21 9 12 15 12 15 21" />
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const SignOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const ChevronDownIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Sidebar inner content (shared between desktop & mobile) ── */
function SidebarContent({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [usersOpen, setUsersOpen] = useState(true);

  const isActive = (path) => pathname === path;

  const navLink = (href, icon, label) => (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors
        ${isActive(href) ? "bg-[#1e2d78] text-white font-semibold" : "text-[#3a3a5c] hover:bg-[#eaeadc]"}`}
    >
      {icon}
      {label}
    </Link>
  );

  const handleLogout = async () => {
    try {
      await fetch("https://back-end-sawu.onrender.com/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");

    router.push("/LoginScreen");
  };

  return (
    <div className="flex flex-col h-full px-3 py-4">

      {/* User Profile */}
      <div className="flex items-center gap-3 px-3 py-2.5 mb-5 border border-dashed border-violet-400 rounded-xl">
        <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-[#7c6fa0] to-[#2d2b55]" />
        <span className="text-sm font-semibold text-[#1a1a2e]">Kherraz Maroua</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">

        {navLink("/admin/Dashboard", <HomeIcon />, "General")}

        {/* Users dropdown */}
        <div>
          <button
            onClick={() => setUsersOpen(!usersOpen)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#3a3a5c] hover:bg-[#eaeadc] transition-colors"
          >
            <UsersIcon />
            <span className="flex-1 text-left">Users</span>
            <ChevronDownIcon open={usersOpen} />
          </button>

          {usersOpen && (
            <div className="pl-4 mt-0.5 flex flex-col gap-0.5">
              <Link
                href="/admin/users/users"
                onClick={onClose}
                className={`block px-3.5 py-2 rounded-lg text-sm transition-colors text-[#3a3a5c]
                  ${isActive("/admin/users/users") ? "font-semibold" : "font-normal hover:bg-[#eaeadc]"}`}
              >
                All Users
              </Link>
              <Link
                href="/admin/users/associations"
                onClick={onClose}
                className={`block px-3.5 py-2 rounded-lg text-sm font-semibold text-[#3a3a5c] transition-colors
                  ${isActive("/admin/users/associations") ? "bg-blue-100" : "hover:bg-[#eaeadc]"}`}
              >
                Associations
              </Link>
            </div>
          )}
        </div>

        {navLink("/admin/reports",   <ReportsIcon />,   "Reports")}
        {navLink("/admin/analytics", <AnalyticsIcon />, "Analytics")}
        {navLink("/admin/settings",  <SettingsIcon />,  "Settings")}
      </nav>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#3a3a5c] hover:bg-[#eaeadc] transition-colors w-full"
      >
        <SignOutIcon />
        Sign out
      </button>
    </div>
  );
}

/* ── Main export ── */
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── DESKTOP: always-visible fixed sidebar ── */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-60 bg-[#f5f5f0] border-r border-[#e2e2d8] flex-col z-50">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* ── MOBILE: top navbar with hamburger ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#f5f5f0] border-b border-[#e2e2d8]">
        <span className="text-sm font-semibold text-[#1a1a2e]">Admin Panel</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-[#3a3a5c] hover:bg-[#eaeadc] transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </header>

      {/* ── MOBILE: backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE: slide-in drawer ── */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#f5f5f0] border-r border-[#e2e2d8]
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-[#3a3a5c] hover:bg-[#eaeadc] transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>
    </>
  );
}