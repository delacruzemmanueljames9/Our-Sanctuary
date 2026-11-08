// Master Database Abstraction Layer for Our Sanctuary
// Connects directly to Supabase PostgreSQL (Project: htzvacyqgjovtznzrjwu)
// Automatically falls back to in-memory store if tables are pending execution

import { getServiceSupabase } from './server';
import { sanctuaryStore } from './mock-store';
import {
  SanctuarySettings,
  Profile,
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

export interface SharedJournalEntry {
  id: string;
  author: 'emman' | 'lei';
  title: string;
  content: string;
  moodTag?: string;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  sender: 'emman' | 'lei';
  recipient: 'emman' | 'lei';
  message: string;
  isHuman: boolean;
  createdAt: string;
}

// In-memory fallback stores for new tables
const inMemorySharedJournals: SharedJournalEntry[] = [
  {
    id: 'shared-1',
    author: 'emman',
    title: 'The Night We Built Our Sanctuary',
    content: 'Watching this celestial world come to life piece by piece, knowing that every detail, room, and flower was handcrafted just for us. Here is to all the adventures waiting ahead.',
    moodTag: 'Pure Joy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shared-2',
    author: 'lei',
    title: 'A Little Note of Warmth',
    content: 'Thank you for making a sanctuary where our moments are treasured and safe forever. It feels magical here.',
    moodTag: 'Gratitude',
    createdAt: new Date().toISOString(),
  },
];

const inMemoryDirectMessages: DirectMessage[] = [
  {
    id: 'dm-1',
    sender: 'emman',
    recipient: 'lei',
    message: "Hi sweetie, whats bothering you now?",
    isHuman: true,
    createdAt: new Date().toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuarySettings(): Promise<SanctuarySettings> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sanctuary_settings')
        .select('*')
        .eq('id', 'sanctuary')
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          relationshipStartDate: data.relationship_start_date,
          sanctuaryTitle: data.sanctuary_title,
          tagline: data.tagline,
          themeAccent: data.theme_accent,
          activeModules: data.active_modules,
          ambientAudioEnabled: data.ambient_audio_enabled,
        };
      }
    } catch (e) {
      console.warn('Supabase getSettings fallback:', e);
    }
  }
  return sanctuaryStore.getSettings();
}

export async function updateSanctuarySettings(
  partial: Partial<SanctuarySettings>
): Promise<SanctuarySettings> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const dbPayload: any = { updated_at: new Date().toISOString() };
      if (partial.sanctuaryTitle) dbPayload.sanctuary_title = partial.sanctuaryTitle;
      if (partial.tagline) dbPayload.tagline = partial.tagline;
      if (partial.themeAccent) dbPayload.theme_accent = partial.themeAccent;
      if (partial.activeModules) dbPayload.active_modules = partial.activeModules;
      if (typeof partial.ambientAudioEnabled === 'boolean')
        dbPayload.ambient_audio_enabled = partial.ambientAudioEnabled;

      const { data, error } = await supabase
        .from('sanctuary_settings')
        .upsert({ id: 'sanctuary', ...dbPayload })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          relationshipStartDate: data.relationship_start_date,
          sanctuaryTitle: data.sanctuary_title,
          tagline: data.tagline,
          themeAccent: data.theme_accent,
          activeModules: data.active_modules,
          ambientAudioEnabled: data.ambient_audio_enabled,
        };
      }
    } catch (e) {
      console.warn('Supabase updateSettings fallback:', e);
    }
  }
  return sanctuaryStore.updateSettings(partial);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MEMORIES & ALBUMS
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuaryMemories(albumId?: string): Promise<MemoryItem[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      let query = supabase.from('memories').select('*').order('created_at', { ascending: true });
      if (albumId && albumId !== 'all') {
        query = query.eq('album_id', albumId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          albumId: m.album_id,
          title: m.title,
          description: m.description,
          mediaUrl: m.media_url,
          mediaType: m.media_type,
          memoryDate: m.memory_date,
          location: m.location,
          tags: m.tags || [],
          isFavorite: m.is_favorite,
          uploadedBy: m.uploaded_by,
          createdAt: m.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getMemories fallback:', e);
    }
  }
  const mems = sanctuaryStore.getMemories();
  if (albumId && albumId !== 'all') {
    return mems.filter((m) => m.albumId === albumId);
  }
  return mems;
}

