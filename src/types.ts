export interface UserProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  interests: string[];
  bio: string;
  avatar: string;
  gender: 'male' | 'female' | 'other';
  hearts: number;
  streak: number;
  lastLogin: string;
  online: boolean;
  compatibilities?: { [userId: string]: number };
  giftsReceived: { [giftId: string]: number };
  isBlocked?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  read: boolean;
  deleted?: boolean;
  replyToId?: string;
  mediaUrl?: string;
  reaction?: string;
}

export interface Match {
  id: string;
  users: [string, string];
  createdAt: number;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
  emoji: string;
  description: string;
}

export interface DailyTask {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  type: 'spin' | 'like' | 'chat' | 'gift' | 'streak';
}

export interface Complaint {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  timestamp: number;
  status: 'pending' | 'resolved';
}
