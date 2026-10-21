import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SmartSearchBar } from './components/SmartSearchBar';
import { ThemedDecks } from './components/ThemedDecks';
import { FlashcardReview } from './components/FlashcardReview';
import { MockExams } from './components/MockExams';
import { LearningRoadmap } from './components/LearningRoadmap';
import { SaveToNotebookModal } from './components/SaveToNotebookModal';
import { PronunciationTrainerModal } from './components/PronunciationTrainerModal';
import { ReportErrorModal } from './components/ReportErrorModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { Sparkles, BookOpen, Layers, Award, Compass, Volume2, Mic, Flame } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setOnboardingModalOpen, userProfile, words } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-neutral-800 font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* Top Header */}
      <Header />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === 'home' && (
          <div>
            {/* Hero Welcome Banner */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Trợ lý thông minh học từ vựng & kiểm tra ngữ pháp tiếng Hàn</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                Học & Ghi Nhớ Từ Vựng Tiếng Hàn <br className="hidden sm:inline" />
                <span className="text-teal-600">Dễ Dàng & Chuẩn Xác</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
                Tra cứu từ 2 chiều Hàn-Việt, phát hiện lỗi ngữ pháp bằng AI, ghi nhớ siêu tốc với Flashcard Spaced Repetition và luyện giọng đọc chuẩn Seoul.
              </p>

              {/* Quick Jump Badges */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <button
                  onClick={() => setOnboardingModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 font-bold border border-neutral-200 transition-colors shadow-2xs"
                >
                  🎯 Chọn mục tiêu & Cấp độ
                </button>
                <button
                  onClick={() => setActiveTab('review')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 font-bold border border-neutral-200 transition-colors shadow-2xs"
                >
                  ⚡ Ôn tập Flashcard ({words.length} từ)
                </button>
                <button
                  onClick={() => setActiveTab('exam')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 font-bold border border-neutral-200 transition-colors shadow-2xs"
                >
                  📝 Thi thử TOPIK I & II
                </button>
              </div>
            </div>

            {/* Smart 2-in-1 Search & Grammar Bar */}
            <SmartSearchBar />

            {/* Themed Vocabulary Decks */}
            <ThemedDecks />
          </div>
        )}

        {activeTab === 'review' && <FlashcardReview />}

        {activeTab === 'exam' && <MockExams />}

        {activeTab === 'roadmap' && <LearningRoadmap />}
      </main>

      {/* Modals & Dialogs */}
      <SaveToNotebookModal />
      <PronunciationTrainerModal />
      <ReportErrorModal />
      <OnboardingModal />
      <ProfileModal />
      <AuthModal />
      <LegalModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
