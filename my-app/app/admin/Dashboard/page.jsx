"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (token && userData) {
        try {
          return JSON.parse(userData);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      return !token || !userData;
    }
    return true;
  });

  useEffect(() => {
    if (!user) {
      router.push('/LoginScreen');
    }
  }, [user, router]);

  // Fetched Status states
  const [stats, setStats] = useState({
    activeDonations: "—",
    registeredAssociations: "—",
    totalUsers: "—"
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) return;

      try {
        const [donationsRes, associationsRes, usersRes] = await Promise.all([
          fetch("https://back-end-sawu.onrender.com/admin/donation", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://back-end-sawu.onrender.com/admin/associations/approved", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://back-end-sawu.onrender.com/admin/users", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        let donationsCount = 0;
        if (donationsRes.ok) {
          const dData = await donationsRes.json();
          let dList = [];
          if (dData?.user_donations || dData?.asso_donations) {
            dList = [...(dData.user_donations || []), ...(dData.asso_donations || [])];
          } else if (Array.isArray(dData)) {
            dList = dData;
          } else if (dData?.don && Array.isArray(dData.don)) {
            dList = dData.don;
          } else if (dData?.donations && Array.isArray(dData.donations)) {
            dList = dData.donations;
          } else if (dData?.data && Array.isArray(dData.data)) {
            dList = dData.data;
          }
          // count actived donations or total
          donationsCount = dList.length;
        }

        let associationsCount = 0;
        if (associationsRes.ok) {
          const aData = await associationsRes.json();
          associationsCount = aData?.associations ? aData.associations.length : 0;
        }

        let usersCount = 0;
        if (usersRes.ok) {
          const uData = await usersRes.json();
          let uList = [];
          if (Array.isArray(uData)) uList = uData;
          else if (uData?.users && Array.isArray(uData.users)) uList = uData.users;
          else if (uData?.data && Array.isArray(uData.data)) uList = uData.data;
          usersCount = uList.length;
        }

        setStats({
          activeDonations: donationsCount,
          registeredAssociations: associationsCount,
          totalUsers: usersCount
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch('https://back-end-sawu.onrender.com/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');

    router.push('/LoginScreen');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-[#f4f6fb] p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1f5e] tracking-tight">Overview Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span>. Here is what's happening today.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Active Donations</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#1a1f5e] mb-1">{stats.activeDonations}</h3>
              <p className="text-xs text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded-full">Updated now</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Registered Associations</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#1a1f5e] mb-1">{stats.registeredAssociations}</h3>
              <p className="text-xs text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded-full">Verified platforms</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Total Users</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#1a1f5e] mb-1">{stats.totalUsers}</h3>
              <p className="text-xs text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded-full">Steady growth</p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Details (Left Column) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#1a1f5e] to-[#2a307c]"></div>
            <div className="px-6 pb-6 relative">
              <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center text-2xl font-bold text-[#1a1f5e] bg-blue-50 absolute -top-10">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Access Role</p>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1a1f5e] text-white capitalize">
                      {user?.role || "Administrator"}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Account Status</p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active & Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status / Quick Actions (Right Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-[#1a1f5e] mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">API Servers</h4>
                      <p className="text-xs text-gray-500">All systems operational</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Security Protocols</h4>
                      <p className="text-xs text-gray-500">Last updated 2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Secure</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-[#1a1f5e] mb-4">Recent Administration Notes</h3>
              <div className="p-5 border-l-4 border-[#1a1f5e] bg-blue-50/30 rounded-r-xl">
                <p className="text-sm text-gray-700 leading-relaxed">
                  The central monitoring systems are fully operational. Please continue overseeing the overall health of the platform, managing global configurations, and supervising subordinate administrative accounts (SecAdmin & Maire).
                </p>
                <p className="text-xs font-medium text-gray-400 mt-3">— Super Administration Board</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}