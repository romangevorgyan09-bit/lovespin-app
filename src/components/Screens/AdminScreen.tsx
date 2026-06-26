import React, { useState } from 'react';
import { UserProfile, Complaint } from '../../types';
import { Shield, Users, AlertTriangle, Activity, Check, Heart, Ban, ChevronLeft } from 'lucide-react';

interface AdminScreenProps {
  profiles: UserProfile[];
  complaints: Complaint[];
  onToggleBlockUser: (userId: string) => void;
  onResolveComplaint: (complaintId: string) => void;
  onClose: () => void;
}

export default function AdminScreen({ profiles, complaints, onToggleBlockUser, onResolveComplaint, onClose }: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'complaints'>('users');

  const totalHearts = profiles.reduce((sum, p) => sum + p.hearts, 0);
  const activeComplaints = complaints.filter(c => c.status === 'pending');

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-5 overflow-y-auto select-none select-none relative">
      {/* Red/Purple soft alarm light blur */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-950/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header with Close */}
      <div className="flex items-center justify-between mt-2 mb-4 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Панель Администратора</span>
              <Shield className="w-4 h-4 text-purple-400" />
            </h2>
            <p className="text-[9px] text-zinc-500 font-medium">Управление базой данных, жалобы и модерация</p>
          </div>
        </div>
      </div>

      {/* Stats Counters Overview */}
      <div className="grid grid-cols-3 gap-2 mb-4.5 select-none">
        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-2.5 text-center">
          <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Юзеры</span>
          <div className="text-sm font-black text-white mt-0.5">{profiles.length}</div>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-2.5 text-center">
          <AlertTriangle className="w-4 h-4 text-rose-500 mx-auto mb-1" />
          <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Жалобы</span>
          <div className="text-sm font-black text-rose-500 mt-0.5">{activeComplaints.length}</div>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-2.5 text-center">
          <Heart className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400/20 mx-auto mb-1" />
          <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Сердца ❤️</span>
          <div className="text-sm font-black text-fuchsia-300 mt-0.5">{totalHearts}</div>
        </div>
      </div>

      {/* Segment tabs */}
      <div className="grid grid-cols-2 gap-1.5 bg-zinc-900/40 p-1 rounded-xl mb-4 select-none">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-purple-950/40 border border-purple-900/30 text-purple-300'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Список анкет
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'complaints'
              ? 'bg-purple-950/40 border border-purple-900/30 text-purple-300'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Жалобы ({activeComplaints.length})
        </button>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[220px]">
        {activeTab === 'users' && (
          <div className="flex flex-col gap-2">
            {profiles.map(p => (
              <div
                key={p.id}
                className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <h4 className="text-[10px] font-bold text-white truncate">{p.name}, {p.age}</h4>
                    <p className="text-[8px] text-zinc-500">{p.city}</p>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => onToggleBlockUser(p.id)}
                    className={`px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      p.isBlocked
                        ? 'bg-emerald-950/30 border border-emerald-900 text-emerald-400'
                        : 'bg-rose-950/30 border border-rose-900 text-rose-400'
                    }`}
                  >
                    <Ban size={10} />
                    <span>{p.isBlocked ? 'Разблок.' : 'Заблок.'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="flex flex-col gap-2">
            {activeComplaints.length === 0 ? (
              <div className="text-center py-8 text-[10px] text-zinc-600 font-medium">
                Жалоб нет. Приложение в безопасности! ✨
              </div>
            ) : (
              activeComplaints.map(comp => {
                const reporter = profiles.find(p => p.id === comp.reporterId);
                const reported = profiles.find(p => p.id === comp.reportedId);
                return (
                  <div
                    key={comp.id}
                    className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-baseline text-[8px] text-zinc-500">
                        <span>Отправитель: {reporter?.name || 'Гость'}</span>
                        <span>{new Date(comp.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-zinc-300 font-semibold leading-relaxed">
                        Жалоба на: <span className="text-rose-400">{reported?.name || 'Пользователя'}</span> — "{comp.reason}"
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-3 pt-2.5 border-t border-zinc-900/60 justify-end">
                      <button
                        onClick={() => onResolveComplaint(comp.id)}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Check size={10} />
                        <span>Отклонить</span>
                      </button>
                      <button
                        onClick={() => {
                          if (reported) {
                            onToggleBlockUser(reported.id);
                            onResolveComplaint(comp.id);
                          }
                        }}
                        className="bg-rose-950/30 border border-rose-900 text-rose-400 px-2.5 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Ban size={10} />
                        <span>Заблокировать</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Growth mock charts info block */}
      <div className="mt-4 border-t border-zinc-900 pt-3 select-none">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Активность сети</h4>
        <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-900 flex justify-between items-center text-[10px] text-zinc-400 font-semibold">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Пинг Firestore: 14мс</span>
          </span>
          <span className="text-purple-400 uppercase font-black">АМУР ИИ СЕРВЕР: ONLINE</span>
        </div>
      </div>
    </div>
  );
}
