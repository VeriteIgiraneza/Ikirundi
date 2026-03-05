import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Dictionary } from './components/Dictionary';
import { WordOfDay } from './components/WordOfDay';
import { Quiz } from './components/Quiz';
import { sampleWords } from './data/words';
import { Settings } from './components/Settings';
import { translations, Language, TranslationLang } from './i18n/translations';
import { themes, ThemeMode } from './i18n/themes';
import { SafeAreaView } from 'react-native-safe-area-context';

type Screen = 'dictionary' | 'wordOfDay' | 'quiz' | 'settings';

const DRAWER_WIDTH = 280;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dictionary');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayLang, setDisplayLang] = useState<Language>('en');
  const [translationLang, setTranslationLang] = useState<TranslationLang>('both');
  const [themeMode, setThemeMode] = useState<ThemeMode>('color');
  const strings = translations[displayLang];
  const theme = themes[themeMode];
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerOpen(false);
    });
  };

  const navigateTo = (screen: Screen) => {
    setActiveScreen(screen);
    closeDrawer();
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dictionary':
        return strings.dictionary;
      case 'wordOfDay':
        return strings.wordOfDay;
      case 'quiz':
        return strings.quiz;
      case 'settings':
        return strings.settings;
    }
  };

  const menuItems: { screen: Screen; label: string }[] = [
    { screen: 'dictionary', label: strings.dictionary },
    { screen: 'wordOfDay', label: strings.wordOfDay },
    { screen: 'quiz', label: strings.quiz },
    { screen: 'settings', label: strings.settings },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.header }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />

      {/* Header with Hamburger */}
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburger}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <View style={[styles.content, { backgroundColor: theme.bg }]}>
        {activeScreen === 'dictionary' && <Dictionary words={sampleWords} theme={theme} translationLang={translationLang} />}
        {activeScreen === 'wordOfDay' && <WordOfDay words={sampleWords} theme={theme} translationLang={translationLang} />}
        {activeScreen === 'quiz' && <Quiz words={sampleWords} theme={theme} translationLang={translationLang} />}
        {activeScreen === 'settings' && (
          <Settings
            displayLang={displayLang}
            translationLang={translationLang}
            onDisplayLangChange={setDisplayLang}
            onTranslationLangChange={setTranslationLang}
            themeMode={themeMode}
            onThemeModeChange={setThemeMode}
            strings={strings}
            theme={theme}
          />
        )}
      </View>

      {/* Overlay (dark background when drawer is open) */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Side Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }], backgroundColor: theme.card },
        ]}
      >
        {/* Drawer Header */}
        <View style={[styles.drawerHeader, { backgroundColor: theme.header }]}>
          <Text style={styles.drawerTitle}>🇧🇮 {strings.learnKirundi}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.screen}
              onPress={() => navigateTo(item.screen)}
              style={[
                styles.menuItem,
                activeScreen === item.screen && [styles.menuItemActive, { backgroundColor: theme.badge }],
              ]}
            >
              <Text
                style={[
                  styles.menuLabel,
                  { color: theme.text },
                  activeScreen === item.screen && [styles.menuLabelActive, { color: theme.title }],
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Drawer Footer */}
        {/* Drawer Footer */}
        <Text style={[styles.versionText, { color: theme.subtext }]}>Version 1.0.0</Text>
        <View style={[styles.madeWithLoveBox, { borderTopColor: theme.border }]}>
          <Text style={[styles.drawerFooterText, { color: theme.subtext }]}>{strings.madeWithLove}</Text>       
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15803d',
  },

  // Header
  header: {
    backgroundColor: '#15803d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: Platform.OS === 'ios' ? -14 : -6,
  },
  hamburger: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  hamburgerLine: {
    width: 22,
    height: 2.5,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerRight: {
    width: 36,
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },

  // Footer
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 10,
  },

  // Drawer
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
    paddingBottom: Platform.OS === 'android' ? 40 : 20,
  },
  drawerHeader: {
    backgroundColor: '#15803d',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 4,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#d1fae5',
    lineHeight: 20,
  },

  // Menu Items
  menuList: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  menuItemActive: {
    backgroundColor: '#d1fae5',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  menuLabelActive: {
    color: '#15803d',
    fontWeight: '700',
  },

  // Drawer Footer
  versionText: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'left',
    paddingHorizontal: 6,
    marginBottom: 4,
  },

  madeWithLoveBox: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  // Drawer Footer
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: Platform.OS === 'android' ? 20 : 10,
  },
  drawerFooterText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#6b7280',
  },
});

export default App;