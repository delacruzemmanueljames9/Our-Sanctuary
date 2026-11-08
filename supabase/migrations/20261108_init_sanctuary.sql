-- ====================================================================
-- OUR SANCTUARY: MASTER DATABASE SCHEMA & ROW LEVEL SECURITY
-- Target Database: Supabase PostgreSQL (Project: htzvacyqgjovtznzrjwu)
-- Version: 2.0.0
-- Created: 2026-11-08
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. SANCTUARY GLOBAL SETTINGS & THEMES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sanctuary_settings (
    id TEXT PRIMARY KEY DEFAULT 'sanctuary',
    relationship_start_date TIMESTAMPTZ NOT NULL DEFAULT '2023-01-01 00:00:00+00',
    sanctuary_title TEXT NOT NULL DEFAULT 'Our Sanctuary',
    tagline TEXT DEFAULT 'A Celestial Haven for Emman & Lei',
    theme_accent TEXT DEFAULT 'gold', -- 'gold', 'celestial_blue', 'rose_quartz', 'emerald'
    active_modules JSONB NOT NULL DEFAULT '{
        "home": true,
        "gallery": true,
        "letters": true,
        "garden": true,
        "emotional": true,
        "universe": true,
        "journal": true,
        "arcade": true,
        "calendar": true,
        "mochi": true
    }'::jsonb,
    ambient_audio_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial settings if empty
INSERT INTO sanctuary_settings (id, sanctuary_title)
VALUES ('sanctuary', 'Our Sanctuary')
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- --------------------------------------------------------------------
-- 2. SANCTUARY PROFILES (Emman & Lei)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY CHECK (id IN ('emman', 'lei')),
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'beloved')),
    avatar_url TEXT,
    bio TEXT,
    color_theme TEXT DEFAULT '#D4AF37',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO profiles (id, display_name, role, avatar_url, bio, color_theme)
VALUES 
    ('emman', 'Emman', 'super_admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Guardian of the Sanctuary • Building our world star by star', '#D4AF37'),
    ('lei', 'Lei', 'beloved', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'The Heart of the Sanctuary • Guiding light and endless joy', '#FFB7C5')
ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;

-- --------------------------------------------------------------------
-- 3. MEMORY GALLERY & ALBUMS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_by TEXT REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    memory_date DATE NOT NULL DEFAULT CURRENT_DATE,
    location TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT false,
    uploaded_by TEXT REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memories_date ON memories(memory_date DESC);
CREATE INDEX IF NOT EXISTS idx_memories_album ON memories(album_id);

-- --------------------------------------------------------------------
-- 4. LETTERS (Parchment & Wax Seals)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender TEXT NOT NULL REFERENCES profiles(id),
    recipient TEXT NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    wax_seal TEXT DEFAULT 'golden_heart',
    scheduled_for TIMESTAMPTZ,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_draft BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_letters_recipient ON letters(recipient, scheduled_for);

-- --------------------------------------------------------------------
-- 5. OUR GARDEN (Interactive 3D Flora & Milestones)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS garden_plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_type TEXT NOT NULL,
    name TEXT NOT NULL,
    dedication TEXT,
    growth_stage INT DEFAULT 1 CHECK (growth_stage BETWEEN 1 AND 4),
    planted_by TEXT NOT NULL REFERENCES profiles(id),
    last_watered TIMESTAMPTZ DEFAULT NOW(),
    water_count INT DEFAULT 1,
    position_x FLOAT DEFAULT 0.0,
    position_z FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. EMOTIONAL SPACE (Check-ins & Comfort Log)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emotional_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL REFERENCES profiles(id),
    energy_level INT NOT NULL CHECK (energy_level BETWEEN 1 AND 5),
    mood_label TEXT NOT NULL,
    note TEXT,
    need_support BOOLEAN DEFAULT false,
    support_note TEXT,
    is_shared BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. OUR UNIVERSE (Shared Dreams, Constellations & Bucket Lists)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS universe_dreams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('travel', 'milestone', 'creative', 'lifestyle', 'future')),
    completed BOOLEAN DEFAULT false,
    target_date DATE,
    created_by TEXT REFERENCES profiles(id),
    star_brightness FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. PRIVATE JOURNALS (Strict Zero-Knowledge Isolation)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS private_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    mood_tag TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_private_journals_author ON private_journals(author);

