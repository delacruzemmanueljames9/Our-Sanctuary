// Master Data Store for Our Sanctuary
// Provides realistic initial sanctuary data & transparent offline/mock state
// Seamlessly delegates to Supabase when environment variables are supplied.

import {
  Profile,
  SanctuarySettings,
  MemoryItem,
  Album,
  Letter,
  GardenPlant,
  EmotionalCheckin,
  UniverseDream,
  PrivateJournalEntry,
  CalendarEvent,
  QuizQuestion,
  AdminAuditLog,
} from '@/types/sanctuary';

export interface SanctuaryDataState {
  settings: SanctuarySettings;
  profiles: Record<string, Profile>;
  albums: Album[];
  memories: MemoryItem[];
  letters: Letter[];
  gardenPlants: GardenPlant[];
  emotionalCheckins: EmotionalCheckin[];
  universeDreams: UniverseDream[];
  privateJournals: PrivateJournalEntry[];
  calendarEvents: CalendarEvent[];
  quizQuestions: QuizQuestion[];
  auditLogs: AdminAuditLog[];
}

const initialSettings: SanctuarySettings = {
  id: 'sanctuary',
  relationshipStartDate: '2023-01-01T00:00:00Z',
  sanctuaryTitle: 'Our Sanctuary',
  tagline: 'A Celestial Haven for Emman & Lei',
  themeAccent: 'gold',
  activeModules: {
    home: true,
    gallery: true,
    letters: true,
    garden: true,
    emotional: true,
    universe: true,
    journal: true,
    arcade: true,
    calendar: true,
    mochi: true,
  },
  ambientAudioEnabled: true,
};

const initialProfiles: Record<string, Profile> = {
  emman: {
    id: 'emman',
    displayName: 'Emman',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Guardian of the Sanctuary • Building our world star by star',
    colorTheme: '#D4AF37',
  },
  lei: {
    id: 'lei',
    displayName: 'Lei',
    role: 'beloved',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'The Heart of the Sanctuary • Guiding light and endless joy',
    colorTheme: '#FFB7C5',
  },
};

