export type ComplaintCategory = 'Fasilitas' | 'Pengajaran' | 'Kantin' | 'Perundungan';

export type ComplaintStatus = 'Terkirim' | 'Sedang Diproses' | 'Selesai' | 'Ditolak';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  text: string;
  status: ComplaintStatus;
  createdAt: string;
}
