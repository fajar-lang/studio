"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Admin, AdminRole } from '@/lib/types';

const ADMINS_STORAGE_KEY = 'aspirasi-siswa-admins';
const LOGGED_IN_ADMIN_KEY = 'aspirasi-siswa-logged-in-admin';

// This is a simplified stand-in for a proper hashing function.
// In a real-world app, use a robust library like bcrypt.
const simpleHash = (password: string) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loggedInAdmin, setLoggedInAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize admins and check login status from localStorage
  useEffect(() => {
    try {
      const storedAdmins = localStorage.getItem(ADMINS_STORAGE_KEY);
      if (storedAdmins) {
        setAdmins(JSON.parse(storedAdmins));
      } else {
        // If no admins exist, create the default superadmin
        const superAdmin: Admin = {
          id: `ADMIN-${Date.now()}`,
          username: 'adminsuper',
          password: simpleHash('smkn2lutim'),
          role: 'superadmin',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify([superAdmin]));
        setAdmins([superAdmin]);
      }

      const loggedInUserJson = sessionStorage.getItem(LOGGED_IN_ADMIN_KEY);
      if (loggedInUserJson) {
        setLoggedInAdmin(JSON.parse(loggedInUserJson));
      }
    } catch (error) {
      console.error("Gagal memuat data admin dari storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const saveAdmins = useCallback((updatedAdmins: Admin[]) => {
    try {
      setAdmins(updatedAdmins);
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(updatedAdmins));
    } catch (error) {
      console.error("Gagal menyimpan admin ke localStorage", error);
    }
  }, []);

  const addAdmin = useCallback((username: string, password: string): {success: boolean, message: string} => {
    const currentAdmins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '[]');
    
    if (currentAdmins.some((admin: Admin) => admin.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: "Nama pengguna sudah ada." };
    }

    const newAdmin: Admin = {
      id: `ADMIN-${Date.now()}`,
      username,
      password: simpleHash(password),
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    saveAdmins([...currentAdmins, newAdmin]);
    return { success: true, message: "Admin berhasil ditambahkan." };
  }, [saveAdmins]);


  const login = useCallback(async (username: string, password_raw: string): Promise<Admin | null> => {
    const currentAdmins: Admin[] = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '[]');
    const hashedPassword = simpleHash(password_raw);
    
    const admin = currentAdmins.find(
      (a) => a.username.toLowerCase() === username.toLowerCase() && a.password === hashedPassword
    );

    if (admin) {
      const adminDataForSession = { id: admin.id, username: admin.username, role: admin.role, createdAt: admin.createdAt };
      sessionStorage.setItem(LOGGED_IN_ADMIN_KEY, JSON.stringify(adminDataForSession));
      setLoggedInAdmin(adminDataForSession);
      return adminDataForSession;
    }

    return null;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(LOGGED_IN_ADMIN_KEY);
    setLoggedInAdmin(null);
  }, []);
  
  const getAdmins = useCallback((): Omit<Admin, 'password'>[] => {
     const currentAdmins: Admin[] = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '[]');
     return currentAdmins.map(({ password, ...rest }) => rest);
  }, []);


  return { admins: getAdmins(), loggedInAdmin, isLoading, addAdmin, login, logout };
}
