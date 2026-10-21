import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VOCAB_TOPICS } from '../data/vocabData';
import { VocabWord } from '../types';
import { playKoreanSpeech } from '../utils/audio';
import {
  Layers,
  Volume2,
  BookmarkPlus,
  Mic,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle,
} from 'lucide-react';

export const ThemedDecks: React.FC = () => {
  const {
    words,
    activeTopicFilter,
    setActiveTopicFilter,
    setActiveTab,
    openSaveWordModal,
    openPronounceModal,
  } = useApp();

  const [searchWordText, setSearchWordText] = useState('');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Filter words by active topic
  const filteredWords = words.filter((w) => {
    const matchesTopic =
      activeTopicFilter === 'all' ||
      w.topic === activeTopicFilter ||
      (activeTopicFilter === 'Giao tiếp hàng ngày' && w.topic.includes('Giao tiếp')) ||
      (activeTopicFilter === 'TOPIK Cốt Lõi' && w.topic.includes('TOPIK'));

    const matchesSearch =
      !searchWordText ||
      w.korean.toLowerCase().includes(searchWordText.toLowerCase()) ||
      w.vietnamese.toLowerCase().includes(searchWordText.toLowerCase());

    return matchesTopic && matchesSearch;
  });

  const handlePlayWord = async (word: VocabWord) => {
    setPlayingWordId(word.id);
    await playKoreanSpeech(word.korean, 'normal');
    setPlayingWordId(null);
  };

  return (
    <section className="mt-10 sm:mt-14 w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-[#E8E2D9]">
        <div>
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs sm:text-sm uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Kho từ vựng có cấu trúc</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Từ Vựng Theo Chủ Đề
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Khám phá và ghi nhớ từ vựng tiếng Hàn phân loại theo các tình huống đời sống & TOPIK
          </p>
        </div>

        {/* Quick Review All button */}
        <button
          onClick={() => setActiveTab('review')}
          className="mt-3 sm:mt-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all hover:shadow cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Luyện thẻ Flashcard chủ đề này</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Topic Badges Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
        {VOCAB_TOPICS.map((topic) => {
          const isActive =
            (topic.id === 'all' && activeTopicFilter === 'all') ||
            (topic.topicKey && activeTopicFilter === topic.topicKey);
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopicFilter(topic.topicKey || 'all')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/20'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'
              }`}
            >
              <span>{topic.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {topic.id === 'all' ? words.length : words.filter((w) => w.topic === topic.topicKey).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Vocabulary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            className="group bg-white rounded-3xl p-5 border border-[#E8E2D9] hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Card Top: Level & Badges */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200/80">
                  {word.partOfSpeech}
                </span>
                <span className="text-[11px] font-semibold text-neutral-400">
                  {word.level}
                </span>
              </div>

              {/* Korean Word & Pronunciation */}
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-black text-neutral-900 group-hover:text-teal-700 transition-colors">
                  {word.korean}
                </h3>
                {word.hanja && (
                  <span className="text-xs text-neutral-400 font-mono">{word.hanja}</span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{word.pronunciation}</p>

              {/* Vietnamese Meaning */}
              <div className="mt-3">
                <p className="text-base font-bold text-neutral-800">{word.vietnamese}</p>
              </div>

              {/* Example Snippet */}
              <div className="mt-3.5 p-3 rounded-2xl bg-[#FAF8F5] border border-neutral-100 text-xs">
                <p className="font-semibold text-neutral-800 truncate" title={word.example.korean}>
                  {word.example.korean}
                </p>
                <p className="text-neutral-500 truncate mt-0.5" title={word.example.vietnamese}>
                  {word.example.vietnamese}
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => handlePlayWord(word)}
                disabled={playingWordId === word.id}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors"
                title="Nghe phát âm"
              >
                <Volume2 className={`w-3.5 h-3.5 ${playingWordId === word.id ? 'animate-bounce' : ''}`} />
                <span>Phát âm</span>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openPronounceModal(word.korean, word.pronunciation, word)}
                  className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                  title="Luyện nói AI"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openSaveWordModal(word)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                  title="Lưu vào Sổ tay"
                >
                  <BookmarkPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
