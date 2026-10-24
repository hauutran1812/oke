import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VocabWord } from '../types';
import { playKoreanSpeech } from '../utils/audio';
import {
  Layers,
  Volume2,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  BookmarkPlus,
  Mic,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const FlashcardReview: React.FC = () => {
  const {
    words,
    customNotebooks,
    activeTopicFilter,
    updateWordMastery,
    openSaveWordModal,
    openPronounceModal,
  } = useApp();

  const [activeDeckFilter, setActiveDeckFilter] = useState<'all' | 'needs_review' | string>(() => {
    if (activeTopicFilter && (activeTopicFilter.startsWith('TOPIK') || activeTopicFilter.startsWith('topik'))) {
      return activeTopicFilter;
    }
    return 'all';
  });
  const [deck, setDeck] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal');
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ easy: 0, good: 0, hard: 0 });

  // Sync if global activeTopicFilter changes to a TOPIK level
  useEffect(() => {
    if (activeTopicFilter && activeTopicFilter.startsWith('TOPIK')) {
      setActiveDeckFilter(activeTopicFilter);
    }
  }, [activeTopicFilter]);

  // Build deck based on selected filter
  useEffect(() => {
    let targetWords: VocabWord[] = [];

    if (activeDeckFilter === 'all') {
      targetWords = [...words];
    } else if (activeDeckFilter === 'needs_review') {
      targetWords = words.filter((w) => w.masteryStatus === 'hard' || w.masteryStatus === 'unlearned');
      if (targetWords.length === 0) targetWords = [...words.slice(0, 10)];
    } else if (activeDeckFilter.startsWith('TOPIK ') || activeDeckFilter.startsWith('topik-')) {
      const lvlStr = activeDeckFilter.replace('topik-', 'TOPIK ');
      targetWords = words.filter((w) => w.level === lvlStr || `TOPIK ${w.topikLevel}` === lvlStr);
    } else {
      // Custom notebook ID or topic
      const nb = customNotebooks.find((n) => n.id === activeDeckFilter);
      if (nb) {
        targetWords = words.filter((w) => nb.wordIds.includes(w.id));
      } else {
        targetWords = words.filter((w) => w.topic === activeDeckFilter);
      }
    }

    if (targetWords.length === 0) {
      targetWords = [...words.slice(0, 10)];
    }

    setDeck(targetWords);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setSessionStats({ easy: 0, good: 0, hard: 0 });
  }, [activeDeckFilter, words, customNotebooks]);

  const currentWord = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playKoreanSpeech(text, audioSpeed);
  };

  const handleRate = (status: 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;

    // Update global state and spaced repetition queue
    updateWordMastery(currentWord.id, status);

    // Track session stats
    setSessionStats((prev) => ({
      ...prev,
      [status]: prev[status] + 1,
    }));

    // If hard, optionally insert back to deck to repeat later
    if (status === 'hard') {
      setDeck((prev) => [...prev, currentWord]);
    }

    // Move to next card
    if (currentIndex + 1 < deck.length) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleNextWord = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 120);
  };

  const handlePrevWord = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setCurrentIndex(deck.length - 1);
      }
    }, 120);
  };

  // Keyboard navigation for smooth study
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionCompleted) return;
      if (e.key === 'ArrowRight') {
        handleNextWord();
      } else if (e.key === 'ArrowLeft') {
        handlePrevWord();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length, sessionCompleted, isFlipped]);

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setSessionStats({ easy: 0, good: 0, hard: 0 });
  };

  if (!currentWord && !sessionCompleted) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E2D9] p-8">
        <Layers className="w-12 h-12 text-teal-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-neutral-800">Chưa có thẻ nào trong bộ ôn tập này</h3>
        <p className="text-neutral-500 mt-1 text-sm">Hãy chọn bộ khác hoặc lưu từ vựng vào sổ tay để bắt đầu luyện tập.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Spaced Repetition Flashcards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            Ôn Tập Từ Vựng Thông Minh
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Lật thẻ để kiểm tra trí nhớ và đánh giá mức độ thuộc để thuật toán xếp lịch ôn lại
          </p>
        </div>

        {/* Deck selector dropdown & Shuffle */}
        <div className="flex items-center space-x-2">
          <select
            value={activeDeckFilter}
            onChange={(e) => setActiveDeckFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Tất cả ({words.length} từ)</option>
            <option value="needs_review">Từ chưa thuộc / Cần ôn gấp</option>
            <optgroup label="Cấp độ TOPIK">
              <option value="TOPIK 1">TOPIK 1 - Sơ cấp 1 ({words.filter(w => w.topikLevel === 1 || w.level === 'TOPIK 1').length} từ)</option>
              <option value="TOPIK 2">TOPIK 2 - Sơ cấp 2 ({words.filter(w => w.topikLevel === 2 || w.level === 'TOPIK 2').length} từ)</option>
              <option value="TOPIK 3">TOPIK 3 - Trung cấp 3 ({words.filter(w => w.topikLevel === 3 || w.level === 'TOPIK 3').length} từ)</option>
              <option value="TOPIK 4">TOPIK 4 - Trung cấp 4 ({words.filter(w => w.topikLevel === 4 || w.level === 'TOPIK 4').length} từ)</option>
              <option value="TOPIK 5">TOPIK 5 - Cao cấp 5 ({words.filter(w => w.topikLevel === 5 || w.level === 'TOPIK 5').length} từ)</option>
              <option value="TOPIK 6">TOPIK 6 - Cao cấp 6 ({words.filter(w => w.topikLevel === 6 || w.level === 'TOPIK 6').length} từ)</option>
            </optgroup>
            {customNotebooks.length > 0 && (
              <optgroup label="Sổ tay cá nhân">
                {customNotebooks.map((nb) => (
                  <option key={nb.id} value={nb.id}>
                    {nb.icon} {nb.title} ({nb.wordIds.length} từ)
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          <button
            onClick={handleShuffle}
            title="Trộn ngẫu nhiên thứ tự thẻ"
            className="p-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {sessionCompleted ? (
        /* Completion Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E8E2D9] shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400 to-sky-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-teal-500/20 mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Xuất Sắc! Hoàn Thành Phiên Ôn Tập
          </h3>
          <p className="text-neutral-500 text-sm mt-1">
            Bạn vừa ôn luyện tổng cộng <strong>{deck.length}</strong> từ vựng tiếng Hàn.
          </p>

          {/* Stats Breakdown */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-2xl font-black text-emerald-700">{sessionStats.easy}</span>
              <p className="text-xs font-bold text-emerald-800 mt-1">Đã thuộc</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <span className="text-2xl font-black text-amber-700">{sessionStats.good}</span>
              <p className="text-xs font-bold text-amber-800 mt-1">Cần nhớ lại</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
              <span className="text-2xl font-black text-rose-700">{sessionStats.hard}</span>
              <p className="text-xs font-bold text-rose-800 mt-1">Quên / Khó</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-3">
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Ôn tập lại bộ này</span>
            </button>
            <button
              onClick={() => setActiveDeckFilter('needs_review')}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm transition-all cursor-pointer"
            >
              <span>Chỉ ôn các từ khó</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Flashcard Study */
        <div>
          {/* Progress bar & Counter */}
          <div className="flex items-center justify-between text-xs text-neutral-500 font-bold mb-2">
            <span>
              Thẻ {currentIndex + 1} / {deck.length}
            </span>
            <div className="flex items-center space-x-2">
              <span>Tốc độ đọc:</span>
              <button
                onClick={() => setAudioSpeed(audioSpeed === 'normal' ? 'slow' : 'normal')}
                className="text-teal-700 hover:underline"
              >
                {audioSpeed === 'normal' ? 'Chuẩn 1.0x' : 'Chậm 0.7x'}
              </button>
            </div>
          </div>

          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-teal-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            />
          </div>

          {/* Flashcard 3D Card Area */}
          <div
            onClick={handleFlip}
            className="w-full min-h-[380px] sm:min-h-[420px] bg-white rounded-3xl border-2 border-[#E8E2D9] hover:border-teal-400 p-6 sm:p-8 cursor-pointer shadow-xl transition-all duration-300 relative flex flex-col justify-between select-none"
          >
            {/* Top Bar inside card */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-600">
                {isFlipped ? 'Mặt sau: Nghĩa & Ứng dụng' : 'Mặt trước: Từ tiếng Hàn'}
              </span>
              <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleNextWord}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 transition-all cursor-pointer shadow-2xs"
                  title="Chuyển sang từ mới"
                >
                  <span>Chuyển từ mới</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openPronounceModal(currentWord.korean, currentWord.pronunciation, currentWord)}
                  className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                  title="Luyện nói AI"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openSaveWordModal(currentWord)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                  title="Lưu vào Sổ tay"
                >
                  <BookmarkPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD FRONT CONTENT */}
            {!isFlipped ? (
              <div className="my-auto text-center py-6">
                {currentWord.imageUrl && (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                    <img
                      src={currentWord.imageUrl}
                      alt={currentWord.korean}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
                  {currentWord.korean}
                </h3>
                <p className="text-sm font-mono text-neutral-400 mt-2">{currentWord.pronunciation}</p>

                {/* Pronunciation Audio & Next Word Buttons */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={(e) => handlePlayAudio(currentWord.korean, e)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe phát âm ({audioSpeed === 'slow' ? 'Chậm' : 'Chuẩn'})</span>
                  </button>

                  <button
                    onClick={handleNextWord}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                    title="Chuyển qua từ mới tiếp theo"
                  >
                    <span>Chuyển qua từ mới</span>
                    <ArrowRight className="w-4 h-4 text-teal-600" />
                  </button>
                </div>

                <p className="mt-6 text-xs text-neutral-400 font-medium">
                  (Bấm vào thẻ để lật xem nghĩa & ví dụ)
                </p>
              </div>
            ) : (
              /* CARD BACK CONTENT */
              <div className="my-auto py-2 text-left space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200">
                      {currentWord.partOfSpeech}
                    </span>
                    <span className="text-xs text-neutral-400 font-semibold">{currentWord.level}</span>
                    {currentWord.hanja && (
                      <span className="text-xs text-neutral-500 font-mono bg-neutral-100 px-2 py-0.5 rounded">
                        {currentWord.hanja}
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black text-teal-900 mt-2">
                    {currentWord.vietnamese}
                  </h4>
                </div>

                {/* Example sentence with translation */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Ví dụ minh họa
                    </span>
                    <button
                      onClick={(e) => handlePlayAudio(currentWord.example.korean, e)}
                      className="text-xs text-teal-700 font-semibold flex items-center space-x-1 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe câu mẫu</span>
                    </button>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-neutral-800">
                    {currentWord.example.korean}
                  </p>
                  <p className="text-sm text-neutral-600 font-medium">
                    {currentWord.example.vietnamese}
                  </p>
                </div>

                {/* Phonetics rule notes & Next word action */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-neutral-400">
                    <span>Phiên âm chuẩn: </span>
                    <strong className="text-neutral-700 font-mono">{currentWord.pronunciation}</strong>
                  </div>
                  <button
                    onClick={handleNextWord}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span>Chuyển từ mới</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Flip Hint */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-100">
              <span className="flex items-center space-x-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Bấm vào thẻ để lật xem {isFlipped ? 'mặt trước' : 'mặt sau'}</span>
              </span>
              <span>Chủ đề: {currentWord.topic}</span>
            </div>
          </div>

          {/* Quick Word Switcher Navigation */}
          <div className="flex items-center justify-between text-xs font-semibold my-4 px-1">
            <button
              onClick={handlePrevWord}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-500" />
              <span>Từ trước</span>
            </button>

            <span className="hidden sm:inline text-neutral-400 text-xs">
              Mẹo: Phím <kbd className="px-1.5 py-0.5 bg-neutral-200/70 rounded border border-neutral-300 font-mono text-[10px]">Space</kbd> lật thẻ • Phím <kbd className="px-1.5 py-0.5 bg-neutral-200/70 rounded border border-neutral-300 font-mono text-[10px]">→</kbd> chuyển từ mới
            </span>

            <button
              onClick={handleNextWord}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>Chuyển qua từ mới</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* RATING BUTTONS (After flipping) */}
          <div className="mt-6">
            <p className="text-center text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
              {isFlipped ? 'Đánh giá mức độ ghi nhớ sau khi xem thẻ:' : 'Lật thẻ để đánh giá:'}
            </p>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {/* Hard / Forget */}
              <button
                onClick={() => handleRate('hard')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-200 hover:border-rose-400 transition-all font-bold shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mb-1 text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold">Quên / Khó (Hard)</span>
                <span className="text-[10px] text-rose-500 font-medium hidden sm:inline">
                  Ôn lại ngay
                </span>
              </button>

              {/* Good / Remember with effort */}
              <button
                onClick={() => handleRate('good')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-200 hover:border-amber-400 transition-all font-bold shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-1 text-amber-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold">Cần nhớ lại (Good)</span>
                <span className="text-[10px] text-amber-600 font-medium hidden sm:inline">
                  Ôn sau 1-2 ngày
                </span>
              </button>

              {/* Easy / Mastered */}
              <button
                onClick={() => handleRate('easy')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:border-emerald-400 transition-all font-bold shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-1 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold">Đã thuộc (Easy)</span>
                <span className="text-[10px] text-emerald-600 font-medium hidden sm:inline">
                  Ôn sau 4-7 ngày
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
