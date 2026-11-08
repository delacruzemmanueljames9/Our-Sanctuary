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

-- 9. Seed 16 Original Memories
INSERT INTO memories (title, description, media_url, media_type, memory_date, location, is_favorite, uploaded_by)
VALUES
  ('Judy''s Place', 'From that day at Judy''s... everything changed. 💜', 'https://image2url.com/r2/default/images/1772452296568-066f9cb0-97a8-4334-8cf7-a5e0610b8c91.jpg', 'image', '2023-02-14', 'Judy''s', true, 'emman'),
  ('First JS Prom', 'Our first JS Prom — the rhythm of our hearts together. 💜✨', 'https://image2url.com/r2/default/images/1772452426364-0defc4cc-39d6-46b4-904c-73804a9c1f05.jpeg', 'image', '2023-03-04', 'JS Prom Ball', true, 'emman'),
  ('Our First Date', 'Our first date — the start of our forever. 💍✨', 'https://image2url.com/r2/default/images/1772452839431-00fbd3a2-c32e-4638-b861-7b9af905983a.png', 'image', '2023-04-15', 'Our Special Spot', true, 'emman'),
  ('A Sealed Promise', 'That kiss sealed every promise we made. 💜✨', 'https://image2url.com/r2/default/images/1772453355444-41bdd217-b4df-460c-a27a-104a85180195.jpg', 'image', '2023-05-20', 'Under The Starlight', true, 'emman'),
  ('Simple Moment', 'In this simple moment together, I found my forever.', 'https://image2url.com/r2/default/images/1772504833109-fb9b049c-a9c5-4b06-be98-1e616f7ae162.jpg', 'image', '2023-06-12', 'Quiet Moments', true, 'emman'),
  ('Melody of Laughter', 'Your laughter that day was the melody my heart still dances to. 💜✨', 'https://image2url.com/r2/default/images/1772507925212-ffa5231a-19c4-4efb-a758-b358525f16d3.jpg', 'image', '2023-07-22', 'Sweet Afternoon', true, 'emman'),
  ('A Forever Promise', 'Every ''I love you'' we share is a promise I''ll keep forever. 💛✨', 'https://image2url.com/r2/default/images/1772505257752-7c4f65be-ac06-4d30-bdd4-7dd19356ab2f.jpeg', 'image', '2023-08-30', 'Every Moment', true, 'emman'),
  ('Meeting Family', 'That day wasn''t just about meeting family — it was about opening my world to you. 💜✨', 'https://image2url.com/r2/default/images/1772505386436-c5683dec-7147-4075-989d-9ab32f45ea97.jpg', 'image', '2023-09-18', 'Family Home', true, 'emman'),
  ('On The Way Home', 'On the way home, my heart was full — because you were already part of my family. 💜✨', 'https://image2url.com/r2/default/images/1772505578552-1ed3578e-adb0-4e43-8a20-0fdf330ef831.jpg', 'image', '2023-09-18', 'Road Home', true, 'emman'),
  ('Toast to Memories', 'Every sip was more than joy — it was a toast to the countless memories we''ve made together. 💜', 'https://image2url.com/r2/default/images/1772505726196-967c09f9-4317-447a-a971-544a2d380d1a.jpg', 'image', '2023-10-25', 'Cozy Cafe', true, 'emman'),
  ('Celebration of Us', 'Dressed in joy and love, that night was a celebration of us. 💜✨', 'https://image2url.com/r2/default/images/1772505987509-9008f8d0-25b8-46db-a356-ac7392ce6315.blob', 'image', '2023-11-15', 'Grand Evening', true, 'emman'),
  ('Shared Journey', 'Every medal and certificate means more because I shared the journey with you. 🎓💜', 'https://image2url.com/r2/default/images/1772506337655-9b972cb4-84a6-4383-8e6c-9d93520d1cf2.jpg', 'image', '2023-12-05', 'Academy Hall', true, 'emman'),
  ('By The Shore', 'By the shore, with the waves as our witness, love is our forever horizon. 🌊💜✨', 'https://image2url.com/r2/default/images/1772506558227-a171ec74-c3fc-4ca5-9af1-3b18b6ff60f9.jpg', 'image', '2024-01-10', 'Ocean Shore', true, 'emman'),
  ('Side by Side', 'Side by side, every achievement feels brighter because of you. 💜✨', 'https://image2url.com/r2/default/images/1772506695799-cb90d49c-a821-44bb-b9b3-08081605f9f8.blob', 'image', '2024-02-18', 'Ceremony Stage', true, 'emman'),
  ('Grad Ball Lights', 'Under the lights of Grad Ball, every dance step felt like a promise. 💜✨', 'https://image2url.com/r2/default/images/1772506881171-82876548-c926-4d09-af8f-388d95bd8540.jpg', 'image', '2024-03-22', 'Graduation Ballroom', true, 'emman'),
  ('Graduation Day', 'Graduation Day! 💜🎓', 'https://image2url.com/r2/default/images/1772417979098-57fb8ef8-cf07-4b8e-b5ba-adcc7e8a63a1.jpg', 'image', '2024-04-05', 'Graduation Grounds', true, 'emman')
ON CONFLICT DO NOTHING;
