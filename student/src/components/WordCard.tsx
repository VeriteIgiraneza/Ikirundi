import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Word } from '../types';
import { Theme } from '../i18n/themes';
import { TranslationLang } from '../i18n/translations';

interface WordCardProps {
  word: Word;
  showImage?: boolean;
  theme: Theme;
  translationLang?: TranslationLang;
}

export const WordCard: React.FC<WordCardProps> = ({ word, showImage = true, theme, translationLang = 'both' }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.card, shadowColor: theme.text }]}>
      {showImage && word.imageUrl && (
        <Image 
          source={{ uri: word.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.kirundi, { color: theme.title }]}>{word.kirundi}</Text>
          {word.pronunciation && (
            <Text style={[styles.pronunciation, { color: theme.subtext }]}>/{word.pronunciation}/</Text>
          )}
        </View>
        
        <View style={styles.translations}>
          {(translationLang === 'en' || translationLang === 'both') && (
            <View style={styles.translationBox}>
              <Text style={[styles.label, { color: theme.subtext }]}>ENGLISH</Text>
              <Text style={[styles.translation, { color: theme.text }]}>{word.english}</Text>
            </View>
          )}
          {(translationLang === 'fr' || translationLang === 'both') && word.french && (
            <View style={styles.translationBox}>
              <Text style={[styles.label, { color: theme.subtext }]}>FRENCH</Text>
              <Text style={[styles.translation, { color: theme.text }]}>{word.french}</Text>
            </View>
          )}
        </View>
        
        {word.example && (
          <View style={[styles.exampleSection, { borderTopColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.subtext }]}>EXAMPLE</Text>
            <Text style={[styles.example, { color: theme.text }]}>{word.example}</Text>
          </View>
        )}
        
        {word.category && (
          <View style={[styles.categoryBadge, { backgroundColor: theme.badge }]}>
            <Text style={[styles.categoryText, { color: theme.badgeText }]}>{word.category}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
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
    marginBottom: 4,
  },
  pronunciation: {
    fontSize: 14,
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
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  translation: {
    fontSize: 16,
    fontWeight: '500',
  },
  exampleSection: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginBottom: 12,
  },
  example: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});