export async function addSanctuaryMemory(
  item: Omit<MemoryItem, 'id' | 'createdAt'>
): Promise<MemoryItem> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert({
          album_id: item.albumId || null,
          title: item.title,
          description: item.description,
          media_url: item.mediaUrl,
          media_type: item.mediaType,
          memory_date: item.memoryDate,
          location: item.location,
          tags: item.tags,
          is_favorite: item.isFavorite,
          uploaded_by: item.uploadedBy,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          albumId: data.album_id,
          title: data.title,
          description: data.description,
          mediaUrl: data.media_url,
          mediaType: data.media_type,
          memoryDate: data.memory_date,
          location: data.location,
          tags: data.tags || [],
          isFavorite: data.is_favorite,
          uploadedBy: data.uploaded_by,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Supabase addMemory fallback:', e);
    }
  }
  return sanctuaryStore.addMemory(item);
}

export async function deleteSanctuaryMemory(id: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from('memories').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteMemory fallback:', e);
    }
  }
  sanctuaryStore.deleteMemory(id);
  return true;
}

export async function getSanctuaryAlbums(): Promise<Album[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          coverUrl: a.cover_url,
          createdAt: a.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getAlbums fallback:', e);
    }
  }
  return sanctuaryStore.getAlbums();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LETTERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuaryLetters(user?: 'emman' | 'lei'): Promise<Letter[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      let query = supabase.from('letters').select('*').order('created_at', { ascending: false });
      if (user) {
        query = query.or(`recipient.eq.${user},sender.eq.${user}`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((l: any) => ({
          id: l.id,
          sender: l.sender,
          recipient: l.recipient,
          title: l.title,
          content: l.content,
          waxSeal: l.wax_seal,
          scheduledFor: l.scheduled_for,
          isRead: l.is_read,
          readAt: l.read_at,
          isDraft: l.is_draft,
          createdAt: l.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getLetters fallback:', e);
    }
  }
  return sanctuaryStore.getLetters(user);
}

export async function sendSanctuaryLetter(
  letter: Omit<Letter, 'id' | 'createdAt' | 'isRead'>
): Promise<Letter> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('letters')
        .insert({
          sender: letter.sender,
          recipient: letter.recipient,
          title: letter.title,
          content: letter.content,
          wax_seal: letter.waxSeal,
          scheduled_for: letter.scheduledFor,
          is_draft: letter.isDraft,
          is_read: false,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          sender: data.sender,
          recipient: data.recipient,
          title: data.title,
          content: data.content,
          waxSeal: data.wax_seal,
          scheduledFor: data.scheduled_for,
          isRead: data.is_read,
          readAt: data.read_at,
          isDraft: data.is_draft,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Supabase sendLetter fallback:', e);
    }
  }
  return sanctuaryStore.sendLetter(letter);
}

export async function deleteSanctuaryLetter(id: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from('letters').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteLetter fallback:', e);
    }
  }
  const all = sanctuaryStore.getLetters();
  const idx = all.findIndex((l) => l.id === id);
  if (idx !== -1) all.splice(idx, 1);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GARDEN PLANTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuaryPlants(): Promise<GardenPlant[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('garden_plants').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          id: p.id,
          plantType: p.plant_type,
          name: p.name,
          dedication: p.dedication,
          growthStage: p.growth_stage,
          plantedBy: p.planted_by,
          lastWatered: p.last_watered,
          waterCount: p.water_count,
          positionX: p.position_x,
          positionZ: p.position_z,
          createdAt: p.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getGardenPlants fallback:', e);
    }
  }
  return sanctuaryStore.getGardenPlants();
}

