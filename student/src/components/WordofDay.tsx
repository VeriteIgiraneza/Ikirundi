import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Word } from '../types';
import { WordCard } from './WordCard';

interface WordOfDayProps {
  words: Word[];
}

export const WordOfDay: React.FC<WordOfDayProps> = ({ words }) => {
  const [wordOfDay, setWordOfDay] = useState<Word | null>(null);

  useEffect(() => {
    // Get today's date as a seed for consistent daily word
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Word of the Day</Text>
        </View>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <View style={styles.cardContainer}>
        <WordCard word={wordOfDay} />
      </View>

      <View style={styles.tip}>
        <Text style={styles.tipText}>
          <Text style={styles.tipEmoji}>💡 </Text>
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
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    padding: 20,
    margin: 6,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#d1fae5',
  },
  cardContainer: {
    padding: 16,
  },
  tip: {
    backgroundColor: '#dbeafe',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    padding: 16,
    margin: 6,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  tipEmoji: {
    fontSize: 14,
  },
  tipBold: {
    fontWeight: 'bold',
  },
});