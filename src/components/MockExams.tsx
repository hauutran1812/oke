import React, { useState, useEffect } from 'react';
import { MOCK_EXAMS } from '../data/quizData';
import { QuizTest, QuizQuestion } from '../types';
import { playKoreanSpeech } from '../utils/audio';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Check,
  AlertCircle,
  Trophy,
} from 'lucide-react';

export const MockExams: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<QuizTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer: any = null;
    if (isTimerActive && timeLeft > 0 && !examSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setExamSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, examSubmitted]);

  const handleStartExam = (exam: QuizTest) => {
    setSelectedExam(exam);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setExamSubmitted(false);
    setTimeLeft(exam.durationMinutes * 60);
    setIsTimerActive(true);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (examSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitExam = () => {
    setIsTimerActive(false);
    setExamSubmitted(true);
  };

  const handleRetake = () => {
    if (!selectedExam) return;
    handleStartExam(selectedExam);
  };

  const handleExitExam = () => {
    setSelectedExam(null);
    setIsTimerActive(false);
    setExamSubmitted(false);
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate score
  const calculateResults = () => {
    if (!selectedExam) return { correctCount: 0, total: 0, percentage: 0 };
    let correct = 0;
    selectedExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correctCount: correct,
      total: selectedExam.questions.length,
      percentage: Math.round((correct / selectedExam.questions.length) * 100),
    };
  };

  const [selectedTopikFilter, setSelectedTopikFilter] = useState<'all' | number>('all');

  // Filter exams based on TOPIK level 1 to 6
  const filteredExams = MOCK_EXAMS.filter((exam) => {
    if (selectedTopikFilter === 'all') return true;
    return exam.topikLevel === selectedTopikFilter;
  });

  // Level badge styling helper
  const getLevelBadgeStyle = (levelNum?: number) => {
    switch (levelNum) {
      case 1:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 2:
        return 'bg-teal-50 text-teal-800 border-teal-300';
      case 3:
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 4:
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 5:
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 6:
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-neutral-50 text-neutral-800 border-neutral-300';
    }
  };

  // If no exam selected, show list of available mock exams
  if (!selectedExam) {
    return (
      <div className="w-full max-w-5xl mx-auto py-2 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Kiểm tra năng lực chuẩn TOPIK I & II</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Thi Thử Tiếng Hàn 6 Cấp Độ (TOPIK 1 - 6)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
            Lựa chọn đề thi thử chuẩn cấu trúc đề thi chính thức NIIED theo cấp độ 1 đến 6 để củng cố từ vựng, phản xạ ngữ pháp và tính điểm thời gian thực.
          </p>

          {/* Level Filter Tabs (TOPIK 1 to 6) */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedTopikFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedTopikFilter === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-[#E8E2D9] text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Tất cả đề ({MOCK_EXAMS.length})
            </button>
            {[1, 2, 3, 4, 5, 6].map((lvl) => {
              const count = MOCK_EXAMS.filter((e) => e.topikLevel === lvl).length;
              const isActive = selectedTopikFilter === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedTopikFilter(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white border border-[#E8E2D9] text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>TOPIK {lvl}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {count} đề
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Grid of Exams: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8E2D9] hover:border-teal-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] border ${getLevelBadgeStyle(
                      exam.topikLevel
                    )}`}
                  >
                    {exam.level}
                  </span>
                  <span className="flex items-center space-x-1 text-neutral-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{exam.durationMinutes} phút</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug line-clamp-2">
                  {exam.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                  {exam.description}
                </p>

                <div className="mt-3 pt-3 border-t border-neutral-100 text-xs font-semibold text-neutral-600 flex items-center space-x-2">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  <span>{exam.questions.length} câu hỏi đa dạng (kèm phát âm)</span>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="mt-4 sm:mt-6 w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <span>Bắt đầu thi thử</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const results = calculateResults();
  const currentQ = selectedExam.questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-6">
      {/* Test Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8E2D9] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={handleExitExam}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-600 mb-1 inline-flex items-center space-x-1"
          >
            <span>← Quay lại danh sách đề thi</span>
          </button>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">{selectedExam.title}</h3>
          <p className="text-xs text-neutral-500">
            {selectedExam.level} • {selectedExam.questions.length} câu hỏi
          </p>
        </div>

        {/* Timer display */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl font-mono text-sm font-bold border ${
              timeLeft < 120
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-neutral-100 text-neutral-800 border-neutral-200'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-600" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!examSubmitted && (
            <button
              onClick={handleSubmitExam}
              className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Nộp bài
            </button>
          )}
        </div>
      </div>

      {examSubmitted ? (
        /* Result Summary Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-lg animate-in zoom-in-95 duration-200">
          <div className="text-center pb-6 border-b border-neutral-100">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900">Kết Quả Bài Thi Thử</h3>
            <p className="text-neutral-500 text-sm mt-1">
              Bạn đạt được <strong>{results.correctCount}/{results.total}</strong> câu đúng (
              {results.percentage}%)
            </p>

            <div className="mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {results.percentage >= 80
                ? 'Đạt trình độ mục tiêu xuất sắc 🎉'
                : results.percentage >= 60
                ? 'Kết quả khá tốt! Cần luyện thêm từ khó 👍'
                : 'Cần ôn luyện thêm từ vựng và ngữ pháp 📚'}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
              Chi tiết bài làm & Lời giải:
            </h4>

            {selectedExam.questions.map((q, idx) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border text-sm ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-neutral-900">
                      Câu {idx + 1}: {q.prompt}
                    </p>
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-emerald-700 font-bold text-xs shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đúng</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-rose-700 font-bold text-xs shrink-0">
                        <XCircle className="w-4 h-4" />
                        <span>Sai</span>
                      </span>
                    )}
                  </div>

                  {q.audioText && (
                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        onClick={() => playKoreanSpeech(q.audioText!)}
                        className="text-xs text-teal-700 font-semibold flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-teal-200"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe lại âm thanh</span>
                      </button>
                    </div>
                  )}

                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-neutral-600">
                      Đáp án bạn chọn:{' '}
                      <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {userAnswers[q.id] || '(Chưa chọn)'}
                      </strong>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-800">
                        Đáp án đúng: <strong>{q.correctAnswer}</strong>
                      </p>
                    )}
                    <p className="text-neutral-500 italic mt-1 bg-white p-2 rounded-xl border border-neutral-100">
                      Giải thích: {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center space-x-3">
            <button
              onClick={handleRetake}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại đề thi</span>
            </button>
            <button
              onClick={handleExitExam}
              className="px-6 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm transition-all cursor-pointer"
            >
              Chọn đề khác
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Display */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-md">
          {/* Question Counter */}
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold mb-4">
            <span>
              Câu {currentQuestionIndex + 1} / {selectedExam.questions.length}
            </span>
            <div className="flex items-center space-x-1">
              {selectedExam.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                    idx === currentQuestionIndex
                      ? 'bg-teal-600 text-white ring-2 ring-teal-300'
                      : userAnswers[q.id]
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="my-4">
            <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
              {currentQ.prompt}
            </h4>

            {/* Audio question prompt if applicable */}
            {currentQ.audioText && (
              <div className="mt-4 p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center space-x-3">
                <button
                  onClick={() => playKoreanSpeech(currentQ.audioText!)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Bấm nghe phát âm mẫu</span>
                </button>
                <span className="text-xs text-teal-800 font-medium">
                  Nghe rõ và chọn câu trả lời tương ứng
                </span>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="mt-6 space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = userAnswers[currentQ.id] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, option)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold shadow-xs'
                      : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-base">{option}</span>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-teal-600" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Prev / Next */}
          <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-xs sm:text-sm font-semibold hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Câu trước
            </button>

            {currentQuestionIndex + 1 < selectedExam.questions.length ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(selectedExam.questions.length - 1, prev + 1)
                  )
                }
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                Hoàn tất & Nộp bài
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
