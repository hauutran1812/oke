import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOPIK_LEVELS_INFO, TopikLevelMeta } from '../data/vocabData';
import {
  Award,
  BookOpen,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  FileText,
  ChevronRight,
  Compass,
} from 'lucide-react';

export const TopikLevelsPathway: React.FC = () => {
  const { words, setActiveTab, setActiveTopicFilter } = useApp();
  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number | null>(null);

  // Helper to count words for a specific TOPIK level
  const getWordCountForLevel = (lvl: number) => {
    return words.filter(
      (w) => w.topikLevel === lvl || w.level === `TOPIK ${lvl}`
    ).length;
  };

  const handleStartReviewLevel = (levelKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveTopicFilter(levelKey);
    setActiveTab('review');
  };

  const handleFilterWordsByLevel = (levelKey: string) => {
    setActiveTopicFilter(levelKey);
    // Smooth scroll down to vocabulary list
    const el = document.getElementById('vocab-list-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToExam = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveTab('exam');
  };

  return (
    <section className="w-full mb-8 sm:mb-10">
      {/* Header of Section: Clean, educational, no commercial hype */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-neutral-200/80 gap-3">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
            <span>Lộ trình học tập chuẩn Viện Giáo dục Quốc tế Hàn Quốc (NIIED)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>6 Cấp Độ Học Tiếng Hàn TOPIK</span>
            <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
              TOPIK 1 - 6
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Chọn cấp độ từ 1 đến 6 để học từ vựng chuyên sâu, luyện thẻ nhớ Flashcard và làm bài tập ngữ pháp tương ứng.
          </p>
        </div>

        {/* Quick Review All button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('review')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Ôn tất cả Flashcard ({words.length} từ)</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 TOPIK Levels (1 to 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {TOPIK_LEVELS_INFO.map((info) => {
          const actualCount = getWordCountForLevel(info.level);
          const isSelected = selectedLevelNumber === info.level;

          return (
            <div
              key={info.level}
              onClick={() => setSelectedLevelNumber(info.level === selectedLevelNumber ? null : info.level)}
              className={`relative rounded-2xl p-5 border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-white hover:bg-neutral-50/80 border-neutral-200 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Top Row: Badge, Level Tag, and Count */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black shadow-xs tracking-wider ${info.badgeBg} ${info.badgeText}`}
                  >
                    {info.badge}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      {info.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 leading-snug">
                      Cấp độ {info.level}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/60">
                    <BookOpen className="w-3 h-3 text-teal-600" />
                    <span>{actualCount} từ vựng</span>
                  </span>
                </div>
              </div>

              {/* Subtitle / Full Name */}
              <div className="text-xs font-bold text-teal-800 mb-2">
                {info.name}
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 leading-relaxed mb-3 line-clamp-2">
                {info.description}
              </p>

              {/* Target Score & Key Skills */}
              <div className="pt-2.5 border-t border-neutral-100 space-y-2 mb-4">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                  <span>Mục tiêu điểm số:</span>
                  <span className="font-bold text-neutral-800">{info.targetScore}</span>
                </div>

                {/* Key Skill Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {info.keySkills.slice(0, 2).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons for this Level */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={(e) => handleStartReviewLevel(info.levelKey, e)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  title={`Luyện Flashcard ${info.badge}`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Học Flashcard</span>
                </button>

                <button
                  onClick={() => handleFilterWordsByLevel(info.levelKey)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors border border-neutral-200 cursor-pointer"
                  title={`Xem danh sách từ ${info.badge}`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Xem danh sách</span>
                </button>

                <button
                  onClick={handleGoToExam}
                  className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
                  title="Thi thử trắc nghiệm"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
