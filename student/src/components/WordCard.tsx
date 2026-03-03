import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  showImage?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ word, showImage = true }) => {
  return (
    <View style={styles.container}>
      {showImage && word.imageUrl && (
        <Image 
          source={{ uri: word.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.kirundi}>{word.kirundi}</Text>
          {word.pronunciation && (
            <Text style={styles.pronunciation}>/{word.pronunciation}/</Text>
          )}
        </View>
        
        <View style={styles.translations}>
          <View style={styles.translationBox}>
            <Text style={styles.label}>ENGLISH</Text>
            <Text style={styles.translation}>{word.english}</Text>
          </View>
          {word.french && (
            <View style={styles.translationBox}>
              <Text style={styles.label}>FRENCH</Text>
              <Text style={styles.translation}>{word.french}</Text>
            </View>
          )}
        </View>
        
        {word.example && (
          <View style={styles.exampleSection}>
            <Text style={styles.label}>EXAMPLE</Text>
            <Text style={styles.example}>{word.example}</Text>
          </View>
        )}
        
        {word.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{word.category}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 12,
  },
  kirundi: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  pronunciation: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  translations: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  translationBox: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  translation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  exampleSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginBottom: 12,
  },
  example: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  categoryBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '500',
  },
});