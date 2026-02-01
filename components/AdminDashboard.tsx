
import React, { useState, useEffect, useMemo } from 'react';
import { MMIRecord, PresenceStatus } from '../types';
import { storageService } from '../services/storageService';
import { getAIInsights } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [records, setRecords] = useState<MMIRecord[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setRecords(storageService.getRecords());
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const relief = records.filter(r => r.status === PresenceStatus.RELIEF).length;
    const original = total - relief;
    
    // Group by reason for relief
    const reasonCounts: Record<string, number> = {};
    records.filter(r => r.status === PresenceStatus.RELIEF).forEach(r => {
      reasonCounts[r.sebab] = (reasonCounts[r.sebab] || 0) + 1;
    });

    const chartData = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }));
    const presenceData = [
      { name: 'Guru Asal', value: original, color: '#1e3a8a' },
      { name: 'Guru Ganti', value: relief, color: '#ea580c' }
    ];

    return { total, relief, original, chartData, presenceData };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.nama.toLowerCase().includes(filter.toLowerCase()) ||
      r.subjek.toLowerCase().includes(filter.toLowerCase()) ||
      r.kelas.toLowerCase().includes(filter.toLowerCase())
    );
  }, [records, filter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus rekod ini?')) {
      storageService.deleteRecord(id);
      setRecords(storageService.getRecords());
    }
  };

  const generateAI = async () => {
    setAnalyzing(true);
    const result = await getAIInsights(records);
    setAiInsights(result);
    setAnalyzing(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Admin</h1>
          <p className="text-slate-500 font-medium">Pengurusan Keberadaan Guru MMI</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => window.location.reload()}
            className="bg-white border-2 border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition"
            title="Refresh"
          >
            <i className="fas fa-sync-alt text-slate-600"></i>
          </button>
          <button 
            onClick={generateAI}
            disabled={analyzing || records.length === 0}
            className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
          >
            {analyzing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>}
            Analitis AI
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Jumlah Rekod</p>
            <h3 className="text-3xl font-black text-slate-800">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Guru Asal</p>
            <h3 className="text-3xl font-black text-slate-800">{stats.original}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            <i className="fas fa-user-shield"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Guru Ganti</p>
            <h3 className="text-3xl font-black text-slate-800">{stats.relief}</h3>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      {aiInsights && (
        <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border-2 border-indigo-100 shadow-xl shadow-indigo-50/50 animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-3 mb-4 text-indigo-700">
            <i className="fas fa-robot text-2xl"></i>
            <h4 className="font-black text-xl">Laporan Strategik AI</h4>
          </div>
          <div className="prose prose-indigo max-w-none text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
            {aiInsights}
          </div>
        </div>
      )}

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="font-black text-slate-800 mb-6 uppercase text-sm tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Komposisi Keberadaan
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.presenceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.presenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {stats.presenceData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-bold text-slate-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="font-black text-slate-800 mb-6 uppercase text-sm tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div> Analisis Sebab Guru Ganti
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="font-black text-slate-800 uppercase text-sm tracking-widest">Senarai Rekod Terkini</h4>
          <div className="relative w-full md:w-72">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Cari guru, kelas, subjek..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none text-sm transition"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                <th className="px-6 py-4">Tarikh/Masa</th>
                <th className="px-6 py-4">Guru</th>
                <th className="px-6 py-4">Kelas/Subjek</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{record.tarikh}</div>
                    <div className="text-xs text-slate-400 font-medium">{record.masa}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{record.nama}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 text-sm">{record.kelas}</div>
                    <div className="text-xs text-blue-600 font-bold uppercase">{record.subjek}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      record.status === PresenceStatus.ORIGINAL 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-orange-100 text-orange-700'
                    }`}>
                      {record.status}
                    </span>
                    {record.status === PresenceStatus.RELIEF && (
                      <div className="text-[10px] text-slate-500 mt-1 italic">Sebab: {record.sebab}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition"
                      title="Hapus"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="text-slate-300 mb-2">
                      <i className="fas fa-folder-open text-5xl"></i>
                    </div>
                    <p className="text-slate-400 font-bold">Tiada rekod dijumpai</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
