import React, { createContext, useContext, useState, useEffect } from 'react';
import { VocabWord, CustomNotebook, UserProfile, Lesson } from '../types';
import { INITIAL_VOCAB_LIST } from '../data/vocabData';
import { INITIAL_LESSONS } from '../data/lessonsData';

interface AppContextType {
  words: VocabWord[];
  lessons: Lesson[];
  customNotebooks: CustomNotebook[];
  searchHistory: string[];
  userProfile: UserProfile;
  activeTab: 'home' | 'review' | 'exam' | 'roadmap' | 'game';
  activeTopicFilter: string;
  setActiveTopicFilter: (topic: string) => void;
  setActiveTab: (tab: 'home' | 'review' | 'exam' | 'roadmap' | 'game') => void;
  
  // Modals
  saveWordModal: { isOpen: boolean; word: VocabWord | null };
  openSaveWordModal: (word: VocabWord) => void;
  closeSaveWordModal: () => void;

  pronounceModal: { isOpen: boolean; targetText: string; pronunciationTip?: string; word?: VocabWord };
  openPronounceModal: (targetText: string, pronunciationTip?: string, word?: VocabWord) => void;
  closePronounceModal: () => void;

  reportModal: { isOpen: boolean; word?: VocabWord };
  openReportModal: (word?: VocabWord) => void;
  closeReportModal: () => void;

  onboardingModalOpen: boolean;
  setOnboardingModalOpen: (open: boolean) => void;

  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;

  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  legalModal: { isOpen: boolean; type: 'terms' | 'privacy' };
  openLegalModal: (type: 'terms' | 'privacy') => void;
  closeLegalModal: () => void;

