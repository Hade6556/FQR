# FQR

NFC-based attendance tracking system with AI-powered FOMO notifications.

**No external services required** - works completely standalone with in-memory storage.

## Features

- **NFC Attendance**: Tap your phone on an NFC tag to log entry/exit
- **Google Calendar Integration**: Mock calendar sync for free hours tracking
- **AI FOMO Generator**: Brutally honest motivation messages in Lithuanian
- **Group Comparison**: Compare your stats with the group average
- **Dashboard**: View your attendance history and statistics

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Storage**: In-memory (no database required)
- **Styling**: TailwindCSS
- **State**: Zustand
- **AI**: OpenAI GPT-4o-mini (optional - has built-in fallback)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Account

- **Email**: `demo@fqr.lt`
- **Password**: `demo123`

Or create a new account!

## Optional: OpenAI Integration

For AI-generated FOMO messages, create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key
```

Without OpenAI, the app uses built-in FOMO message templates.

## Usage

### NFC Attendance

The NFC tag should be programmed to open:
```
https://your-domain.com/scan?id=ROOM_ID
```

For testing, use the "Simulate Scan" button on the homepage.

### Attendance Logic

- First tap of the day = **Enter**
- Tap 60+ minutes later = **Exit**
- Tap within 60 minutes = No change (already checked in)

### FOMO Messages

Click "Generate FOMO" to get a brutally honest motivational message based on:
- Your free hours vs study hours
- Your attendance vs group average
- Messages are in Lithuanian and intentionally harsh

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── scan/page.tsx
│   ├── page.tsx
│   └── layout.tsx
├── actions/
│   ├── attendance.ts
│   ├── auth.ts
│   ├── calendar.ts
│   └── fomo.ts
├── components/
│   ├── CalendarConnect.tsx
│   └── FomoGenerator.tsx
├── lib/
│   ├── auth.ts          # Session management
│   ├── db.ts            # In-memory database
│   ├── calendar.ts      # Mock calendar
│   └── fomo.ts          # FOMO generation
└── store/
    └── useStore.ts
```

## Note

This is an MVP with in-memory storage. Data will be reset when the server restarts. For production, integrate with a persistent database.

## License

MIT
