export interface StoryWord {
  kirundi: string;
  english: string;
  french: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Story {
  id: string;
  title: string;
  titleEnglish: string;
  titleFrench: string;
  difficulty: Difficulty;
  description: string;
  descriptionFrench: string;
  words: StoryWord[];
  paragraphs: string[];
  moral?: string;
  moralEnglish?: string;
  moralFrench?: string;
}