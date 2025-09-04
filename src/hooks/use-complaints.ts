"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Complaint } from '@/lib/types';

const COMPLAINTS_STORAGE_KEY = 'aspirasi-siswa-complaints';

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedComplaints = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
      if (storedComplaints) {
        setComplaints(JSON.parse(storedComplaints));
      }
    } catch (error) {
      console.error("Gagal memuat keluhan dari localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveComplaints = useCallback((updatedComplaints: Complaint[]) => {
    try {
      setComplaints(updatedComplaints);
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updatedComplaints));
    } catch (error) {
      console.error("Gagal menyimpan keluhan ke localStorage", error);
    }
  }, []);

  const addComplaint = useCallback((newComplaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const id = `AS-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const complaintToAdd: Complaint = {
      ...newComplaint,
      id,
      status: 'Terkirim',
      createdAt: new Date().toISOString(),
    };
    saveComplaints([complaintToAdd, ...complaints]);
    return id;
  }, [complaints, saveComplaints]);

  const getComplaintById = useCallback((id: string) => {
    return complaints.find(c => c.id === id);
  }, [complaints]);

  const updateComplaint = useCallback((id: string, updates: Partial<Complaint>) => {
    const updatedComplaints = complaints.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    saveComplaints(updatedComplaints);
  }, [complaints, saveComplaints]);

  return { complaints, isLoading, addComplaint, getComplaintById, updateComplaint };
}
