import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { Language } from '../i18n/translations';
import { Theme, ThemeMode } from '../i18n/themes';

interface SettingsProps {
  displayLang: Language;
  translationLang: Language;
  onDisplayLangChange: (lang: Language) => void;
  onTranslationLangChange: (lang: Language) => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  strings: Record<string, string>;
  theme: Theme;
}

export const Settings: React.FC<SettingsProps> = ({
  displayLang,
  translationLang,
  onDisplayLangChange,
  onTranslationLangChange,
  themeMode,
  onThemeModeChange,
  strings,
  theme,
}) => {
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Display Language */}
      <View style={[styles.section, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{strings.displayLanguage}</Text>
        <Text style={[styles.sectionDesc, { color: theme.subtext }]}>{strings.displayLanguageDesc}</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            onPress={() => onDisplayLangChange('en')}
            style={[
              styles.optionButton,
              { borderColor: theme.border, backgroundColor: theme.input },
              displayLang === 'en' && { borderColor: theme.accent, backgroundColor: theme.badge },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                { color: theme.text },
                displayLang === 'en' && { color: theme.title, fontWeight: '700' },
              ]}
            >
              {strings.englishLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDisplayLangChange('fr')}
            style={[
              styles.optionButton,
              { borderColor: theme.border, backgroundColor: theme.input },
              displayLang === 'fr' && { borderColor: theme.accent, backgroundColor: theme.badge },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                { color: theme.text },
                displayLang === 'fr' && { color: theme.title, fontWeight: '700' },
              ]}
            >
              {strings.frenchLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Translation Language */}
      <View style={[styles.section, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{strings.translationLanguage}</Text>
        <Text style={[styles.sectionDesc, { color: theme.subtext }]}>{strings.translationLanguageDesc}</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            onPress={() => onTranslationLangChange('en')}
            style={[
              styles.optionButton,
              { borderColor: theme.border, backgroundColor: theme.input },
              translationLang === 'en' && { borderColor: theme.accent, backgroundColor: theme.badge },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                { color: theme.text },
                translationLang === 'en' && { color: theme.title, fontWeight: '700' },
              ]}
            >
              {strings.englishLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTranslationLangChange('fr')}
            style={[
              styles.optionButton,
              { borderColor: theme.border, backgroundColor: theme.input },
              translationLang === 'fr' && { borderColor: theme.accent, backgroundColor: theme.badge },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                { color: theme.text },
                translationLang === 'fr' && { color: theme.title, fontWeight: '700' },
              ]}
            >
              {strings.frenchLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Monochrome Toggle */}
      <View style={[styles.section, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{strings.monochromeUI}</Text>
            <Text style={[styles.sectionDesc, { color: theme.subtext }]}>{strings.monochromeUIDesc}</Text>
          </View>
          <Switch
            value={themeMode === 'mono'}
            onValueChange={(value) => onThemeModeChange(value ? 'mono' : 'color')}
            trackColor={{ false: '#e5e7eb', true: '#333333' }}
            thumbColor={'#fff'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
});