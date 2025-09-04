"use client";

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Complaint, ComplaintCategory, ComplaintStatus } from '@/lib/types';
import { useComplaints } from '@/hooks/use-complaints';
import { format } from 'date-fns';
import { MoreHorizontal, Bot, Filter } from 'lucide-react';
import { AssessDialog } from './assess-dialog';
import { Input } from '../ui/input';

interface ComplaintsTableProps {
  complaints: Complaint[];
}

export function ComplaintsTable({ complaints: initialComplaints }: ComplaintsTableProps) {
  const { complaints, updateComplaint } = useComplaints();
  const [complaintToAssess, setComplaintToAssess] = useState<Complaint | null>(null);
  const [filter, setFilter] = useState<{ text: string; status: ComplaintStatus | 'All' }>({ text: '', status: 'All' });

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, { status });
  };
  
  const getStatusVariant = (status: Complaint['status']) => {
    switch (status) {
      case 'Submitted': return 'secondary';
      case 'In Progress': return 'default';
      case 'Completed': return 'outline';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter(c => filter.status === 'All' || c.status === filter.status)
      .filter(c => c.text.toLowerCase().includes(filter.text.toLowerCase()) || c.id.toLowerCase().includes(filter.text.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [complaints, filter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Incoming Complaints</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
                <Input 
                    placeholder="Filter by text or ID..."
                    value={filter.text}
                    onChange={(e) => setFilter(prev => ({...prev, text: e.target.value}))}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Filter className="mr-2 h-4 w-4" />
                            {filter.status}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'All'}))}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Submitted'}))}>Submitted</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'In Progress'}))}>In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Completed'}))}>Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Rejected'}))}>Rejected</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono">{complaint.id}</TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell>
                      <div className="truncate w-48" title={complaint.text}>
                        {complaint.text}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(complaint.createdAt), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setComplaintToAssess(complaint)}>
                            <Bot className="mr-2 h-4 w-4" />
                            Assess with AI
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'In Progress')}>Mark as In Progress</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'Completed')}>Mark as Completed</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'Rejected')}>Mark as Rejected</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No complaints found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {complaintToAssess && (
        <AssessDialog
          complaint={complaintToAssess}
          isOpen={!!complaintToAssess}
          onClose={() => setComplaintToAssess(null)}
          onStatusUpdate={(newStatus) => {
            handleStatusChange(complaintToAssess.id, newStatus);
            setComplaintToAssess(null);
          }}
        />
      )}
    </Card>
  );
}
