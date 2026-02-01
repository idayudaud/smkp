
import { MMIRecord } from '../types';
import { STORAGE_KEY } from '../constants';

export const storageService = {
  saveRecord: (record: MMIRecord) => {
    const existing = storageService.getRecords();
    const updated = [record, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
  getRecords: (): MMIRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  deleteRecord: (id: string) => {
    const existing = storageService.getRecords();
    const filtered = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
