import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../../types';
import { Sparkles, Send, Trash, Reply, Smile, ChevronLeft, Bot, MessageSquare, Zap, Eye, CheckCheck } from 'lucide-react';

interface ChatsScreenProps {
  userProfile: UserProfile;
  profiles: UserProfile[];
  messages: ChatMessage[];
  onSendMessage: (receiverId: string, text: string, replyToId?: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export default function ChatsScreen({ userProfile, profiles, messages, onSendMessage, onDeleteMessage }: ChatsScreenProps) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);
  
  // AI helpers state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiAdvisorAdvice, setAiAdvisorAdvice] = useState('');
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);

  // Chat window bottom scroll helper
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const selectedPartner = profiles.find(p => p.id === selectedPartnerId);

  // Filter messages for current active dialog
  const activeMessages = messages.filter(m => 
    selectedPartnerId && (
      (m.senderId === userProfile.id && m.receiverId === selectedPartnerId) ||
      (m.senderId === selectedPartnerId && m.receiverId === userProfile.id)
    )
  );

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, selectedPartnerId]);

  // Request Icebreakers from Gemini on the server!
  const fetchIcebreakers = async () => {
    if (!selectedPartner) return;
    setLoadingSuggestions(true);
    setAiSuggestions([]);
    try {
      const res = await fetch('/api/ai/first-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: selectedPartner.name,
          partnerInterests: selectedPartner.interests,
          partnerBio: selectedPartner.bio
        })
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
      setAiSuggestions([
        `Привет, ${selectedPartner.name}! Заметил(а), что ты увлекаешься ${selectedPartner.interests?.[0] || 'интересными вещами'}. Давай пообщаемся?`,
        `Привет! У тебя очень классный профиль. Расскажи подробнее про свои интересы! 😊`
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Request Advisor Conversation Tips from Gemini on the server!
  const fetchAdvisorTips = async () => {
    if (!selectedPartner) return;
    setLoadingAdvisor(true);
    setAiAdvisorAdvice('');
    setShowAiDrawer(true);
    try {
      const historyFormatted = activeMessages.slice(-5).map(m => ({
        role: m.senderId === userProfile.id ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyFormatted,
          userProfile: userProfile,
          partnerProfile: selectedPartner
        })
      });
      const data = await res.json();
      setAiAdvisorAdvice(data.reply);
    } catch (err) {
      console.error(err);
      setAiAdvisorAdvice('Будь вежливым, пиши развернутые интересные ответы и чаще задавай открытые вопросы!');
    } finally {
      setLoadingAdvisor(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || !selectedPartnerId) return;
    onSendMessage(selectedPartnerId, inputText.trim(), replyingToMessage?.id);
    setInputText('');
    setReplyingToMessage(null);
    setAiSuggestions([]); // Reset suggestions on message send
  };

  const useSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    setAiSuggestions([]);
  };

  // Chat Conversations List screen
  if (!selectedPartnerId) {
    const listProfiles = profiles.filter(p => p.id !== userProfile.id);
    return (
      <div className="flex flex-col h-full bg-zinc-950 p-5 overflow-y-auto select-none select-none">
        <div className="mt-2 mb-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <span>Мои Чаты & Диалоги</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </h2>
          <p className="text-[10px] text-zinc-500 font-medium">Общайтесь со своими взаимными совпадениями!</p>
        </div>

        <div className="flex flex-col gap-2.5">
          {listProfiles.map(p => {
            // Find last message
            const partnerMessages = messages.filter(m => 
              (m.senderId === userProfile.id && m.receiverId === p.id) ||
              (m.senderId === p.id && m.receiverId === userProfile.id)
            );
            const lastMsg = partnerMessages[partnerMessages.length - 1];

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPartnerId(p.id)}
                className="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-3.5 flex items-center gap-3.5 transition-all text-left cursor-pointer"
              >
                <div className="relative">
                  <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                  {p.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-white">{p.name}, {p.age}</h4>
                    <span className="text-[9px] text-zinc-500">
                      {p.online ? 'онлайн' : 'оффлайн'}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 truncate max-w-full font-medium">
                    {lastMsg ? (lastMsg.deleted ? 'Сообщение удалено' : lastMsg.text) : p.bio}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Chat Messenger Screen
  return (
    <div className="flex flex-col h-full bg-zinc-950 justify-between select-none relative overflow-hidden">
      {/* Dynamic Amethyst light glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-950/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Chat header panel */}
      <div className="bg-zinc-900/30 border-b border-zinc-900 px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedPartnerId(null);
              setReplyingToMessage(null);
              setAiSuggestions([]);
              setShowAiDrawer(false);
            }}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg cursor-pointer transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="relative">
            <img src={selectedPartner.avatar} alt={selectedPartner.name} className="w-9 h-9 rounded-full object-cover" />
            {selectedPartner.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-zinc-950 rounded-full" />
            )}
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-white leading-tight">{selectedPartner.name}</h4>
            <span className="text-[9px] text-zinc-500">
              {selectedPartner.online ? 'Активен(а) сейчас' : 'Был(а) недавно'}
            </span>
          </div>
        </div>

        {/* AI Action Hub */}
        <div className="flex gap-1.5">
          <button
            onClick={fetchIcebreakers}
            disabled={loadingSuggestions}
            className="p-2 bg-purple-950/40 hover:bg-purple-950/60 text-purple-400 rounded-xl border border-purple-900/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40"
            title="ИИ Первое сообщение"
          >
            <Bot size={13} />
            <span>ИИ Лед</span>
          </button>
          <button
            onClick={fetchAdvisorTips}
            className="p-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            title="ИИ Советник отношений"
          >
            <Zap size={13} className="text-amber-400 fill-amber-400/20" />
            <span>ИИ Совет</span>
          </button>
        </div>
      </div>

      {/* Floating AI Icebreakers popup panel */}
      {aiSuggestions.length > 0 && (
        <div className="absolute top-16 left-4 right-4 bg-purple-950/95 border border-purple-900/50 rounded-2xl p-4.5 z-30 shadow-2xl animate-fade-in select-none">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-black">
              <Bot size={14} />
              <span>ИИ Ледоколы (Icebreakers)</span>
            </div>
            <button
              onClick={() => setAiSuggestions([])}
              className="text-[10px] text-zinc-500 hover:text-white font-bold cursor-pointer"
            >
              Закрыть
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {aiSuggestions.map((item, i) => (
              <button
                key={i}
                onClick={() => useSuggestion(item)}
                className="text-left text-[10px] bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 p-2.5 rounded-xl font-medium leading-relaxed transition-all cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating AI Advisor Drawer */}
      {showAiDrawer && (
        <div className="absolute inset-x-0 bottom-0 top-[20%] bg-zinc-950/95 border-t border-purple-900/35 z-40 flex flex-col justify-between p-5 animate-slide-up select-none">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm">
              <Zap className="w-4 h-4 fill-purple-400" />
              <span>Советник отношений Амур ИИ</span>
            </div>
            <button
              onClick={() => setShowAiDrawer(false)}
              className="text-xs font-bold text-zinc-500 hover:text-white cursor-pointer"
            >
              Закрыть
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 pr-1">
            {loadingAdvisor ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-zinc-500 animate-pulse">
                <Bot size={24} className="text-purple-400 animate-bounce mb-2" />
                <span>Амур ИИ анализирует психологию диалога...</span>
              </div>
            ) : (
              <div className="bg-purple-950/10 border border-purple-900/20 rounded-2xl p-4">
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                  {aiAdvisorAdvice}
                </p>
                <div className="mt-3 text-[10px] text-zinc-500 leading-normal border-t border-zinc-900/60 pt-2.5">
                  Рекомендация основана на сравнении ваших интересов (<strong className="text-purple-400">{userProfile.interests.slice(0,2).join(', ')}</strong>) и партнера (<strong className="text-purple-400">{selectedPartner.interests.slice(0,2).join(', ')}</strong>).
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAiDrawer(false)}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
          >
            Вернуться к диалогу
          </button>
        </div>
      )}

      {/* Messages body list area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative max-h-[350px]">
        {activeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center my-auto py-16 text-zinc-500 select-none">
            <MessageSquare className="w-8 h-8 text-zinc-700 mb-2" />
            <h4 className="text-xs font-bold text-zinc-400">Начните диалог прямо сейчас!</h4>
            <p className="text-[10px] text-zinc-600 mt-1 max-w-[180px]">Нажмите кнопку "ИИ Лед" вверху для классного первого сообщения.</p>
          </div>
        ) : (
          activeMessages.map(msg => {
            const isMe = msg.senderId === userProfile.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'} relative group`}
              >
                {/* Replying indicator above bubble */}
                {msg.replyToId && (
                  <div className="text-[8px] text-zinc-500 flex items-center gap-1 mb-0.5 ml-1">
                    <Reply size={8} />
                    <span>В ответ на сообщение</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed transition-all relative ${
                    msg.deleted
                      ? 'bg-zinc-900/40 border border-zinc-900/60 text-zinc-600 italic rounded-tr-sm'
                      : isMe
                        ? 'bg-purple-600 text-white rounded-tr-sm rounded-br-2xl'
                        : 'bg-zinc-900 text-zinc-200 rounded-tl-sm rounded-bl-2xl'
                  }`}
                >
                  <span>{msg.deleted ? 'Сообщение было удалено' : msg.text}</span>
                  
                  {/* Status double checkmarks */}
                  {isMe && !msg.deleted && (
                    <span className="inline-flex ml-1.5 text-purple-200" title="Прочитано">
                      <CheckCheck size={11} strokeWidth={3} />
                    </span>
                  )}
                </div>

                {/* Action Controls (Trash, Reply) visible on hover/tap */}
                {!msg.deleted && (
                  <div className="flex gap-2.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setReplyingToMessage(msg)}
                      className="text-[9px] font-bold text-zinc-500 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      title="Ответить"
                    >
                      <Reply size={10} />
                      <span>Ответить</span>
                    </button>
                    {isMe && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="text-[9px] font-bold text-rose-500 hover:text-rose-400 flex items-center gap-0.5 cursor-pointer"
                        title="Удалить"
                      >
                        <Trash size={10} />
                        <span>Удалить</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Chat bottom typing input panel */}
      <div className="bg-zinc-900/20 border-t border-zinc-900 p-3 flex flex-col gap-2 relative z-10">
        {/* Reply Preview Header */}
        {replyingToMessage && (
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-1.5 flex justify-between items-center">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Reply size={10} className="text-purple-400" />
              <p className="text-[10px] text-zinc-400 truncate font-medium">
                Ответ для: <strong className="text-purple-400">{replyingToMessage.senderId === userProfile.id ? 'меня' : selectedPartner.name}</strong> — "{replyingToMessage.text}"
              </p>
            </div>
            <button
              onClick={() => setReplyingToMessage(null)}
              className="text-[9px] font-black text-zinc-500 hover:text-white cursor-pointer"
            >
              Отмена
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Напишите сообщение..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            maxLength={160}
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-purple-600 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-700 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
