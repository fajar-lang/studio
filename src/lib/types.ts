export type ComplaintCategory = 'Fasilitas' | 'Pengajaran' | 'Kantin' | 'Perundungan' | 'Lainnya';

export type ComplaintStatus = 'Terkirim' | 'Sedang Diproses' | 'Selesai' | 'Ditolak';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  text: string;
  status: ComplaintStatus;
  createdAt: string;
}
