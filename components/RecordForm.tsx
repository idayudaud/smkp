
import React, { useState } from 'react';
import { PresenceStatus, MMIRecord } from '../types';
import { CLASSES, REASONS } from '../constants';
import { storageService } from '../services/storageService';

const RecordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    tarikh: new Date().toISOString().split('T')[0],
    masa: '',
    nama: '',
    kelas: '',
    subjek: '',
    status: PresenceStatus.ORIGINAL,
    sebab: '-'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newRecord: MMIRecord = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      storageService.saveRecord(newRecord);
      alert('✅ Rekod Berjaya Disimpan!');
      setFormData({
        ...formData,
        masa: '',
        nama: '',
        kelas: '',
        subjek: '',
        status: PresenceStatus.ORIGINAL,
        sebab: '-'
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-50/80 p-8 flex flex-col items-center border-b border-slate-100 text-center">
          <img 
            src="https://i.ibb.co/v4mYp0N/logo-smk-penampang.png" 
            alt="Logo Sekolah" 
            className="h-28 w-auto mb-4 drop-shadow-xl"
          />
          <h2 className="text-slate-800 font-extrabold text-2xl uppercase italic tracking-tight">Rekod Keberadaan Guru</h2>
          <p className="text-slate-500 font-semibold text-sm mt-1 uppercase">Sistem MMI Digital (V2.0)</p>
          <div className="h-1.5 w-32 bg-red-600 rounded-full mt-4"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh</label>
              <input 
                type="date" 
                value={formData.tarikh}
                onChange={(e) => setFormData({...formData, tarikh: e.target.value})}
                required 
                className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Masa / Waktu</label>
              <input 
                type="time" 
                value={formData.masa}
                onChange={(e) => setFormData({...formData, masa: e.target.value})}
                required 
                className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Penuh Guru</label>
            <input 
              type="text" 
              placeholder="Masukkan nama penuh guru"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              required 
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kelas</label>
              <select 
                value={formData.kelas}
                onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                required 
                className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none bg-white transition cursor-pointer font-medium"
              >
                <option value="" disabled>-- Pilih Kelas --</option>
                {CLASSES.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.values.map(v => <option key={v} value={v}>{v}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subjek</label>
              <input 
                type="text" 
                placeholder="Contoh: B. Melayu"
                value={formData.subjek}
                onChange={(e) => setFormData({...formData, subjek: e.target.value})}
                required 
                className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 text-center italic">Status Keberadaan</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, status: PresenceStatus.ORIGINAL, sebab: '-'})}
                className={`p-4 text-center border-2 rounded-2xl font-bold transition shadow-sm ${
                  formData.status === PresenceStatus.ORIGINAL 
                  ? 'bg-blue-600 border-blue-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                GURU ASAL
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, status: PresenceStatus.RELIEF})}
                className={`p-4 text-center border-2 rounded-2xl font-bold transition shadow-sm ${
                  formData.status === PresenceStatus.RELIEF 
                  ? 'bg-orange-600 border-orange-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                GURU GANTI
              </button>
            </div>
          </div>

          {formData.status === PresenceStatus.RELIEF && (
            <div className="bg-orange-50 p-6 rounded-[1.5rem] border-2 border-orange-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="block text-sm font-bold text-orange-800 mb-3">Sebab Guru Asal Tidak Hadir:</label>
              <select 
                value={formData.sebab}
                onChange={(e) => setFormData({...formData, sebab: e.target.value})}
                required
                className="w-full p-4 border-2 border-orange-300 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none bg-white font-medium"
              >
                <option value="-">-- Sila Pilih Sebab --</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-900 transition duration-300 shadow-xl flex justify-center items-center gap-3 text-lg disabled:opacity-70"
          >
            {loading ? (
               <i className="fas fa-spinner fa-spin"></i>
            ) : (
               <i className="fas fa-check-circle"></i>
            )}
            SIMPAN REKOD MMI
          </button>
        </form>
      </div>
      <div className="text-center mt-10 space-y-2">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">SMK PENAMBANG • KOTA BHARU • KELANTAN</p>
        <p className="text-slate-500 text-xs font-bold uppercase italic tracking-widest">"Berilmu, Bertakwa, Berbakti"</p>
      </div>
    </div>
  );
};

export default RecordForm;