const initialAlbums: Album[] = [
  {
    id: 'album-1',
    title: 'First Adventures & Sunsets',
    description: 'The golden moments that shaped the foundation of our journey together.',
    coverUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-02-14T10:00:00Z',
  },
  {
    id: 'album-2',
    title: 'Cafe Talks & Midnight Drives',
    description: 'Long conversations, quiet glances, and laughter in the car under city lights.',
    coverUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-06-20T18:30:00Z',
  },
  {
    id: 'album-3',
    title: 'Celestial Milestones',
    description: 'Celebrations, anniversaries, and promises made under the open sky.',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const initialMemories: MemoryItem[] = [
  {
    id: 'mem-1',
    albumId: 'album-1',
    title: "Judy's Place",
    description: "From that day at Judy's... everything changed. 💜",
    mediaUrl: 'https://image2url.com/r2/default/images/1772452296568-066f9cb0-97a8-4334-8cf7-a5e0610b8c91.jpg',
    mediaType: 'image',
    memoryDate: '2023-02-14',
    location: "Judy's",
    tags: ['First Chapter', 'Beginning', 'Special Moment'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-02-14T10:00:00Z',
  },
  {
    id: 'mem-2',
    albumId: 'album-1',
    title: 'First JS Prom',
    description: 'Our first JS Prom — the rhythm of our hearts together. 💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772452426364-0defc4cc-39d6-46b4-904c-73804a9c1f05.jpeg',
    mediaType: 'image',
    memoryDate: '2023-03-04',
    location: 'JS Prom Ball',
    tags: ['JS Prom', 'Dance', 'Hearts Together'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-03-04T18:00:00Z',
  },
  {
    id: 'mem-3',
    albumId: 'album-1',
    title: 'Our First Date',
    description: 'Our first date — the start of our forever. 💍✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772452839431-00fbd3a2-c32e-4638-b861-7b9af905983a.png',
    mediaType: 'image',
    memoryDate: '2023-04-15',
    location: 'Our Special Spot',
    tags: ['First Date', 'Forever', 'Love'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-04-15T14:00:00Z',
  },
  {
    id: 'mem-4',
    albumId: 'album-1',
    title: 'A Sealed Promise',
    description: 'That kiss sealed every promise we made. 💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772453355444-41bdd217-b4df-460c-a27a-104a85180195.jpg',
    mediaType: 'image',
    memoryDate: '2023-05-20',
    location: 'Under The Starlight',
    tags: ['Promises', 'Kiss', 'Sacred'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-05-20T20:00:00Z',
  },
  {
    id: 'mem-5',
    albumId: 'album-2',
    title: 'Simple Moment',
    description: 'In this simple moment together, I found my forever.',
    mediaUrl: 'https://image2url.com/r2/default/images/1772504833109-fb9b049c-a9c5-4b06-be98-1e616f7ae162.jpg',
    mediaType: 'image',
    memoryDate: '2023-06-12',
    location: 'Quiet Moments',
    tags: ['Forever', 'Simplicity', 'Peace'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-06-12T16:00:00Z',
  },
  {
    id: 'mem-6',
    albumId: 'album-2',
    title: 'Melody of Laughter',
    description: 'Your laughter that day was the melody my heart still dances to. 💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772507925212-ffa5231a-19c4-4efb-a758-b358525f16d3.jpg',
    mediaType: 'image',
    memoryDate: '2023-07-22',
    location: 'Sweet Afternoon',
    tags: ['Laughter', 'Joy', 'Melody'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-07-22T15:30:00Z',
  },
  {
    id: 'mem-7',
    albumId: 'album-2',
    title: 'A Forever Promise',
    description: "Every 'I love you' we share is a promise I'll keep forever. 💛✨",
    mediaUrl: 'https://image2url.com/r2/default/images/1772505257752-7c4f65be-ac06-4d30-bdd4-7dd19356ab2f.jpeg',
    mediaType: 'image',
    memoryDate: '2023-08-30',
    location: 'Every Moment',
    tags: ['I Love You', 'Devotion', 'Golden'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-08-30T17:00:00Z',
  },
  {
    id: 'mem-8',
    albumId: 'album-2',
    title: 'Meeting Family',
    description: "That day wasn't just about meeting family — it was about opening my world to you. 💜✨",
    mediaUrl: 'https://image2url.com/r2/default/images/1772505386436-c5683dec-7147-4075-989d-9ab32f45ea97.jpg',
    mediaType: 'image',
    memoryDate: '2023-09-18',
    location: 'Family Home',
    tags: ['Family', 'Home', 'Belonging'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-09-18T13:00:00Z',
  },
  {
    id: 'mem-9',
    albumId: 'album-2',
    title: 'On The Way Home',
    description: 'On the way home, my heart was full — because you were already part of my family. 💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772505578552-1ed3578e-adb0-4e43-8a20-0fdf330ef831.jpg',
    mediaType: 'image',
    memoryDate: '2023-09-18',
    location: 'Road Home',
    tags: ['Journey', 'Family', 'Full Heart'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-09-18T19:00:00Z',
  },
  {
    id: 'mem-10',
    albumId: 'album-2',
    title: 'Toast to Memories',
    description: "Every sip was more than joy — it was a toast to the countless memories we've made together. 💜",
    mediaUrl: 'https://image2url.com/r2/default/images/1772505726196-967c09f9-4317-447a-a971-544a2d380d1a.jpg',
    mediaType: 'image',
    memoryDate: '2023-10-25',
    location: 'Cozy Cafe',
    tags: ['Toast', 'Joy', 'Memories'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-10-25T16:45:00Z',
  },
  {
    id: 'mem-11',
    albumId: 'album-3',
    title: 'Celebration of Us',
    description: 'Dressed in joy and love, that night was a celebration of us. 💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772505987509-9008f8d0-25b8-46db-a356-ac7392ce6315.blob',
    mediaType: 'image',
    memoryDate: '2023-11-15',
    location: 'Grand Evening',
    tags: ['Celebration', 'Love', 'Elegance'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-11-15T21:00:00Z',
  },
  {
    id: 'mem-12',
    albumId: 'album-3',
    title: 'Shared Journey',
    description: 'Every medal and certificate means more because I shared the journey with you. 🎓💜',
    mediaUrl: 'https://image2url.com/r2/default/images/1772506337655-9b972cb4-84a6-4383-8e6c-9d93520d1cf2.jpg',
    mediaType: 'image',
    memoryDate: '2023-12-05',
    location: 'Academy Hall',
    tags: ['Milestones', 'Honor', 'Journey'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2023-12-05T15:00:00Z',
  },
  {
    id: 'mem-13',
    albumId: 'album-3',
    title: 'By The Shore',
    description: 'By the shore, with the waves as our witness, love is our forever horizon. 🌊💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772506558227-a171ec74-c3fc-4ca5-9af1-3b18b6ff60f9.jpg',
    mediaType: 'image',
    memoryDate: '2024-01-10',
    location: 'Ocean Shore',
    tags: ['Waves', 'Shore', 'Horizon'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2024-01-10T17:30:00Z',
  },
  {
    id: 'mem-14',
    albumId: 'album-3',
    title: 'Side by Side',
    description: 'Side by side, every achievement feels brighter because of you. 💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772506695799-cb90d49c-a821-44bb-b9b3-08081605f9f8.blob',
    mediaType: 'image',
    memoryDate: '2024-02-18',
    location: 'Ceremony Stage',
    tags: ['Achievement', 'Side by Side', 'Pride'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2024-02-18T14:00:00Z',
  },
  {
    id: 'mem-15',
    albumId: 'album-3',
    title: 'Grad Ball Lights',
    description: 'Under the lights of Grad Ball, every dance step felt like a promise. 💜✨',
    mediaUrl: 'https://image2url.com/r2/default/images/1772506881171-82876548-c926-4d09-af8f-388d95bd8540.jpg',
    mediaType: 'image',
    memoryDate: '2024-03-22',
    location: 'Graduation Ballroom',
    tags: ['Grad Ball', 'Dancing', 'Lights'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2024-03-22T21:30:00Z',
  },
  {
    id: 'mem-16',
    albumId: 'album-3',
    title: 'Graduation Day',
    description: 'Graduation Day! 💜🎓',
    mediaUrl: 'https://image2url.com/r2/default/images/1772417979098-57fb8ef8-cf07-4b8e-b5ba-adcc7e8a63a1.jpg',
    mediaType: 'image',
    memoryDate: '2024-04-05',
    location: 'Graduation Grounds',
    tags: ['Graduation', 'Milestone', 'Forever'],
    isFavorite: true,
    uploadedBy: 'emman',
    createdAt: '2024-04-05T11:00:00Z',
  },
];

const initialLetters: Letter[] = [
  {
    id: 'letter-1',
    sender: 'emman',
    recipient: 'lei',
    title: 'To My Safe Harbor In Every Storm',
    content: `My dearest Lei,\n\nWhen the world gets loud and demanding, you are the calm rhythm that centers my soul. Building this sanctuary for you isn’t just about code or 3D spaces—it is my way of giving our love a physical home that will never fade, no matter how many years pass.\n\nThank you for choosing me every day, for your patience, your smile that melts away any stress, and the genuine joy you bring into my life. The Angel Knight stands at the gate because what we have here is sacred to me.\n\nForever yours,\nEmman`,
    waxSeal: 'golden_heart',
    isRead: true,
    readAt: '2024-01-01T12:00:00Z',
    isDraft: false,
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'letter-2',
    sender: 'lei',
    recipient: 'emman',
    title: 'You Are My Favorite Part of Every Day',
    content: `Emman,\n\nI don’t tell you enough how much I appreciate the way you look out for me. Even in the little things—the way you remember how I like my drinks, the way you listen when I overthink, and the steady confidence you give me.\n\nI love our sanctuary. Let’s keep filling these rooms with stories, laughter, and all our future dreams.\n\nAll my love,\nLei`,
    waxSeal: 'celestial_rose',
    isRead: false,
    isDraft: false,
    createdAt: '2024-02-14T09:30:00Z',
  },
];

const initialPlants: GardenPlant[] = [
  {
    id: 'plant-1',
    plantType: 'eternal_rose',
    name: 'Rose of First Spark',
    dedication: 'Planted on the day we realized we were meant for each other.',
    growthStage: 4,
    plantedBy: 'emman',
    lastWatered: new Date().toISOString(),
    waterCount: 42,
    positionX: -2.5,
    positionZ: 1.2,
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'plant-2',
    plantType: 'celestial_lily',
    name: 'Lei’s Starlight Lily',
    dedication: 'Glows whenever Lei smiles.',
    growthStage: 3,
    plantedBy: 'lei',
    lastWatered: new Date().toISOString(),
    waterCount: 28,
    positionX: 1.8,
    positionZ: -1.5,
    createdAt: '2023-04-20T00:00:00Z',
  },
  {
    id: 'plant-3',
    plantType: 'starlight_orchid',
    name: 'Sanctuary Guardian Orchid',
    dedication: 'Fed by starlight and mutual trust.',
    growthStage: 2,
    plantedBy: 'emman',
    lastWatered: new Date().toISOString(),
    waterCount: 15,
    positionX: 0.0,
    positionZ: 3.0,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const initialEmotionalCheckins: EmotionalCheckin[] = [
  {
    id: 'checkin-1',
    author: 'lei',
    mood: 'peaceful',
    supportPreference: 'talk_together',
    reflection: 'Felt very grateful today looking back at old photos. Everything feels right in the world.',
    isShared: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'checkin-2',
    author: 'emman',
    mood: 'joyful',
    supportPreference: 'comfort',
    reflection: 'Excited about the projects and trips we are planning. Seeing your smile gives me so much energy.',
    isShared: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const initialUniverseDreams: UniverseDream[] = [
  {
    id: 'dream-1',
    title: 'Northern Lights Expedition',
    description: 'Watch the aurora borealis dancing across the sky from a heated glass igloo, wrapped in blankets.',
    category: 'future_trip',
    targetDate: '2027-12-20',
    completed: false,
    starX: -35,
    starY: 25,
    starZ: -40,
    createdBy: 'lei',
    createdAt: '2023-02-01T00:00:00Z',
  },
  {
    id: 'dream-2',
    title: 'Our Own Cozy Cottage with a Greenhouse',
    description: 'A quiet place filled with natural light, blooming plants, a big bookshelf, and plenty of room for morning coffee.',
    category: 'bucket_list',
    targetDate: '2028-06-01',
    completed: false,
    starX: 42,
    starY: 18,
    starZ: -50,
    createdBy: 'emman',
    createdAt: '2023-03-15T00:00:00Z',
  },
  {
    id: 'dream-3',
    title: 'Sunset Gondola in Venice',
    description: 'Drifting down quiet canals with classical accordion music playing in the distance.',
    category: 'future_trip',
    targetDate: '2026-10-15',
    completed: false,
    starX: 12,
    starY: 45,
    starZ: -30,
    createdBy: 'lei',
    createdAt: '2023-07-22T00:00:00Z',
  },
];

const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Our First Official Anniversary',
    description: 'The day our story officially began.',
    eventDate: '2024-01-01T00:00:00Z',
    isRecurringAnnually: true,
    category: 'anniversary',
    createdBy: 'emman',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'event-2',
    title: 'Sanctuary Starlight Date Night',
    description: 'Candlelight dinner, dessert, and watching our favorite studio movie.',
    eventDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    isRecurringAnnually: false,
    category: 'date_night',
    createdBy: 'emman',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event-3',
    title: 'Lei’s Special Birthday Celebration',
    description: 'A day dedicated completely to celebrating the most wonderful person in the world.',
    eventDate: '2027-09-15T00:00:00Z',
    isRecurringAnnually: true,
    category: 'milestone',
    createdBy: 'emman',
    createdAt: '2023-09-15T00:00:00Z',
  },
];

const initialQuizQuestions: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'Where did we take our very first photo together?',
    options: ['At the seaside coffee shop', 'In the park by the fountain', 'In the car during rain', 'At the cinema lobby'],
    correctOptionIndex: 0,
    explanation: 'We ordered iced lattes and couldn’t stop smiling for the camera!',
    targetPerson: 'lei',
  },
  {
    id: 'q-2',
    question: 'What is Emman’s ultimate comfort food when he’s tired?',
    options: ['Spicy ramen with extra egg', 'Crispy chicken tenders and fries', 'Warm beef stew and rice', 'Classic pepperoni pizza'],
    correctOptionIndex: 0,
    explanation: 'A hot bowl of ramen fixes everything every single time.',
    targetPerson: 'emman',
  },
  {
    id: 'q-3',
    question: 'What song immediately reminds us of our late night drives?',
    options: ['Golden Hour - JVKE', 'Until I Found You - Stephen Sanchez', 'Die With A Smile - Bruno Mars & Lady Gaga', 'Lover - Taylor Swift'],
    correctOptionIndex: 1,
    explanation: 'We played it on repeat as the city lights blurred past the window.',
    targetPerson: 'lei',
  },
];

const initialJournals: PrivateJournalEntry[] = [
  {
    id: 'journal-emman-1',
    author: 'emman',
    title: 'Why I Created Our Sanctuary',
    content: 'Building this world for Lei is one of the most rewarding things I have ever tackled. I want her to know she will always have a safe space where she is cherished and heard.',
    moodTag: 'Grateful & Inspired',
    createdAt: '2024-01-02T14:00:00Z',
    updatedAt: '2024-01-02T14:00:00Z',
  },
  {
    id: 'journal-lei-1',
    author: 'lei',
    title: 'Quiet Reflections on Growth',
    content: 'I was thinking about how much calmer my mind feels now. Having someone who truly listens makes all the difference in the world.',
    moodTag: 'Peaceful',
    createdAt: '2024-01-03T16:30:00Z',
    updatedAt: '2024-01-03T16:30:00Z',
  },
];

const initialAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-1',
    action: 'SANCTUARY_INITIALIZED',
    targetModule: 'System',
    details: { message: 'Sanctuary core systems and celestial realm initialized.' },
    createdAt: new Date().toISOString(),
  },
];

// Singleton in-memory state
class SanctuaryStore {
  private state: SanctuaryDataState;

  constructor() {
    this.state = {
      settings: initialSettings,
      profiles: initialProfiles,
      albums: initialAlbums,
      memories: initialMemories,
      letters: initialLetters,
      gardenPlants: initialPlants,
      emotionalCheckins: initialEmotionalCheckins,
      universeDreams: initialUniverseDreams,
      privateJournals: initialJournals,
      calendarEvents: initialCalendarEvents,
      quizQuestions: initialQuizQuestions,
      auditLogs: initialAuditLogs,
    };
  }

  // Getters
  getSettings() { return this.state.settings; }
  updateSettings(newSettings: Partial<SanctuarySettings>) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.logAction('UPDATE_SETTINGS', 'Settings', newSettings);
    return this.state.settings;
  }

  getProfiles() { return this.state.profiles; }

  getAlbums() { return this.state.albums; }
  createAlbum(album: Omit<Album, 'id' | 'createdAt'>) {
    const newAlbum: Album = {
      ...album,
      id: `album-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.albums.unshift(newAlbum);
    this.logAction('CREATE_ALBUM', 'Gallery', { id: newAlbum.id, title: newAlbum.title });
    return newAlbum;
  }

  getMemories() { return this.state.memories; }
  addMemory(memory: Omit<MemoryItem, 'id' | 'createdAt'>) {
    const newMem: MemoryItem = {
      ...memory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.memories.unshift(newMem);
    this.logAction('ADD_MEMORY', 'Gallery', { id: newMem.id, title: newMem.title });
    return newMem;
  }
  deleteMemory(id: string) {
    this.state.memories = this.state.memories.filter(m => m.id !== id);
    this.logAction('DELETE_MEMORY', 'Gallery', { id });
    return true;
  }

  getLetters(forUser?: 'emman' | 'lei') {
    if (!forUser) return this.state.letters;
    return this.state.letters.filter(
      l => (l.recipient === forUser || l.sender === forUser) && !l.isDraft
    );
  }
  sendLetter(letter: Omit<Letter, 'id' | 'createdAt' | 'isRead'>) {
    const newLetter: Letter = {
      ...letter,
      id: `letter-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.state.letters.unshift(newLetter);
    this.logAction('SEND_LETTER', 'Letters', { id: newLetter.id, recipient: newLetter.recipient });
    return newLetter;
  }
  markLetterAsRead(id: string) {
    const letter = this.state.letters.find(l => l.id === id);
    if (letter) {
      letter.isRead = true;
      letter.readAt = new Date().toISOString();
    }
    return letter;
  }

  getGardenPlants() { return this.state.gardenPlants; }
  plantFlower(plant: Omit<GardenPlant, 'id' | 'createdAt' | 'lastWatered' | 'waterCount' | 'growthStage'>) {
    const newPlant: GardenPlant = {
      ...plant,
      id: `plant-${Date.now()}`,
      growthStage: 1,
      waterCount: 1,
      lastWatered: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.state.gardenPlants.push(newPlant);
    return newPlant;
  }
  waterPlant(id: string) {
    const plant = this.state.gardenPlants.find(p => p.id === id);
    if (plant) {
      plant.waterCount += 1;
      plant.lastWatered = new Date().toISOString();
      if (plant.waterCount >= 10 && plant.growthStage < 4) {
        plant.growthStage = (plant.growthStage + 1) as 1 | 2 | 3 | 4;
      }
    }
    return plant;
  }

  getEmotionalCheckins() { return this.state.emotionalCheckins; }
  addEmotionalCheckin(checkin: Omit<EmotionalCheckin, 'id' | 'createdAt'>) {
    const newCheckin: EmotionalCheckin = {
      ...checkin,
      id: `checkin-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.emotionalCheckins.unshift(newCheckin);
    return newCheckin;
  }

  getUniverseDreams() { return this.state.universeDreams; }
  addUniverseDream(dream: Omit<UniverseDream, 'id' | 'createdAt' | 'completed'>) {
    const newDream: UniverseDream = {
      ...dream,
      id: `dream-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.state.universeDreams.unshift(newDream);
    return newDream;
  }
  toggleDreamCompleted(id: string) {
    const dream = this.state.universeDreams.find(d => d.id === id);
    if (dream) {
      dream.completed = !dream.completed;
      dream.completedAt = dream.completed ? new Date().toISOString() : undefined;
    }
    return dream;
  }

  // Private Journals: strictly isolated by author
  private journalPins: Record<'emman' | 'lei', string | null> = {
    emman: null,
    lei: null,
  };

  getJournalPin(user: 'emman' | 'lei'): string | null {
    return this.journalPins[user] || null;
  }
  setJournalPin(user: 'emman' | 'lei', pin: string): void {
    this.journalPins[user] = pin;
    this.logAction('SET_JOURNAL_PIN', 'Journal', { user });
  }
  hasJournalPin(user: 'emman' | 'lei'): boolean {
    return Boolean(this.journalPins[user]);
  }

  getPrivateJournal(author: 'emman' | 'lei') {
    return this.state.privateJournals.filter(j => j.author === author);
  }
  addPrivateJournalEntry(entry: Omit<PrivateJournalEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const newEntry: PrivateJournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.privateJournals.unshift(newEntry);
    return newEntry;
  }
  deletePrivateJournalEntry(id: string, author: 'emman' | 'lei') {
    this.state.privateJournals = this.state.privateJournals.filter(
      j => !(j.id === id && j.author === author)
    );
    return true;
  }

  getCalendarEvents() { return this.state.calendarEvents; }
  addCalendarEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>) {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.calendarEvents.push(newEvent);
    this.logAction('ADD_CALENDAR_EVENT', 'Calendar', { id: newEvent.id, title: newEvent.title });
    return newEvent;
  }

  getQuizQuestions() { return this.state.quizQuestions; }
  addQuizQuestion(q: Omit<QuizQuestion, 'id'>) {
    const newQ: QuizQuestion = {
      ...q,
      id: `quiz-${Date.now()}`,
    };
    this.state.quizQuestions.push(newQ);
    return newQ;
  }

  getAuditLogs() { return this.state.auditLogs; }
  logAction(action: string, targetModule: string, details: Record<string, unknown>) {
    const log: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      action,
      targetModule,
      details,
      createdAt: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(log);
    return log;
  }

  exportFullBackup() {
    // Redacts private journals for export privacy
    const exportable = {
      ...this.state,
      privateJournals: '[REDACTED_FOR_SECURITY_AND_EMOTIONAL_PRIVACY]',
      exportedAt: new Date().toISOString(),
    };
    return exportable;
  }
}

// Global singleton instance
const globalForStore = globalThis as unknown as { sanctuaryStore: SanctuaryStore };
export const sanctuaryStore = globalForStore.sanctuaryStore || new SanctuaryStore();
if (process.env.NODE_ENV !== 'production') globalForStore.sanctuaryStore = sanctuaryStore;
