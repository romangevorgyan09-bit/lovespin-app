import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Heart, X, Star, Sparkles, MapPin, Zap } from 'lucide-react';

interface CardsScreenProps {
  userProfile: UserProfile;
  profiles: UserProfile[];
  onLike: (partnerId: string) => void;
  onPass: (partnerId: string) => void;
  onMatch: (partner: UserProfile, compatibilityScore: number) => void;
}

export default function CardsScreen({ userProfile, profiles, onLike, onPass, onMatch }: CardsScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<{ partner: UserProfile; score: number; explanation: string } | null>(null);

  const activeProfile = profiles[currentIndex];

  const handleAction = async (isLike: boolean) => {
    if (!activeProfile) return;

    if (isLike) {
      onLike(activeProfile.id);
      
      // Let's analyze compatibility on the server!
      setAnalyzing(true);
      try {
        const res = await fetch('/api/ai/compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            myName: userProfile.name,
            myInterests: userProfile.interests,
            myBio: userProfile.bio,
            partnerName: activeProfile.name,
            partnerInterests: activeProfile.interests,
            partnerBio: activeProfile.bio
          })
        });
        const data = await res.json();
        
        // Simulating matching criteria (e.g. high compatibility creates an instant match)
        if (data.score > 70) {
          setCurrentMatch({
            partner: activeProfile,
            score: data.score,
            explanation: data.explanation
          });
          onMatch(activeProfile, data.score);
        }
      } catch (err) {
        console.error("Error evaluating compatibility:", err);
      } finally {
        setAnalyzing(false);
      }
    } else {
      onPass(activeProfile.id);
    }

    // Go to next card
    setCurrentIndex(prev => prev + 1);
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-zinc-950 text-zinc-400 p-6 text-center select-none">
        <div className="p-4 bg-purple-950/30 rounded-full border border-purple-900/30 text-purple-400 mb-4 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-bold text-white">Вы просмотрели все анкеты!</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-[220px]">Попробуйте покрутить бутылочку в разделе "Случайная встреча" или зайдите позже.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 justify-between p-5 select-none relative overflow-hidden">
      {/* Compatibility Analyzing Overlay Loader */}
      {analyzing && (
        <div className="absolute inset-0 bg-zinc-950/90 z-40 flex flex-col items-center justify-center text-center p-6 select-none">
          <div className="relative flex items-center justify-center w-20 h-20 mb-4">
            <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-purple-500 rounded-full animate-spin" />
            <Heart className="w-8 h-8 text-purple-400 fill-purple-400/10 animate-pulse" />
          </div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-center">
            <span>Анализ совместимости ИИ</span>
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
          </h4>
          <p className="text-xs text-zinc-500 mt-1.5 max-w-[220px] leading-relaxed">Сканируем интересы, увлечения и тексты профилей через ИИ...</p>
        </div>
      )}

      {/* Match Overlay */}
      {currentMatch && (
        <div className="absolute inset-0 bg-zinc-950/95 z-50 flex flex-col justify-between p-6 text-center animate-fade-in select-none">
          <div className="mt-8">
            <div className="inline-flex px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              Взаимная симпатия!
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500">
              Это Мэтч! 💕
            </h1>
            <p className="text-xs text-zinc-400 mt-1">ИИ рассчитал вашу совместимость на высшем уровне</p>
          </div>

          <div className="flex flex-col items-center my-4">
            {/* Dual Profile Circle */}
            <div className="flex items-center justify-center -space-x-4 mb-5">
              <div className="w-18 h-18 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-fuchsia-500 shadow-xl shadow-purple-950/20">
                <img src={userProfile.avatar} alt="Me" className="w-full h-full object-cover rounded-full bg-zinc-950" />
              </div>
              <div className="w-18 h-18 rounded-full p-0.5 bg-gradient-to-tr from-fuchsia-500 to-pink-500 shadow-xl shadow-purple-950/20">
                <img src={currentMatch.partner.avatar} alt="Partner" className="w-full h-full object-cover rounded-full bg-zinc-950" />
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-2xl p-4 max-w-full">
              <div className="flex items-center justify-center gap-1 text-purple-400 font-black text-lg mb-1">
                <Zap className="w-4 h-4 fill-purple-400" />
                <span>{currentMatch.score}% совместимости</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">{currentMatch.explanation}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setCurrentMatch(null)}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Начать общение 💬
            </button>
            <button
              onClick={() => setCurrentMatch(null)}
              className="w-full bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white py-3 rounded-xl border border-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            >
              Продолжить свайпы
            </button>
          </div>
        </div>
      )}

      {/* Main Tinder Card */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden relative rounded-3xl bg-zinc-900/30 border border-zinc-800/40 shadow-2xl">
        {/* Profile Image with Gradient overlay */}
        <div className="relative w-full h-[70%] overflow-hidden">
          <img src={activeProfile.avatar} alt={activeProfile.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
          
          {/* Top Badges (Age & Online Status) */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            {activeProfile.online ? (
              <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800/40 px-2.5 py-1 rounded-full text-[9px] text-emerald-400 font-bold select-none">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>ОНЛАЙН</span>
              </div>
            ) : (
              <div className="bg-zinc-900/60 border border-zinc-800/40 px-2.5 py-1 rounded-full text-[9px] text-zinc-400 font-bold">
                ОФФЛАЙН
              </div>
            )}
            
            <div className="bg-purple-950/70 border border-purple-800/40 px-2.5 py-1 rounded-full text-[9px] text-purple-300 font-bold select-none">
              ИИ-Рекомендация
            </div>
          </div>
        </div>

        {/* Profile Info Details (Interests & Bio) */}
        <div className="p-4 flex-1 flex flex-col justify-end bg-gradient-to-b from-zinc-950/20 via-zinc-950/70 to-zinc-950/90 relative z-10 -mt-24">
          <h2 className="text-xl font-bold text-white flex items-baseline gap-2">
            <span>{activeProfile.name}, {activeProfile.age}</span>
            <span className="text-xs text-zinc-400 font-semibold">{activeProfile.city}</span>
          </h2>
          
          <p className="text-xs text-zinc-300 mt-2 line-clamp-2 leading-relaxed font-medium">
            {activeProfile.bio}
          </p>

          {/* Interests Icons */}
          <div className="flex flex-wrap gap-1 mt-3">
            {activeProfile.interests.slice(0, 3).map(interest => (
              <span key={interest} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-md font-medium">
                {interest}
              </span>
            ))}
            {activeProfile.interests.length > 3 && (
              <span className="text-[9px] text-purple-400 font-bold px-1.5 py-1">
                +{activeProfile.interests.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Pass, Superlike, Like */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => handleAction(false)}
          className="p-4 bg-zinc-900 hover:bg-zinc-850 text-rose-500 rounded-full border border-zinc-800 shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Пропустить"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <button
          onClick={() => handleAction(true)}
          className="p-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full shadow-lg shadow-purple-950/30 hover:scale-110 transition-all cursor-pointer"
          title="Понравилось!"
        >
          <Heart className="w-6 h-6 fill-white" />
        </button>
      </div>
    </div>
  );
}
