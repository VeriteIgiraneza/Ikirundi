import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Word } from '../types';
import { WordCard } from './WordCard';
import { Theme } from '../i18n/themes';
import { TranslationLang } from '../i18n/translations';

interface DictionaryProps {
  words: Word[];
  theme: Theme;
  translationLang: TranslationLang;
}

export const Dictionary: React.FC<DictionaryProps> = ({ words, theme, translationLang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(words.map(w => w.category).filter((c): c is string => Boolean(c)))];

  const filteredWords = words.filter(word => {
    const matchesSearch = 
      word.kirundi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.french?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || word.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
          placeholder="Search in Kirundi, English, or French..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={theme.subtext}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                { backgroundColor: theme.badge },
                selectedCategory === cat && { backgroundColor: theme.accent }
              ]}
            >
              <Text style={[
                styles.categoryText,
                { color: theme.badgeText },
                selectedCategory === cat && { color: theme.accentText }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.wordsContainer}>
        {filteredWords.map(word => (
          <WordCard key={word.id} word={word} theme={theme} translationLang={translationLang} />
        ))}
      </View>

      {filteredWords.length === 0 && (
        <View style={styles.noResults}>
          <Text style={[styles.noResultsText, { color: theme.subtext }]}>
            No words found. Try a different search term!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  wordsContainer: {
    padding: 8,
  },
  noResults: {
    padding: 48,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
});