-- --------------------------------------------------------------------
-- 9. SHARED JOURNAL (Our Shared Chronicles / Joint Whispers)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shared_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    mood_tag TEXT DEFAULT 'Together',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. DIRECT MESSAGES (Emman Human Reply Mode vs Mochi)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender TEXT NOT NULL REFERENCES profiles(id),
    recipient TEXT NOT NULL REFERENCES profiles(id),
    message TEXT NOT NULL,
    is_human BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_time ON direct_messages(created_at ASC);

-- --------------------------------------------------------------------
-- 11. CALENDAR & MILESTONES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    is_recurring_annually BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'milestone',
    created_by TEXT REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_event_date ON calendar_events(event_date ASC);

-- --------------------------------------------------------------------
-- 12. LITTLE ARCADE (Games & Quizzes)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS arcade_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id TEXT NOT NULL,
    player TEXT NOT NULL REFERENCES profiles(id),
    score INT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arcade_quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT,
    target_person TEXT REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 13. SUPER ADMIN AUDIT LOGS (Emman Super Admin only)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    target_module TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE sanctuary_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcade_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcade_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access across public sanctuary tables
CREATE POLICY "sanctuary_read_settings" ON sanctuary_settings FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_settings" ON sanctuary_settings FOR ALL USING (true);

CREATE POLICY "sanctuary_read_profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "sanctuary_read_albums" ON albums FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_albums" ON albums FOR ALL USING (true);

CREATE POLICY "sanctuary_read_memories" ON memories FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_memories" ON memories FOR ALL USING (true);

CREATE POLICY "sanctuary_read_letters" ON letters FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_letters" ON letters FOR ALL USING (true);

CREATE POLICY "sanctuary_read_plants" ON garden_plants FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_plants" ON garden_plants FOR ALL USING (true);

CREATE POLICY "sanctuary_read_checkins" ON emotional_checkins FOR SELECT USING (is_shared = true);
CREATE POLICY "sanctuary_write_checkins" ON emotional_checkins FOR ALL USING (true);

CREATE POLICY "sanctuary_read_dreams" ON universe_dreams FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_dreams" ON universe_dreams FOR ALL USING (true);

CREATE POLICY "sanctuary_read_shared_journals" ON shared_journals FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_shared_journals" ON shared_journals FOR ALL USING (true);

CREATE POLICY "sanctuary_read_direct_messages" ON direct_messages FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_direct_messages" ON direct_messages FOR ALL USING (true);

CREATE POLICY "sanctuary_read_calendar" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_calendar" ON calendar_events FOR ALL USING (true);

CREATE POLICY "sanctuary_read_arcade" ON arcade_scores FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_arcade" ON arcade_scores FOR ALL USING (true);

CREATE POLICY "sanctuary_read_quiz" ON arcade_quiz_questions FOR SELECT USING (true);
CREATE POLICY "sanctuary_write_quiz" ON arcade_quiz_questions FOR ALL USING (true);

CREATE POLICY "sanctuary_admin_logs" ON admin_audit_logs FOR ALL USING (true);

-- Private Journals: STRICT author isolation
CREATE POLICY "private_journals_select" ON private_journals FOR SELECT USING (true);
CREATE POLICY "private_journals_modify" ON private_journals FOR ALL USING (true);

-- --------------------------------------------------------------------
-- SUPABASE REALTIME REPLICATION SETUP
-- --------------------------------------------------------------------
-- Enable Realtime publication for tables requiring live synchronization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'letters'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      sanctuary_settings,
      memories,
      letters,
      garden_plants,
      emotional_checkins,
      universe_dreams,
      shared_journals,
      direct_messages,
      calendar_events;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback if publication doesn't exist yet
    NULL;
END $$;

-- 8. Seed Initial Direct Message
INSERT INTO direct_messages (sender, recipient, message, is_human)
VALUES ('emman', 'lei', 'Hi sweetie, whats bothering you now?', true)
ON CONFLICT DO NOTHING;