export async function plantSanctuaryFlower(
  flower: Omit<GardenPlant, 'id' | 'growthStage' | 'lastWatered' | 'waterCount' | 'createdAt'>
): Promise<GardenPlant> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('garden_plants')
        .insert({
          plant_type: flower.plantType,
          name: flower.name,
          dedication: flower.dedication,
          growth_stage: 1,
          planted_by: flower.plantedBy,
          water_count: 1,
          position_x: flower.positionX,
          position_z: flower.positionZ,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          plantType: data.plant_type,
          name: data.name,
          dedication: data.dedication,
          growthStage: data.growth_stage,
          plantedBy: data.planted_by,
          lastWatered: data.last_watered,
          waterCount: data.water_count,
          positionX: data.position_x,
          positionZ: data.position_z,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Supabase plantFlower fallback:', e);
    }
  }
  return sanctuaryStore.plantFlower(flower);
}

export async function waterSanctuaryPlant(id: string): Promise<GardenPlant | null> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data: curr } = await supabase.from('garden_plants').select('water_count, growth_stage').eq('id', id).single();
      if (curr) {
        const newCount = (curr.water_count || 1) + 1;
        let newStage = curr.growth_stage;
        if (newCount >= 10) newStage = 4;
        else if (newCount >= 6) newStage = 3;
        else if (newCount >= 3) newStage = 2;

        const { data, error } = await supabase
          .from('garden_plants')
          .update({
            water_count: newCount,
            growth_stage: newStage,
            last_watered: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            plantType: data.plant_type,
            name: data.name,
            dedication: data.dedication,
            growthStage: data.growth_stage,
            plantedBy: data.planted_by,
            lastWatered: data.last_watered,
            waterCount: data.water_count,
            positionX: data.position_x,
            positionZ: data.position_z,
            createdAt: data.created_at,
          };
        }
      }
    } catch (e) {
      console.warn('Supabase waterPlant fallback:', e);
    }
  }
  return sanctuaryStore.waterPlant(id) || null;
}

export async function deleteSanctuaryPlant(id: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from('garden_plants').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deletePlant fallback:', e);
    }
  }
  const all = sanctuaryStore.getGardenPlants();
  const idx = all.findIndex((p) => p.id === id);
  if (idx !== -1) all.splice(idx, 1);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EMOTIONAL SPACE
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuaryCheckins(): Promise<EmotionalCheckin[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('emotional_checkins')
        .select('*')
        .eq('is_shared', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          author: c.author,
          mood: c.mood || 'peaceful',
          supportPreference: c.support_preference,
          reflection: c.reflection || c.note || '',
          isShared: c.is_shared,
          createdAt: c.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getEmotionalCheckins fallback:', e);
    }
  }
  return sanctuaryStore.getEmotionalCheckins();
}

export async function addSanctuaryCheckin(
  checkin: Omit<EmotionalCheckin, 'id' | 'createdAt'>
): Promise<EmotionalCheckin> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('emotional_checkins')
        .insert({
          author: checkin.author,
          mood: checkin.mood,
          support_preference: checkin.supportPreference,
          reflection: checkin.reflection,
          is_shared: checkin.isShared,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          author: data.author,
          mood: data.mood,
          supportPreference: data.support_preference,
          reflection: data.reflection,
          isShared: data.is_shared,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Supabase addCheckin fallback:', e);
    }
  }
  return sanctuaryStore.addEmotionalCheckin(checkin);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. OUR UNIVERSE DREAMS
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuaryDreams(): Promise<UniverseDream[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('universe_dreams').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          category: d.category || 'bucket_list',
          completed: d.completed,
          targetDate: d.target_date,
          createdBy: d.created_by,
          starX: d.star_x ?? (Math.random() - 0.5) * 8,
          starY: d.star_y ?? (Math.random() - 0.5) * 8,
          starZ: d.star_z ?? (Math.random() - 0.5) * 8,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getDreams fallback:', e);
    }
  }
  return sanctuaryStore.getUniverseDreams();
}

export async function addSanctuaryDream(
  dream: Omit<UniverseDream, 'id' | 'createdAt' | 'completed'>
): Promise<UniverseDream> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('universe_dreams')
        .insert({
          title: dream.title,
          description: dream.description,
          category: dream.category,
          completed: false,
          target_date: dream.targetDate,
          created_by: dream.createdBy,
          star_x: dream.starX,
          star_y: dream.starY,
          star_z: dream.starZ,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category,
          completed: data.completed,
          targetDate: data.target_date,
          createdBy: data.created_by,
          starX: data.star_x ?? dream.starX,
          starY: data.star_y ?? dream.starY,
          starZ: data.star_z ?? dream.starZ,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Supabase addDream fallback:', e);
    }
  }
  return sanctuaryStore.addUniverseDream(dream);
}

