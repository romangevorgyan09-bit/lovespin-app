import React, { useState, useEffect } from 'react';
import { UserProfile, ChatMessage, Gift, Complaint } from '../types';
import { Wifi, Battery, Signal, ArrowLeft, Bot, Sparkles, MessageSquare, Heart, Gift as GiftIcon, Shield } from 'lucide-react';
import WelcomeScreen from './Screens/WelcomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import CardsScreen from './Screens/CardsScreen';
import BottleScreen from './Screens/BottleScreen';
import StoreScreen from './Screens/StoreScreen';
import ChatsScreen from './Screens/ChatsScreen';
import AdminScreen from './Screens/AdminScreen';

interface AndroidSimulatorProps {
  userProfile: UserProfile | null;
  profiles: UserProfile[];
  messages: ChatMessage[];
  complaints: Complaint[];
  onStartUser: (profile: Omit<UserProfile, 'id' | 'hearts' | 'streak' | 'lastLogin' | 'online' | 'giftsReceived'>) => void;
  onSendMessage: (receiverId: string, text: string, replyToId?: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onLikeUser: (partnerId: string) => void;
  onPassUser: (partnerId: string) => void;
  onMatchUser: (partner: UserProfile, compatibilityScore: number) => void;
  onGiftSent: (partnerId: string, gift: Gift) => void;
  onDeductHearts: (amount: number) => void;
  onAddHearts: (amount: number) => void;
  onClaimDaily: () => { success: boolean; reward: number; message: string } | null;
  onToggleBlockUser: (userId: string) => void;
  onResolveComplaint: (complaintId: string) => void;
}

type ActiveScreen = 'welcome' | 'cards' | 'spin' | 'gifts' | 'chats' | 'profile';

export default function AndroidSimulator({
  userProfile,
  profiles,
  messages,
  complaints,
  onStartUser,
  onSendMessage,
  onDeleteMessage,
  onLikeUser,
  onPassUser,
  onMatchUser,
  onGiftSent,
  onDeductHearts,
  onAddHearts,
  onClaimDaily,
  onToggleBlockUser,
  onResolveComplaint
}: AndroidSimulatorProps) {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('welcome');
  const [showAdmin, setShowAdmin] = useState(false);
  const [simClock, setSimClock] = useState('');
  const [incomingNotification, setIncomingNotification] = useState<{ title: string; body: string } | null>(null);

  // Synchronize clock to current local time in HH:MM format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSimClock(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulator incoming notification cue triggers
  const triggerNotification = (title: string, body: string) => {
    setIncomingNotification({ title, body });
    // Play virtual notification tone sound if wanted
    setTimeout(() => setIncomingNotification(null), 4500);
  };

  // Trigger interactive notification on screen loads
  useEffect(() => {
    if (userProfile && activeScreen === 'profile') {
      const timeout = setTimeout(() => {
        triggerNotification('Подарок получен! 🌹', 'Пользователь Алина отправила вам розу.');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [activeScreen, userProfile]);

  return (
    <div className="relative flex items-center justify-center select-none p-4 w-full">
      {/* Dynamic Background Amethyst Glowing Orb */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-600/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-fuchsia-600/5 rounded-full blur-[100px]" />

      {/* Hardware Frame Outer Bezel */}
      <div className="relative w-[365px] h-[740px] bg-zinc-900 border-4 border-zinc-800 rounded-[48px] shadow-2xl flex flex-col overflow-hidden ring-12 ring-zinc-950">
        
        {/* Hardware side physical volume buttons */}
        <div className="absolute top-28 -left-1 w-[4px] h-12 bg-zinc-700 rounded-r-md z-30" />
        <div className="absolute top-44 -left-1 w-[4px] h-12 bg-zinc-700 rounded-r-md z-30" />
        {/* Hardware side power button */}
        <div className="absolute top-36 -right-1 w-[4px] h-16 bg-zinc-700 rounded-l-md z-30" />

        {/* Dynamic Island / Notch centered */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5.5 bg-black rounded-full z-50 flex items-center justify-center border border-zinc-900/60 shadow-inner">
          <div className="w-3.5 h-3.5 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-blue-950 rounded-full" />
          </div>
        </div>

        {/* Dynamic Toast Notification Drawer */}
        {incomingNotification && (
          <div className="absolute top-11 inset-x-4 bg-zinc-950/95 border border-purple-900/30 p-3 rounded-2xl flex items-start gap-2.5 shadow-2xl z-50 animate-slide-down">
            <div className="p-1.5 bg-purple-950/60 text-purple-400 rounded-lg">
              <GiftIcon size={14} />
            </div>
            <div className="flex-1 overflow-hidden">
              <h5 className="text-[10px] font-bold text-white leading-normal truncate">{incomingNotification.title}</h5>
              <p className="text-[9px] text-zinc-400 leading-normal mt-0.5 truncate">{incomingNotification.body}</p>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="bg-zinc-950 h-9 flex items-center justify-between px-6 text-[10px] text-zinc-400 select-none z-40 border-b border-zinc-950 relative">
          <span className="font-extrabold text-white font-sans mt-0.5">{simClock}</span>
          <div className="flex items-center gap-1.5">
            <Signal size={12} className="stroke-[2.5]" />
            <span className="text-[8px] font-black uppercase tracking-wider text-purple-400">5G</span>
            <Wifi size={12} className="stroke-[2.5]" />
            <div className="flex items-center gap-1">
              <Battery size={13} className="rotate-0 stroke-[2.5]" />
              <span className="text-[8px] font-black">98%</span>
            </div>
          </div>
        </div>

        {/* Mobile Screen Body Viewer */}
        <div className="flex-1 overflow-hidden relative bg-zinc-950">
          {showAdmin ? (
            <AdminScreen
              profiles={profiles}
              complaints={complaints}
              onToggleBlockUser={onToggleBlockUser}
              onResolveComplaint={onResolveComplaint}
              onClose={() => setShowAdmin(false)}
            />
          ) : !userProfile ? (
            <WelcomeScreen
              onStart={(prof) => {
                onStartUser(prof);
                setActiveScreen('cards');
              }}
            />
          ) : (
            <>
              {activeScreen === 'cards' && (
                <CardsScreen
                  userProfile={userProfile}
                  profiles={profiles}
                  onLike={onLikeUser}
                  onPass={onPassUser}
                  onMatch={onMatchUser}
                />
              )}
              {activeScreen === 'spin' && (
                <BottleScreen
                  userProfile={userProfile}
                  profiles={profiles}
                  onGiftSent={onGiftSent}
                  onDeductHearts={onDeductHearts}
                  onMatch={onMatchUser}
                />
              )}
              {activeScreen === 'gifts' && (
                <StoreScreen
                  userProfile={userProfile}
                  onAddHearts={onAddHearts}
                />
              )}
              {activeScreen === 'chats' && (
                <ChatsScreen
                  userProfile={userProfile}
                  profiles={profiles}
                  messages={messages}
                  onSendMessage={onSendMessage}
                  onDeleteMessage={onDeleteMessage}
                />
              )}
              {activeScreen === 'profile' && (
                <ProfileScreen
                  user={userProfile}
                  onClaimDaily={onClaimDaily}
                  onToggleAdmin={() => setShowAdmin(true)}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom Smartphone Virtual Navigation Gestures Bar */}
        {userProfile && !showAdmin && (
          <div className="bg-zinc-950 border-t border-zinc-900/60 pb-1.5 pt-1 px-4 flex justify-between items-center z-40 select-none">
            <button
              onClick={() => setActiveScreen('cards')}
              className={`flex flex-col items-center flex-1 cursor-pointer transition-all ${
                activeScreen === 'cards' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <span className="text-sm select-none">🎴</span>
              <span className="text-[8px] font-bold mt-1 tracking-tight">Анкеты</span>
            </button>

            <button
              onClick={() => setActiveScreen('spin')}
              className={`flex flex-col items-center flex-1 cursor-pointer transition-all ${
                activeScreen === 'spin' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <span className="text-sm select-none">🍾</span>
              <span className="text-[8px] font-bold mt-1 tracking-tight">Бутылочка</span>
            </button>

            <button
              onClick={() => setActiveScreen('gifts')}
              className={`flex flex-col items-center flex-1 cursor-pointer transition-all ${
                activeScreen === 'gifts' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <span className="text-sm select-none">🎁</span>
              <span className="text-[8px] font-bold mt-1 tracking-tight">Магазин</span>
            </button>

            <button
              onClick={() => setActiveScreen('chats')}
              className={`flex flex-col items-center flex-1 cursor-pointer transition-all ${
                activeScreen === 'chats' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <span className="text-sm select-none">💬</span>
              <span className="text-[8px] font-bold mt-1 tracking-tight">Чаты</span>
            </button>

            <button
              onClick={() => setActiveScreen('profile')}
              className={`flex flex-col items-center flex-1 cursor-pointer transition-all ${
                activeScreen === 'profile' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <span className="text-sm select-none">👤</span>
              <span className="text-[8px] font-bold mt-1 tracking-tight">Кабинет</span>
            </button>
          </div>
        )}

        {/* Android Gesture Navigation Pill Indicator */}
        <div className="bg-zinc-950 h-5 flex items-center justify-center z-50">
          <div className="w-28 h-1 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}
