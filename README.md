# AlgoPilot

**AI-powered DSA platform** — Master algorithms with intelligent hints, real-time battles, and visual dry-run debugging.

<p align="center">
  <strong>React • Vite • TypeScript • TailwindCSS • Framer Motion • shadcn/ui</strong><br/>
  <strong>Node.js • Express • Prisma • PostgreSQL</strong>
</p>

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** running locally (or a remote instance)
- **npm** or **pnpm**

### 1. Clone & Install

```bash
git clone <your-repo-url> algopilot
cd algopilot

# Install both client and server
npm run install:all
```

### 2. Configure Environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your DATABASE_URL and JWT_SECRET

# Client
cp client/.env.example client/.env
```

### 3. Set Up Database

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development

```bash
# From root — starts both client and server
npm run dev
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173         |
| Backend  | http://localhost:5000/api     |
| Prisma Studio | http://localhost:5555    |

---

## 📁 Architecture

```
algopilot/
├── client/                  # React frontend
│   ├── src/
│   │   ├── app/             # App shell, providers, router
│   │   ├── components/
│   │   │   ├── ui/          # shadcn/ui primitives
│   │   │   ├── layout/      # Sidebar, Topbar, PageShell
│   │   │   ├── common/      # GlassCard, AnimatedPage, Logo
│   │   │   └── features/    # Problem, Editor, Battle components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer (Axios)
│   │   ├── stores/          # Zustand state stores
│   │   ├── lib/             # Utilities, constants, query client
│   │   ├── types/           # Shared TypeScript types
│   │   ├── pages/           # Page components
│   │   └── styles/          # Global CSS + design tokens
│   └── ...
│
├── server/                  # Express backend
│   ├── prisma/              # Prisma schema & migrations
│   └── src/
│       ├── config/          # Environment config
│       ├── controllers/     # Request handlers
│       ├── services/        # Business logic
│       ├── routes/          # Route definitions
│       ├── middleware/      # Auth, validation, error handling
│       ├── lib/             # Prisma client, logger
│       ├── types/           # Server types
│       └── websocket/       # Future WebSocket handlers
│
└── package.json             # Root workspace scripts
```

---

## 🎨 Design System

Premium dark theme inspired by **Raycast**, **Linear**, and **Vercel**:

- **Near-black backgrounds** with subtle surface layering
- **Electric violet accent** (`hsl(262, 83%, 58%)`)
- **Glassmorphism** with backdrop blur
- **Framer Motion** animations throughout
- **Inter** + **JetBrains Mono** typography

---

## 🗺️ Roadmap

- [x] Project scaffolding & architecture
- [x] Design system & component library
- [x] Dashboard & problems list
- [ ] Monaco code editor integration
- [ ] Code execution engine
- [ ] JWT authentication
- [ ] AI-powered hints & explanations
- [ ] Real-time battle arena (WebSocket)
- [ ] Leaderboard & ranking system
- [ ] Dry-run visualizer
- [ ] Mobile responsive layout

---

## 📄 License

MIT
