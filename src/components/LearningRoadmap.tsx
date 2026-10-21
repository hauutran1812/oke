import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lesson, CustomNotebook, VocabWord } from '../types';
import { playKoreanSpeech } from '../utils/audio';
import {
  Compass,
  Bookmark,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Plus,
  Trash2,
  Volume2,
  BookmarkPlus,
  Mic,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  X,
  Check,
} from 'lucide-react';

export const LearningRoadmap: React.FC = () => {
  const {
    lessons,
    customNotebooks,
    words,
    createCustomNotebook,
    deleteCustomNotebook,
    removeWordFromNotebook,
    completeLesson,
    openSaveWordModal,
    openPronounceModal,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'notebooks'>('roadmap');
  
  // Selected Lesson Modal / View
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseResult, setExerciseResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Selected Notebook Detail View
  const [selectedNotebook, setSelectedNotebook] = useState<CustomNotebook | null>(null);

  // New Notebook Creator State
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('📚');
  const [newColor, setNewColor] = useState('from-teal-400 to-emerald-600');

  // New Word inside Notebook Creator State
  const [isAddingCustomWord, setIsAddingCustomWord] = useState(false);
  const [newKorean, setNewKorean] = useState('');
  const [newVietnamese, setNewVietnamese] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState<'Danh từ' | 'Động từ' | 'Tính từ' | 'Thành ngữ'>('Danh từ');
  const [newExampleKorean, setNewExampleKorean] = useState('');
  const [newExampleVietnamese, setNewExampleVietnamese] = useState('');

  const colorOptions = [
    { label: 'Xanh Mint / Ngọc bích', value: 'from-teal-400 to-emerald-600' },
    { label: 'Xanh Nước Biển', value: 'from-sky-400 to-blue-600' },
    { label: 'Cam Rực Rỡ', value: 'from-amber-400 to-orange-500' },
    { label: 'Hồng Phim Ảnh', value: 'from-pink-400 to-rose-500' },
    { label: 'Tím Quý Phái', value: 'from-purple-400 to-indigo-600' },
  ];

  const iconOptions = ['📚', '💼', '💻', '🎬', '✈️', '⚡', '☕', '🍜', '🌸', '🇰🇷'];

  // Handle lesson reinforcement exercise submit
  const handleSubmitExercise = () => {
    if (!selectedLesson) return;
    let correct = 0;
    selectedLesson.reinforcementExercises.forEach((ex) => {
      if (exerciseAnswers[ex.id] === ex.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / selectedLesson.reinforcementExercises.length) * 100);
    const passed = score >= 60;
    setExerciseResult({ score, passed });

    if (passed) {
      completeLesson(selectedLesson.id, score);
    }
  };

  const handleCreateNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createCustomNotebook(newTitle.trim(), newColor, newIcon, newDescription.trim());
    setNewTitle('');
    setNewDescription('');
    setIsCreatingNotebook(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8E2D9]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Lộ Trình & Sổ Tay Từ Vựng
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Lộ trình học theo từng bước từ con số 0 kết hợp sổ tay chủ đề cá nhân hóa
          </p>
        </div>

        {/* Switcher Buttons */}
        <div className="flex items-center space-x-2 bg-neutral-100 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveSubTab('roadmap');
              setSelectedNotebook(null);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'roadmap'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Lộ Trình Bài Học (Roadmap)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notebooks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'notebooks'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Sổ Tay Tự Chọn ({customNotebooks.length})</span>
          </button>
        </div>
      </div>

      {/* ================= SECTION 1: LEARNING ROADMAP ================= */}
      {activeSubTab === 'roadmap' && (
        <div>
          {/* Information banner */}
          <div className="bg-gradient-to-r from-teal-50 to-sky-50 p-4 sm:p-5 rounded-3xl border border-teal-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                🎯
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 text-sm sm:text-base">
                  Lộ trình chuẩn hóa dành cho người mới bắt đầu từ số 0
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Mỗi bài học đều có từ vựng và bài tập củng cố tức thì. <strong>Cứ cách 3 bài sẽ có 1 bài kiểm tra tổng hợp định kỳ!</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Lessons List Timeline */}
          <div className="space-y-4">
            {lessons.map((lesson, idx) => {
              const isCheckpoint = lesson.isCheckpointExam;
              return (
                <div
                  key={lesson.id}
                  className={`rounded-3xl p-5 sm:p-6 border-2 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCheckpoint
                      ? 'bg-gradient-to-r from-amber-50/70 to-orange-50/50 border-amber-300 shadow-sm'
                      : lesson.completed
                      ? 'bg-white border-teal-200 hover:border-teal-400'
                      : 'bg-white border-[#E8E2D9] hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Status Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold shadow-xs ${
                        isCheckpoint
                          ? 'bg-amber-500 text-white shadow-amber-500/20'
                          : lesson.completed
                          ? 'bg-teal-600 text-white shadow-teal-500/20'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {isCheckpoint ? (
                        <Award className="w-6 h-6" />
                      ) : lesson.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        {isCheckpoint && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                            Kiểm tra tổng hợp định kỳ
                          </span>
                        )}
                        <span className="text-xs font-semibold text-neutral-400">
                          {lesson.level}
                        </span>
                        {lesson.completed && (
                          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                            Đã đạt {lesson.score || 100}%
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 mt-1">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">{lesson.description}</p>

                      <div className="mt-2 text-xs text-neutral-400 flex items-center space-x-3">
                        <span>{lesson.words.length} từ vựng mục tiêu</span>
                        <span>•</span>
                        <span>{lesson.reinforcementExercises.length} bài tập củng cố</span>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setExerciseMode(false);
                        setExerciseAnswers({});
                        setExerciseResult(null);
                      }}
                      className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isCheckpoint
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                          : lesson.completed
                          ? 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lesson.completed ? 'Ôn lại bài' : 'Vào học ngay'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SECTION 2: CUSTOM NOTEBOOKS ================= */}
      {activeSubTab === 'notebooks' && (
        <div>
          {/* Header of custom notebooks */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-800">Bộ Sổ Tay Từ Vựng Của Bạn</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Chủ động gom nhóm từ vựng theo nhu cầu cá nhân: chuyên ngành IT, công ty, phim ảnh, từ chưa thuộc...
              </p>
            </div>

            <button
              onClick={() => setIsCreatingNotebook(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bộ từ vựng mới</span>
            </button>
          </div>

          {/* New Notebook Creator Modal / Form */}
          {isCreatingNotebook && (
            <div className="bg-white rounded-3xl p-6 border-2 border-teal-300 shadow-md mb-8 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h4 className="font-extrabold text-lg text-neutral-900">
                  Tạo Sổ Tay Từ Vựng Cá Nhân
                </h4>
                <button
                  onClick={() => setIsCreatingNotebook(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNotebook} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Tên bộ từ vựng (Ví dụ: Từ vựng IT, Giao tiếp công ty...)
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Nhập tên bộ từ vựng..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Mô tả ngắn gọn (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Ghi chú mục đích của sổ tay..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Biểu tượng đại diện (Icon)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        type="button"
                        key={icon}
                        onClick={() => setNewIcon(icon)}
                        className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all ${
                          newIcon === icon
                            ? 'bg-teal-50 border-teal-600 scale-110 shadow-xs'
                            : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Gradient Selector */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Màu sắc chủ đạo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setNewColor(opt.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          newColor === opt.value
                            ? 'ring-2 ring-teal-600 border-transparent shadow-xs text-neutral-900 bg-white'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${opt.value}`} />
                          <span>{opt.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNotebook(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                  >
                    Lưu sổ tay
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notebook Grid */}
          {!selectedNotebook ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {customNotebooks.map((nb) => {
                const count = nb.wordIds.length;
                return (
                  <div
                    key={nb.id}
                    onClick={() => setSelectedNotebook(nb)}
                    className="group bg-white rounded-3xl p-5 border border-[#E8E2D9] hover:border-teal-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${nb.color} flex items-center justify-center text-xl text-white shadow-md shadow-neutral-200`}
                        >
                          {nb.icon}
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                          {count} từ vựng
                        </span>
                      </div>

                      <h4 className="font-extrabold text-lg text-neutral-900 group-hover:text-teal-700 transition-colors">
                        {nb.title}
                      </h4>
                      {nb.description && (
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                          {nb.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-teal-700">
                      <span>Mở xem & Luyện tập</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Selected Notebook Detail View */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <button
                    onClick={() => setSelectedNotebook(null)}
                    className="text-xs font-bold text-neutral-400 hover:text-neutral-600 mb-1 inline-flex items-center space-x-1"
                  >
                    <span>← Quay lại tất cả sổ tay</span>
                  </button>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{selectedNotebook.icon}</span>
                    <h3 className="text-2xl font-black text-neutral-900">
                      {selectedNotebook.title}
                    </h3>
                  </div>
                  {selectedNotebook.description && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {selectedNotebook.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('review')}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Ôn Flashcard sổ này</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa sổ tay này không?')) {
                        deleteCustomNotebook(selectedNotebook.id);
                        setSelectedNotebook(null);
                      }
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Xóa sổ tay"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* List of words in this notebook */}
              <div className="mt-6 space-y-3">
                {selectedNotebook.wordIds.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm">Chưa có từ nào trong sổ tay này.</p>
                    <p className="text-xs mt-1">
                      Hãy bấm "Lưu vào Sổ tay" tại thanh tìm kiếm hoặc trang chủ để gom từ vào đây!
                    </p>
                  </div>
                ) : (
                  words
                    .filter((w) => selectedNotebook.wordIds.includes(w.id))
                    .map((word) => (
                      <div
                        key={word.id}
                        className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-black text-neutral-900">
                              {word.korean}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">
                              {word.partOfSpeech}
                            </span>
                            <span className="text-xs font-mono text-neutral-400">
                              {word.pronunciation}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-neutral-700 mt-1">
                            {word.vietnamese}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5 italic">
                            {word.example.korean} - {word.example.vietnamese}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 self-end sm:self-center">
                          <button
                            onClick={() => playKoreanSpeech(word.korean)}
                            className="p-2 text-teal-700 hover:bg-teal-50 rounded-xl"
                            title="Nghe phát âm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openPronounceModal(word.korean, word.pronunciation, word)}
                            className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl"
                            title="Luyện nói AI"
                          >
                            <Mic className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              removeWordFromNotebook(word.id, selectedNotebook.id)
                            }
                            className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                            title="Xóa khỏi sổ tay này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: LESSON DETAIL & REINFORCEMENT EXERCISE ================= */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-neutral-100 shadow-2xl relative">
            <button
              onClick={() => setSelectedLesson(null)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!exerciseMode ? (
              /* LESSON CONTENT VIEW */
              <div>
                <div className="pr-8">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {selectedLesson.level}
                  </span>
                  <h3 className="text-2xl font-black text-neutral-900 mt-2">
                    {selectedLesson.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">{selectedLesson.description}</p>
                </div>

                {/* Target Vocab list in this lesson */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    Từ vựng trọng tâm bài học ({selectedLesson.words.length} từ)
                  </h4>
                  <div className="space-y-2.5">
                    {selectedLesson.words.map((w) => (
                      <div
                        key={w.id}
                        className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-base text-neutral-900">{w.korean}</span>
                            <span className="text-xs text-neutral-400 font-mono">
                              {w.pronunciation}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-teal-800 mt-0.5">
                            {w.vietnamese}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => playKoreanSpeech(w.korean)}
                            className="p-2 text-teal-700 hover:bg-teal-50 rounded-xl"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openSaveWordModal(w)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl"
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button to Launch Reinforcement Exercise */}
                <div className="mt-8 pt-4 border-t border-neutral-100 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="px-4 py-2.5 rounded-xl text-neutral-600 font-semibold text-xs sm:text-sm hover:bg-neutral-100"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => setExerciseMode(true)}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span>Làm bài tập củng cố bài này</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* REINFORCEMENT EXERCISE VIEW */
              <div>
                <div className="pr-8">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Bài tập củng cố kiến thức
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 mt-1">
                    {selectedLesson.title}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Trả lời đúng từ 60% trở lên để hoàn thành và mở khóa tiếp theo!
                  </p>
                </div>

                {exerciseResult ? (
                  /* Exercise Score Result */
                  <div className="mt-6 text-center py-6 bg-[#FAF8F5] rounded-3xl border border-teal-200">
                    <div
                      className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-xl mb-3 ${
                        exerciseResult.passed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {exerciseResult.passed ? '🎉' : '💪'}
                    </div>
                    <h4 className="text-xl font-bold text-neutral-900">
                      {exerciseResult.passed
                        ? 'Chúc mừng! Bạn đã hoàn thành xuất sắc'
                        : 'Cần ôn lại thêm một chút!'}
                    </h4>
                    <p className="text-sm text-neutral-600 mt-1">
                      Điểm số của bạn: <strong>{exerciseResult.score}%</strong>
                    </p>

                    <div className="mt-6 flex justify-center space-x-3">
                      <button
                        onClick={() => {
                          setExerciseResult(null);
                          setExerciseAnswers({});
                        }}
                        className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold text-xs"
                      >
                        Làm lại bài tập
                      </button>
                      <button
                        onClick={() => setSelectedLesson(null)}
                        className="px-6 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm"
                      >
                        Hoàn tất & Quay lại
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Questions */
                  <div className="mt-6 space-y-6">
                    {selectedLesson.reinforcementExercises.map((ex, qIdx) => (
                      <div key={ex.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm">
                        <p className="font-bold text-neutral-900">
                          Câu {qIdx + 1}: {ex.question}
                        </p>
                        <div className="mt-3 space-y-2">
                          {ex.options.map((opt, oIdx) => {
                            const isSelected = exerciseAnswers[ex.id] === opt;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  setExerciseAnswers((prev) => ({
                                    ...prev,
                                    [ex.id]: opt,
                                  }))
                                }
                                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                                  isSelected
                                    ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 flex justify-between items-center border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => setExerciseMode(false)}
                        className="text-xs font-semibold text-neutral-500 hover:underline"
                      >
                        ← Xem lại lý thuyết
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitExercise}
                        disabled={
                          Object.keys(exerciseAnswers).length <
                          selectedLesson.reinforcementExercises.length
                        }
                        className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        Nộp bài củng cố
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
