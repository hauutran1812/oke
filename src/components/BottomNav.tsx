import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Layers,
  Award,
  Gamepad2,
  Compass,
  GraduationCap,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: BookOpen },
    { id: 'roadmap', label: 'Lộ trình', icon: GraduationCap },
    { id: 'review', label: 'Ôn tập', icon: Layers },
    { id: 'exam', label: 'Thi thử', icon: Award },
    { id: 'game', label: 'Trò chơi', icon: Gamepad2, isHighlight: true, badge: 'Đào vàng' },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng cuối"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8E2D9] shadow-lg shadow-neutral-900/10 px-2 py-1.5 transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                // Scroll to top when changing tab on mobile
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? item.isHighlight
                    ? 'text-amber-700 font-black'
                    : 'text-teal-700 font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {/* Badge for Game */}
              {item.badge && !isActive && (
                <span className="absolute -top-1.5 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-white shadow-2xs animate-pulse">
                  HOT
                </span>
              )}

              <div
                className={`relative flex items-center justify-center w-9 h-7 rounded-lg transition-transform ${
                  isActive
                    ? item.isHighlight
                      ? 'bg-amber-400 text-neutral-950 scale-105 shadow-xs'
                      : 'bg-teal-600 text-white scale-105 shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate max-w-full ${
                  isActive ? 'font-extrabold text-neutral-900' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
