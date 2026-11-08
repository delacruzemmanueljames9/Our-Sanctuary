# OUR SANCTUARY 🕊️✨
### A Celestial Fantasy World & Private Digital Haven for Emman & Lei

> *"The Angel Heart Knight stands at the gate. The ancient runes illuminate. Beyond the heart-shaped portals lies a sacred world crafted star by star."*

---

## 🌟 Overview

**OUR SANCTUARY** is a handcrafted 3D interactive fantasy world and personal scrapbook designed exclusively for **Emman** and **Lei**. It breaks away from generic AI dashboards, flat card templates, and cookie-cutter layouts to deliver an intimate, cinematic gaming experience combined with real personal preservation.

---

## 🏛️ The 9 Sanctuary Rooms

1. **Room 01 — Our Home (`/sanctuary`)**: The main 3D sanctuary island dashboard. Features an interactive 3D floating island with the central fantasy house, flowing waterfalls, relationship timeline counter ("Days of Harmony"), upcoming milestones, and direct portal access.
2. **Room 02 — Memory Gallery (`/sanctuary/gallery`)**: Archival collections of cherished photos and videos. Supports albums, timeline filtering, favorite highlights, and interactive memory preservation.
3. **Room 03 — Letter Room (`/sanctuary/letters`)**: Handcrafted parchment and wax seal writing studio. Write, schedule future time-capsule letters, choose wax seals (*Golden Heart, Celestial Rose, Starlight, Angel Wing*), and read received letters.
4. **Room 04 — Our Garden (`/sanctuary/garden`)**: An interactive garden of living milestones. Plant unique flora (*Rose of Eternal Love, Celestial Lily, Starlight Orchid, Sunlight Blossom, Moonlight Fern*), dedicate them to special moments, and water them through four growth stages.
5. **Room 05 — Emotional Space (`/sanctuary/emotional`)**: A gentle, zero-pressure emotional harbor. Choose current moods, express support preferences (*"Just listen", "Give me a warm hug", "Give me space", "Talk together"*), and share optional reflections.
6. **Room 06 — Our Universe (`/sanctuary/universe`)**: 3D celestial observatory & constellation of shared dreams. Track bucket lists, future voyages, date night adventures, and ignite new stars as dreams are achieved together.
7. **Room 07 — Private Journal (`/sanctuary/journal`)**: Strict zero-knowledge personal isolation. Separate personal PIN passkeys for Emman and Lei. Neither the gate key nor admin privileges can peer into the other's private reflections.
8. **Room 08 — Little Arcade (`/sanctuary/arcade`)**: Functional couple games, including a real "How Well Do You Know Me?" trivia quiz with scorekeeping and an interactive Date Night Surprise Generator.
9. **Room 09 — Calendar (`/sanctuary/calendar`)**: Celestial calendar tracking anniversaries, birthdays, milestones, and upcoming date nights with annual recurring event support.

---

## 🛡️ The Gate & The Angel Heart Knight

- Guarded by the **Angel Heart Knight** in silver-white plate armor with gold filigree, large feathered wings, and a pulsating heart emblem on his chest.
- Interactive camera and knight head tracking that responds to visitor cursor/touch.
- **Shared 6-Digit Gate PIN**: Both Emman and Lei enter using the shared 6-digit key.
- Upon correct entry: Gate symbols illuminate, the knight raises his blade in salute, the heart emblem flares, and the twin iron doors swing open as warm golden light emerges, guiding the visitor into the sanctuary.
- Rate limiting and progressive lockout protect against brute-force attacks.
- Lightweight fallback is provided for devices requesting reduced motion.

---

## 👑 Super Administrator Access (Emman ONLY)

- Accessible via a discreet button inside the sanctuary.
- Requires Emman's private master passphrase (`EMMAN_ADMIN_SECRET`).
- Issues an independent, high-privilege `HttpOnly` cookie verified strictly server-side on every `/api/admin/*` endpoint.
- **Strict Policy**: Lei and general visitors are strictly prohibited from receiving administrator permissions.
- Control Center capabilities:
  - Toggle individual sanctuary rooms on/off.
  - Customize the sanctuary global aura (*Celestial Gold, Ethereal Sapphire, Rose Quartz, Living Emerald*).
  - Download full JSON database backups.
  - Inspect administrative audit logs.

---

## 🤖 Mochi — AI Spirit Companion

- Cute floating celestial familiar residing in the sanctuary.
- Natural speaker of warm, gentle **Taglish**.
- **Phase 1 (Ready)**: Transparent AI abstraction layer. When no API key is provided, Mochi clearly explains that his consciousness is in celestial rest, avoiding deceptive fake chatbot replies while offering genuine sanctuary prompts and activity ideas.
- **Phase 2 (Active when configured)**: Add `GEMINI_API_KEY` or `OPENAI_API_KEY` to `.env.local` to awaken live empathetic responses, relationship advice, and date suggestions.
- **Privacy Guarantee**: Mochi is programmatically barred from ever accessing or discussing Private Journals.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS & PostCSS
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animation**: Framer Motion
- **Database & Storage**: Supabase PostgreSQL & Supabase Storage (with local in-memory fallback store)
- **Security**: Web Crypto HMAC-SHA256 tokens, HttpOnly secure cookies, rate limiting

---

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Default local credentials:
- **Sanctuary Gate PIN**: `110826`
- **Emman Super Admin Passphrase**: `emman_celestial_admin_2026`
- **Emman Journal PIN**: `2408`
- **Lei Journal PIN**: `1509`

### 2. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or configured port) in your browser.

### 3. Build for Production

```bash
npm run build
npm run start
```

---

## 🗄️ Database Setup (Supabase)

When connecting to Supabase:
1. Create a new Supabase project.
2. Open the SQL Editor in Supabase.
3. Paste and run `supabase/migrations/20261108_init_sanctuary.sql`.
4. Add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (and Vercel environment variables).

---

## 🚢 Vercel Deployment

1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/our-sanctuary.git
   git push -u origin main
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Set your production environment variables in the Vercel Project Settings:
   - `SANCTUARY_GATE_PIN`
   - `EMMAN_ADMIN_SECRET`
   - `EMMAN_JOURNAL_PIN`
   - `LEI_JOURNAL_PIN`
   - `SANCTUARY_SESSION_SECRET`
   - `GEMINI_API_KEY` (optional)
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
4. Deploy!
