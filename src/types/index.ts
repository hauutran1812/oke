export type PartOfSpeech =
  | 'Danh từ'
  | 'Động từ'
  | 'Tính từ'
  | 'Phó từ'
  | 'Đại từ'
  | 'Thành ngữ'
  | 'Liên từ'
  | 'Thán từ'
  | 'Quán dụng ngữ'
  | 'Từ vựng';

export type VocabLevel =
  | 'TOPIK 1'
  | 'TOPIK 2'
  | 'TOPIK 3'
  | 'TOPIK 4'
  | 'TOPIK 5'
  | 'TOPIK 6'
  | 'Sơ cấp 1'
  | 'Sơ cấp 2'
  | 'Trung cấp'
  | 'Cao cấp'
  | 'TOPIK I'
  | 'TOPIK II';

export type MasteryStatus = 'unlearned' | 'hard' | 'good' | 'easy' | 'mastered';

export interface VocabWord {
  id: string;
  korean: string;
  vietnamese: string;
  hanja?: string;
  partOfSpeech: PartOfSpeech;
  pronunciation: string;
  level: VocabLevel;
  topikLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  topic: string;
  example: {
    korean: string;
    vietnamese: string;
  };
  imageUrl?: string;
  masteryStatus: MasteryStatus;
  reviewCount: number;
  lastReviewed?: string;
  nextReview?: string;
  notes?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface CustomNotebook {
  id: string;
  title: string;
  description?: string;
  color: string; // Tailwind color class or hex
  icon: string; // Emoji or Lucide icon key
  createdAt: string;
  wordIds: string[];
}

export interface GrammarCheckErrorItem {
  originalWord: string;
  correctedWord: string;
  reason: string;
}

export interface GrammarCheckResult {
  hasError: boolean;
  originalSentence: string;
  suggestedFix: string;
  vietnameseMeaning: string;
  errorItems: GrammarCheckErrorItem[];
  grammarNotes: string[];
  pronunciationGuide?: string;
  honorificLevel?: string;
}

export interface SentenceVocabularyItem {
  word: string;
  meaning: string;
  partOfSpeech: string;
}

export interface SentenceTranslationResult {
  sourceText: string;
  translatedText: string;
  sourceLanguage: 'ko' | 'vi' | string;
  targetLanguage: 'vi' | 'ko' | string;
  pronunciation?: string;
  politeness?: string;
  vocabularyBreakdown: SentenceVocabularyItem[];
  grammarStructures: string[];
  alternativeTranslations?: string[];
}

export interface PronunciationEvaluation {
  score: number;
  accuracyLevel: 'Tuyệt vời' | 'Khá tốt' | 'Cần luyện thêm';
  feedback: string;
  phoneticTips: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'kr_to_vn' | 'vn_to_kr' | 'fill_blank' | 'audio_choice';
  prompt: string;
  audioText?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  relatedWord?: VocabWord;
}

export interface QuizTest {
  id: string;
  title: string;
  level: string;
  topikLevel?: number;
  description: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface LessonExercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  isCheckpointExam: boolean; // Every 3 lessons has a checkpoint exam!
  description: string;
  level: string;
  words: VocabWord[];
  completed: boolean;
  score?: number;
  reinforcementExercises: LessonExercise[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  phone?: string;
  authProvider?: 'google' | 'facebook' | 'phone' | 'email';
  levelGoal: 'Sơ cấp 1' | 'TOPIK I' | 'TOPIK II' | 'Giao tiếp hàng ngày';
  hasLearnedBefore: boolean;
  streakDays: number;
  wordsLearnedCount: number;
  dailyGoalWords: number;
  isOnboarded: boolean;
  isLoggedIn: boolean;
}
