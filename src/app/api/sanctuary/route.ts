import { NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

export async function GET() {
  const settings = sanctuaryStore.getSettings();
  const profiles = sanctuaryStore.getProfiles();
  const memories = sanctuaryStore.getMemories().slice(0, 6);
  const letters = sanctuaryStore.getLetters();
  const plants = sanctuaryStore.getGardenPlants();
  const dreams = sanctuaryStore.getUniverseDreams();
  const events = sanctuaryStore.getCalendarEvents();
  const checkins = sanctuaryStore.getEmotionalCheckins().slice(0, 3);

  return NextResponse.json({
    settings,
    profiles,
    recentMemories: memories,
    totalMemories: sanctuaryStore.getMemories().length,
    unreadLettersCount: letters.filter(l => !l.isRead).length,
    totalPlants: plants.length,
    totalDreams: dreams.length,
    completedDreamsCount: dreams.filter(d => d.completed).length,
    upcomingEvents: events.slice(0, 4),
    recentCheckins: checkins,
  });
}
