"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
export default function Reports() {
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

  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AdminLayout >
    reports
    </AdminLayout>
  );
}