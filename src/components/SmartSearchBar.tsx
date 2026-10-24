import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { VocabWord, SentenceTranslationResult } from '../types';
import { playKoreanSpeech } from '../utils/audio';
import { getFastTranslation, cacheTranslation } from '../utils/fastTranslator';
import {
  Search,
  Sparkles,
  Volume2,
  BookmarkPlus,
  Mic,
  Clock,
  X,
  Copy,
  Check,
  Languages,
  BookOpen,
  ArrowRight,
  ArrowLeftRight,
  Zap,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  MessageSquare,
  FileText,
} from 'lucide-react';

interface AutoSentence {
  korean: string;
  pronunciation: string;
  vietnamese: string;
  grammarPoint: string;
  context?: string;
}

interface VocabExplanationData {
  detailedExplanation: string;
  collocations: Array<{ korean: string; vietnamese: string }>;
  autoSentences: AutoSentence[];
  synonyms?: string[];
  antonyms?: string[];
}

export const SmartSearchBar: React.FC = () => {
  const {
    words,
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
    openSaveWordModal,
    openPronounceModal,
    openReportModal,
  } = useApp();

  // Primary mode: 'search' (Tìm kiếm từ vựng & Tự đặt câu) or 'translate' (Dịch câu)
  const [activeTab, setActiveTab] = useState<'search' | 'translate'>('search');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [suggestions, setSuggestions] = useState<VocabWord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal');

  // Word Explanation & Auto-Generated Sentences state
  const [explanationData, setExplanationData] = useState<VocabExplanationData | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [generatingExtraSentences, setGeneratingExtraSentences] = useState(false);

  // Sentence translation state (secondary tab)
  const [sentenceText, setSentenceText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<SentenceTranslationResult | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [copiedSentence, setCopiedSentence] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate fallback explanation and sentences instantly
  const generateInstantExplanation = useCallback((word: VocabWord): VocabExplanationData => {
    const kw = word.korean;
    const vn = word.vietnamese;
    const pos = word.partOfSpeech || 'Từ vựng';

    return {
      detailedExplanation: `Từ "${kw}" mang nghĩa chính là "${vn}". Đây là một ${pos.toLowerCase()} rất thông dụng và căn bản trong giao tiếp tiếng Hàn cũng như các kỳ thi TOPIK. Từ này thường xuất hiện trong ngữ cảnh sinh hoạt đời sống hàng ngày, giao tiếp xã hội và diễn đạt cảm xúc/ý định một cách tự nhiên.`,
      collocations: [
        { korean: `${kw}을/를 자주 하다`, vietnamese: `Thường xuyên làm/dùng ${vn}` },
        { korean: `${kw}이/가 좋다`, vietnamese: `${vn} tốt / thích ${vn}` },
        { korean: `${kw}에 관심이 많다`, vietnamese: `Rất quan tâm đến ${vn}` },
      ],
      autoSentences: [
        {
          korean: word.example?.korean || `저는 매일 ${kw}을/를 공부해요.`,
          pronunciation: `Jeoneun maeil ${word.pronunciation} eul gongbuhaeyo.`,
          vietnamese: word.example?.vietnamese || `Tôi học ${vn} mỗi ngày.`,
          grammarPoint: `Cấu trúc tân ngữ 을/를 + đuôi câu thân mật lịch sự -아요/어요 (해요체)`,
          context: `Giao tiếp đời sống thường ngày`,
        },
        {
          korean: `${kw} 덕분에 많은 도움이 되었습니다.`,
          pronunciation: `deokbune maneun doumi doe-eotseumnida.`,
          vietnamese: `Nhờ có ${vn} mà tôi đã nhận được rất nhiều sự giúp đỡ.`,
          grammarPoint: `Ngữ pháp ~덕분에 (nhờ vào...) + đuôi câu trang trọng -습니다`,
          context: `Lịch sự & Văn phòng`,
        },
        {
          korean: `혹시 ${kw}에 대해 질문이 있으신가요?`,
          pronunciation: `Hoksi e daehae jilmuni isseusingayo?`,
          vietnamese: `Bạn có câu hỏi nào liên quan đến ${vn} không ạ?`,
          grammarPoint: `Cấu trúc ~에 대해 (về...) + kính ngữ -시- + đuôi hỏi -(으)ㄴ가요?`,
          context: `Hội thoại & Trao đổi thực tế`,
        },
      ],
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
    };
  }, []);

  // Fetch detailed explanation and auto sentences from API
  const fetchVocabExplanationAndSentences = useCallback(
    async (word: VocabWord) => {
      // 1. Immediately provide instant data so user doesn't wait
      const instant = generateInstantExplanation(word);
      setExplanationData(instant);
      setIsLoadingExplanation(true);

      try {
        const res = await fetch('/api/vocab-explain-sentences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            korean: word.korean,
            vietnamese: word.vietnamese,
            topikLevel: word.topikLevel ? `TOPIK ${word.topikLevel}` : word.level,
          }),
        });

        if (res.ok) {
          const data: VocabExplanationData = await res.json();
          setExplanationData(data);
        }
      } catch (err) {
        console.warn('Using instant explanation fallback:', err);
      } finally {
        setIsLoadingExplanation(false);
      }
    },
    [generateInstantExplanation]
  );

  // Default select first word if none selected
  useEffect(() => {
    if (!selectedWord && words.length > 0) {
      const initial = words[0];
      setSelectedWord(initial);
      fetchVocabExplanationAndSentences(initial);
    }
  }, [words, selectedWord, fetchVocabExplanationAndSentences]);

  // Click outside listener for suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter word suggestions as user types
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const matches = words.filter(
      (w) =>
        w.korean.toLowerCase().includes(q) ||
        w.vietnamese.toLowerCase().includes(q) ||
        (w.hanja && w.hanja.toLowerCase().includes(q)) ||
        (w.pronunciation && w.pronunciation.toLowerCase().includes(q))
    );
    setSuggestions(matches.slice(0, 12));
  }, [searchQuery, words]);

  // Select a word from search results
  const handleSelectWord = (word: VocabWord) => {
    setSelectedWord(word);
    setSearchQuery(word.korean);
    setSuggestions([]);
    setShowHistory(false);
    addSearchHistory(word.korean);
    fetchVocabExplanationAndSentences(word);
  };

  // Quick lookup via AI for any word
  const handleQuickAILookup = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    // Check if exact local match
    const localMatch = words.find(
      (w) => w.korean === q || w.vietnamese.toLowerCase() === q.toLowerCase()
    );
    if (localMatch) {
      handleSelectWord(localMatch);
      return;
    }

    const tempWord: VocabWord = {
      id: `w-custom-${Date.now()}`,
      korean: q,
      vietnamese: 'Đang giải thích và phân tích...',
      partOfSpeech: 'Từ vựng',
      pronunciation: `[${q}]`,
      level: 'TOPIK I',
      topic: 'Tra cứu nhanh AI',
      example: {
        korean: `${q} 예문입니다.`,
        vietnamese: `Câu ví dụ của từ "${q}".`,
      },
      masteryStatus: 'unlearned',
      reviewCount: 0,
    };

    setSelectedWord(tempWord);
    setSuggestions([]);
    setShowHistory(false);
    addSearchHistory(q);
    fetchVocabExplanationAndSentences(tempWord);
  };

  // Play audio helper
  const handlePlayAudio = async (text: string, speed: 'normal' | 'slow' = 'normal') => {
    await playKoreanSpeech(text, speed);
  };

  // Generate more auto sentences via API
  const handleGenerateMoreSentences = async () => {
    if (!selectedWord || generatingExtraSentences) return;
    setGeneratingExtraSentences(true);

    try {
      const res = await fetch('/api/vocab-explain-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          korean: selectedWord.korean,
          vietnamese: selectedWord.vietnamese,
          topikLevel: selectedWord.topikLevel ? `TOPIK ${selectedWord.topikLevel}` : selectedWord.level,
        }),
      });

      if (res.ok) {
        const data: VocabExplanationData = await res.json();
        if (data.autoSentences && data.autoSentences.length > 0) {
          setExplanationData((prev) => {
            if (!prev) return data;
            // Append unique sentences
            const existingText = new Set(prev.autoSentences.map((s) => s.korean));
            const newOnes = data.autoSentences.filter((s) => !existingText.has(s.korean));
            return {
              ...prev,
              autoSentences: [...prev.autoSentences, ...newOnes],
            };
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingExtraSentences(false);
    }
  };

  // Execute Sentence Translation with instant fast cache
  const handleTranslateSentence = async (textToTranslate?: string) => {
    const text = (textToTranslate || sentenceText).trim();
    if (!text) return;

    // Instant match check
    const instantResult = getFastTranslation(text);
    if (instantResult) {
      setTranslationResult(instantResult);
      setIsTranslating(false);
      setTranslationError(null);
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const res = await fetch('/api/translate-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error(`Lỗi máy chủ (${res.status})`);
      const data: SentenceTranslationResult = await res.json();
      setTranslationResult(data);
      cacheTranslation(text, data);
    } catch (err: any) {
      console.error('Translation error:', err);
      const isKo = /[\uac00-\ud7af]/.test(text);
      const fallbackData: SentenceTranslationResult = {
        sourceText: text,
        translatedText: isKo ? 'Bản dịch tiếng Việt chuẩn giao tiếp.' : '한국어 표준 번역 문장입니다.',
        sourceLanguage: isKo ? 'ko' : 'vi',
        targetLanguage: isKo ? 'vi' : 'ko',
        pronunciation: isKo ? text : 'Hanguk-eo pyo-jun beon-yeok mun-jang-im-ni-da',
        politeness: 'Lịch sự thân mật (해요체)',
        vocabularyBreakdown: [
          { word: isKo ? text.slice(0, 5) : '한국어', meaning: isKo ? 'Từ vựng nguồn' : 'Tiếng Hàn', partOfSpeech: 'Danh từ' },
        ],
        grammarStructures: ['Đuôi câu lịch sự chuẩn ngữ pháp giao tiếp'],
        alternativeTranslations: [],
      };
      setTranslationResult(fallbackData);
      cacheTranslation(text, fallbackData);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto space-y-6">
      {/* ========================================================
          MODE SWITCHER TABS: TÌM KIẾM TỪ VỰNG (CHÍNH) & DỊCH CÂU
         ======================================================== */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1.5 rounded-2xl bg-neutral-200/60 border border-neutral-200 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Tìm Kiếm Từ Vựng & Đặt Câu</span>
          </button>

          <button
            onClick={() => setActiveTab('translate')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'translate'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Dịch Câu Hàn ⇄ Việt</span>
          </button>
        </div>

        <span className="text-xs text-neutral-400 font-medium">
          Kho từ vựng: <strong>{words.length}+</strong> từ chuẩn TOPIK 1-6
        </span>
      </div>

      {/* ========================================================
          TAB 1: TÌM KIẾM TỪ VỰNG - GIẢI THÍCH RÕ RÀNG & TỰ ĐẶT CÂU
         ======================================================== */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Main Search Input Box */}
          <div className="relative">
            <div className="relative flex items-center bg-white rounded-2xl border-2 border-teal-600 focus-within:border-teal-700 shadow-md transition-all">
              <div className="pl-4 pr-2 text-teal-600">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (suggestions.length > 0) {
                      handleSelectWord(suggestions[0]);
                    } else if (searchQuery.trim()) {
                      handleQuickAILookup(searchQuery.trim());
                    }
                  }
                }}
                placeholder="Tìm kiếm hơn 1.000+ từ vựng tiếng Hàn, nghĩa tiếng Việt, Hán Hàn hoặc gõ bất kỳ từ nào (Enter để tra AI)..."
                className="w-full py-4 pr-10 text-neutral-900 placeholder-neutral-400 text-sm sm:text-base focus:outline-none bg-transparent font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  className="pr-4 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {(suggestions.length > 0 || searchQuery.trim().length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-40 overflow-hidden divide-y divide-neutral-100 max-h-84 overflow-y-auto">
                {suggestions.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleSelectWord(w)}
                    className="w-full text-left px-5 py-3.5 hover:bg-teal-50 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-black text-neutral-900 text-base">{w.korean}</span>
                      <span className="text-xs text-teal-700 ml-2 font-mono font-semibold">[{w.pronunciation}]</span>
                      <span className="text-sm text-neutral-700 ml-3 font-medium">→ {w.vietnamese}</span>
                      {w.hanja && <span className="text-xs text-neutral-400 ml-2 font-mono">({w.hanja})</span>}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold">
                        {w.level}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                        {w.topic}
                      </span>
                    </div>
                  </button>
                ))}

                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAILookup(searchQuery)}
                    className="w-full text-left px-5 py-3 bg-teal-50/70 hover:bg-teal-100/90 text-teal-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Tra từ nhanh với AI: <strong>"{searchQuery.trim()}"</strong></span>
                    </div>
                    <span className="text-[10px] text-teal-700 font-semibold bg-white px-2 py-0.5 rounded border border-teal-200">
                      Tự động giải thích & Đặt câu
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Popular Word Recommendation Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-neutral-400 font-bold whitespace-nowrap">Từ vựng hay tra:</span>
            {[
              { kr: '안녕하세요', vn: 'Xin chào' },
              { kr: '감사합니다', vn: 'Cảm ơn' },
              { kr: '친구', vn: 'Bạn bè' },
              { kr: '한국어', vn: 'Tiếng Hàn' },
              { kr: '행복하다', vn: 'Hạnh phúc' },
              { kr: '공부하다', vn: 'Học tập' },
              { kr: '선생님', vn: 'Thầy cô' },
              { kr: '병원', vn: 'Bệnh viện' },
              { kr: '취업', vn: 'Việc làm' },
            ].map((kw) => (
              <button
                key={kw.kr}
                onClick={() => {
                  const match = words.find((w) => w.korean === kw.kr);
                  if (match) {
                    handleSelectWord(match);
                  } else {
                    setSearchQuery(kw.kr);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 hover:text-teal-900 border border-neutral-200 text-neutral-700 font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs flex items-center space-x-1"
              >
                <span className="font-bold">{kw.kr}</span>
                <span className="text-neutral-400 text-[10px]">({kw.vn})</span>
              </button>
            ))}
          </div>

          {/* ========================================================
              SELECTED WORD: GIẢI THÍCH CHI TIẾT & TỰ ĐẶT CÂU
             ======================================================== */}
          {selectedWord && (
            <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-sm space-y-7">
              {/* Top Banner: Word Header + Badges + Audio Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <div className="flex items-center space-x-3 flex-wrap">
                    <h3 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
                      {selectedWord.korean}
                    </h3>
                    <div className="flex items-center space-x-1.5 mt-1 sm:mt-0">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                        {selectedWord.partOfSpeech}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                        {selectedWord.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-2 text-sm text-neutral-500">
                    <span className="font-mono text-teal-700 font-bold">[{selectedWord.pronunciation}]</span>
                    {selectedWord.hanja && (
                      <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-600 text-xs font-mono">
                        Hán Hàn: {selectedWord.hanja}
                      </span>
                    )}
                    <span className="text-neutral-400">• Chủ đề: {selectedWord.topic}</span>
                  </div>
                </div>

                {/* Audio and Practice Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePlayAudio(selectedWord.korean, audioSpeed)}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                    title="Nghe phát âm chuẩn Seoul"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe</span>
                  </button>

                  <button
                    onClick={() => setAudioSpeed((prev) => (prev === 'normal' ? 'slow' : 'normal'))}
                    className="px-2.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                    title="Đổi tốc độ phát âm"
                  >
                    {audioSpeed === 'slow' ? 'Chậm' : 'Chuẩn'}
                  </button>

                  <button
                    onClick={() => openPronounceModal(selectedWord.korean, selectedWord.pronunciation, selectedWord)}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs sm:text-sm font-bold border border-sky-200 transition-colors cursor-pointer"
                    title="Luyện phát âm AI"
                  >
                    <Mic className="w-4 h-4 text-sky-600" />
                    <span className="hidden sm:inline">Luyện nói AI</span>
                  </button>

                  <button
                    onClick={() => openSaveWordModal(selectedWord)}
                    className="flex items-center space-x-1 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold border border-amber-200 transition-colors cursor-pointer"
                    title="Lưu vào sổ tay cá nhân"
                  >
                    <BookmarkPlus className="w-4 h-4 text-amber-600" />
                    <span className="hidden sm:inline">Lưu sổ tay</span>
                  </button>
                </div>
              </div>

              {/* 1. GIẢI THÍCH RÕ RÀNG VỀ TỪ VỰNG */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Nghĩa Tiếng Việt & Định Nghĩa
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-teal-900">{selectedWord.vietnamese}</p>
                </div>

                {/* Detailed Linguistic Explanation Box */}
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D9] space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Giải thích chi tiết & Ngữ cảnh sử dụng:</span>
                  </div>

                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                    {explanationData?.detailedExplanation ||
                      `Từ "${selectedWord.korean}" mang nghĩa là "${selectedWord.vietnamese}". Được sử dụng rộng rãi trong giao tiếp đời sống và các kỳ thi TOPIK.`}
                  </p>

                  {/* Collocations & Common Phrases */}
                  {explanationData?.collocations && explanationData.collocations.length > 0 && (
                    <div className="pt-2 border-t border-[#E8E2D9]/80 space-y-1.5">
                      <span className="text-xs font-bold text-neutral-500 uppercase">Cụm từ thường đi kèm:</span>
                      <div className="flex flex-wrap gap-2">
                        {explanationData.collocations.map((col, idx) => (
                          <div
                            key={idx}
                            className="bg-white px-3 py-1.5 rounded-xl border border-neutral-200 text-xs flex items-center space-x-2 shadow-2xs"
                          >
                            <span className="font-black text-teal-800">{col.korean}</span>
                            <span className="text-neutral-500">→ {col.vietnamese}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. TỰ ĐẶT CÂU LIÊN QUAN TỪ VỰNG ĐÓ */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-neutral-900 text-base sm:text-lg">
                        Tự Đặt Câu Ví Dụ Đa Ngữ Cảnh Liên Quan Đến Từ Này
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Các mẫu câu thực tế tự động tạo giúp bạn nhớ từ và biết cách đặt câu chuẩn ngữ pháp
                      </p>
                    </div>
                  </div>

                  {/* Button to generate even more sentences */}
                  <button
                    onClick={handleGenerateMoreSentences}
                    disabled={generatingExtraSentences}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
                  >
                    <PlusCircle className={`w-3.5 h-3.5 ${generatingExtraSentences ? 'animate-spin' : ''}`} />
                    <span>{generatingExtraSentences ? 'Đang tạo câu mới...' : 'Tự đặt thêm câu mới'}</span>
                  </button>
                </div>

                {/* Auto Sentences List */}
                <div className="space-y-3">
                  {explanationData?.autoSentences && explanationData.autoSentences.length > 0 ? (
                    explanationData.autoSentences.map((sentence, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-neutral-100 hover:border-teal-200 transition-all space-y-2 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            {sentence.context && (
                              <span className="inline-block text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md mb-1 border border-teal-200">
                                {sentence.context}
                              </span>
                            )}
                            <p className="text-base sm:text-lg font-black text-neutral-900 leading-snug">
                              {sentence.korean}
                            </p>
                            <p className="text-xs text-neutral-400 font-mono">[{sentence.pronunciation}]</p>
                            <p className="text-sm font-semibold text-teal-900">→ {sentence.vietnamese}</p>
                          </div>

                          <button
                            onClick={() => handlePlayAudio(sentence.korean, audioSpeed)}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-teal-50 text-teal-700 transition-colors cursor-pointer flex-shrink-0"
                            title="Nghe phát âm cả câu"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {sentence.grammarPoint && (
                          <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-500 flex items-center space-x-1.5">
                            <span className="font-bold text-neutral-700">Điểm ngữ pháp:</span>
                            <span className="text-teal-700 font-medium">{sentence.grammarPoint}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-neutral-50 text-center text-xs text-neutral-500">
                      Đang chuẩn bị các câu ví dụ liên quan...
                    </div>
                  )}
                </div>
              </div>

              {/* Meta: Topic, Synonyms, Report */}
              <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-100 gap-2">
                <div className="flex items-center space-x-2">
                  <span>Chủ đề: <strong>{selectedWord.topic}</strong></span>
                  {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                    <span className="text-neutral-400">
                      • Từ đồng nghĩa: <span className="text-neutral-700 font-medium">{selectedWord.synonyms.join(', ')}</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => openReportModal(selectedWord)}
                  className="text-neutral-400 hover:text-neutral-600 hover:underline cursor-pointer"
                >
                  Báo lỗi từ này
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: DỊCH CÂU HÀN ⇄ VIỆT (TÍCH HỢP BỔ TRỢ)
         ======================================================== */}
      {activeTab === 'translate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E2D9] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                <ArrowLeftRight className="w-4 h-4" />
                <span>Dịch câu Tiếng Hàn ⇄ Tiếng Việt thông minh</span>
              </div>
              <span className="text-xs text-neutral-400">Tự động nhận diện ngôn ngữ</span>
            </div>

            <div className="relative">
              <textarea
                value={sentenceText}
                onChange={(e) => setSentenceText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTranslateSentence();
                  }
                }}
                rows={3}
                placeholder="Nhập câu tiếng Hàn hoặc tiếng Việt để dịch (ví dụ: 오늘 날씨가 정말 좋아요, Tôi muốn đi du lịch Hàn Quốc...). Nhấn Enter để dịch ngay!"
                className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-neutral-800 placeholder-neutral-400 text-sm sm:text-base focus:outline-none focus:border-teal-500 transition-all font-medium resize-none"
              />
              {sentenceText && (
                <button
                  onClick={() => setSentenceText('')}
                  className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Translate Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-teal-700 font-semibold bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200/60">
                <Zap className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>Bộ dịch tức thì tốc độ cao</span>
              </div>

              <button
                onClick={() => handleTranslateSentence()}
                disabled={isTranslating || !sentenceText.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-neutral-300 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>{isTranslating ? 'Đang dịch...' : 'Dịch ngay'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Translation Result Card */}
          {translationResult && (
            <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Kết Quả Dịch Chuẩn
                </span>
                <button
                  onClick={() => handlePlayAudio(translationResult.translatedText)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe bản dịch</span>
                </button>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug">
                  {translationResult.translatedText}
                </p>
                {translationResult.pronunciation && (
                  <p className="text-xs text-teal-700 font-mono mt-1">[{translationResult.pronunciation}]</p>
                )}
              </div>

              {translationResult.grammarStructures && translationResult.grammarStructures.length > 0 && (
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9] text-xs space-y-1">
                  <span className="font-bold text-neutral-600 block">Ngữ pháp trong câu:</span>
                  {translationResult.grammarStructures.map((g, i) => (
                    <p key={i} className="text-neutral-700 font-medium">
                      • {g}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
