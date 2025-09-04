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
import { Terminal } from 'lucide-react';
import { format } from 'date-fns';

const formSchema = z.object({
  trackingId: z.string().min(1, { message: "Tracking ID is required." }),
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
      case 'Submitted': return 'secondary';
      case 'In Progress': return 'default';
      case 'Completed': return 'outline';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="trackingId"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Enter your tracking ID (e.g., AS-12345-ABCDE)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline">Track</Button>
          </form>
        </Form>
        
        {searchedComplaint !== undefined && (
          <div className="mt-6 text-left transition-all duration-300">
            {searchedComplaint === null ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>
                  No complaint found with that ID. Please check the ID and try again.
                </AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Complaint Details</CardTitle>
                    <Badge variant={getStatusVariant(searchedComplaint.status)}>{searchedComplaint.status}</Badge>
                  </div>
                  <CardDescription>
                    ID: {searchedComplaint.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Category</h4>
                    <p className="text-muted-foreground">{searchedComplaint.category}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold">Submitted On</h4>
                    <p className="text-muted-foreground">{format(new Date(searchedComplaint.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Complaint</h4>
                    <p className="text-muted-foreground bg-secondary p-3 rounded-md">{searchedComplaint.text}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
