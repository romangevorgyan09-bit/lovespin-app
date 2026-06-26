import React, { useState, useEffect } from 'react';
import { UserProfile, Gift } from '../../types';
import { Heart, Send, Sparkles, Navigation, RotateCw, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { STATIC_GIFTS } from '../../data/mockUsers';

interface BottleScreenProps {
  userProfile: UserProfile;
  profiles: UserProfile[];
  onGiftSent: (partnerId: string, gift: Gift) => void;
  onDeductHearts: (amount: number) => void;
  onMatch: (partner: UserProfile, compatibilityScore: number) => void;
}

export default function BottleScreen({ userProfile, profiles, onGiftSent, onDeductHearts, onMatch }: BottleScreenProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [compatibility, setCompatibility] = useState<number | null>(null);
  const [compatibilityExplanation, setCompatibilityExplanation] = useState('');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const spinBottle = () => {
    if (spinning) return;

    setSpinning(true);
    setSelectedProfile(null);
    setCompatibility(null);

    // Dynamic rotation math for acceleration & deceleration feel
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 9 full spins
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (extraSpins * 360) + finalAngle;
    
    setRotation(totalRotation);

    // Audio sound tick simulation
    let tickCount = 0;
    const playTick = () => {
      if (soundEnabled) {
        // We can't play real audio easily without local assets, so we show visual pulse ticks!
      }
    };

    setTimeout(async () => {
      setSpinning(false);
      
      // Select a random profile that is not the user
      const validProfiles = profiles.filter(p => p.id !== userProfile.id);
      const randomProfile = validProfiles[Math.floor(Math.random() * validProfiles.length)];
      
      if (randomProfile) {
        setSelectedProfile(randomProfile);

        // Fetch deep AI Compatibility for the random profile!
        try {
          const res = await fetch('/api/ai/compatibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              myName: userProfile.name,
              myInterests: userProfile.interests,
              myBio: userProfile.bio,
              partnerName: randomProfile.name,
              partnerInterests: randomProfile.interests,
              partnerBio: randomProfile.bio
            })
          });
          const data = await res.json();
          setCompatibility(data.score);
          setCompatibilityExplanation(data.explanation);

          // If compatibility is very high, trigger an automatic match opportunity!
          if (data.score > 80) {
            onMatch(randomProfile, data.score);
          }
        } catch (err) {
          console.error("Error analyzing compatibility:", err);
          setCompatibility(75);
          setCompatibilityExplanation("У вас схожий возраст и общие интересы в общении!");
        }
      }
    }, 4000); // 4 seconds spin duration
  };

  const handleSendGift = (gift: Gift) => {
    if (!selectedProfile) return;

    if (userProfile.hearts < gift.cost) {
      setToastMessage('Недостаточно сердец ❤️ для этого подарка!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    onDeductHearts(gift.cost);
    onGiftSent(selectedProfile.id, gift);
    setShowGiftModal(false);
    setToastMessage(`Вы подарили подарок "${gift.name}" ${selectedProfile.name}! 🌹`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-5 select-none justify-between relative overflow-hidden">
      {/* Dynamic Amethyst Ambient Glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mt-2 z-10">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <span>Случайная встреча</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </h2>
          <p className="text-[10px] text-zinc-500 font-medium">Закрути судьбу и найди свою половинку!</p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 bg-zinc-900 border border-zinc-800/60 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="absolute top-18 left-4 right-4 bg-purple-950/95 border border-purple-800/40 text-purple-200 px-4 py-2.5 rounded-xl text-[10px] font-bold text-center shadow-2xl z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Main Spinning Arena */}
      {!selectedProfile ? (
        <div className="flex-1 flex flex-col items-center justify-center my-6 relative z-10">
          {/* Circular Board dial */}
          <div className="relative w-56 h-56 rounded-full border-2 border-dashed border-purple-900/20 bg-zinc-900/10 flex items-center justify-center">
            {/* Spinning Bottle Graphic */}
            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none'
              }}
              className="absolute w-12 h-36 flex items-center justify-center origin-center"
            >
              {/* Ultra-realistic Glass Bottle Graphic */}
              <div className="w-4 h-36 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 rounded-t-full rounded-b-xl border border-emerald-400/30 flex flex-col items-center justify-between py-2 relative shadow-2xl shadow-emerald-950/50">
                {/* Bottle Cap */}
                <div className="w-2.5 h-3 bg-yellow-600 rounded-t-sm" />
                {/* Bottle Label */}
                <div className="w-3 h-10 bg-yellow-50 border border-yellow-200 rounded-sm flex items-center justify-center">
                  <Heart className="w-1.5 h-1.5 text-purple-600 fill-purple-600" />
                </div>
                {/* Bottom weight */}
                <div className="w-3.5 h-2 bg-emerald-800 rounded-b-md" />
              </div>
            </div>

            {/* Core golden spin center button */}
            <button
              onClick={spinBottle}
              disabled={spinning}
              className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-fuchsia-600 border border-purple-500/40 rounded-full flex flex-col items-center justify-center shadow-lg shadow-purple-950/40 z-20 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              <RotateCw size={18} className={`text-white ${spinning ? 'animate-spin' : ''}`} />
              <span className="text-[8px] font-black tracking-wider text-white uppercase mt-1">SPIN</span>
            </button>
          </div>

          <p className="text-[10px] text-zinc-500 font-medium text-center mt-6 max-w-[180px]">
            {spinning ? 'Бутылочка вращается... Кто же это будет?' : 'Нажмите кнопку SPIN в центре, чтобы крутить бутылочку.'}
          </p>
        </div>
      ) : (
        /* Winner profile Display */
        <div className="flex-1 flex flex-col justify-center my-4 relative z-10 animate-fade-in select-none">
          <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
            {/* Top Close / Reset action */}
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-xs font-bold text-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              Сбросить
            </button>

            {/* Avatar & Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-fuchsia-500 shadow-lg shadow-purple-950/20">
                <img src={selectedProfile.avatar} alt="Dating profile" className="w-full h-full object-cover rounded-full bg-zinc-900" />
              </div>
              <h3 className="text-lg font-bold text-white mt-3">{selectedProfile.name}, {selectedProfile.age}</h3>
              <p className="text-xs text-zinc-500">{selectedProfile.city}</p>
            </div>

            {/* AI Compatibility score block */}
            {compatibility !== null ? (
              <div className="bg-purple-950/20 border border-purple-900/30 rounded-2xl p-4 my-4 flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5 text-purple-400 font-extrabold text-xs">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Совместимость: {compatibility}%</span>
                </div>
                <p className="text-[10px] text-zinc-300 mt-1.5 leading-relaxed font-medium">
                  {compatibilityExplanation}
                </p>
              </div>
            ) : (
              <div className="bg-zinc-950/40 rounded-2xl py-6 my-4 text-center text-[10px] text-zinc-500 animate-pulse font-medium">
                Рассчитываем искусственную совместимость...
              </div>
            )}

            {/* Interests of Winner */}
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {selectedProfile.interests.slice(0, 4).map(interest => (
                <span key={interest} className="text-[9px] bg-zinc-950 border border-zinc-900 text-zinc-400 px-2.5 py-1 rounded-md font-medium">
                  {interest}
                </span>
              ))}
            </div>

            {/* Interactive buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-900">
              <button
                onClick={() => setShowGiftModal(true)}
                className="bg-purple-950/50 hover:bg-purple-950/70 border border-purple-900/30 text-purple-400 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Отправить подарок</span>
              </button>
              <button
                onClick={spinBottle}
                className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Крутить снова</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gift Sending Popup Modal */}
      {showGiftModal && selectedProfile && (
        <div className="absolute inset-0 bg-zinc-950/95 z-50 flex flex-col justify-end p-5 animate-slide-up select-none">
          <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-3xl p-5 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-white">Выбери подарок для {selectedProfile.name}</h3>
              <button
                onClick={() => setShowGiftModal(false)}
                className="text-xs font-bold text-zinc-500 hover:text-white cursor-pointer"
              >
                Закрыть
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5 mb-5">
              {STATIC_GIFTS.map(gift => (
                <button
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="flex flex-col items-center bg-zinc-950/40 border border-zinc-900 hover:border-purple-600 hover:bg-purple-950/10 p-2 rounded-xl transition-all cursor-pointer"
                >
                  <span className="text-2xl select-none">{gift.emoji}</span>
                  <span className="text-[8px] text-zinc-400 mt-1 font-bold">{gift.name}</span>
                  <span className="text-[8px] text-purple-400 font-extrabold mt-0.5">{gift.cost} ❤️</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-[10px] text-zinc-500 font-medium">
                Твой текущий баланс: <strong className="text-purple-400">{userProfile.hearts} ❤️</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom hint info */}
      <div className="text-center py-2 select-none z-10 border-t border-zinc-900">
        <span className="text-[9px] text-zinc-600 font-mono">LoveSpin Алгоритм совместимости ИИ v2.5</span>
      </div>
    </div>
  );
}
