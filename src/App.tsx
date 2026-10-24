import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SmartSearchBar } from './components/SmartSearchBar';
import { VocabGamePromoBanner } from './components/VocabGamePromoBanner';
import { TopikLevelsPathway } from './components/TopikLevelsPathway';
import { ThemedDecks } from './components/ThemedDecks';
import { VocabGame } from './components/VocabGame';
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
import { BottomNav } from './components/BottomNav';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-neutral-800 font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* Top Header */}
      <Header />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-10">
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-12">
            {/* 1. Fast 2-in-1 Sentence Translation & Vocabulary Search - AT THE VERY TOP */}
            <SmartSearchBar />

            {/* Vocab Game & Multiplayer Friend Invite Promo Banner */}
            <VocabGamePromoBanner onPlayGame={() => setActiveTab('game')} />

            {/* 2. Prominent 6 TOPIK Learning Levels (TOPIK 1 - 6) */}
            <TopikLevelsPathway />

            {/* 3. Themed & Level-based Vocabulary Decks */}
            <ThemedDecks />
          </div>
        )}

        {activeTab === 'game' && <VocabGame />}

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

      {/* Mobile Bottom Navigation Bar (Fixed) */}
      <BottomNav />

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
