import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Sparkles, Heart, MapPin, ArrowRight, Check } from 'lucide-react';

const INTERESTS_POOL = [
  'Дизайн', 'Фотография', 'Кофе', 'Путешествия', 'Технологии',
  'Спорт', 'Рок-музыка', 'Книги', 'Кулинария', 'Настолки',
  'Искусство', 'Йога', 'Кинематограф', 'Коты', 'Программирование',
  'Автомобили', 'Сноуборд', 'Киберспорт', 'Пицца', 'Серфинг', 'Танцы'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
];

interface WelcomeScreenProps {
  onStart: (profile: Omit<UserProfile, 'id' | 'hearts' | 'streak' | 'lastLogin' | 'online' | 'giftsReceived'>) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(22);
  const [city, setCity] = useState('Москва');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [bio, setBio] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 5 ? [...prev, interest] : prev
    );
  };

  const generateAIBio = async () => {
    setGeneratingBio(true);
    try {
      const response = await fetch('/api/ai/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, city, gender, interests: selectedInterests })
      });
      const data = await response.json();
      setBio(data.bio);
    } catch (error) {
      console.error('Error generating bio:', error);
      setBio(`Привет! Меня зовут ${name}, увлекаюсь ${selectedInterests.join(', ')}. Давай общаться!`);
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && selectedInterests.length < 2) return;
    
    if (step === 2) {
      generateAIBio();
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    onStart({
      name,
      age,
      city,
      gender,
      interests: selectedInterests,
      bio: bio || `Привет! Рад(а) знакомству. Увлекаюсь ${selectedInterests.join(', ')}.`,
      avatar: selectedAvatar
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 justify-between select-none relative overflow-hidden">
      {/* Dynamic Amethyst Ambient Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px]" />

      {step === 1 && (
        <div className="flex flex-col flex-1 justify-between p-6 z-10">
          <div className="text-center mt-8">
            <div className="inline-flex p-3 bg-purple-950/50 border border-purple-900/30 rounded-2xl mb-4 animate-bounce">
              <Heart className="w-8 h-8 text-purple-500 fill-purple-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">LoveSpin</h1>
            <p className="text-xs text-zinc-400 mt-1.5">Знакомства нового поколения: бутылочка, подарки и ИИ</p>
          </div>

          <div className="flex flex-col gap-4 bg-zinc-900/40 border border-zinc-800/40 p-5 rounded-2xl">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Как тебя зовут?</label>
              <input
                type="text"
                placeholder="Имя или никнейм"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={18}
                className="w-full mt-1.5 bg-zinc-950 border border-zinc-800 focus:border-purple-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Твой возраст</label>
                <select
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full mt-1.5 bg-zinc-950 border border-zinc-800 focus:border-purple-600 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                >
                  {Array.from({ length: 33 }, (_, i) => i + 18).map(v => (
                    <option key={v} value={v} className="bg-zinc-950">{v} лет</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Город</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full mt-1.5 bg-zinc-950 border border-zinc-800 focus:border-purple-600 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Твой пол</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {(['female', 'male', 'other'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs rounded-lg font-medium border transition-all cursor-pointer ${
                      gender === g
                        ? 'bg-purple-950/50 border-purple-500 text-purple-300'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-500'
                    }`}
                  >
                    {g === 'female' ? 'Девушка' : g === 'male' ? 'Парень' : 'Другой'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            disabled={!name.trim()}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Продолжить</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col flex-1 justify-between p-6 z-10 overflow-hidden">
          <div className="mt-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>Выбери интересы</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Выберите от 2 до 5 интересов, чтобы ИИ составил идеальное описание вашего профиля.</p>
          </div>

          <div className="flex-1 my-5 overflow-y-auto max-h-[280px] pr-1 flex flex-wrap gap-2 content-start select-none">
            {INTERESTS_POOL.map(interest => {
              const selected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-2 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                    selected
                      ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                      : 'bg-zinc-950/30 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
            <span className="text-xs text-zinc-500">
              Выбрано: <strong className="text-purple-400">{selectedInterests.length}/5</strong>
            </span>
            <button
              onClick={handleNextStep}
              disabled={selectedInterests.length < 2}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Далее</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col flex-1 justify-between p-6 z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>Выбери аватар</span>
              <Heart className="w-4 h-4 text-purple-400" />
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Твое главное фото профиля для первых знакомств.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            {PRESET_AVATARS.map((url, i) => {
              const isSelected = selectedAvatar === url;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-purple-500 scale-95 shadow-lg shadow-purple-950/30' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-purple-950/30 flex items-center justify-center">
                      <div className="bg-purple-500 p-1 rounded-full text-white">
                        <Check size={10} strokeWidth={4} />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Описание профиля от ИИ</label>
              {generatingBio && <span className="text-[10px] text-purple-400 animate-pulse">Генерируем...</span>}
            </div>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Здесь появится красивое описание вашего профиля..."
              className="w-full mt-1.5 h-24 bg-zinc-950 border border-zinc-800 focus:border-purple-600 rounded-xl px-3 py-2.5 text-xs text-zinc-300 placeholder-zinc-700 outline-none resize-none transition-all"
            />
            <button
              onClick={generateAIBio}
              disabled={generatingBio}
              className="mt-1.5 text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={10} />
              <span>Перегенерировать описание</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
          >
            <span>Впустить любовь! 💖</span>
          </button>
        </div>
      )}
    </div>
  );
}
