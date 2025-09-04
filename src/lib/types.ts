export type ComplaintCategory = 'Facilities' | 'Teaching' | 'Canteen' | 'Bullying';

export type ComplaintStatus = 'Submitted' | 'In Progress' | 'Completed' | 'Rejected';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  text: string;
  status: ComplaintStatus;
  createdAt: string;
}
