import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Word } from '../types';
import { WordCard } from './WordCard';

interface DictionaryProps {
  words: Word[];
}

export const Dictionary: React.FC<DictionaryProps> = ({ words }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...new Set(words.map(w => w.category).filter(Boolean))];

  // Filter words
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kirundi Dictionary</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search in Kirundi, English, or French..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#9ca3af"
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
                selectedCategory === cat && styles.categoryButtonActive
              ]}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.resultCount}>
        Showing {filteredWords.length} {filteredWords.length === 1 ? 'word' : 'words'}
      </Text>

      <View style={styles.wordsContainer}>
        {filteredWords.map(word => (
          <WordCard key={word.id} word={word} />
        ))}
      </View>

      {filteredWords.length === 0 && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>
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
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#16a34a',
  },
  categoryText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultCount: {
    color: '#6b7280',
    fontSize: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  wordsContainer: {
    padding: 16,
  },
  noResults: {
    padding: 48,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
});