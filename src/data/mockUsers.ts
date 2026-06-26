import { UserProfile, Gift } from '../types';

export const STATIC_GIFTS: Gift[] = [
  { id: 'rose', name: 'Роза', icon: '🌹', cost: 10, emoji: '🌹', description: 'Символ нежной симпатии и романтики.' },
  { id: 'bear', name: 'Медвежонок', icon: '🧸', cost: 25, emoji: '🧸', description: 'Мягкий знак теплоты и заботы.' },
  { id: 'fire_heart', name: 'Горячее сердце', icon: '🔥', cost: 50, emoji: '🔥', description: 'Для тех, кто разжег в вас яркий огонь.' },
  { id: 'diamond', name: 'Алмаз', icon: '💎', cost: 100, emoji: '💎', description: 'Изысканный знак внимания высшей пробы.' },
  { id: 'crown', name: 'Корона', icon: '👑', cost: 250, emoji: '👑', description: 'Подарок для настоящего короля или королевы.' }
];

export const mockUsers: UserProfile[] = [
  {
    id: 'user_1',
    name: 'Алина',
    age: 23,
    city: 'Москва',
    interests: ['Дизайн', 'Фотография', 'Кофе', 'Путешествия', 'Технологии'],
    bio: 'Привет! Создаю интерфейсы, ловлю закаты на камеру и ищу человека, с которым можно разделить чашку идеального флэт уайта. Верю в искренность и ИИ ☕️✨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    gender: 'female',
    hearts: 150,
    streak: 3,
    lastLogin: '2026-06-25',
    online: true,
    giftsReceived: { rose: 5, bear: 2, fire_heart: 1 },
    compatibilities: { current_user: 88 }
  },
  {
    id: 'user_2',
    name: 'Дмитрий',
    age: 26,
    city: 'Санкт-Петербург',
    interests: ['Спорт', 'Рок-музыка', 'Книги', 'Кулинария', 'Настолки'],
    bio: 'Фитнес-тренер, который обожает читать классику под винил. Готов приготовить для тебя лучший стейк в твоей жизни или сыграть в партию "Каркассона" 🎲🎸',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    hearts: 80,
    streak: 1,
    lastLogin: '2026-06-26',
    online: true,
    giftsReceived: { rose: 0, bear: 1, diamond: 1 },
    compatibilities: { current_user: 95 }
  },
  {
    id: 'user_3',
    name: 'Екатерина',
    age: 21,
    city: 'Казань',
    interests: ['Искусство', 'Йога', 'Веганство', 'Кинематограф', 'Коты'],
    bio: 'Учусь на искусствоведа, практикую хатха-йогу и спасаю уличных котят. Ищу единомышленника для душевных бесед до утра под артхаусные фильмы 🌿🎬🐱',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    gender: 'female',
    hearts: 210,
    streak: 5,
    lastLogin: '2026-06-26',
    online: true,
    giftsReceived: { rose: 12, bear: 4, crown: 1 },
    compatibilities: { current_user: 72 }
  },
  {
    id: 'user_4',
    name: 'Артем',
    age: 28,
    city: 'Екатеринбург',
    interests: ['Программирование', 'Автомобили', 'Сноуборд', 'Киберспорт', 'Пицца'],
    bio: 'Android разработчик на Kotlin. Пишу чистый код, катаю по пухляку в Шерегеше и иногда зависаю в Dota 2. Ищу ту, которая поймет мои шутки про баги и фичи 💻🏂',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    hearts: 320,
    streak: 12,
    lastLogin: '2026-06-26',
    online: false,
    giftsReceived: { fire_heart: 3, crown: 2 },
    compatibilities: { current_user: 91 }
  },
  {
    id: 'user_5',
    name: 'Мария',
    age: 25,
    city: 'Сочи',
    interests: ['Танцы', 'Серфинг', 'Пляж', 'Электронная музыка', 'Татуировки'],
    bio: 'Жизнь слишком коротка, чтобы проводить её на диване! Танцую бачату, ловлю волны на доске и обожаю фестивали электронной музыки под открытым небом 🌊☀️💃',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    gender: 'female',
    hearts: 90,
    streak: 2,
    lastLogin: '2026-06-26',
    online: true,
    giftsReceived: { rose: 3, bear: 0 },
    compatibilities: { current_user: 84 }
  },
  {
    id: 'user_6',
    name: 'Михаил',
    age: 24,
    city: 'Новосибирск',
    interests: ['Астрономия', 'Походы', 'Гитара', 'Космос', 'Аниме'],
    bio: 'Смотрю на звёзды в телескоп, хожу в Алтайские горы с огромным рюкзаком и пою песни у костра. Ищу попутчицу для покорения новых вершин и наблюдения метеоритных дождей 🌌🏔️🎸',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    gender: 'male',
    hearts: 140,
    streak: 4,
    lastLogin: '2026-06-25',
    online: false,
    giftsReceived: { rose: 1, bear: 1 },
    compatibilities: { current_user: 78 }
  }
];
