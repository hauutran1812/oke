import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, BookOpen, Layers, Award, Compass, ShieldCheck, Mail, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, openLegalModal, openReportModal } = useApp();

  return (
    <footer className="mt-20 border-t border-[#E8E2D9] bg-[#FAF8F5] text-neutral-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs border border-teal-100 flex-shrink-0 bg-white p-0.5">
                <img
                  src="/korean_vocab_logo.jpg"
                  alt="KOREAN VOCAB Logo"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-black text-2xl tracking-tight text-neutral-800">
                KOREAN <span className="text-teal-600">VOCAB</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Nền tảng học từ vựng tiếng Hàn thông minh, kết hợp Spaced Repetition, AI sửa lỗi ngữ pháp và luyện phát âm giọng đọc chuẩn Seoul.
            </p>
            <div className="pt-1 flex items-center space-x-1 text-xs text-neutral-400">
              <span>Được xây dựng với</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>dành cho người học tiếng Hàn</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Tính năng chính
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Tra từ & Kiểm tra câu AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('review')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Thẻ Flashcard lặp lại ngắt quãng
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('exam')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Thi thử TOPIK I & TOPIK II
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Lộ trình bài học cho người mới
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sổ tay & Tiện ích */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Sổ tay & Hỗ trợ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Sổ tay từ vựng tự chọn (Custom Decks)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openReportModal()}
                  className="hover:text-teal-700 transition-colors"
                >
                  Báo cáo lỗi từ vựng / dịch sai
                </button>
              </li>
              <li>
                <span className="text-neutral-400">Hỗ trợ học viên: contact@koreanvocab.vn</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Chính sách & Điều khoản
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-teal-700 transition-colors text-left"
                >
                  Điều khoản dịch vụ (Terms of Service)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-teal-700 transition-colors text-left"
                >
                  Chính sách bảo mật (Privacy Policy)
                </button>
              </li>
              <li>
                <span className="text-[11px] text-neutral-400 block pt-1">
                  Tuân thủ các tiêu chuẩn bảo vệ quyền riêng tư & dữ liệu người học.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-[#E8E2D9] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <p>© {new Date().getFullYear()} KOREAN VOCAB. Bảo lưu mọi quyền.</p>
          <p className="text-[11px]">Nền trắng kem thư thái • Tối ưu thị giác khi học lâu</p>
        </div>
      </div>
    </footer>
  );
};
