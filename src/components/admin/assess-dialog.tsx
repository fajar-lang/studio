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
        console.error("AI assessment failed", error);
        toast({
          variant: 'destructive',
          title: 'Assessment Failed',
          description: 'The AI assessment could not be completed. Please try again.',
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
          <DialogTitle>AI Complaint Assessment</DialogTitle>
          <DialogDescription>
            Use AI to get a recommendation for this complaint's status based on its content.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-4">
          {!assessment && (
            <Button onClick={handleAssess} disabled={isAssessing} className="w-full">
              {isAssessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isAssessing ? 'Assessing...' : 'Start AI Assessment'}
            </Button>
          )}

          {assessment && (
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle>AI Recommendation</AlertTitle>
              <AlertDescription>
                <p className="font-semibold">
                  Suggested Status: <span className="font-bold text-primary">{assessment.newStatus}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Reasoning:</strong> {assessment.reasoning}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!assessment || isAssessing} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Update to "{assessment?.newStatus || '...'}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
