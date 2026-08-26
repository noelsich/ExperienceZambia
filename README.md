<<<<<<< HEAD
# UPND Manifesto 2026 — React Website

**Zambia Forward, Together**

A mobile-first React + TypeScript + Tailwind CSS website for the UPND 2026 Election Manifesto.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9+ (comes with Node.js)

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder — ready to deploy to any static host.

### 4. Preview production build locally

```bash
npm run preview
```

---

## 📁 Project Structure

```
upnd-manifesto/
├── public/
│   ├── favicon.svg
│   └── images/                  # Extracted manifesto photos
│       ├── rally.jpg            # Hero background — rally crowd
│       ├── president-portrait.jpg
│       ├── president-vision.jpg
│       ├── campaign-rally.jpg
│       ├── youth.jpg
│       ├── agriculture.jpg
│       ├── agriculture2.jpg
│       ├── mining.jpg
│       └── mining2.jpg
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Fixed nav with mobile hamburger drawer
│   │   ├── Hero.tsx             # Full-screen hero with rally image
│   │   ├── Ticker.tsx           # Scrolling headline ticker
│   │   ├── StatsBar.tsx         # 4 key stat numbers
│   │   ├── Achievements.tsx     # 8-card achievements grid
│   │   ├── Vision.tsx           # Presidential quote + portrait
│   │   ├── Targets.tsx          # 15 targets in 6 category cards
│   │   ├── Pillars.tsx          # 4 pillars with tabbed interface
│   │   ├── PhotoGrid.tsx        # Manifesto image gallery
│   │   ├── VoteCTA.tsx          # Final call-to-action
│   │   └── Footer.tsx
│   │
│   ├── data/
│   │   └── manifesto.ts         # All manifesto content data
│   │
│   ├── hooks/
│   │   └── useScrolled.ts       # Scroll detection hook
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   ├── App.tsx                  # Root component composing all sections
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + global styles
│
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `upnd-red` | `#C8102E` |
| `upnd-gold` | `#FFD100` |
| `upnd-black` | `#0A0A0A` |
| `upnd-charcoal` | `#1A1A1A` |
| `upnd-offwhite` | `#F5F0E8` |

**Fonts:** Bebas Neue (display), Playfair Display (editorial), DM Sans (body)

---

## 🌐 Deployment

### Netlify (recommended — free)
1. Push this repo to GitHub
2. Connect at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel
```bash
npx vercel
```

### Manual / cPanel
Run `npm run build`, then upload the `dist/` folder to your web server root.

---

## 📱 Mobile Optimisation

- Hamburger navigation drawer on screens < 768px
- Full-width CTAs stacked vertically on mobile
- Horizontally scrollable pillar tabs on small screens
- All images use `loading="lazy"` for performance
- Ticker animation hardware-accelerated via CSS transforms

---

*United Party for National Development · upnd.org.zm · 2026*
=======
# manifesto1
a 2nd site for view
>>>>>>> origin/main
