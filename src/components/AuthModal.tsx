import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

type AuthMethod = 'social' | 'phone' | 'email';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, updateUserProfile } = useApp();

  // Primary mode: 'login' or 'register'
  const [isRegister, setIsRegister] = useState(false);
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('phone');

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone number state
  const [countryCode, setCountryCode] = useState('+84');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentOtpHint, setSentOtpHint] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // General feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (authModalOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [authModalOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!authModalOpen) return null;

  // 1. Google Login
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/oauth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          name: 'Học Viên Google',
          email: 'hocvien.google@koreanvocab.vn',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        updateUserProfile({
          name: data.user.name,
          email: data.user.email,
          avatarUrl: data.user.avatarUrl,
          authProvider: 'google',
          isLoggedIn: true,
        });
        setSuccessMessage('Đăng nhập thành công với tài khoản Google!');
        setTimeout(() => {
          setAuthModalOpen(false);
        }, 800);
      }
    } catch {
      // Fallback direct
      updateUserProfile({
        name: 'Học Viên Google',
        email: 'user.google@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        authProvider: 'google',
        isLoggedIn: true,
      });
      setAuthModalOpen(false);
    }
  };

  // 2. Facebook Login
  const handleFacebookAuth = async () => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/oauth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'facebook',
          name: 'Học Viên Facebook',
          email: 'hocvien.fb@facebook.com',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        updateUserProfile({
          name: data.user.name,
          email: data.user.email,
          avatarUrl: data.user.avatarUrl,
          authProvider: 'facebook',
          isLoggedIn: true,
        });
        setSuccessMessage('Đăng nhập thành công với tài khoản Facebook!');
        setTimeout(() => {
          setAuthModalOpen(false);
        }, 800);
      }
    } catch {
      updateUserProfile({
        name: 'Học Viên Facebook',
        email: 'user.facebook@facebook.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        authProvider: 'facebook',
        isLoggedIn: true,
      });
      setAuthModalOpen(false);
    }
  };

  // 3. Phone Number - Send SMS OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const clean = phoneNumber.trim().replace(/\D/g, '');
    if (clean.length < 9 || clean.length > 11) {
      setErrorMessage('Số điện thoại không hợp lệ. Vui lòng nhập từ 9 đến 11 số.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/phone-send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: clean,
          countryCode,
          name: phoneName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể gửi mã xác thực SMS');
      }

      setOtpSent(true);
      setSentOtpHint(data.otpCode || '886622');
      setCountdown(60);
      setSuccessMessage(`Đã gửi mã xác thực SMS đến ${countryCode} ${clean}!`);
    } catch (err: any) {
      // Fallback
      setOtpSent(true);
      setSentOtpHint('886622');
      setCountdown(60);
      setSuccessMessage(`Mã xác thực SMS demo: 886622`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 4. Phone Number - Verify SMS OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.trim().length < 6) {
      setErrorMessage('Vui lòng nhập đủ mã xác thực OTP 6 chữ số.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const clean = phoneNumber.trim().replace(/\D/g, '');
      const res = await fetch('/api/auth/phone-verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: clean,
          countryCode,
          otpCode: otpCode.trim(),
          name: phoneName.trim() || `Học viên ${clean.slice(-4)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Mã xác thực OTP không đúng.');
      }

      updateUserProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        avatarUrl: data.user.avatarUrl,
        authProvider: 'phone',
        isLoggedIn: true,
      });

      setSuccessMessage('Xác thực số điện thoại thành công! Đang chuyển tiếp...');
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 5. Email & Password submit
  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    const displayName = isRegister
      ? name.trim() || email.split('@')[0]
      : name.trim() || email.split('@')[0] || 'Học Viên Tiếng Hàn';

    updateUserProfile({
      name: displayName,
      email: email.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
      authProvider: 'email',
      isLoggedIn: true,
    });

    setSuccessMessage(isRegister ? 'Tạo tài khoản thành công!' : 'Đăng nhập thành công!');
    setTimeout(() => {
      setAuthModalOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-7 border border-neutral-100 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md mx-auto mb-2.5 border border-teal-100 bg-white p-1">
            <img
              src="/app-icon.png"
              alt="KOREAN VOCAB Logo"
              className="w-full h-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            {isRegister ? 'Tạo Tài Khoản Học Tiếng Hàn' : 'Đăng Nhập Korean Vocab'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Học hơn 1.000 từ vựng TOPIK, thi thử và đồng bộ tiến độ học tập trên mọi thiết bị
          </p>
        </div>

        {/* Alert Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Social Platforms Row (Google & Facebook) */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 text-center">
            Đăng nhập nhanh với 1 chạm
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80 text-neutral-700 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

            {/* Facebook */}
            <button
              type="button"
              onClick={handleFacebookAuth}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Divider with method switch */}
        <div className="flex border-b border-neutral-200 mb-4">
          <button
            type="button"
            onClick={() => {
              setActiveMethod('phone');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-1.5 ${
              activeMethod === 'phone'
                ? 'border-teal-600 text-teal-700 bg-teal-50/40 rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Số điện thoại (SMS OTP)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMethod('email');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-1.5 ${
              activeMethod === 'email'
                ? 'border-teal-600 text-teal-700 bg-teal-50/40 rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Mật khẩu</span>
          </button>
        </div>

        {/* METHOD 1: PHONE NUMBER & SMS OTP */}
        {activeMethod === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {isRegister ? 'Họ và tên của bạn' : 'Tên hiển thị (tùy chọn)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phoneName}
                      onChange={(e) => setPhoneName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-2.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="+84">🇻🇳 +84</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+81">🇯🇵 +81</option>
                    </select>

                    <div className="relative flex-1">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Hệ thống sẽ gửi mã xác thực gồm 6 chữ số qua tin nhắn SMS
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Gửi Mã Xác Thực SMS OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5">
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-center">
                  <p className="text-xs text-teal-900 font-medium">
                    Mã xác thực đã gửi đến{' '}
                    <span className="font-black text-teal-900">
                      {countryCode} {phoneNumber}
                    </span>
                  </p>
                  {sentOtpHint && (
                    <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white rounded-lg border border-teal-300 text-[11px] text-teal-800 font-semibold shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mã OTP của bạn: <strong className="text-teal-700 tracking-wider text-xs">{sentOtpHint}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(sentOtpHint)}
                        className="ml-1.5 text-teal-700 underline text-[10px] font-bold hover:text-teal-900"
                      >
                        (Điền tự động)
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Nhập mã xác thực 6 chữ số
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="886622"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-center tracking-[0.3em] text-base font-black text-neutral-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <ShieldCheck className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="text-neutral-500 hover:text-neutral-700 hover:underline"
                  >
                    Đổi số điện thoại khác
                  </button>

                  {countdown > 0 ? (
                    <span className="text-neutral-400 text-[11px]">
                      Gửi lại mã sau <strong>{countdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      className="text-teal-700 font-bold hover:underline text-[11px]"
                    >
                      Gửi lại mã OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {isVerifyingOtp ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Xác Nhận & Đăng Nhập Ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* METHOD 2: EMAIL & PASSWORD */}
        {activeMethod === 'email' && (
          <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required={isRegister}
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
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Địa chỉ Email
              </label>
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
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>{isRegister ? 'Đăng Ký Miễn Phí' : 'Đăng Nhập Với Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Toggle Register / Login */}
        <div className="mt-4 pt-3 border-t border-neutral-100 text-center text-xs text-neutral-500">
          {isRegister ? (
            <p>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage(null);
                }}
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
                onClick={() => {
                  setIsRegister(true);
                  setErrorMessage(null);
                }}
                className="text-teal-700 font-bold hover:underline"
              >
                Đăng ký tài khoản mới miễn phí
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
