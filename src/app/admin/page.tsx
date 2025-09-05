"use client";

import { useState, useEffect } from 'react';
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminLogin } from '@/components/admin/login-form';
import { useAdmins } from '@/hooks/use-admins';

export default function AdminPage() {
  const { loggedInAdmin, isLoading: isAdminLoading, logout } = useAdmins();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleLoginSuccess = () => {
    // This will trigger a re-render and useAdmins will have the logged in user
    // We just need to re-render the component.
    // A simple way is to update a state variable.
    window.location.reload();
  };
  
  const handleLogout = () => {
    logout();
    window.location.reload();
  }

  if (!isClient || isAdminLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-muted">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
        <div className="container mx-auto px-4 py-8">
            {loggedInAdmin ? (
                <>
                    <div className="text-right mb-6">
                        <span className="text-muted-foreground mr-4">
                            Masuk sebagai <strong>{loggedInAdmin.username}</strong> ({loggedInAdmin.role})
                        </span>
                        <button onClick={handleLogout} className="text-sm text-primary hover:underline">Keluar</button>
                    </div>
                    <AdminDashboard />
                </>
            ) : <AdminLogin onLoginSuccess={handleLoginSuccess} />}
        </div>
    </div>
  );
}
