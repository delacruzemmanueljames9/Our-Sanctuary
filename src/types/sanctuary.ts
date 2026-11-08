export type SanctuaryUser = 'emman' | 'lei';

export type UserRole = 'super_admin' | 'beloved';

export interface Profile {
  id: SanctuaryUser;
  displayName: string;
  role: UserRole;
  avatarUrl: string;
  bio?: string;
  colorTheme: string;
}

export interface SanctuarySettings {
  id: string;
  relationshipStartDate: string;
  sanctuaryTitle: string;
  tagline: string;
  themeAccent: 'gold' | 'celestial_blue' | 'rose_quartz' | 'emerald';
  activeModules: {
    home: boolean;
    gallery: boolean;
    letters: boolean;
    garden: boolean;
    emotional: boolean;
    universe: boolean;
    journal: boolean;
    arcade: boolean;
    calendar: boolean;
    mochi: boolean;
  };
  ambientAudioEnabled: boolean;
}

export interface MemoryItem {
  id: string;
  albumId?: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  memoryDate: string;
  location?: string;
  tags: string[];
  isFavorite: boolean;
  uploadedBy: SanctuaryUser;
  createdAt: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  createdAt: string;
}

export interface Letter {
  id: string;
  sender: SanctuaryUser;
  recipient: SanctuaryUser;
  title: string;
  content: string;
  waxSeal: 'golden_heart' | 'celestial_rose' | 'starlight' | 'angel_wing';
  scheduledFor?: string | null;
  isRead: boolean;
  readAt?: string | null;
  isDraft: boolean;
  createdAt: string;
}

export interface GardenPlant {
  id: string;
  plantType: 'eternal_rose' | 'celestial_lily' | 'starlight_orchid' | 'moonlight_fern' | 'sunburst_flower';
  name: string;
  dedication?: string;
  growthStage: 1 | 2 | 3 | 4;
  plantedBy: SanctuaryUser;
  lastWatered: string;
  waterCount: number;
  positionX: number;
  positionZ: number;
  createdAt: string;
}

export interface EmotionalCheckin {
  id: string;
  author: SanctuaryUser;
  mood: 'peaceful' | 'joyful' | 'tired' | 'longing' | 'overwhelmed' | 'thoughtful';
  supportPreference?: 'listen' | 'comfort' | 'give_space' | 'talk_together' | 'sweet_treat';
  reflection?: string;
  isShared: boolean;
  createdAt: string;
}

export interface UniverseDream {
  id: string;
  title: string;
  description: string;
  category: 'bucket_list' | 'milestone' | 'future_trip' | 'date_idea';
  targetDate?: string;
  completed: boolean;
  completedAt?: string;
  starX: number;
  starY: number;
  starZ: number;
  createdBy: SanctuaryUser;
  createdAt: string;
}

export interface PrivateJournalEntry {
  id: string;
  author: SanctuaryUser;
  title: string;
  content: string;
  moodTag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  isRecurringAnnually: boolean;
  category: 'anniversary' | 'date_night' | 'special_trip' | 'milestone';
  createdBy: SanctuaryUser;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  targetPerson: SanctuaryUser;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  targetModule: string;
  details: Record<string, unknown>;
  ipHash?: string;
  createdAt: string;
}
