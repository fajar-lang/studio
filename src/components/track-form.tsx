"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useComplaints } from '@/hooks/use-complaints';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Complaint } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Search } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const formSchema = z.object({
  trackingId: z.string().min(1, { message: "ID pelacakan diperlukan." }),
});

export function TrackForm() {
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null | undefined>(undefined);
  const { getComplaintById } = useComplaints();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const complaint = getComplaintById(values.trackingId.trim());
    setSearchedComplaint(complaint || null);
  }
  
  const getStatusVariant = (status: Complaint['status']) => {
    switch (status) {
      case 'Terkirim': return 'secondary';
      case 'Sedang Diproses': return 'default';
      case 'Selesai': return 'outline';
      case 'Ditolak': return 'destructive';
      default: return 'secondary';
    }
  }

  return (
    <>
      <Card className="w-full shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="trackingId"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="Masukkan ID pelacakanmu (misal, AS-12345-ABCDE)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Lacak
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
        
      {searchedComplaint !== undefined && (
        <div className="mt-6 text-left transition-all duration-300">
          {searchedComplaint === null ? (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Tidak Ditemukan</AlertTitle>
              <AlertDescription>
                Tidak ada keluhan yang ditemukan dengan ID tersebut. Harap periksa kembali ID dan coba lagi.
              </AlertDescription>
            </Alert>
          ) : (
            <Card className="shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Detail Keluhan</CardTitle>
                  <Badge variant={getStatusVariant(searchedComplaint.status)}>{searchedComplaint.status}</Badge>
                </div>
                <CardDescription>
                  ID: {searchedComplaint.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Kategori</h4>
                  <p className="text-muted-foreground">{searchedComplaint.category}</p>
                </div>
                  <div>
                  <h4 className="font-semibold">Dikirim Pada</h4>
                  <p className="text-muted-foreground">{format(new Date(searchedComplaint.createdAt), 'd MMMM yyyy, HH:mm', { locale: id })}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Keluhan</h4>
                  <p className="text-muted-foreground bg-slate-100 p-3 rounded-md">{searchedComplaint.text}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