  // Actions
  saveWordToNotebook: (wordId: string, notebookId: string) => void;
  removeWordFromNotebook: (wordId: string, notebookId: string) => void;
  createCustomNotebook: (title: string, color: string, icon: string, description?: string) => string;
  deleteCustomNotebook: (notebookId: string) => void;
  updateWordMastery: (wordId: string, status: 'hard' | 'good' | 'easy') => void;
  addCustomWord: (word: Partial<VocabWord>, notebookId?: string) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  completeLesson: (lessonId: number, score?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_NOTEBOOKS: CustomNotebook[] = [
  {
    id: 'nb-hard',
    title: 'Từ chưa thuộc (Cần ôn gấp)',
    description: 'Tập hợp các từ vựng đánh dấu khó cần xem lại thường xuyên',
    color: 'from-amber-400 to-orange-500',
    icon: '⚡',
    createdAt: '2026-09-01',
    wordIds: ['w-3', 'w-19', 'w-32'],
  },
  {
    id: 'nb-office',
    title: 'Từ vựng công ty & Phỏng vấn',
    description: 'Từ vựng giao tiếp công sở, họp hành và viết báo cáo',
    color: 'from-blue-500 to-indigo-600',
    icon: '💼',
    createdAt: '2026-09-05',
    wordIds: ['w-18', 'w-19', 'w-20', 'w-21', 'w-22'],
  },
  {
    id: 'nb-it',
    title: 'Từ vựng chuyên ngành IT & Tech',
    description: 'Công nghệ thông tin, lập trình và phát triển phần mềm',
    color: 'from-teal-400 to-emerald-600',
    icon: '💻',
    createdAt: '2026-09-10',
    wordIds: ['w-33', 'w-32', 'w-31'],
  },
  {
    id: 'nb-drama',
    title: 'Từ vựng phim ảnh & Đời sống Seoul',
    description: 'Lời thoại trendy trong K-Drama và đời sống giới trẻ Hàn',
    color: 'from-pink-400 to-rose-500',
    icon: '🎬',
    createdAt: '2026-09-15',
    wordIds: ['w-1', 'w-2', 'w-6', 'w-14', 'w-27'],
  },
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Học Viên Tiếng Hàn',
  email: 'hocvien@koreanvocab.vn',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  levelGoal: 'Sơ cấp 1',
  hasLearnedBefore: false,
  streakDays: 4,
  wordsLearnedCount: 18,
  dailyGoalWords: 10,
  isOnboarded: true,
  isLoggedIn: true,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Words state with persistence and auto-upgrade to 1,000+ vocabulary database
  const [words, setWords] = useState<VocabWord[]>(() => {
    const saved = localStorage.getItem('kv_words_v4');
    if (saved) {
      try {
        const parsed: VocabWord[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_VOCAB_LIST.length) {
          return parsed;
        }
        // Merge missing words from INITIAL_VOCAB_LIST
        const existingIds = new Set(parsed.map(w => w.id));
        const merged = [...parsed];
        for (const w of INITIAL_VOCAB_LIST) {
          if (!existingIds.has(w.id)) {
            merged.push(w);
          }
        }
        return merged;
      } catch (e) { /* ignore */ }
    }
    // Also check previous version kv_words_v3 to preserve custom words/mastery
    const prevSaved = localStorage.getItem('kv_words_v3');
    if (prevSaved) {
      try {
        const prevParsed: VocabWord[] = JSON.parse(prevSaved);
        if (Array.isArray(prevParsed)) {
          const statusMap = new Map(prevParsed.map(w => [w.id, { masteryStatus: w.masteryStatus, reviewCount: w.reviewCount }]));
          const upgraded = INITIAL_VOCAB_LIST.map(w => {
            const st = statusMap.get(w.id);
            return st ? { ...w, ...st } : w;
          });
          return upgraded;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_VOCAB_LIST;
  });

  // Lessons state
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('kv_lessons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_LESSONS;
  });

  // Custom Notebooks
  const [customNotebooks, setCustomNotebooks] = useState<CustomNotebook[]>(() => {
    const saved = localStorage.getItem('kv_notebooks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_NOTEBOOKS;
  });

  // Search History
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('kv_search_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['안녕하세요', '학교', 'thư viện', '맛있다', 'đi làm', '회의'];
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kv_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'review' | 'exam' | 'roadmap' | 'game'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'game' || params.has('gameRoom') || params.has('room') || params.has('invite')) {
        return 'game';
      }
      if (tab === 'review' || tab === 'exam' || tab === 'roadmap') return tab;
    }
    return 'home';
  });
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');

  // Modal States
  const [saveWordModal, setSaveWordModal] = useState<{ isOpen: boolean; word: VocabWord | null }>({
    isOpen: false,
    word: null,
  });

  const [pronounceModal, setPronounceModal] = useState<{
    isOpen: boolean;
    targetText: string;
    pronunciationTip?: string;
    word?: VocabWord;
  }>({
    isOpen: false,
    targetText: '',
  });

  const [reportModal, setReportModal] = useState<{ isOpen: boolean; word?: VocabWord }>({
    isOpen: false,
  });

  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms',
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('kv_words_v4', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('kv_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('kv_notebooks', JSON.stringify(customNotebooks));
  }, [customNotebooks]);

  useEffect(() => {
    localStorage.setItem('kv_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('kv_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Actions
  const openSaveWordModal = (word: VocabWord) => {
    setSaveWordModal({ isOpen: true, word });
  };

  const closeSaveWordModal = () => {
    setSaveWordModal({ isOpen: false, word: null });
  };

  const openPronounceModal = (targetText: string, pronunciationTip?: string, word?: VocabWord) => {
    setPronounceModal({ isOpen: true, targetText, pronunciationTip, word });
  };

  const closePronounceModal = () => {
    setPronounceModal({ isOpen: false, targetText: '' });
  };

  const openReportModal = (word?: VocabWord) => {
    setReportModal({ isOpen: true, word });
  };

  const closeReportModal = () => {
    setReportModal({ isOpen: false, word: undefined });
  };

  const openLegalModal = (type: 'terms' | 'privacy') => {
    setLegalModal({ isOpen: true, type });
  };

  const closeLegalModal = () => {
    setLegalModal({ isOpen: false, type: 'terms' });
  };

  const saveWordToNotebook = (wordId: string, notebookId: string) => {
    setCustomNotebooks(prev =>
      prev.map(nb => {
        if (nb.id === notebookId) {
          if (!nb.wordIds.includes(wordId)) {
            return { ...nb, wordIds: [...nb.wordIds, wordId] };
          }
        }
        return nb;
      })
    );
  };

  const removeWordFromNotebook = (wordId: string, notebookId: string) => {
    setCustomNotebooks(prev =>
      prev.map(nb => {
        if (nb.id === notebookId) {
          return { ...nb, wordIds: nb.wordIds.filter(id => id !== wordId) };
        }
        return nb;
      })
    );
  };

  const createCustomNotebook = (title: string, color: string, icon: string, description?: string): string => {
    const newId = `nb-${Date.now()}`;
    const newNotebook: CustomNotebook = {
      id: newId,
      title,
      color,
      icon,
      description,
      createdAt: new Date().toISOString().split('T')[0],
      wordIds: [],
    };
    setCustomNotebooks(prev => [newNotebook, ...prev]);
    return newId;
  };

  const deleteCustomNotebook = (notebookId: string) => {
    setCustomNotebooks(prev => prev.filter(nb => nb.id !== notebookId));
  };

  const updateWordMastery = (wordId: string, status: 'hard' | 'good' | 'easy') => {
    setWords(prev =>
      prev.map(w => {
        if (w.id === wordId) {
          const nextCount = (w.reviewCount || 0) + 1;
          const mappedStatus = status === 'easy' ? 'easy' : status === 'good' ? 'good' : 'hard';
          return {
            ...w,
            masteryStatus: mappedStatus,
            reviewCount: nextCount,
            lastReviewed: new Date().toISOString(),
          };
        }
        return w;
      })
    );

    // If hard, also automatically add to 'Từ chưa thuộc' notebook if present
    if (status === 'hard') {
      saveWordToNotebook(wordId, 'nb-hard');
    }

    // Increment words learned count in profile
    setUserProfile(p => ({
      ...p,
      wordsLearnedCount: Math.min(words.length, p.wordsLearnedCount + 1),
    }));
  };

  const addCustomWord = (wordData: Partial<VocabWord>, notebookId?: string) => {
    const newWord: VocabWord = {
      id: `w-custom-${Date.now()}`,
      korean: wordData.korean || '',
      vietnamese: wordData.vietnamese || '',
      hanja: wordData.hanja,
      partOfSpeech: wordData.partOfSpeech || 'Danh từ',
      pronunciation: wordData.pronunciation || `[${wordData.korean}]`,
      level: wordData.level || 'Sơ cấp 1',
      topic: wordData.topic || 'Sổ tay cá nhân',
      example: wordData.example || {
        korean: `${wordData.korean}을/를 사용합니다.`,
        vietnamese: `Sử dụng ${wordData.vietnamese}.`,
      },
      masteryStatus: 'unlearned',
      reviewCount: 0,
      notes: wordData.notes,
    };

    setWords(prev => [newWord, ...prev]);
    if (notebookId) {
      saveWordToNotebook(newWord.id, notebookId);
    }
  };

  const addSearchHistory = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== q.toLowerCase());
      return [q, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const completeLesson = (lessonId: number, score?: number) => {
    setLessons(prev =>
      prev.map(l => {
        if (l.id === lessonId) {
          return { ...l, completed: true, score: score !== undefined ? score : 100 };
        }
        return l;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        words,
        lessons,
        customNotebooks,
        searchHistory,
        userProfile,
        activeTab,
        activeTopicFilter,
        setActiveTopicFilter,
        setActiveTab,
        saveWordModal,
        openSaveWordModal,
        closeSaveWordModal,
        pronounceModal,
        openPronounceModal,
        closePronounceModal,
        reportModal,
        openReportModal,
        closeReportModal,
        onboardingModalOpen,
        setOnboardingModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        authModalOpen,
        setAuthModalOpen,
        legalModal,
        openLegalModal,
        closeLegalModal,
        saveWordToNotebook,
        removeWordFromNotebook,
        createCustomNotebook,
        deleteCustomNotebook,
        updateWordMastery,
        addCustomWord,
        addSearchHistory,
        clearSearchHistory,
        updateUserProfile,
        completeLesson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
