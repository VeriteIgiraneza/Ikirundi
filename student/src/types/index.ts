export interface Word {
  id: string;
  kirundi: string;
  english: string;
  french?: string;
  pronunciation?: string;
  example?: string;
  imageUrl?: string;
  category?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  wordId: string;
}

export interface UserProgress {
  wordsLearned: string[];
  quizScores: { date: string; score: number }[];
  currentStreak: number;
  lastVisit: string;
}