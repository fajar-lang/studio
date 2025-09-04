"use client";

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { automatedComplaintStatusUpdate } from '@/ai/flows/automated-complaint-status-update';
import { useToast } from '@/hooks/use-toast';
import { Complaint, ComplaintStatus } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AssessDialogProps {
  complaint: Complaint;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (newStatus: ComplaintStatus) => void;
}

export function AssessDialog({ complaint, isOpen, onClose, onStatusUpdate }: AssessDialogProps) {
  const [isAssessing, startAssessing] = useTransition();
  const [assessment, setAssessment] = useState<{ newStatus: string; reasoning: string } | null>(null);
  const { toast } = useToast();

  const handleAssess = () => {
    startAssessing(async () => {
      try {
        const result = await automatedComplaintStatusUpdate({
          complaintText: complaint.text,
          currentStatus: complaint.status,
        });
        setAssessment(result);
      } catch (error) {
        console.error("Penilaian AI gagal", error);
        toast({
          variant: 'destructive',
          title: 'Penilaian Gagal',
          description: 'Penilaian AI tidak dapat diselesaikan. Silakan coba lagi.',
        });
      }
    });
  };

  const handleConfirm = () => {
    if (assessment) {
      onStatusUpdate(assessment.newStatus as ComplaintStatus);
      handleClose();
    }
  };
  
  const handleClose = () => {
    setAssessment(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Penilaian Keluhan AI</DialogTitle>
          <DialogDescription>
            Gunakan AI untuk mendapatkan rekomendasi status keluhan ini berdasarkan isinya.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-4">
          {!assessment && (
            <Button onClick={handleAssess} disabled={isAssessing} className="w-full">
              {isAssessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isAssessing ? 'Menilai...' : 'Mulai Penilaian AI'}
            </Button>
          )}

          {assessment && (
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle>Rekomendasi AI</AlertTitle>
              <AlertDescription>
                <p className="font-semibold">
                  Status yang Disarankan: <span className="font-bold text-primary">{assessment.newStatus}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Alasan:</strong> {assessment.reasoning}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={!assessment || isAssessing} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Perbarui menjadi "{assessment?.newStatus || '...'}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
