import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, updateUserProfile } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name || (email.split('@')[0] || 'Học Viên Mới'),
      email: email || 'user@koreanvocab.vn',
      isLoggedIn: true,
    });
    setAuthModalOpen(false);
  };

  const handleOAuthLogin = (provider: string) => {
    updateUserProfile({
      name: `${provider} Học Viên`,
      email: `${provider.toLowerCase()}@koreanvocab.vn`,
      isLoggedIn: true,
    });
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 border border-neutral-100 shadow-2xl relative">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-lg shadow-teal-700/15 mx-auto mb-3 border border-teal-100 bg-white p-1">
            <img
              src="/korean_vocab_logo.jpg"
              alt="KOREAN VOCAB Logo"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-2xl font-black text-neutral-900">
            {isRegister ? 'Đăng Ký Tài Khoản' : 'Chào Mừng Trở Lại!'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Đăng nhập để đồng bộ tiến độ học từ vựng, chuỗi ngày học và sổ tay cá nhân
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => handleOAuthLogin('Google')}
            className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
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
            onClick={() => handleOAuthLogin('Facebook')}
            className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-400 font-semibold">Hoặc với email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Họ và tên</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@cuaban.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>{isRegister ? 'Đăng Ký Miễn Phí' : 'Đăng Nhập'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-neutral-500">
          {isRegister ? (
            <p>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-teal-700 font-bold hover:underline"
              >
                Đăng nhập ngay
              </button>
            </p>
          ) : (
            <p>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-teal-700 font-bold hover:underline"
              >
                Đăng ký miễn phí
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
