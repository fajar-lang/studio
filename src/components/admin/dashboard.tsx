"use client";

import { useComplaints } from "@/hooks/use-complaints";
import { StatsCards } from "./stats-cards";
import { ComplaintsTable } from "./complaints-table";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboard() {
  const { isLoading } = useComplaints();

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
    </div>
  );
}
