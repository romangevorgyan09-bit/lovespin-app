import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Heart, Gift, Award, Calendar, ChevronRight, User, Settings, Shield } from 'lucide-react';
import { STATIC_GIFTS } from '../../data/mockUsers';

interface ProfileScreenProps {
  user: UserProfile;
  onClaimDaily: () => { success: boolean; reward: number; message: string } | null;
  onToggleAdmin: () => void;
}

export default function ProfileScreen({ user, onClaimDaily, onToggleAdmin }: ProfileScreenProps) {
  const [claimedStatus, setClaimedStatus] = useState<string | null>(null);

  const handleClaim = () => {
    const result = onClaimDaily();
    if (result) {
      setClaimedStatus(`Получено: +${result.reward} ❤️! ${result.message}`);
    } else {
      setClaimedStatus('Вы уже получили бонус сегодня! Возвращайтесь завтра 🌟');
    }
    setTimeout(() => setClaimedStatus(null), 4000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 p-5 overflow-y-auto select-none select-none relative">
      {/* Background radial soft light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-950/20 rounded-full blur-[70px] pointer-events-none" />

      {/* Top Profile Header */}
      <div className="flex flex-col items-center text-center mt-3 mb-6 relative z-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full bg-zinc-900" />
          </div>
          <div className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
        </div>
        <h2 className="text-xl font-bold mt-3 text-white flex items-center gap-1.5 justify-center">
          <span>{user.name}, {user.age}</span>
        </h2>
        <p className="text-xs text-zinc-500 font-medium">{user.city}</p>
      </div>

      {/* Stats Board: Hearts, Streak, Gifts */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Баланс сердец</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-purple-400">{user.hearts}</span>
            <span className="text-xs text-zinc-500 font-semibold">❤️</span>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Серия входа</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-400">{user.streak}</span>
            <span className="text-xs text-zinc-500 font-semibold">дн. 🔥</span>
          </div>
        </div>
      </div>

      {/* Daily Bonus Reward Action */}
      <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-4 mb-5 relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <div className="p-2.5 bg-purple-950/40 rounded-xl border border-purple-900/30 text-purple-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-zinc-200">Ежедневный бонус за активность!</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Получайте ❤️ Hearts за ежедневный вход в приложение для покупки подарков.</p>
          </div>
        </div>

        {claimedStatus && (
          <div className="mt-3 p-2 bg-purple-950/30 border border-purple-900/30 rounded-xl text-[10px] text-purple-300 font-medium text-center animate-pulse">
            {claimedStatus}
          </div>
        )}

        <button
          onClick={handleClaim}
          className="w-full mt-3 bg-zinc-900 hover:bg-zinc-850 text-white py-2.5 rounded-xl text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Забрать бонус дня</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Gifts Received Section */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2.5">Моя полка подарков</h3>
        <div className="grid grid-cols-5 gap-2 bg-zinc-900/20 border border-zinc-900 rounded-xl p-3">
          {STATIC_GIFTS.map(gift => {
            const count = user.giftsReceived[gift.id] || 0;
            return (
              <div key={gift.id} className="flex flex-col items-center p-1 relative">
                <span className="text-2xl select-none" title={gift.name}>{gift.emoji}</span>
                <span className="text-[9px] text-zinc-400 font-medium mt-1 truncate max-w-full">{gift.name}</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-zinc-950">
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interests Section */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2.5">Интересы</h3>
        <div className="flex flex-wrap gap-1.5">
          {user.interests.map(interest => (
            <span key={interest} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1.5 rounded-lg font-medium">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Bio Description */}
      <div className="mb-5 bg-zinc-900/20 border border-zinc-900 rounded-xl p-3.5">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">О себе</h4>
        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{user.bio}</p>
      </div>

      {/* Extra Action Buttons */}
      <div className="mt-auto pt-4 border-t border-zinc-900 flex flex-col gap-2">
        <button
          onClick={onToggleAdmin}
          className="w-full bg-purple-950/20 hover:bg-purple-950/30 text-purple-400 py-3 rounded-xl text-xs font-bold border border-purple-900/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Перейти в Админ-панель</span>
        </button>
      </div>
    </div>
  );
}
