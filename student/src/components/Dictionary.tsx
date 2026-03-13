import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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

  const categories = useMemo(
    () => ['all', ...new Set(words.map(w => w.category).filter((c): c is string => Boolean(c)))],
    [words]
  );

  const filteredWords = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return words.filter(word => {
      const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!search) return true;
      return (
        word.kirundi.toLowerCase().includes(search) ||
        word.english.toLowerCase().includes(search) ||
        word.french?.toLowerCase().includes(search)
      );
    });
  }, [words, searchTerm, selectedCategory]);

  const renderItem = useCallback(({ item }: { item: Word }) => (
    <WordCard word={item} theme={theme} translationLang={translationLang} />
  ), [theme, translationLang]);

  const keyExtractor = useCallback((item: Word) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Search & Categories */}
      <View style={[styles.header, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
          placeholder="Search in Kirundi, English, or French..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={theme.subtext}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(cat) => cat}
          style={styles.categoryScroll}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                { backgroundColor: theme.badge },
                selectedCategory === cat && { backgroundColor: theme.accent },
              ]}
            >
              <Text style={[
                styles.categoryText,
                { color: theme.badgeText },
                selectedCategory === cat && { color: theme.accentText },
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Word List */}
      <FlatList
        data={filteredWords}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.wordsContainer}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.noResults}>
            <Text style={[styles.noResultsText, { color: theme.subtext }]}>
              No words found. Try a different search term!
            </Text>
          </View>
        }
      />
    </View>
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