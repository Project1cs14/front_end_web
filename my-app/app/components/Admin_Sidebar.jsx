"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

const ConfigurationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const SignOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={"transition-transform duration-200 " + (open ? "rotate-180" : "")}
  >
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

/* ── Reusable nav link ── */
function NavLink({ href, icon, label, onClick }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 " +
        (active
          ? "bg-[#001f5c] text-white shadow-sm"
          : "text-[#4a4a6a] hover:bg-[#f0f0f8] hover:text-[#1a1a3e]")
      }
    >
      <span className={active ? "text-white" : "text-[#7a7a9e]"}>{icon}</span>
      <span className="flex-1">{label}</span>
    </Link>
  );
}

/* ── Dropdown group ── */
function NavGroup({ icon, label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#4a4a6a] hover:bg-[#f0f0f8] hover:text-[#1a1a3e] transition-all duration-200"
      >
        <span className="text-[#7a7a9e]">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <span className="text-[#7a7a9e]">
          <ChevronIcon open={open} />
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? "300px" : "0px" }}
      >
        <div className="mt-0.5 ml-3 pl-4 border-l border-[#e8e8f0] space-y-0.5 py-1">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-link inside a group ── */
function SubLink({ href, label, onClick }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 " +
        (active
          ? "bg-[#001f5c] text-white font-medium shadow-sm"
          : "text-[#4a4a6a] hover:bg-[#f0f0f8] hover:text-[#1a1a3e]")
      }
    >
      <span
        className={
          "w-1.5 h-1.5 rounded-full shrink-0 " +
          (active ? "bg-white" : "bg-[#c0c0d8]")
        }
      />
      {label}
    </Link>
  );
}

/* ── Section label ── */
const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold text-[#9a9ab8] uppercase tracking-widest px-4 pt-2 pb-1">
    {children}
  </p>
);

/* ── Sidebar content (shared desktop + mobile) ── */
function SidebarContent({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const managementPaths = ["/admin/management/admins", "/admin/management/users", "/admin/management/associations","/admin/management/mayors"];
  const contentPaths = ["/admin/Content/reports", "/admin/Content/donations"];
  const configPaths = ["/admin/Configuration/Categories"];
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
    <div className="flex flex-col h-full bg-[#f8f8fc] px-3 py-6">

      {/* Logo */}
      <div className="flex items-center justify-center flex-col mb-8">
        <Image alt="ZeroWaste Logo" src="../../adminlogo.svg" width={100} height={100} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">

        {/* Dashboard */}
        <NavLink href="/admin/Dashboard" icon={<HomeIcon />} label="Dashboard" onClick={onClose} />

        {/* Management */}
        <SectionLabel>Management</SectionLabel>
        <NavGroup
          label="Management"
          defaultOpen={managementPaths.some((p) => pathname === p)}
          icon={<UsersIcon />}
        >
          <SubLink href="/admin/management/admins"            label="Admins"       onClick={onClose} />
          <SubLink href="/admin/management/users"             label="Users"        onClick={onClose} />
          
          <SubLink href="/admin/management/associations"      label="Associations" onClick={onClose} />
          <SubLink href="/admin/management/mayors"            label="Mayors"       onClick={onClose} />
        </NavGroup>

        {/* Content */}
        <SectionLabel>Content</SectionLabel>
        <NavGroup
          label="Content"
          defaultOpen={contentPaths.some((p) => pathname === p)}
          icon={<ReportsIcon />}
        >
                    <SubLink href="/admin/Content/Donations" label="Donations" onClick={onClose} />

          <SubLink href="/admin/Content/reports"   label="Reports"   onClick={onClose} />
        </NavGroup>
        
     {/* Configuration */}
        <SectionLabel>Configuration</SectionLabel>
        <NavGroup
          label="Configuration"
          defaultOpen={configPaths.some((p) => pathname === p)}
          icon={<ConfigurationIcon />}
        >
          <SubLink href="/admin/Configuration/Categories"   label="Categories"   onClick={onClose} />
         
        </NavGroup>

        {/* Standalone items */}
        <div className="mt-1">
          <NavLink href="/admin/analytics" icon={<AnalyticsIcon />} label="Analytics" onClick={onClose} />
          <NavLink href="/admin/settings"  icon={<SettingsIcon />}  label="Settings"  onClick={onClose} />
        </div>
      </nav>

      {/* Sign out */}
      <div className="pt-4 border-t border-[#e8e8f0]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#4a4a6a] hover:bg-[#f0f0f8] hover:text-[#1a1a3e] transition-all duration-200"
        >
          <span className="text-[#7a7a9e]"><SignOutIcon /></span>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: always-visible fixed sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-[#f8f8fc] border-r border-[#e8e8f0] flex-col z-50">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Mobile: top navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#f8f8fc] border-b border-[#e8e8f0]">
        <span className="text-sm font-bold text-[#001f5c]">Admin Panel</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-[#4a4a6a] hover:bg-[#f0f0f8] transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </header>

      {/* Mobile: backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile: slide-in drawer */}
      <div
        className={
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#f8f8fc] border-r border-[#e8e8f0] " +
          "transform transition-transform duration-300 ease-in-out " +
          (mobileOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-[#4a4a6a] hover:bg-[#f0f0f8] transition-colors"
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