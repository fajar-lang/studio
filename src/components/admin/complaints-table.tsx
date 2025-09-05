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
import { Complaint, ComplaintStatus } from '@/lib/types';
import { useComplaints } from '@/hooks/use-complaints';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MoreHorizontal, Bot, Filter, Trash2, FileDown } from 'lucide-react';
import { AssessDialog } from './assess-dialog';
import { Input } from '../ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const exportToExcel = async (complaints: Complaint[]) => {
  const XLSX = await import('xlsx');
  const dataToExport = complaints.map(c => ({
    'ID Pelacakan': c.id,
    'Kategori': c.category,
    'Keluhan': c.text,
    'Dikirim': format(new Date(c.createdAt), 'dd MMMM yyyy, HH:mm', { locale: id }),
    'Status': c.status,
  }));
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Keluhan');
  XLSX.writeFile(workbook, `data-keluhan-${new Date().toISOString().split('T')[0]}.xlsx`);
};


export function ComplaintsTable() {
  const { complaints, updateComplaint, deleteComplaint } = useComplaints();
  const [complaintToAssess, setComplaintToAssess] = useState<Complaint | null>(null);
  const [filter, setFilter] = useState<{ text: string; status: ComplaintStatus | 'Semua' }>({ text: '', status: 'Semua' });

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, { status });
  };
  
  const getStatusVariant = (status: Complaint['status']) => {
    switch (status) {
      case 'Terkirim': return 'secondary';
      case 'Sedang Diproses': return 'default';
      case 'Selesai': return 'outline';
      case 'Ditolak': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter(c => filter.status === 'Semua' || c.status === filter.status)
      .filter(c => c.text.toLowerCase().includes(filter.text.toLowerCase()) || c.id.toLowerCase().includes(filter.text.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [complaints, filter]);
  
  const handleExport = () => {
    exportToExcel(filteredComplaints);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Keluhan Masuk</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Input 
                    placeholder="Saring berdasarkan teks atau ID..."
                    value={filter.text}
                    onChange={(e) => setFilter(prev => ({...prev, text: e.target.value}))}
                    className="w-full sm:w-64"
                />
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                {filter.status}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Semua'}))}>Semua</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Terkirim'}))}>Terkirim</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Sedang Diproses'}))}>Sedang Diproses</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Selesai'}))}>Selesai</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter(prev => ({...prev, status: 'Ditolak'}))}>Ditolak</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" onClick={handleExport} className="w-full">
                        <FileDown className="mr-2 h-4 w-4" />
                        Ekspor
                    </Button>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[150px]">ID Pelacakan</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="min-w-[200px]">Keluhan</TableHead>
                        <TableHead>Dikirim</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredComplaints.length > 0 ? (
                        filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                            <TableCell className="font-mono text-xs">{complaint.id}</TableCell>
                            <TableCell>{complaint.category}</TableCell>
                            <TableCell>
                            <div className="truncate max-w-xs" title={complaint.text}>
                                {complaint.text}
                            </div>
                            </TableCell>
                            <TableCell>{format(new Date(complaint.createdAt), 'dd/MM/yy HH:mm', { locale: id })}</TableCell>
                            <TableCell>
                            <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Buka menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setComplaintToAssess(complaint)}>
                                    <Bot className="mr-2 h-4 w-4" />
                                    Nilai dengan AI
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'Sedang Diproses')}>Tandai Sedang Diproses</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'Selesai')}>Tandai Selesai</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'Ditolak')}>Tandai Ditolak</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus keluhan secara permanen.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteComplaint(complaint.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Tidak ada keluhan ditemukan.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
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
