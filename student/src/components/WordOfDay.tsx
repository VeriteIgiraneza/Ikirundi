import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Word } from '../types';
import { WordCard } from './WordCard';
import { Theme } from '../i18n/themes';
import { TranslationLang } from '../i18n/translations';

interface WordOfDayProps {
  words: Word[];
  theme: Theme;
  translationLang: TranslationLang;
}

export const WordOfDay: React.FC<WordOfDayProps> = ({ words, theme, translationLang }) => {
  const [wordOfDay, setWordOfDay] = useState<Word | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % words.length;
    setWordOfDay(words[index]);
  }, [words]);

  if (!wordOfDay) return null;

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.accent }]}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={[styles.title, { color: theme.accentText }]}>Word of the Day</Text>
        </View>
        <Text style={{ fontSize: 14, color: theme.accentText, opacity: 0.8 }}>{formattedDate}</Text>
      </View>

      <View style={styles.cardContainer}>
        <WordCard word={wordOfDay} theme={theme} translationLang={translationLang} />
      </View>

      <View style={[styles.tip, { backgroundColor: theme.badge, borderLeftColor: theme.accent }]}>
        <Text style={[styles.tipText, { color: theme.badgeText }]}>
          <Text style={styles.tipBold}>Tip: </Text>
          Come back tomorrow for a new word! Try to use today's word in a sentence before the day ends.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardContainer: {
    padding: 16,
  },
  tip: {
    borderLeftWidth: 4,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: 'bold',
  },
});