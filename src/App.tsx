import React, { useState, useEffect } from 'react';
import { UserProfile, ChatMessage, Gift, Complaint } from './types';
import { mockUsers as initialUsers, STATIC_GIFTS } from './data/mockUsers';
import AndroidSimulator from './components/AndroidSimulator';
import SourceCodeViewer from './components/SourceCodeViewer';
import { Sparkles, Compass, Heart, Award, Shield, Terminal, Download, FileText, CheckCircle, Smartphone } from 'lucide-react';

export default function App() {
  // Main app states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Hydrate states from Local Storage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('lovespin_user');
    const savedProfiles = localStorage.getItem('lovespin_profiles');
    const savedMessages = localStorage.getItem('lovespin_messages');
    const savedComplaints = localStorage.getItem('lovespin_complaints');

    if (savedUser) {
      setUserProfile(JSON.parse(savedUser));
    }
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      setProfiles(initialUsers);
    }
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Seed some starting messages to make the chats tab look lively
      const seedMessages: ChatMessage[] = [
        {
          id: 'seed_1',
          senderId: 'user_1', // Alina
          receiverId: 'current_user',
          text: 'Привет! Мне понравились твои интересы. Буду рада пообщаться! Как проводишь эту пятницу? 😊',
          timestamp: Date.now() - 3600000 * 2,
          read: true
        }
      ];
      setMessages(seedMessages);
    }
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    } else {
      const seedComplaints: Complaint[] = [
        {
          id: 'comp_1',
          reporterId: 'user_3',
          reportedId: 'user_4',
          reason: 'Пишет подозрительные ссылки на спам-каналы',
          timestamp: Date.now() - 3600000 * 12,
          status: 'pending'
        }
      ];
      setComplaints(seedComplaints);
    }
  }, []);

  // Save changes back to Local Storage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('lovespin_user', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('lovespin_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('lovespin_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (complaints.length > 0) {
      localStorage.setItem('lovespin_complaints', JSON.stringify(complaints));
    }
  }, [complaints]);

  // App logical handlers
  const handleStartUser = (newProfile: Omit<UserProfile, 'id' | 'hearts' | 'streak' | 'lastLogin' | 'online' | 'giftsReceived'>) => {
    const freshUser: UserProfile = {
      ...newProfile,
      id: 'current_user',
      hearts: 250, // Starting bonus
      streak: 3, // Initial mock streak
      lastLogin: new Date().toISOString().split('T')[0],
      online: true,
      giftsReceived: { rose: 1, bear: 0, fire_heart: 0, diamond: 0, crown: 0 }
    };
    setUserProfile(freshUser);
  };

  const handleSendMessage = (receiverId: string, text: string, replyToId?: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderId: 'current_user',
      receiverId,
      text,
      timestamp: Date.now(),
      read: true,
      replyToId
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate other user typing back after 3 seconds with a friendly reply!
    setTimeout(() => {
      const partner = profiles.find(p => p.id === receiverId);
      const partnerName = partner ? partner.name : 'Собеседник';
      const responseMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}_reply`,
        senderId: receiverId,
        receiverId: 'current_user',
        text: `Спасибо за теплое сообщение! Это так мило с твоей стороны. С удовольствием продолжу общение! 😊`,
        timestamp: Date.now(),
        read: false
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 3000);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, deleted: true } : m)
    );
  };

  const handleLikeUser = (partnerId: string) => {
    // Add to matches if needed, update state
  };

  const handlePassUser = (partnerId: string) => {
    // Standard pass tracking
  };

  const handleMatchUser = (partner: UserProfile, compatibilityScore: number) => {
    // Trigger on matches
  };

  const handleGiftSent = (partnerId: string, gift: Gift) => {
    // Add gift count to the target profile
    setProfiles(prev =>
      prev.map(p => {
        if (p.id === partnerId) {
          const gifts = { ...p.giftsReceived };
          gifts[gift.id] = (gifts[gift.id] || 0) + 1;
          return { ...p, giftsReceived: gifts };
        }
        return p;
      })
    );
  };

  const handleDeductHearts = (amount: number) => {
    if (!userProfile) return;
    setUserProfile(prev => prev ? { ...prev, hearts: Math.max(0, prev.hearts - amount) } : null);
  };

  const handleAddHearts = (amount: number) => {
    if (!userProfile) return;
    setUserProfile(prev => prev ? { ...prev, hearts: prev.hearts + amount } : null);
  };

  const handleClaimDaily = () => {
    if (!userProfile) return null;
    
    const todayStr = new Date().toISOString().split('T')[0];
    if (userProfile.lastLogin === todayStr && userProfile.hearts > 250) {
      // Already claimed today
      return null;
    }

    const reward = 50;
    setUserProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        hearts: prev.hearts + reward,
        streak: prev.streak + 1,
        lastLogin: todayStr
      };
    });

    return {
      success: true,
      reward,
      message: 'Бонус за активность успешно начислен!'
    };
  };

  const handleToggleBlockUser = (userId: string) => {
    setProfiles(prev =>
      prev.map(p => p.id === userId ? { ...p, isBlocked: !p.isBlocked } : p)
    );
  };

  const handleResolveComplaint = (complaintId: string) => {
    setComplaints(prev =>
      prev.map(c => c.id === complaintId ? { ...c, status: 'resolved' as const } : c)
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans selection:bg-purple-900 selection:text-white relative overflow-hidden">
      {/* Absolute futuristic ambient glow */}
      <div className="absolute top-[-10%] right-[-5%] w-120 h-120 bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-120 h-120 bg-fuchsia-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-5 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Android Smartphone Simulator representation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <AndroidSimulator
            userProfile={userProfile}
            profiles={profiles}
            messages={messages}
            complaints={complaints}
            onStartUser={handleStartUser}
            onSendMessage={handleSendMessage}
            onDeleteMessage={handleDeleteMessage}
            onLikeUser={handleLikeUser}
            onPassUser={handlePassUser}
            onMatchUser={handleMatchUser}
            onGiftSent={handleGiftSent}
            onDeductHearts={handleDeductHearts}
            onAddHearts={handleAddHearts}
            onClaimDaily={handleClaimDaily}
            onToggleBlockUser={handleToggleBlockUser}
            onResolveComplaint={handleResolveComplaint}
          />
        </div>

        {/* Right Side: Visual Specs Pitch, Firebase status, Source Explorer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main App branding intro */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-2xl text-white shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>LoveSpin Dating Core</span>
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                </h1>
                <p className="text-xs text-zinc-500 font-medium">Native Jetpack Compose Android Client & Firebase Backend</p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Добро пожаловать в LoveSpin — современное мобильное приложение знакомств на Android, созданное с использованием Material Design 3 и передовых игровых механик. 
              Интерактивная бутылочка, умные советы от ИИ, подарки за активность и синхронизированный Firebase Firestore бэкенд выведут ваши знакомства на совершенно новый уровень!
            </p>

            {/* Quick architectural spec tags */}
            <div className="flex flex-wrap gap-2 mt-4 select-none">
              <span className="text-[9px] bg-purple-950/40 border border-purple-900/30 text-purple-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Kotlin & Jetpack Compose
              </span>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Firebase Firestore & Auth
              </span>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Gemini 3.5 LLM Helper
              </span>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Material Design 3 (M3)
              </span>
            </div>
          </div>

          {/* Android Studio and Build Instructions card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4.5 flex items-start gap-3">
              <div className="p-2 bg-zinc-900 rounded-xl text-purple-400 border border-zinc-800">
                <Terminal className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Импорт в Android Studio</h4>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                  Проект полностью совместим с Android Studio Koala+. Откройте корневую папку <code className="text-purple-400 bg-purple-950/20 px-1 rounded">/android</code> для импорта Gradle.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4.5 flex items-start gap-3">
              <div className="p-2 bg-zinc-900 rounded-xl text-amber-400 border border-zinc-800">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Публикация в маркеты</h4>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                  Готов к сборке APK и AAB в меню <code className="text-amber-400 bg-amber-950/20 px-1 rounded">Build &gt; Generate Signed Bundle</code> для Google Play и RuStore.
                </p>
              </div>
            </div>
          </div>

          {/* Source Code Explorer Component */}
          <SourceCodeViewer />

        </div>
      </div>

      {/* Footer Branding */}
      <footer className="border-t border-zinc-900 py-6 mt-12 bg-zinc-950 select-none z-10 relative">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-purple-500 fill-purple-500" />
            <span className="text-xs font-bold text-white tracking-tight">LoveSpin Dating App Core © 2026</span>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">
            Спроектировано в строгом соответствии с нативными стандартами Android UI и Material Design 3.
          </p>
        </div>
      </footer>
    </div>
  );
}
