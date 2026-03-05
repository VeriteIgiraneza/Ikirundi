import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { Story, StoryWord } from '../types/storyTypes';
import { Theme } from '../i18n/themes';
import { TranslationLang } from '../i18n/translations';

interface StoryReaderProps {
  story: Story;
  theme: Theme;
  translationLang: TranslationLang;
  onBack: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, theme, translationLang, onBack }) => {
  const [selectedWord, setSelectedWord] = useState<StoryWord | null>(null);
  const [tappedWords, setTappedWords] = useState<Set<string>>(new Set());

  const findWordTranslation = (word: string): StoryWord | undefined => {
    const cleaned = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
    return story.words.find(w => w.kirundi.toLowerCase() === cleaned);
  };

  const handleWordTap = (word: string) => {
    const translation = findWordTranslation(word);
    if (translation) {
      setSelectedWord(translation);
      setTappedWords(prev => new Set(prev).add(translation.kirundi.toLowerCase()));
    }
  };

  const getTranslation = (word: StoryWord): string => {
    if (translationLang === 'fr') return word.french;
    if (translationLang === 'both') return `${word.english} / ${word.french}`;
    return word.english;
  };

  const renderParagraph = (paragraph: string, paragraphIndex: number) => {
    const words = paragraph.split(' ');
    return (
      <Text key={paragraphIndex} style={styles.paragraph}>
        {words.map((word, wordIndex) => {
          const translation = findWordTranslation(word);
          const isTranslatable = !!translation;
          const wasTapped = translation && tappedWords.has(translation.kirundi.toLowerCase());

          return (
            <Text key={`${paragraphIndex}-${wordIndex}`}>
              <Text
                onPress={() => handleWordTap(word)}
                style={[
                  styles.word,
                  { color: theme.text },
                  isTranslatable && [styles.translatableWord, { color: theme.title }],
                  wasTapped && { textDecorationLine: 'underline', textDecorationColor: theme.accent },
                ]}
              >
                {word}
              </Text>
              {wordIndex < words.length - 1 && <Text style={{ color: theme.text }}> </Text>}
            </Text>
          );
        })}
      </Text>
    );
  };

  const translatedTitle = translationLang === 'fr' ? story.titleFrench : story.titleEnglish;
  const moral = story.moral;
  const moralTranslation = translationLang === 'fr' ? story.moralFrench : story.moralEnglish;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView style={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity onPress={onBack} style={[styles.backButton, { backgroundColor: theme.card }]}>
          <Text style={[styles.backText, { color: theme.title }]}>← Back to Stories</Text>
        </TouchableOpacity>

        {/* Story Header */}
        <View style={[styles.storyHeader, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <Text style={[styles.storyTitle, { color: theme.title }]}>{story.title}</Text>
          <Text style={[styles.storyTranslatedTitle, { color: theme.subtext }]}>{translatedTitle}</Text>
          <Text style={[styles.tapHint, { color: theme.subtext, backgroundColor: theme.badge }]}>
            Tap highlighted words to see translations
          </Text>
        </View>

        {/* Story Content */}
        <View style={[styles.storyContent, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          {story.paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
        </View>

        {/* Moral */}
        {moral && (
          <View style={[styles.moralBox, { backgroundColor: theme.badge, borderLeftColor: theme.accent }]}>
            <Text style={[styles.moralLabel, { color: theme.badgeText }]}>Moral:</Text>
            <Text style={[styles.moralText, { color: theme.badgeText }]}>{moral}</Text>
            <Text style={[styles.moralTranslation, { color: theme.subtext }]}>{moralTranslation}</Text>
          </View>
        )}

        {/* Word List */}
        <View style={[styles.wordListSection, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <Text style={[styles.wordListTitle, { color: theme.title }]}>
            Words in this story ({story.words.length})
          </Text>
          <Text style={[styles.wordListSubtitle, { color: theme.subtext }]}>
            {tappedWords.size} of {story.words.length} discovered
          </Text>
          <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.accent,
                  width: `${(tappedWords.size / story.words.length) * 100}%`,
                },
              ]}
            />
          </View>
          {story.words.map((word, index) => {
            const discovered = tappedWords.has(word.kirundi.toLowerCase());
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedWord(word);
                  setTappedWords(prev => new Set(prev).add(word.kirundi.toLowerCase()));
                }}
                style={[
                  styles.wordListItem,
                  { borderBottomColor: theme.border },
                  discovered && { backgroundColor: theme.badge },
                ]}
              >
                <Text style={[styles.wordKirundi, { color: theme.title }]}>{word.kirundi}</Text>
                {discovered ? (
                  <Text style={[styles.wordTranslation, { color: theme.text }]}>{getTranslation(word)}</Text>
                ) : (
                  <Text style={[styles.wordHidden, { color: theme.subtext }]}>Tap to reveal</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Translation Popup */}
      <Modal visible={selectedWord !== null} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedWord(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card, shadowColor: theme.text }]}>
            <Text style={[styles.modalKirundi, { color: theme.title }]}>{selectedWord?.kirundi}</Text>
            <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />
            <Text style={[styles.modalTranslation, { color: theme.text }]}>
              {selectedWord && getTranslation(selectedWord)}
            </Text>
            <Text style={[styles.modalDismiss, { color: theme.subtext }]}>Tap anywhere to close</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
  storyHeader: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storyTranslatedTitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  tapHint: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
  },
  storyContent: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 16,
  },
  word: {
    fontSize: 18,
  },
  translatableWord: {
    fontWeight: '600',
  },
  moralBox: {
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  moralLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moralText: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  moralTranslation: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  wordListSection: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wordListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  wordListSubtitle: {
    fontSize: 13,
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  wordListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRadius: 6,
    marginBottom: 2,
  },
  wordKirundi: {
    fontSize: 15,
    fontWeight: '600',
  },
  wordTranslation: {
    fontSize: 14,
  },
  wordHidden: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 14,
    padding: 24,
    width: '75%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalKirundi: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalDivider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  modalTranslation: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDismiss: {
    fontSize: 12,
  },
});