export type ComplaintCategory = 'Fasilitas' | 'Pengajaran' | 'Kantin' | 'Perundungan' | 'Lainnya';

export type ComplaintStatus = 'Terkirim' | 'Sedang Diproses' | 'Selesai' | 'Ditolak';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  text: string;
  status: ComplaintStatus;
  createdAt: string;
}

export type AdminRole = 'superadmin' | 'admin';

export interface Admin {
  id: string;
  username: string;
  password?: string; // Password is not always sent to the client
  role: AdminRole;
  createdAt: string;
}
