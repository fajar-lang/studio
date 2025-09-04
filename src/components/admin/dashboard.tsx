"use client";

import { useComplaints } from "@/hooks/use-complaints";
import { StatsCards } from "./stats-cards";
import { ComplaintsTable } from "./complaints-table";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboard() {
  const { complaints, isLoading } = useComplaints();

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
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage and respond to student complaints.</p>
      </header>
      <StatsCards complaints={complaints} />
      <ComplaintsTable complaints={complaints} />
    </div>
  );
}
