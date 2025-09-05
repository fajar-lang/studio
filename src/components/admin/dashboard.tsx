"use client";

import { useComplaints } from "@/hooks/use-complaints";
import { useAdmins } from "@/hooks/use-admins";
import { StatsCards } from "./stats-cards";
import { ComplaintsTable } from "./complaints-table";
import { AddAdminForm } from "./add-admin-form";
import { AdminsList } from "./admins-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

export function AdminDashboard() {
  const { isLoading: isLoadingComplaints } = useComplaints();
  const { loggedInAdmin, isLoading: isLoadingAdmins } = useAdmins();

  const isLoading = isLoadingComplaints || isLoadingAdmins;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dasbor Admin</h1>
        <p className="text-muted-foreground">Kelola dan tanggapi keluhan siswa.</p>
      </header>
      <StatsCards />
      <ComplaintsTable />
      
      {loggedInAdmin?.role === 'superadmin' && (
        <>
          <Separator />
          <div className="mt-4">
            <h2 className="text-2xl font-bold tracking-tight">Manajemen Admin</h2>
            <p className="text-muted-foreground">Tambah atau lihat admin lain di sistem.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Admin</CardTitle>
                    <CardDescription>Daftar semua admin dengan peran reguler.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminsList />
                </CardContent>
            </Card>
            <AddAdminForm />
          </div>
        </>
      )}
    </div>
  );
}
