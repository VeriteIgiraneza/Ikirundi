import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Language } from '../i18n/translations';

interface SettingsProps {
  displayLang: Language;
  translationLang: Language;
  onDisplayLangChange: (lang: Language) => void;
  onTranslationLangChange: (lang: Language) => void;
  strings: Record<string, string>;
}

export const Settings: React.FC<SettingsProps> = ({
  displayLang,
  translationLang,
  onDisplayLangChange,
  onTranslationLangChange,
  strings,
}) => {
  return (
    <ScrollView style={styles.container}>
      {/* Display Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{strings.displayLanguage}</Text>
        <Text style={styles.sectionDesc}>{strings.displayLanguageDesc}</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            onPress={() => onDisplayLangChange('en')}
            style={[
              styles.optionButton,
              displayLang === 'en' && styles.optionButtonActive,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                displayLang === 'en' && styles.optionTextActive,
              ]}
            >
              {strings.englishLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDisplayLangChange('fr')}
            style={[
              styles.optionButton,
              displayLang === 'fr' && styles.optionButtonActive,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                displayLang === 'fr' && styles.optionTextActive,
              ]}
            >
              {strings.frenchLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Translation Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{strings.translationLanguage}</Text>
        <Text style={styles.sectionDesc}>{strings.translationLanguageDesc}</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            onPress={() => onTranslationLangChange('en')}
            style={[
              styles.optionButton,
              translationLang === 'en' && styles.optionButtonActive,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                translationLang === 'en' && styles.optionTextActive,
              ]}
            >
              {strings.englishLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTranslationLangChange('fr')}
            style={[
              styles.optionButton,
              translationLang === 'fr' && styles.optionButtonActive,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                translationLang === 'fr' && styles.optionTextActive,
              ]}
            >
              {strings.frenchLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#6b7280',
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
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: '#16a34a',
    backgroundColor: '#d1fae5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  optionTextActive: {
    color: '#15803d',
    fontWeight: '700',
  },
});