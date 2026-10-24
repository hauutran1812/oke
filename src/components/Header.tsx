import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Sparkles,
  Award,
  Layers,
  Flame,
  User,
  LogOut,
  Settings,
  Mic,
  Bookmark,
  Menu,
  X,
  Compass,
  Gamepad2,
  Pickaxe,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    updateUserProfile,
    setProfileModalOpen,
    setAuthModalOpen,
    openPronounceModal,
    words,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: BookOpen },
    { id: 'roadmap', label: 'Tiến độ học tập', icon: Compass },
    { id: 'review', label: 'Ôn tập (Flashcard)', icon: Layers },
    { id: 'exam', label: 'Thi thử', icon: Award },
    { id: 'game', label: 'Trò chơi đào vàng', icon: Gamepad2, badge: 'Đào Vàng' },
  ];

  const handleLogout = () => {
    updateUserProfile({ isLoggedIn: false });
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2.5 sm:space-x-3.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm shadow-teal-700/15 group-hover:scale-105 transition-transform duration-200 border border-teal-100/90 flex-shrink-0 bg-white p-0.5">
                <img
                  src="/app-icon.png"
                  alt="KOREAN VOCAB Logo"
                  className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-black text-xl sm:text-3xl tracking-tight text-neutral-800">
                    KOREAN <span className="text-teal-600">VOCAB</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase tracking-wider hidden sm:inline-block">
                    AI Smart
                  </span>
                </div>
                <p className="text-xs text-neutral-500 hidden sm:block font-medium mt-0.5">
                  Học & Ghi nhớ từ vựng tiếng Hàn hiệu quả
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider ${
                        isActive
                          ? 'bg-white text-teal-800'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right corner User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Launch Mic AI Pronunciation Trainer */}
            <button
              onClick={() => openPronounceModal('안녕하세요', '[an-nyeong-ha-se-yo]')}
              title="Luyện nói & Chấm điểm phát âm AI"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200/70 text-xs sm:text-sm font-semibold transition-colors"
            >
              <Mic className="w-4 h-4 text-teal-600 animate-pulse" />
              <span className="hidden sm:inline">Luyện phát âm</span>
            </button>

            {/* Streak Counter */}
            <div
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold"
              title={`${userProfile.streakDays} ngày học liên tiếp`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{userProfile.streakDays} ngày</span>
            </div>

            {/* Profile / Auth Button */}
            {userProfile.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:ring-2 hover:ring-teal-400 transition-all focus:outline-none"
                  aria-label="Tài khoản cá nhân"
                >
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-bold text-neutral-800 truncate">{userProfile.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{userProfile.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-semibold bg-neutral-50 px-2 py-1 rounded-lg">
                        <span className="text-neutral-600">Mục tiêu:</span>
                        <span className="text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          {userProfile.levelGoal}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileModalOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 text-left transition-colors font-medium"
                      >
                        <User className="w-4 h-4 text-neutral-400" />
                        <span>Hồ sơ & Đổi mật khẩu</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('roadmap');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 text-left transition-colors font-medium"
                      >
                        <Bookmark className="w-4 h-4 text-neutral-400" />
                        <span>Sổ tay từ vựng tự chọn</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileModalOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 text-left transition-colors font-medium"
                      >
                        <Settings className="w-4 h-4 text-neutral-400" />
                        <span>Cài đặt học tập</span>
                      </button>
                    </div>

                    <div className="border-t border-neutral-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 text-left transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all hover:shadow"
              >
                Đăng nhập / Đăng ký
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E2D9] bg-[#FAF8F5] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-neutral-700 hover:bg-neutral-200/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                      isActive ? 'bg-white text-teal-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
