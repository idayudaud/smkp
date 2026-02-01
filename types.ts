
export enum PresenceStatus {
  ORIGINAL = 'Guru Matapelajaran',
  RELIEF = 'Guru Ganti'
}

export interface MMIRecord {
  id: string;
  tarikh: string;
  masa: string;
  nama: string;
  kelas: string;
  subjek: string;
  status: PresenceStatus;
  sebab: string;
  timestamp: string;
}

export interface User {
  username: string;
  role: 'admin' | 'viewer';
}
