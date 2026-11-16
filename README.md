<div align="center">

<img src="https://capsule-render.vercel.app/api?type=cylinder&color=0:111827,100:2563EB&height=200&section=header&text=FQR&fontSize=76&fontColor=ffffff&fontAlignY=40&desc=Tap%20in%2C%20tap%20out%2C%20and%20let%20the%20group%20average%20shame%20you%20into%20studying&descSize=17&descAlignY=64" alt="FQR banner" width="100%" />

**NFC attendance tracking for students, with a mock calendar for free hours and brutally honest motivation messages in Lithuanian.**

[![Top language](https://img.shields.io/github/languages/top/Hade6556/FQR?style=for-the-badge)](https://github.com/Hade6556/FQR)
[![License](https://img.shields.io/github/license/Hade6556/FQR?style=for-the-badge)](#license)
[![Last commit](https://img.shields.io/github/last-commit/Hade6556/FQR?style=for-the-badge)](https://github.com/Hade6556/FQR/commits)
[![Stars](https://img.shields.io/github/stars/Hade6556/FQR?style=for-the-badge)](https://github.com/Hade6556/FQR/stargazers)

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-state-443E38?style=for-the-badge)](https://zustand.docs.pmnd.rs/)
[![OpenAI](https://img.shields.io/badge/OpenAI-optional-412991?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com/)

</div>

---

## What it does

An NFC tag at the door of a study room opens `/scan?id=ROOM_ID` on your phone. The first tap of the day logs an entry, a tap an hour or more later logs an exit. The home page shows your attendance history, today's calendar with free slots, and a "FOMO" feed: short Lithuanian messages that compare your study hours and attendance with the group average and are intentionally harsh. Everything runs in memory, so it works with no database and no external service.

> **[screenshot placeholder]** Capture the home page in preview mode on a phone (390×844) showing the attendance list, the calendar card and two FOMO messages, then the `/scan` success screen after a simulated tap.

## Features

- **NFC check-in and check-out** through a plain URL, so any NTAG sticker works. A "Simulate Scan" button on the home page replaces the tag during development.
- **Attendance rules**: first tap enters, a tap after 60 minutes exits, a tap within 60 minutes changes nothing.
- **Mock Google Calendar** with lectures, labs and seminars, free-hour and studied-hour totals, and the next event.
- **FOMO generator**: a dozen Lithuanian templates fed with your numbers and the group's. With an OpenAI key, GPT-4o-mini writes them instead.
- **Group comparison** of your attendance and study hours against the average.
- **Preview mode** for visitors who are not logged in, with demo data, and a demo account for the full flow.
- **Zero setup**: in-memory store, cookie sessions, no migrations.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router with server actions, React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| State | Zustand on the client, an in-memory store in `lib/db.ts` on the server |
| AI | OpenAI `gpt-4o-mini` through the `openai` SDK, optional, with template fallback |
| Auth | Email and password against the in-memory store, session in `lib/auth.ts` |

## Quick start

Requirements: Node 18 or newer.

```bash
git clone https://github.com/Hade6556/FQR.git
cd FQR
npm install
npm run dev                  # http://localhost:3000
```

Log in with the demo account `demo@fqr.lt` / `demo123`, or sign up. For AI-written messages:

```bash
echo 'OPENAI_API_KEY=sk-...' > .env.local
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Usage

1. Program each NFC tag with the URL `https://your-domain/scan?id=ROOM_ID`.
2. Tap the tag with a phone. `/scan` posts to `/api/attendance` and shows whether you entered or exited.
3. Open `/` for the feed and `/dashboard` for history and statistics.
4. Press **Generate FOMO** to get a new message based on your free hours, study hours and attendance versus the group.

### Routes

| Route | Purpose |
|---|---|
| `/` | Home: attendance, calendar, FOMO feed, preview mode when logged out |
| `/scan?id=` | Records a tap and shows the result |
| `/dashboard` | History and statistics |
| `/login`, `/signup` | Accounts |
| `POST /api/attendance` | Log a tap for the current user |
| `POST /api/auth/login`, `/signup`, `/logout` | Session management |

Because storage is in memory, every restart of the dev server resets users and attendance. `env.example` lists Supabase variables for a future persistent version. **[placeholder: persistence is not implemented yet]**

## Contributing

1. Keep the app runnable with no keys. Any new integration needs a fallback like the FOMO templates.
2. Business rules for taps live in `actions/attendance.ts`; change the 60-minute window there and in the README together.
3. New FOMO templates go in `lib/fomo.ts`. Keep them in Lithuanian and keep the numbers interpolated, not hard-coded.
4. Run `npm run lint` and `npm run build` before a pull request.

The committed `FQR-source.zip` is a snapshot of the project and is not used by the build. **[placeholder: remove it from the repo]**

## License

The original README states MIT, but no `LICENSE` file is in the repository yet. **[placeholder: add an MIT LICENSE file; the badge above updates by itself]**