export async function toggleSanctuaryDream(id: string): Promise<UniverseDream | null> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data: curr } = await supabase.from('universe_dreams').select('completed').eq('id', id).single();
      if (curr) {
        const { data, error } = await supabase
          .from('universe_dreams')
          .update({ completed: !curr.completed })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            completed: data.completed,
            targetDate: data.target_date,
            createdBy: data.created_by,
            starX: data.star_x ?? 0,
            starY: data.star_y ?? 0,
            starZ: data.star_z ?? 0,
            createdAt: data.created_at,
          };
        }
      }
    } catch (e) {
      console.warn('Supabase toggleDream fallback:', e);
    }
  }
  return sanctuaryStore.toggleDreamCompleted(id) || null;
}

export async function deleteSanctuaryDream(id: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from('universe_dreams').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteDream fallback:', e);
    }
  }
  const all = sanctuaryStore.getUniverseDreams();
  const idx = all.findIndex((d) => d.id === id);
  if (idx !== -1) all.splice(idx, 1);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CALENDAR & MILESTONES
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuaryCalendarEvents(): Promise<CalendarEvent[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('calendar_events').select('*').order('event_date', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          eventDate: e.event_date,
          isRecurringAnnually: e.is_recurring_annually,
          category: e.category,
          createdBy: e.created_by,
          createdAt: e.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getCalendarEvents fallback:', e);
    }
  }
  return sanctuaryStore.getCalendarEvents();
}

export async function addSanctuaryCalendarEvent(
  event: Omit<CalendarEvent, 'id' | 'createdAt'>
): Promise<CalendarEvent> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: event.title,
          description: event.description,
          event_date: event.eventDate,
          is_recurring_annually: event.isRecurringAnnually,
          category: event.category,
          created_by: event.createdBy,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          eventDate: data.event_date,
          isRecurringAnnually: data.is_recurring_annually,
          category: data.category,
          createdBy: data.created_by,
          createdAt: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Supabase addCalendarEvent fallback:', e);
    }
  }
  return sanctuaryStore.addCalendarEvent(event);
}

export async function deleteSanctuaryCalendarEvent(id: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from('calendar_events').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteCalendarEvent fallback:', e);
    }
  }
  const all = sanctuaryStore.getCalendarEvents();
  const idx = all.findIndex((e) => e.id === id);
  if (idx !== -1) all.splice(idx, 1);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SHARED JOURNAL
// ─────────────────────────────────────────────────────────────────────────────

export async function getSharedJournalEntries(): Promise<SharedJournalEntry[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('shared_journals').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((j: any) => ({
          id: j.id,
          author: j.author,
          title: j.title,
          content: j.content,
          moodTag: j.mood_tag,
          createdAt: j.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getSharedJournals fallback:', e);
    }
  }
  return inMemorySharedJournals;
}

export async function addSharedJournalEntry(
  entry: Omit<SharedJournalEntry, 'id' | 'createdAt'>
): Promise<SharedJournalEntry> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('shared_journals')
        .insert({
          author: entry.author,
          title: entry.title,
          content: entry.content,
          mood_tag: entry.moodTag || 'Together',
        })
        .select()
        .single();

      if (!error && data) {
        const item: SharedJournalEntry = {
          id: data.id,
          author: data.author,
          title: data.title,
          content: data.content,
          moodTag: data.mood_tag,
          createdAt: data.created_at,
        };
        inMemorySharedJournals.unshift(item);
        return item;
      }
    } catch (e) {
      console.warn('Supabase addSharedJournal fallback:', e);
    }
  }
  const created: SharedJournalEntry = {
    id: `shared-${Date.now()}`,
    ...entry,
    createdAt: new Date().toISOString(),
  };
  inMemorySharedJournals.unshift(created);
  return created;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. DIRECT MESSAGES (Emman Live Chat vs Mochi)
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_BUCKET = 'sanctuary_data';
const DM_STORAGE_FILE = 'direct_messages.json';
const DEFAULT_FIRST_GREETING = "Hi sweetie, whats bothering you now?";

