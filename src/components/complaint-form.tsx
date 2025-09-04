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
import { Loader2, Copy } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  category: z.enum(['Facilities', 'Teaching', 'Canteen', 'Bullying'], {
    required_error: "Please select a category.",
  }),
  text: z.string().min(20, {
    message: "Complaint must be at least 20 characters.",
  }).max(2000, {
    message: "Complaint must not exceed 2000 characters."
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
        const newId = addComplaint(values);
        setSubmittedId(newId);
        form.reset();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "Could not save your complaint. Please try again.",
        });
      }
    });
  }

  const copyToClipboard = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      toast({ title: "Copied!", description: "Tracking ID copied to clipboard." });
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
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a complaint category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Teaching">Teaching</SelectItem>
                    <SelectItem value="Canteen">Canteen</SelectItem>
                    <SelectItem value="Bullying">Bullying</SelectItem>
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
                <FormLabel>Your Complaint</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your issue in detail. Your submission is anonymous."
                    {...field}
                    rows={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Anonymously"}
          </Button>
        </form>
      </Form>
      
      <AlertDialog open={!!submittedId} onOpenChange={() => setSubmittedId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complaint Submitted Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Please save this tracking ID. You'll need it to check the status of your complaint.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 bg-secondary rounded-md flex items-center justify-between">
            <span className="text-lg font-mono font-bold text-secondary-foreground">{submittedId}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSubmittedId(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
