import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Check, ArrowRight, BookOpen, Compass, Award } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { onboardingModalOpen, setOnboardingModalOpen, updateUserProfile, setActiveTab } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [hasLearned, setHasLearned] = useState<boolean | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<'Sơ cấp 1' | 'TOPIK I' | 'TOPIK II' | 'Giao tiếp hàng ngày'>('Sơ cấp 1');

  if (!onboardingModalOpen) return null;

  const handleFinish = (method?: string) => {
    updateUserProfile({
      hasLearnedBefore: hasLearned ?? false,
      levelGoal: selectedGoal,
      isOnboarded: true,
      isLoggedIn: true,
    });
    setOnboardingModalOpen(false);
    setActiveTab('roadmap');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-neutral-100 shadow-2xl relative">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div
            className={`w-8 h-2 rounded-full transition-all ${
              step >= 1 ? 'bg-teal-600' : 'bg-neutral-200'
            }`}
          />
          <div
            className={`w-8 h-2 rounded-full transition-all ${
              step >= 2 ? 'bg-teal-600' : 'bg-neutral-200'
            }`}
          />
        </div>

        {step === 1 ? (
          /* STEP 1: PRIOR KNOWLEDGE CHECK */
          <div className="text-center animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900">
              Chào Mừng Đến Với KOREAN VOCAB!
            </h3>
            <p className="text-neutral-500 text-sm mt-1">
              Để thiết kế lộ trình học tập hiệu quả nhất cho bạn, hãy cho chúng tôi biết:
            </p>

            <div className="mt-6 text-left">
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-3">
                Bạn đã từng học tiếng Hàn trước đây chưa?
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setHasLearned(false)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    hasLearned === false
                      ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
                  }`}
                >
                  <p className="font-bold text-base">Chưa, tôi là người mới bắt đầu (từ số 0)</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Cần học từ bảng chữ cái Hangul, quy tắc ghép âm và từ vựng cơ bản nhất.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setHasLearned(true)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    hasLearned === true
                      ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
                  }`}
                >
                  <p className="font-bold text-base">Đã từng học rồi, tôi muốn nâng cao & ôn thi</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Đã biết đọc viết Hangul cơ bản, cần tăng tốc từ vựng TOPIK I, TOPIK II.
                  </p>
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={hasLearned === null}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: SELECT GOAL & QUICK SIGN UP */
          <div className="text-center animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900">
              Chọn Mục Tiêu Học Tập
            </h3>
            <p className="text-neutral-500 text-sm mt-1">
              Hệ thống sẽ tự động cấu hình lộ trình học và đề thi thử phù hợp nhất:
            </p>

            <div className="mt-5 space-y-2.5 text-left">
              {[
                {
                  id: 'Sơ cấp 1',
                  title: 'Học từ đầu (Sơ cấp 1)',
                  desc: 'Bảng chữ cái, chào hỏi, đồ vật, trường học, gia đình',
                },
                {
                  id: 'TOPIK I',
                  title: 'Luyện thi TOPIK I (Level 1 - 2)',
                  desc: '1.000 từ vựng cốt lõi thi đậu chứng chỉ sơ cấp TOPIK I',
                },
                {
                  id: 'TOPIK II',
                  title: 'Luyện thi TOPIK II (Level 3 - 4)',
                  desc: 'Từ vựng học thuật, công sở, trừu tượng và văn viết',
                },
                {
                  id: 'Giao tiếp hàng ngày',
                  title: 'Giao tiếp & Đời sống du lịch',
                  desc: 'Phục vụ du lịch Hàn Quốc, xem phim K-Drama, order món ăn',
                },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGoal(g.id as any)}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all ${
                    selectedGoal === g.id
                      ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <p className="font-bold text-sm sm:text-base">{g.title}</p>
                  <p className="text-xs text-neutral-500">{g.desc}</p>
                </button>
              ))}
            </div>

            {/* Quick Login Options */}
            <div className="mt-6 pt-5 border-t border-neutral-100">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                Đăng ký / Đăng nhập tiện lợi để lưu kết quả:
              </p>

              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <button
                  type="button"
                  onClick={() => handleFinish('Google')}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFinish('Facebook')}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleFinish('Guest')}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Khám phá ngay lộ trình ({selectedGoal})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
