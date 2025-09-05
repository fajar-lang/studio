"use client";

import { useAdmins } from '@/hooks/use-admins';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function AdminsList() {
  const { admins } = useAdmins();
  const regularAdmins = admins.filter(a => a.role !== 'superadmin');

  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Dibuat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regularAdmins.length > 0 ? (
                regularAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.username}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'superadmin' ? 'destructive' : 'secondary'}>
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(admin.createdAt), 'dd MMMM yyyy', { locale: id })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Tidak ada admin reguler yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
    </div>
  );
}
