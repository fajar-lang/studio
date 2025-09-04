"use client";

import { useState, useTransition } from 'react';
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Send } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ComplaintCategory } from '@/lib/types';

const formSchema = z.object({
  category: z.enum(['Fasilitas', 'Pengajaran', 'Kantin', 'Perundungan', 'Lainnya'], {
    required_error: "Silakan pilih kategori.",
  }),
  text: z.string().min(20, {
    message: "Keluhan harus minimal 20 karakter.",
  }).max(2000, {
    message: "Keluhan tidak boleh melebihi 2000 karakter."
  }),
});

export function ComplaintForm() {
  const [isPending, startTransition] = useTransition();
  const { addComplaint } = useComplaints();
  const { toast } = useToast();
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      try {
        const newId = addComplaint({
            ...values,
            category: values.category as ComplaintCategory
        });
        setSubmittedId(newId);
        form.reset();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Pengiriman Gagal",
          description: "Tidak dapat menyimpan keluhanmu. Silakan coba lagi.",
        });
      }
    });
  }

  const copyToClipboard = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      toast({ title: "Tersalin!", description: "ID pelacakan disalin ke clipboard." });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori keluhan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fasilitas">Fasilitas</SelectItem>
                    <SelectItem value="Pengajaran">Pengajaran</SelectItem>
                    <SelectItem value="Kantin">Kantin</SelectItem>
                    <SelectItem value="Perundungan">Perundungan</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keluhanmu</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Harap jelaskan masalahmu secara rinci. Kirimanmu anonim."
                    {...field}
                    rows={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Kirim Secara Anonim
          </Button>
        </form>
      </Form>
      
      <AlertDialog open={!!submittedId} onOpenChange={() => setSubmittedId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluhan Berhasil Dikirim!</AlertDialogTitle>
            <AlertDialogDescription>
              Harap simpan ID pelacakan ini. Kamu akan memerlukannya untuk memeriksa status keluhanmu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 bg-secondary rounded-md flex items-center justify-between">
            <span className="text-lg font-mono font-bold text-secondary-foreground">{submittedId}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSubmittedId(null)}>Tutup</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
