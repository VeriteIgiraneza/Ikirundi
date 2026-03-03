# Kirundi Student App - Mobile (Expo) 🇧🇮📱

A React Native mobile application built with Expo for Burundian youth to learn Kirundi language.

## 📱 Features

- 📚 **Dictionary**: Searchable Kirundi-English-French dictionary with images
- 🌟 **Word of the Day**: Daily featured word to expand vocabulary
- 🎯 **Quiz**: Interactive multiple-choice quizzes to test knowledge
- 🖼️ **Visual Learning**: Images for better word association
- 🔍 **Search & Filter**: Find words by category or search term
- 📲 **Native Mobile Experience**: Smooth, app-like interface

## 🛠️ Tech Stack

- **React Native** with TypeScript
- **Expo** - Development framework
- **AsyncStorage** - Local data persistence
- **Native components** - View, Text, Image, ScrollView, etc.

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- **Expo Go app** on your phone (download from App Store or Google Play)

### Installation

1. **Navigate to the student folder:**
```bash
cd student
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start Expo development server:**
```bash
npm start
```
or
```bash
npx expo start
```

4. **Test on your phone:**
   - Open **Expo Go** app on your phone
   - Scan the QR code shown in terminal
   - App loads on your device!

### Alternative: Test on Emulator

**iOS (Mac only):**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## 📁 Project Structure

```
student/
├── src/
│   ├── components/
│   │   ├── Dictionary.tsx       # Dictionary with search
│   │   ├── WordOfDay.tsx       # Daily word feature
│   │   ├── Quiz.tsx            # Interactive quiz
│   │   └── WordCard.tsx        # Word display component
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   │
│   ├── data/
│   │   └── words.ts            # Sample Kirundi words
│   │
│   ├── utils/
│   │   └── shuffle.ts          # Array shuffle utility
│   │
│   ├── hooks/
│   │   └── useLocalStorage.ts  # AsyncStorage hook
│   │
│   └── App.tsx                 # Main app component
│
├── index.tsx                   # Expo entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── babel.config.js             # Babel config
```

## 📝 Key Differences from Web Version

### React Native Components
- `<div>` → `<View>`
- `<input>` → `<TextInput>`
- `<img>` → `<Image>`
- `<button>` → `<TouchableOpacity>`

### Styling
- No Tailwind CSS - uses **StyleSheet** instead
- All styles defined in JavaScript objects
- Example:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  }
});
```

### Storage
- No `localStorage` - uses **AsyncStorage**
- Async operations (await/async)
- More reliable on mobile

## 🎨 Customization

### Change Colors
Edit StyleSheet objects in components:
```typescript
// Current green theme
backgroundColor: '#16a34a'  // Change to any hex color

// Example: Blue theme
backgroundColor: '#3b82f6'
```

### Add More Words
Edit `src/data/words.ts`:
```typescript
{
  id: '9',
  kirundi: 'Your word',
  english: 'Translation',
  french: 'Traduction',
  pronunciation: 'pro-nun-ci-a-tion',
  example: 'Example sentence',
  category: 'category-name',
  imageUrl: 'https://example.com/image.jpg'
}
```

## 📱 Building for Production

### Create Standalone Apps

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Configure build:**
```bash
eas build:configure
```

4. **Build for Android:**
```bash
eas build --platform android
```

5. **Build for iOS:**
```bash
eas build --platform ios
```

### Publish Updates (Over-the-Air)
```bash
eas update --branch production
```

## 🌐 Publishing to App Stores

### Google Play Store
1. Build APK/AAB: `eas build --platform android`
2. Create Google Play Developer account ($25 one-time)
3. Upload APK through Play Console
4. Fill out store listing
5. Submit for review

### Apple App Store
1. Build IPA: `eas build --platform ios`
2. Create Apple Developer account ($99/year)
3. Upload through App Store Connect
4. Fill out store listing
5. Submit for review

## 🆓 Free Hosting Alternative

**Expo Go Distribution** (No app store needed):
- Share your Expo project link
- Users install Expo Go
- They scan QR or click link
- App runs in Expo Go
- **Free forever!**

## 🔧 Troubleshooting

**Metro bundler error:**
```bash
npx expo start -c
```

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**Cache issues:**
```bash
npx expo start --clear
```

**Can't scan QR code:**
- Make sure phone and computer are on same WiFi
- Try typing the URL manually in Expo Go

## 📱 Testing Tips

1. **Use Expo Go** for instant testing (no build needed)
2. **Test on real device** - emulators can be slow
3. **Shake phone** for dev menu while testing
4. **Enable hot reload** - changes appear instantly

## 🚀 Next Steps

### Phase 1 (You are here) ✅
- Mobile-first design
- Core features working
- Test on real device

### Phase 2
- Add audio pronunciations
- User authentication (Firebase)
- Progress tracking
- Push notifications for Word of Day

### Phase 3
- Offline mode
- Social features (leaderboards)
- Parent dashboard
- Admin panel

## 💡 Tips

1. **Start testing immediately** - `npm start` and scan QR
2. **Add words incrementally** - Edit `data/words.ts`
3. **Test on actual phone** - More reliable than emulator
4. **Share via Expo Go** - Get feedback before publishing
5. **Use EAS Build** - When ready for app stores

## 🆘 Getting Help

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Stack Overflow**: Tag with `expo` and `react-native`

## 📧 Current Sample Data

8 starter words included:
1. Mwaramutse - Good morning
2. Igitabo - Book
3. Umunsi mwiza - Good day
4. Amazi - Water
5. Umuryango - Family
6. Urakoze - Thank you
7. Ikawa - Coffee
8. Umwana - Child

---

**Ready to launch!** 🚀

Run `npm start` and scan the QR code with Expo Go on your phone!