import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Word } from '../types';
import { shuffle } from '../utils/shuffle';
import { Theme } from '../i18n/themes';
import { TranslationLang } from '../i18n/translations';

interface QuizProps {
  words: Word[];
  theme: Theme;
  translationLang: TranslationLang;
}

export const Quiz: React.FC<QuizProps> = ({ words, theme, translationLang }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [skippedWords, setSkippedWords] = useState<Word[]>([]);
  const [answeredWords, setAnsweredWords] = useState<Array<{ word: Word; correct: boolean; userAnswer: string }>>([]);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    word: Word;
    options: string[];
    correctAnswer: string;
  }>>([]);

  const getTranslation = (word: Word): string => {
    if (translationLang === 'fr' && word.french) return word.french;
    return word.english;
  };

  useEffect(() => {
    const shuffledWords = shuffle(words).slice(0, 5);
    const questions = shuffledWords.map(word => {
      const correctAnswer = getTranslation(word);
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .map(w => getTranslation(w))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = shuffle([correctAnswer, ...wrongAnswers]);
      return { word, options, correctAnswer };
    });
    setQuizQuestions(questions);
  }, [words]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnsweredWords(prev => [...prev, {
      word: quizQuestions[currentQuestion].word,
      correct: isCorrect,
      userAnswer: answer,
    }]);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleSkip = () => {
    setSkippedWords(prev => [...prev, quizQuestions[currentQuestion].word]);
    handleNext();
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setSkippedWords([]);
    setAnsweredWords([]);
    const shuffledWords = shuffle(words).slice(0, 5);
    const questions = shuffledWords.map(word => {
      const correctAnswer = getTranslation(word);
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .map(w => getTranslation(w))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = shuffle([correctAnswer, ...wrongAnswers]);
      return { word, options, correctAnswer };
    });
    setQuizQuestions(questions);
  };

  if (quizQuestions.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.bg }]}>
        <Text style={[styles.loadingText, { color: theme.subtext }]}>Loading quiz...</Text>
      </View>
    );
  }

  if (showResult) {
    const percentage = (score / quizQuestions.length) * 100;
    const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '💪';
    const message = percentage >= 80 
      ? 'Excellent work! 🌟' 
      : percentage >= 60 
        ? 'Good job! Keep practicing!' 
        : 'Keep learning! You\'ll get better!';

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={[styles.resultCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={[styles.resultTitle, { color: theme.text }]}>Quiz Complete!</Text>
          <Text style={[styles.resultScore, { color: theme.accent }]}>
            {score} / {quizQuestions.length}
          </Text>
          <Text style={[styles.resultMessage, { color: theme.subtext }]}>{message}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.accent }]} onPress={resetQuiz}>
            <Text style={[styles.retryButtonText, { color: theme.accentText }]}>Try Again</Text>
          </TouchableOpacity>

          {answeredWords.length > 0 && (
            <View style={[styles.skippedSection, { borderTopColor: theme.border }]}>
              <Text style={[styles.skippedTitle, { color: theme.text }]}>
                Your Answers ({answeredWords.length})
              </Text>
              {answeredWords.map((item, index) => (
                <View key={`answered-${item.word.id}-${index}`} style={[styles.answeredItem, { backgroundColor: item.correct ? '#d1fae5' : '#fee2e2', borderColor: item.correct ? '#16a34a' : '#dc2626' }]}>
                  <View style={styles.answeredTop}>
                    <Text style={[styles.skippedKirundi, { color: theme.title }]}>{item.word.kirundi}</Text>
                    <Text style={{ fontSize: 18 }}>{item.correct ? '✅' : '❌'}</Text>
                  </View>
                  <Text style={[styles.answeredCorrect, { color: theme.subtext }]}>
                    Answer: {getTranslation(item.word)}
                  </Text>
                  {!item.correct && (
                    <Text style={[styles.answeredWrong, { color: '#dc2626' }]}>
                      You chose: {item.userAnswer}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {skippedWords.length > 0 && (
            <View style={[styles.skippedSection, { borderTopColor: theme.border }]}>
              <Text style={[styles.skippedTitle, { color: theme.text }]}>
                Skipped Words ({skippedWords.length})
              </Text>
              {skippedWords.map((word, index) => (
                <View key={`skipped-${word.id}-${index}`} style={[styles.skippedItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Text style={[styles.skippedKirundi, { color: theme.title }]}>{word.kirundi}</Text>
                  <Text style={[styles.skippedTranslation, { color: theme.subtext }]}>
                    {getTranslation(word)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Progress */}
      <View style={[styles.progressCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: theme.subtext }]}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </Text>
          <Text style={[styles.scoreText, { color: theme.accent }]}>Score: {score}</Text>
        </View>
        <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: theme.accent }]} />
        </View>
      </View>

      {/* Question */}
      <View style={[styles.questionCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        {question.word.imageUrl && (
          <Image 
            source={{ uri: question.word.imageUrl }}
            style={styles.questionImage}
            resizeMode="cover"
          />
        )}
        
        <Text style={[styles.questionText, { color: theme.text }]}>
          What does <Text style={{ color: theme.title }}>"{question.word.kirundi}"</Text> mean?
        </Text>
        
        {question.word.pronunciation && (
          <Text style={[styles.pronunciation, { color: theme.subtext }]}>/{question.word.pronunciation}/</Text>
        )}

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showFeedback = selectedAnswer !== null;

            let bgColor = theme.input;
            let borderColor = theme.border;
            if (showFeedback) {
              if (isCorrect) {
                bgColor = theme.badge;
                borderColor = theme.accent;
              } else if (isSelected) {
                bgColor = '#fee2e2';
                borderColor = '#dc2626';
              }
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => !selectedAnswer && handleAnswer(option)}
                disabled={selectedAnswer !== null}
                style={[styles.option, { backgroundColor: bgColor, borderColor: borderColor }]}
              >
                <Text style={[styles.optionText, { color: theme.text }]}>
                  {option}
                  {showFeedback && isCorrect }
                  {showFeedback && isSelected && !isCorrect }
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setSelectedAnswer(null);
              }
            }}
            disabled={currentQuestion === 0}
            style={[styles.navButton, { backgroundColor: theme.badge, opacity: currentQuestion === 0 ? 0.4 : 1 }]}
          >
            <Text style={[styles.navButtonText, { color: theme.badgeText }]}>← Previous</Text>
          </TouchableOpacity>

          {!selectedAnswer && (
            <TouchableOpacity
              onPress={handleSkip}
              style={[styles.navButton, { backgroundColor: theme.border }]}
            >
              <Text style={[styles.navButtonText, { color: theme.text }]}>Skip</Text>
            </TouchableOpacity>
          )}

          {selectedAnswer && (
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.navButton, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.navButtonText, { color: theme.accentText }]}>
                {currentQuestion + 1 < quizQuestions.length ? 'Next →' : 'See Results'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  loadingText: {
    fontSize: 16,
  },
  progressCard: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  questionCard: {
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultCard: {
    borderRadius: 12,
    padding: 32,
    margin: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skippedSection: {
    width: '100%',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  skippedTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  skippedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  skippedKirundi: {
    fontSize: 16,
    fontWeight: '600',
  },
  skippedTranslation: {
    fontSize: 14,
  },
  answeredItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  answeredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  answeredCorrect: {
    fontSize: 13,
  },
  answeredWrong: {
    fontSize: 13,
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});