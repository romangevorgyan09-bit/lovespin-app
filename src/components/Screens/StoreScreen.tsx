import React, { useState } from 'react';
import { UserProfile, Gift } from '../../types';
import { Heart, Sparkles, ShoppingBag, CheckCircle, Gift as GiftIcon, ArrowRight } from 'lucide-react';
import { STATIC_GIFTS } from '../../data/mockUsers';

interface StoreScreenProps {
  userProfile: UserProfile;
  onAddHearts: (amount: number) => void;
}

const STREAK_DAYS_CONFIG = [
  { day: 1, reward: 10, title: 'День 1' },
  { day: 2, reward: 20, title: 'День 2' },
  { day: 3, reward: 30, title: 'День 3' },
  { day: 4, reward: 50, title: 'День 4' },
  { day: 5, reward: 80, title: 'День 5' },
  { day: 6, reward: 100, title: 'День 6' },
  { day: 7, reward: 200, title: 'День 7 💎' }
];

export default function StoreScreen({ userProfile, onAddHearts }: StoreScreenProps) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(STATIC_GIFTS[0]);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const handleBuyHearts = (amount: number, costRub: number) => {
    onAddHearts(amount);
    setPurchaseStatus(`Успешно начислено: +${amount} ❤️!`);
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-5 overflow-y-auto select-none select-none relative">
      {/* Dynamic light accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-950/10 rounded-full blur-[75px] pointer-events-none" />

      {/* Header */}
      <div className="mt-2 mb-4 z-10">
        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
          <span>Магазин наград & Подарков</span>
          <ShoppingBag className="w-4 h-4 text-purple-400" />
        </h2>
        <p className="text-[10px] text-zinc-500 font-medium">Дари улыбки, покупай подарки и повышай уровень общения!</p>
      </div>

      {/* Float Notification Status */}
      {purchaseStatus && (
        <div className="p-2.5 bg-emerald-950/90 border border-emerald-850 text-emerald-400 rounded-xl text-[10px] font-bold text-center mb-4 animate-pulse">
          {purchaseStatus}
        </div>
      )}

      {/* Heart Balance Display Card */}
      <div className="bg-gradient-to-r from-purple-950/40 to-fuchsia-950/20 border border-purple-900/30 rounded-2xl p-4 mb-5 flex justify-between items-center relative overflow-hidden">
        <div>
          <span className="text-[9px] uppercase font-bold text-purple-300 tracking-wider">Твой Кошелек</span>
          <div className="text-2xl font-black text-purple-300 flex items-baseline gap-1 mt-1">
            <span>{userProfile.hearts}</span>
            <span className="text-xs">❤️</span>
          </div>
        </div>
        <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl animate-pulse">
          <Heart className="w-5 h-5 fill-purple-400/20" />
        </div>
      </div>

      {/* Streak Daily Attendance Bonus Checker */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2.5 flex items-center gap-1.5">
          <span>Календарь серии входа</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </h3>
        <div className="grid grid-cols-7 gap-1 bg-zinc-900/20 border border-zinc-900 rounded-xl p-2.5 overflow-x-auto">
          {STREAK_DAYS_CONFIG.map(d => {
            const isCompleted = userProfile.streak >= d.day;
            const isCurrent = userProfile.streak + 1 === d.day;
            return (
              <div
                key={d.day}
                className={`flex flex-col items-center justify-between p-1.5 rounded-lg border text-center transition-all ${
                  isCompleted
                    ? 'bg-purple-950/20 border-purple-500/30 text-purple-300'
                    : isCurrent
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200 ring-1 ring-purple-600/40'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                }`}
              >
                <span className="text-[8px] font-bold">{d.title}</span>
                {isCompleted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-purple-500 fill-purple-950 mt-1 mb-0.5" />
                ) : (
                  <span className="text-[9px] font-black mt-1 mb-0.5 text-purple-400">+{d.reward}</span>
                )}
                <span className="text-[8px] font-medium opacity-60">❤️</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gifts Library Showcase */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2.5">Доступные виртуальные подарки</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {STATIC_GIFTS.map(gift => (
            <button
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                selectedGift?.id === gift.id
                  ? 'bg-purple-950/30 border-purple-500 text-purple-300'
                  : 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800 text-zinc-400'
              }`}
            >
              <span className="text-3xl select-none">{gift.emoji}</span>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-zinc-200 truncate">{gift.name}</h4>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-purple-400 font-extrabold">
                  <span>{gift.cost} ❤️</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Gift Explanation detail panel */}
        {selectedGift && (
          <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-4 mt-3 flex items-start gap-3.5">
            <span className="text-4xl select-none">{selectedGift.emoji}</span>
            <div>
              <h4 className="text-xs font-bold text-white">{selectedGift.name}</h4>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{selectedGift.description}</p>
              <div className="mt-2 text-[10px] text-purple-400 font-semibold flex items-center gap-1 select-none">
                <GiftIcon size={11} />
                <span>Дарите этот подарок внутри диалога или бутылочки!</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recharge Wallet Store section */}
      <div className="mt-auto pt-4 border-t border-zinc-900">
        <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2.5">Пополнение баланса (Демо-Магазин)</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { hearts: 100, cost: 99 },
            { hearts: 300, cost: 249 },
            { hearts: 1000, cost: 699 }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleBuyHearts(item.hearts, item.cost)}
              className="bg-zinc-900 hover:bg-zinc-850 hover:border-purple-900/50 border border-zinc-800 rounded-xl p-2 flex flex-col items-center text-center cursor-pointer transition-all"
            >
              <span className="text-purple-400 text-xs font-black">+{item.hearts} ❤️</span>
              <span className="text-[9px] text-zinc-500 mt-1 font-bold">{item.cost} ₽</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