async function loadStoredDirectMessages(): Promise<DirectMessage[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return inMemoryDirectMessages;

  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(DM_STORAGE_FILE);

    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryDirectMessages.length = 0;
        inMemoryDirectMessages.push(...parsed);
        return inMemoryDirectMessages;
      }
    }
  } catch (e) {
    console.warn('Storage download direct_messages fallback:', e);
  }
  return inMemoryDirectMessages;
}

async function saveStoredDirectMessages(messages: DirectMessage[]): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  try {
    const json = JSON.stringify(messages, null, 2);
    await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(DM_STORAGE_FILE, Buffer.from(json), {
        contentType: 'application/json',
        upsert: true,
      });
  } catch (e) {
    console.warn('Storage upload direct_messages fallback:', e);
  }
}

export async function getDirectMessages(): Promise<DirectMessage[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('direct_messages').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          sender: d.sender,
          recipient: d.recipient,
          message: d.message,
          isHuman: d.is_human,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase getDirectMessages table fallback:', e);
    }
  }
  // Persistent cloud storage fallback across all serverless instances
  return loadStoredDirectMessages();
}

export async function sendDirectMessage(
  msg: Omit<DirectMessage, 'id' | 'createdAt'>
): Promise<DirectMessage> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender: msg.sender,
          recipient: msg.recipient,
          message: msg.message,
          is_human: msg.isHuman,
        })
        .select()
        .single();

      if (!error && data) {
        const item: DirectMessage = {
          id: data.id,
          sender: data.sender,
          recipient: data.recipient,
          message: data.message,
          isHuman: data.is_human,
          createdAt: data.created_at,
        };
        inMemoryDirectMessages.push(item);
        await saveStoredDirectMessages(inMemoryDirectMessages);
        return item;
      }
    } catch (e) {
      console.warn('Supabase sendDirectMessage table fallback:', e);
    }
  }

  // Load latest stored messages before appending to prevent race conditions
  const currentMessages = await loadStoredDirectMessages();
  const created: DirectMessage = {
    id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...msg,
    createdAt: new Date().toISOString(),
  };
  currentMessages.push(created);
  inMemoryDirectMessages.length = 0;
  inMemoryDirectMessages.push(...currentMessages);

  // Persist to Supabase Storage immediately
  await saveStoredDirectMessages(inMemoryDirectMessages);
  return created;
}

export async function clearDirectMessages(): Promise<boolean> {
  const defaultFirstMsg = DEFAULT_FIRST_GREETING;
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from('direct_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('direct_messages').insert({
        sender: 'emman',
        recipient: 'lei',
        message: defaultFirstMsg,
        is_human: true,
      });
    } catch (e) {
      console.warn('Supabase clearDirectMessages table fallback:', e);
    }
  }
  inMemoryDirectMessages.length = 0;
  inMemoryDirectMessages.push({
    id: `dm-${Date.now()}`,
    sender: 'emman',
    recipient: 'lei',
    message: defaultFirstMsg,
    isHuman: true,
    createdAt: new Date().toISOString(),
  });

  // Persist cleared state to Supabase Storage
  await saveStoredDirectMessages(inMemoryDirectMessages);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. ARCADE & AUDIT
// ─────────────────────────────────────────────────────────────────────────────

export async function getSanctuaryQuizQuestions(): Promise<QuizQuestion[]> {
  return sanctuaryStore.getQuizQuestions();
}

export async function addSanctuaryQuizQuestion(
  q: Omit<QuizQuestion, 'id'>
): Promise<QuizQuestion> {
  return sanctuaryStore.addQuizQuestion(q);
}

export async function getSanctuaryAuditLogs(): Promise<AdminAuditLog[]> {
  return sanctuaryStore.getAuditLogs();
}

export async function logSanctuaryAdminAction(
  action: string,
  targetModule: string,
  details?: Record<string, any>
): Promise<void> {
  sanctuaryStore.logAction(action, targetModule, details || {});
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from('admin_audit_logs').insert({
        action,
        target_module: targetModule,
        details: details || {},
      });
    } catch {
      // safe ignore
    }
  }
}
