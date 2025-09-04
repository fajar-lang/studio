"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { useAdmins } from '@/hooks/use-admins';
import { UserPlus } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(4, { message: "Nama pengguna minimal 4 karakter." }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
});

export function AddAdminForm() {
  const { toast } = useToast();
  const { addAdmin } = useAdmins();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = addAdmin(values.username, values.password);
    if (result.success) {
      toast({
        title: "Admin Ditambahkan",
        description: `Pengguna '${values.username}' telah berhasil dibuat.`,
      });
      form.reset();
      // Optionally, refresh the list of admins by calling a function from the hook
      window.location.reload(); // Simple way to refresh state across components
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Menambahkan Admin",
        description: result.message,
      });
    }
  }

  return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Tambah Admin Baru</CardTitle>
          <CardDescription>Buat akun admin baru untuk mengelola keluhan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pengguna Baru</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: adminsekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi Baru</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Admin
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
  );
}
