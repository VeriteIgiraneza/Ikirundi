import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Word } from '../types';
import { shuffle } from '../utils/shuffle';
import { Theme } from '../i18n/themes';

interface QuizProps {
  words: Word[];
  theme: Theme;
}

export const Quiz: React.FC<QuizProps> = ({ words, theme }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    word: Word;
    options: string[];
    correctAnswer: string;
  }>>([]);

  useEffect(() => {
    const shuffledWords = shuffle(words).slice(0, 5);
    const questions = shuffledWords.map(word => {
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .map(w => w.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = shuffle([word.english, ...wrongAnswers]);
      return { word, options, correctAnswer: word.english };
    });
    setQuizQuestions(questions);
  }, [words]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    const shuffledWords = shuffle(words).slice(0, 5);
    const questions = shuffledWords.map(word => {
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .map(w => w.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = shuffle([word.english, ...wrongAnswers]);
      return { word, options, correctAnswer: word.english };
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
                  {showFeedback && isCorrect && ' ✅'}
                  {showFeedback && isSelected && !isCorrect && ' ❌'}
                </Text>
              </TouchableOpacity>
            );
          })}
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
});