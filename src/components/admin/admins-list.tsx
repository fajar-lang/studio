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

  return (
    <div className="mt-4 rounded-md border">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Dibuat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length > 0 ? (
                admins.map((admin) => (
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
                    Tidak ada admin lain yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
    </div>
  );
}
