import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { VocabWord, GrammarCheckResult } from '../types';
import { playKoreanSpeech } from '../utils/audio';
import {
  Search,
  Sparkles,
  Volume2,
  BookmarkPlus,
  Mic,
  Clock,
  X,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Flag,
  ArrowRight,
  Info,
} from 'lucide-react';

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

  const [query, setQuery] = useState('');
  const [activeMode, setActiveMode] = useState<'auto' | 'word' | 'grammar'>('auto');
  const [suggestions, setSuggestions] = useState<VocabWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  // Grammar Checker state
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarCheckResult | null>(null);
  const [grammarError, setGrammarError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions/history when clicking outside
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

  // Determine if input is likely a sentence (contains spaces, punctuation, or > 2 Korean syllables/words)
  const isLikelySentence = (text: string): boolean => {
    const trimmed = text.trim();
    const wordsCount = trimmed.split(/\s+/).length;
    return wordsCount >= 2 || trimmed.endsWith('?') || trimmed.endsWith('.') || trimmed.endsWith('!');
  };

  // Filter auto-complete suggestions
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q || isLikelySentence(q)) {
      setSuggestions([]);
      return;
    }

    const matches = words.filter(
      (w) =>
        w.korean.toLowerCase().includes(q) ||
        w.vietnamese.toLowerCase().includes(q) ||
        (w.hanja && w.hanja.toLowerCase().includes(q))
    );
    setSuggestions(matches.slice(0, 5));
  }, [query, words]);

  // Handle single word selection or search
  const handleSelectWord = (word: VocabWord) => {
    setSelectedWord(word);
    setGrammarResult(null);
    setQuery(word.korean);
    setSuggestions([]);
    setShowHistory(false);
    addSearchHistory(word.korean);
  };

  // Execute Search or AI Grammar Check
  const handleExecute = async (inputQuery?: string) => {
    const raw = (inputQuery !== undefined ? inputQuery : query).trim();
    if (!raw) return;

    setShowHistory(false);
    setSuggestions([]);
    addSearchHistory(raw);

    const shouldCheckGrammar =
      activeMode === 'grammar' || (activeMode === 'auto' && isLikelySentence(raw));

    if (shouldCheckGrammar) {
      // Execute AI Grammar Check via backend
      setIsCheckingGrammar(true);
      setGrammarError(null);
      setSelectedWord(null);

      try {
        const response = await fetch('/api/grammar-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentence: raw }),
        });

        if (!response.ok) {
          throw new Error('Không thể kiểm tra ngữ pháp lúc này.');
        }

        const data: GrammarCheckResult = await response.json();
        setGrammarResult(data);
      } catch (err: any) {
        console.error('Grammar check failed:', err);
        setGrammarError('Đã xảy ra lỗi khi kiểm tra ngữ pháp. Vui lòng thử lại sau.');
      } finally {
        setIsCheckingGrammar(false);
      }
    } else {
      // Single word lookup (2-way: Korean <-> Vietnamese)
      const q = raw.toLowerCase();
      const exactMatch = words.find(
        (w) =>
          w.korean.toLowerCase() === q ||
          w.vietnamese.toLowerCase() === q
      );

      const partialMatch = words.find(
        (w) =>
          w.korean.toLowerCase().includes(q) ||
          w.vietnamese.toLowerCase().includes(q)
      );

      const target = exactMatch || partialMatch;

      if (target) {
        setSelectedWord(target);
        setGrammarResult(null);
      } else {
        // If word not found in database, trigger AI analysis
        setIsCheckingGrammar(true);
        try {
          const res = await fetch('/api/grammar-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sentence: raw }),
          });
          const data = await res.json();
          setGrammarResult(data);
          setSelectedWord(null);
        } catch (e) {
          setSelectedWord(null);
        } finally {
          setIsCheckingGrammar(false);
        }
      }
    }
  };

  const handlePlayAudio = async (text: string) => {
    setIsPlayingAudio(true);
    await playKoreanSpeech(text, audioSpeed);
    setIsPlayingAudio(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={containerRef}>
      {/* Search Input Box Card */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg shadow-neutral-200/50 border border-[#E8E2D9] relative transition-all">
        {/* Mode Selector and Quick Speed Toggle */}
        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-neutral-100 text-xs text-neutral-500">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="font-semibold text-neutral-600 hidden sm:inline">Chế độ:</span>
            <button
              onClick={() => setActiveMode('auto')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeMode === 'auto'
                  ? 'bg-teal-100 text-teal-800 font-bold'
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              ⚡ Tự động (Từ & Câu AI)
            </button>
            <button
              onClick={() => setActiveMode('word')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeMode === 'word'
                  ? 'bg-teal-100 text-teal-800 font-bold'
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              📖 Tìm từ đơn 2 chiều
            </button>
            <button
              onClick={() => setActiveMode('grammar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeMode === 'grammar'
                  ? 'bg-teal-100 text-teal-800 font-bold'
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              ✨ Kiểm tra câu AI
            </button>
          </div>

          {/* Speed switch: 1.0x vs 0.7x */}
          <div className="flex items-center space-x-1 bg-neutral-100 p-0.5 rounded-lg">
            <button
              onClick={() => setAudioSpeed('normal')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                audioSpeed === 'normal' ? 'bg-white text-neutral-800 shadow-xs' : 'text-neutral-500'
              }`}
            >
              Chuẩn 1.0x
            </button>
            <button
              onClick={() => setAudioSpeed('slow')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                audioSpeed === 'slow' ? 'bg-white text-teal-700 shadow-xs' : 'text-neutral-500'
              }`}
            >
              Chậm 0.7x
            </button>
          </div>
        </div>

        {/* Input Field Area */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowHistory(false);
              }}
              onFocus={() => {
                if (!query) setShowHistory(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleExecute();
                }
              }}
              placeholder="Nhập từ tiếng Hàn (ví dụ: 학교) hoặc tiếng Việt (trường học), hoặc câu dài để AI kiểm tra ngữ pháp..."
              className="w-full pl-11 pr-10 py-3.5 sm:py-4 rounded-2xl bg-[#FAF8F5] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base text-neutral-800 placeholder-neutral-400 font-medium transition-all"
            />
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedWord(null);
                  setGrammarResult(null);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Search Button */}
          <button
            onClick={() => handleExecute()}
            disabled={isCheckingGrammar || !query.trim()}
            className="flex items-center space-x-1.5 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            {isCheckingGrammar ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Đang phân tích...</span>
              </>
            ) : isLikelySentence(query) ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Sửa câu AI</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Tra từ</span>
              </>
            )}
          </button>
        </div>

        {/* Auto-complete suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-30 animate-in fade-in duration-100">
            <div className="p-2 border-b border-neutral-100 bg-neutral-50/70 text-xs font-semibold text-neutral-500">
              Gợi ý từ vựng
            </div>
            {suggestions.map((w) => (
              <button
                key={w.id}
                onClick={() => handleSelectWord(w)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-teal-50/60 transition-colors text-left border-b last:border-0 border-neutral-50"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-base text-neutral-800">{w.korean}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                    {w.partOfSpeech}
                  </span>
                  {w.hanja && <span className="text-xs text-neutral-400 font-mono">{w.hanja}</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-600 font-medium">{w.vietnamese}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-300" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Recent Search History dropdown */}
        {showHistory && searchHistory.length > 0 && !query && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 p-4 z-30 animate-in fade-in duration-100">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-600 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Lịch sử tìm kiếm gần đây</span>
              </span>
              <button
                onClick={clearSearchHistory}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item);
                    handleExecute(item);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-medium text-neutral-700 transition-colors flex items-center space-x-1"
                >
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RESULT 1: SINGLE WORD RESULT CARD */}
      {selectedWord && (
        <div className="mt-5 bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E2D9] shadow-md relative animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-100 pb-5">
            <div>
              <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  {selectedWord.korean}
                </h3>
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  {selectedWord.partOfSpeech}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">
                  {selectedWord.level}
                </span>
                {selectedWord.hanja && (
                  <span className="text-xs text-neutral-500 font-medium bg-neutral-100 px-2 py-0.5 rounded">
                    {selectedWord.hanja}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500 font-mono">{selectedWord.pronunciation}</p>
            </div>

            {/* Audio & Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePlayAudio(selectedWord.korean)}
                disabled={isPlayingAudio}
                title="Nghe phát âm chuẩn"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>Phát âm ({audioSpeed === 'slow' ? 'Chậm' : 'Chuẩn'})</span>
              </button>

              <button
                onClick={() =>
                  openPronounceModal(
                    selectedWord.korean,
                    selectedWord.pronunciation,
                    selectedWord
                  )
                }
                title="Bật Mic luyện nói & AI chấm điểm"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1"
              >
                <Mic className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline">Luyện nói AI</span>
              </button>

              <button
                onClick={() => openSaveWordModal(selectedWord)}
                title="Lưu vào Sổ tay từ vựng tự chọn"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1"
              >
                <BookmarkPlus className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Lưu sổ tay</span>
              </button>

              <button
                onClick={() => openReportModal(selectedWord)}
                title="Báo cáo lỗi từ vựng"
                className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meaning & Example Sentence */}
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Nghĩa tiếng Việt</p>
              <p className="text-xl sm:text-2xl font-bold text-teal-900 mt-1">
                {selectedWord.vietnamese}
              </p>
            </div>

            {/* Example Box */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Ví dụ câu ứng dụng</span>
                </span>
                <button
                  onClick={() => handlePlayAudio(selectedWord.example.korean)}
                  className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center space-x-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe câu mẫu</span>
                </button>
              </div>
              <p className="text-base sm:text-lg font-bold text-neutral-800 mt-1">
                {selectedWord.example.korean}
              </p>
              <p className="text-sm text-neutral-600 mt-0.5">
                {selectedWord.example.vietnamese}
              </p>
            </div>

            {/* Context Topic Badge */}
            <div className="flex items-center justify-between pt-1 text-xs text-neutral-400">
              <span>Chủ đề: <strong className="text-neutral-700">{selectedWord.topic}</strong></span>
              {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                <span>Từ đồng nghĩa: <span className="text-teal-700">{selectedWord.synonyms.join(', ')}</span></span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESULT 2: AI GRAMMAR CHECK RESULT CARD */}
      {grammarResult && (
        <div className="mt-5 bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E2D9] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-extrabold text-lg text-neutral-800">
                  AI Phân Tích & Sửa Lỗi Ngữ Pháp
                </h4>
                <p className="text-xs text-neutral-500">
                  Phân tích cấu trúc câu, kính ngữ và cách chia động từ tiếng Hàn
                </p>
              </div>
            </div>

            {grammarResult.hasError ? (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Phát hiện lỗi</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Câu chuẩn xác</span>
              </span>
            )}
          </div>

          <div className="mt-5 space-y-5">
            {/* Original Sentence with Underline on errors */}
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Câu của bạn nhập vào
              </p>
              <div className="mt-1 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-base sm:text-lg font-medium text-neutral-800">
                {grammarResult.hasError && grammarResult.errorItems.length > 0 ? (
                  <span>
                    {grammarResult.originalSentence.split(' ').map((word, index) => {
                      const isFaulty = grammarResult.errorItems.some((e) =>
                        word.includes(e.originalWord) || e.originalWord.includes(word)
                      );
                      return (
                        <span
                          key={index}
                          className={
                            isFaulty
                              ? 'border-b-2 border-rose-500 text-rose-700 font-bold bg-rose-50 px-1 rounded-xs inline-block'
                              : 'inline-block mr-1.5'
                          }
                        >
                          {word}{' '}
                        </span>
                      );
                    })}
                  </span>
                ) : (
                  <span>{grammarResult.originalSentence}</span>
                )}
              </div>
            </div>

            {/* Error Breakdown Items (if any) */}
            {grammarResult.errorItems && grammarResult.errorItems.length > 0 && (
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 space-y-2">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Chi tiết lỗi sai & Giải thích</span>
                </p>
                <div className="space-y-2 mt-2">
                  {grammarResult.errorItems.map((item, idx) => (
                    <div key={idx} className="text-xs sm:text-sm text-neutral-700 bg-white p-2.5 rounded-xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="line-through text-rose-600 font-bold">{item.originalWord}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-teal-700 font-bold">{item.correctedWord}</span>
                      </div>
                      <span className="text-neutral-600 text-xs italic">{item.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Fix (Câu chuẩn xác) */}
            <div className="bg-gradient-to-br from-teal-50 to-sky-50 p-5 rounded-2xl border border-teal-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Câu chuẩn xác (Suggested Fix)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(grammarResult.suggestedFix)}
                    className="p-1.5 text-teal-700 hover:bg-teal-100 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                  <button
                    onClick={() => handlePlayAudio(grammarResult.suggestedFix)}
                    disabled={isPlayingAudio}
                    className="p-1.5 px-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe câu sửa ({audioSpeed === 'slow' ? 'Chậm' : 'Chuẩn'})</span>
                  </button>
                  <button
                    onClick={() =>
                      openPronounceModal(
                        grammarResult.suggestedFix,
                        grammarResult.pronunciationGuide
                      )
                    }
                    className="p-1.5 px-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Luyện nói</span>
                  </button>
                </div>
              </div>

              <p className="text-xl sm:text-2xl font-black text-neutral-900 mt-2">
                {grammarResult.suggestedFix}
              </p>

              {/* Vietnamese translation */}
              <div className="mt-3 pt-3 border-t border-teal-200/60">
                <p className="text-xs font-bold text-teal-800">Dịch nghĩa tiếng Việt:</p>
                <p className="text-base font-semibold text-neutral-700 mt-0.5">
                  {grammarResult.vietnameseMeaning}
                </p>
              </div>

              {/* Honorific & Grammar Notes */}
              {grammarResult.grammarNotes && grammarResult.grammarNotes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-teal-200/60 flex flex-wrap gap-2 text-xs">
                  {grammarResult.honorificLevel && (
                    <span className="px-2 py-0.5 rounded-md bg-white text-teal-800 font-semibold border border-teal-200">
                      Kính ngữ: {grammarResult.honorificLevel}
                    </span>
                  )}
                  {grammarResult.grammarNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white text-neutral-700 font-medium border border-teal-100"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {grammarError && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{grammarError}</span>
        </div>
      )}
    </div>
  );
};
