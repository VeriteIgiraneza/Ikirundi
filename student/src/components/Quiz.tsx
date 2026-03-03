import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Word } from '../types';
import { shuffle } from '../utils/shuffle';

interface QuizProps {
  words: Word[];
}

export const Quiz: React.FC<QuizProps> = ({ words }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    word: Word;
    options: string[];
    correctAnswer: string;
  }>>([]);

  // Generate quiz questions
  useEffect(() => {
    const shuffledWords = shuffle(words).slice(0, 5);
    const questions = shuffledWords.map(word => {
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .map(w => w.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = shuffle([word.english, ...wrongAnswers]);

      return {
        word,
        options,
        correctAnswer: word.english
      };
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
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
      <ScrollView style={styles.container}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultScore}>
            {score} / {quizQuestions.length}
          </Text>
          <Text style={styles.resultMessage}>{message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={resetQuiz}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        {question.word.imageUrl && (
          <Image 
            source={{ uri: question.word.imageUrl }}
            style={styles.questionImage}
            resizeMode="cover"
          />
        )}
        
        <Text style={styles.questionText}>
          What does <Text style={styles.kirundi}>"{question.word.kirundi}"</Text> mean?
        </Text>
        
        {question.word.pronunciation && (
          <Text style={styles.pronunciation}>/{question.word.pronunciation}/</Text>
        )}

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showFeedback = selectedAnswer !== null;

            let buttonStyle = styles.optionButton;
            if (showFeedback) {
              if (isCorrect) {
                buttonStyle = styles.optionButtonCorrect;
              } else if (isSelected) {
                buttonStyle = styles.optionButtonWrong;
              }
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => !selectedAnswer && handleAnswer(option)}
                disabled={selectedAnswer !== null}
                style={[styles.option, buttonStyle]}
              >
                <Text style={styles.optionText}>
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
    backgroundColor: '#f0fdf4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
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
    color: '#111827',
    marginBottom: 8,
  },
  kirundi: {
    color: '#16a34a',
  },
  pronunciation: {
    fontSize: 14,
    color: '#6b7280',
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
  optionButton: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  optionButtonCorrect: {
    backgroundColor: '#d1fae5',
    borderColor: '#16a34a',
  },
  optionButtonWrong: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
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
    color: '#111827',
    marginBottom: 16,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});