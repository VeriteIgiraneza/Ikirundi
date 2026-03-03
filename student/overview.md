# Kirundi Learning App - Student Module

## 📁 Complete File Structure

```
student/
├── src/
│   ├── components/
│   │   ├── Dictionary.tsx          # Searchable dictionary with filters
│   │   ├── WordOfDay.tsx          # Daily featured word
│   │   ├── Quiz.tsx               # Interactive quiz with scoring
│   │   └── WordCard.tsx           # Reusable word display component
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces (Word, Quiz, UserProgress)
│   │
│   ├── data/
│   │   └── words.ts               # Sample Kirundi words (8 words to start)
│   │
│   ├── utils/
│   │   └── shuffle.ts             # Array shuffle utility for quiz
│   │
│   ├── hooks/
│   │   └── useLocalStorage.ts     # Custom hook for browser storage
│   │
│   ├── App.tsx                    # Main app with navigation
│   ├── index.tsx                  # React entry point
│   └── index.css                  # Tailwind CSS setup
│
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
├── tsconfig.node.json             # TypeScript build config
├── vite.config.ts                 # Vite bundler config
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── index.html                     # HTML entry point
├── .gitignore                     # Git ignore rules
└── README.md                      # Setup instructions
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd student
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Opens at: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```
Output: `dist/` folder ready to deploy

## 🎯 Features Included

### ✅ Dictionary
- Searchable by Kirundi, English, or French
- Filter by category (greetings, food, family, objects)
- Image support for visual learning
- Pronunciation guides
- Example sentences

### ✅ Word of the Day
- Changes daily (date-based algorithm)
- Featured word with full details
- Motivational tips

### ✅ Interactive Quiz
- 5 random questions per quiz
- Multiple choice format
- Instant feedback (correct/incorrect)
- Score tracking
- Visual results with emojis
- "Try Again" functionality

### ✅ Responsive Design
- Works on mobile, tablet, desktop
- Clean, modern UI with Tailwind CSS
- Green/emerald color scheme (Burundi flag colors)

## 📝 Current Sample Data

The app includes 8 starter words:
1. **Mwaramutse** - Good morning
2. **Igitabo** - Book
3. **Umunsi mwiza** - Good day
4. **Amazi** - Water
5. **Umuryango** - Family
6. **Urakoze** - Thank you
7. **Ikawa** - Coffee
8. **Umwana** - Child

## 🔧 How to Add More Words

Edit `src/data/words.ts`:

```typescript
export const sampleWords: Word[] = [
  {
    id: '9',                              // Unique ID
    kirundi: 'Umugani',                   // Kirundi word
    english: 'Story',                     // English translation
    french: 'Histoire',                   // French translation (optional)
    pronunciation: 'u-mu-ga-ni',         // Pronunciation guide (optional)
    example: 'Umugani mwiza (A good story)', // Example sentence (optional)
    category: 'language',                 // Category for filtering
    imageUrl: 'https://...'              // Image URL (optional)
  },
  // ... add more words
];
```

## 🖼️ Image Storage Options

**For now (development):**
- Use free image URLs from Unsplash/Pexels
- Example: `https://images.unsplash.com/photo-xxxxx?w=400`

**For production:**
- Upload to **Firebase Storage** (free tier: 5GB)
- Upload to **Cloudflare R2** (free tier: 10GB)
- Upload to **Supabase Storage** (free tier: 1GB)

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` or use Tailwind's color classes:
- Current: green/emerald (Burundi flag colors)
- Easy to change: replace `green-xxx` with any Tailwind color

### Add Navigation
Currently uses tabs. Can easily add React Router for URLs:
```bash
npm install react-router-dom
```

## 📱 Making it a PWA (Later)

To convert to Progressive Web App:

1. Install PWA plugin:
```bash
npm install vite-plugin-pwa -D
```

2. Add to `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Learn Kirundi',
        short_name: 'Kirundi',
        description: 'Learn Burundian language',
        theme_color: '#16a34a',
        icons: [/* icon configs */]
      }
    })
  ]
})
```

## 🚀 Deployment Options

### Netlify (Recommended - Easiest)
1. Drag `dist/` folder to netlify.com
2. Done! Free hosting + custom domain

### Vercel
1. Connect GitHub repo
2. Auto-deploys on push
3. Free SSL + CDN

### GitHub Pages
1. Install gh-pages: `npm install gh-pages -D`
2. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/kirundi-app",
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```
3. Run: `npm run deploy`

## 🔮 Next Steps

### Phase 1 (You are here)
- ✅ Core learning features
- ✅ Dictionary, Word of Day, Quiz
- ✅ TypeScript structure
- ✅ Responsive design

### Phase 2 (Backend)
- Add Firebase/Supabase
- User authentication
- Save progress to database
- Admin panel to add words
- Parent dashboard

### Phase 3 (Advanced)
- Audio pronunciations
- Spaced repetition algorithm
- Leaderboards
- Social features
- Push notifications
- Offline mode

## 💡 Tips

1. **Start small**: Deploy with current 8 words, get feedback
2. **Add words incrementally**: Add 5-10 words per week
3. **Test on mobile**: Most users will be on phones
4. **Get community input**: Ask Burundian youth what they want
5. **Focus on engagement**: Fun > perfect at first

## 🆘 Troubleshooting

**Port already in use:**
```bash
npm run dev -- --port 3000
```

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
Check `tsconfig.json` settings match your Node version

## 📧 Support

For issues or questions:
- Check README.md
- Review component code (well commented)
- Test in browser console for errors

---

**Ready to launch!** 🚀

The app is production-ready. Just:
1. `npm install`
2. `npm run build`
3. Deploy `dist/` folder
4. Share with Burundian youth worldwide! 🇧🇮