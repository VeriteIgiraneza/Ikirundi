import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Story, Difficulty } from '../types/storyTypes';
import { Theme } from '../i18n/themes';
import { TranslationLang } from '../i18n/translations';

interface StoriesListProps {
  stories: Story[];
  theme: Theme;
  translationLang: TranslationLang;
  onSelectStory: (story: Story) => void;
}

const difficultyColors: Record<Difficulty, { bg: string; text: string }> = {
  easy: { bg: '#d1fae5', text: '#065f46' },
  medium: { bg: '#fef3c7', text: '#92400e' },
  hard: { bg: '#fee2e2', text: '#991b1b' },
};

const difficultyColorsMonoMap: Record<Difficulty, { bg: string; text: string }> = {
  easy: { bg: '#3a3a3a', text: '#d4d4d4' },
  medium: { bg: '#4a4a4a', text: '#d4d4d4' },
  hard: { bg: '#555555', text: '#d4d4d4' },
};

export const StoriesList: React.FC<StoriesListProps> = ({ stories, theme, translationLang, onSelectStory }) => {
  const isMono = theme.accent === '#555555';

  const getDifficultyLabel = (d: Difficulty) => {
    return d === 'easy' ? 'Easy' : d === 'medium' ? 'Medium' : 'Hard';
  };

  const getDifficultyColors = (d: Difficulty) => {
    return isMono ? difficultyColorsMonoMap[d] : difficultyColors[d];
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Tap a story to start reading. Tap any word to see its translation.
      </Text>

      {stories.map((story) => {
        const colors = getDifficultyColors(story.difficulty);
        const title = story.title;
        const description = translationLang === 'fr' ? story.descriptionFrench : story.description;
        const translatedTitle = translationLang === 'fr' ? story.titleFrench : story.titleEnglish;

        return (
          <TouchableOpacity
            key={story.id}
            onPress={() => onSelectStory(story)}
            style={[styles.storyCard, { backgroundColor: theme.card, shadowColor: theme.text }]}
          >
            <View style={styles.storyHeader}>
              <Text style={[styles.storyTitle, { color: theme.title }]}>{title}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: colors.bg }]}>
                <Text style={[styles.difficultyText, { color: colors.text }]}>
                  {getDifficultyLabel(story.difficulty)}
                </Text>
              </View>
            </View>
            <Text style={[styles.translatedTitle, { color: theme.subtext }]}>{translatedTitle}</Text>
            <Text style={[styles.storyDescription, { color: theme.text }]}>{description}</Text>
            <Text style={[styles.paragraphCount, { color: theme.subtext }]}>
              {story.paragraphs.length} paragraphs · {story.words.length} words to learn
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  storyCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  translatedTitle: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  storyDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  paragraphCount: {
    fontSize: 12,
  },
});