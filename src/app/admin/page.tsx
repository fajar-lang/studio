"use client";

import { useState, useEffect } from 'react';
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminLogin } from '@/components/admin/login-form';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek sessionStorage untuk melihat apakah pengguna sudah login
    const loggedInStatus = sessionStorage.getItem('isAdminLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isAdminLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoggedIn ? <AdminDashboard /> : <AdminLogin onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}
