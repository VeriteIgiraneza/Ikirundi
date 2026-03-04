export type Language = 'en' | 'fr';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Navigation
    dictionary: 'Dictionary',
    wordOfDay: 'Word of the Day',
    quiz: 'Quiz',
    settings: 'Settings',
    learnKirundi: 'Learn Kirundi',

    // Dictionary
    searchPlaceholder: 'Search in Kirundi, English, or French...',
    all: 'all',
    noResults: 'No words found. Try a different search term!',

    // Word of the Day
    tipLabel: 'Tip: ',
    tipText: 'Come back tomorrow for a new word! Try to use today\'s word in a sentence before the day ends.',

    // Word Card
    english: 'ENGLISH',
    french: 'FRENCH',
    example: 'EXAMPLE',

    // Quiz
    loadingQuiz: 'Loading quiz...',
    questionOf: 'Question {current} of {total}',
    score: 'Score: {score}',
    whatDoesMean: 'What does "{word}" mean in Kirundi?',
    quizComplete: 'Quiz Complete!',
    excellent: 'Excellent work!',
    goodJob: 'Good job! Keep practicing!',
    keepLearning: 'Keep learning! You\'ll get better!',
    tryAgain: 'Try Again',

    // Settings
    displayLanguage: 'Display Language',
    displayLanguageDesc: 'Language for menus, buttons, and labels',
    translationLanguage: 'Translation Language',
    translationLanguageDesc: 'Language shown for Kirundi word translations',
    englishLabel: 'English',
    frenchLabel: 'Français',
    monochromeUI: 'Monochrome UI',
    monochromeUIDesc: 'Switch to black & white theme',

    // Footer
    madeWithLove: 'Made with ❤️ for the Burundian community worldwide',
  },
  fr: {
    // Header & Navigation
    dictionary: 'Dictionnaire',
    wordOfDay: 'Mot du jour',
    quiz: 'Quiz',
    settings: 'Paramètres',
    learnKirundi: 'Apprendre le Kirundi',

    // Dictionary
    searchPlaceholder: 'Rechercher en Kirundi, Anglais ou Français...',
    all: 'tout',
    noResults: 'Aucun mot trouvé. Essayez un autre terme !',

    // Word of the Day
    tipLabel: 'Conseil : ',
    tipText: 'Revenez demain pour un nouveau mot ! Essayez d\'utiliser le mot du jour dans une phrase avant la fin de la journée.',

    // Word Card
    english: 'ANGLAIS',
    french: 'FRANÇAIS',
    example: 'EXEMPLE',

    // Quiz
    loadingQuiz: 'Chargement du quiz...',
    questionOf: 'Question {current} sur {total}',
    score: 'Score : {score}',
    whatDoesMean: 'Que signifie « {word} » en Kirundi ?',
    quizComplete: 'Quiz terminé !',
    excellent: 'Excellent travail !',
    goodJob: 'Bon travail ! Continuez à pratiquer !',
    keepLearning: 'Continuez à apprendre ! Vous allez vous améliorer !',
    tryAgain: 'Réessayer',

    // Settings
    displayLanguage: 'Langue d\'affichage',
    displayLanguageDesc: 'Langue des menus, boutons et libellés',
    translationLanguage: 'Langue de traduction',
    translationLanguageDesc: 'Langue affichée pour les traductions des mots Kirundi',
    englishLabel: 'English',
    frenchLabel: 'Français',
    monochromeUI: 'Interface monochrome',
    monochromeUIDesc: 'Passer au thème noir et blanc',

    // Footer
    madeWithLove: 'Fait avec ❤️ pour la communauté burundaise du monde entier',
  },
};

// Helper to replace placeholders like {word}, {current}, {total}
export function t(
  strings: Record<string, string>,
  key: string,
  params?: Record<string, string | number>
): string {
  let text = strings[key] || key;
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }
  return text;
}