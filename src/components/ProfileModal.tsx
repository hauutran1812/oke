import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, KeyRound, Flame, Award, BookOpen, Check, X } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { profileModalOpen, setProfileModalOpen, userProfile, updateUserProfile, words } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [goal, setGoal] = useState(userProfile.levelGoal);
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyGoalWords);

  // Change password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!profileModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      levelGoal: goal,
      dailyGoalWords: Number(dailyGoal),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 2000);
  };

  const masteredCount = words.filter((w) => w.masteryStatus === 'easy').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-neutral-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-left">
          <h3 className="text-2xl font-black text-neutral-900">Hồ Sơ Cá Nhân & Cài Đặt</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Quản lý thông tin tài khoản, mục tiêu học tập và đổi mật khẩu
          </p>
        </div>

        {/* Stats Summary Cards */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <Flame className="w-5 h-5 text-amber-500 mx-auto" />
            <span className="block font-black text-lg text-amber-800 mt-1">
              {userProfile.streakDays} Ngày
            </span>
            <span className="text-[10px] text-amber-600 font-semibold">Chuỗi liên tiếp</span>
          </div>

          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200">
            <Check className="w-5 h-5 text-teal-600 mx-auto" />
            <span className="block font-black text-lg text-teal-800 mt-1">
              {masteredCount} Từ
            </span>
            <span className="text-[10px] text-teal-600 font-semibold">Đã thuộc vững</span>
          </div>

          <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
            <Award className="w-5 h-5 text-sky-600 mx-auto" />
            <span className="block font-black text-sm text-sky-800 mt-1 truncate">
              {userProfile.levelGoal}
            </span>
            <span className="text-[10px] text-sky-600 font-semibold">Mục tiêu hiện tại</span>
          </div>
        </div>

        {/* Form 1: Profile Info */}
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center space-x-3">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-teal-500 shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-neutral-900">{userProfile.name}</p>
                <p className="text-xs text-neutral-500">{userProfile.phone || userProfile.email}</p>
                <div className="mt-1 flex items-center space-x-1.5">
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    <span>
                      {userProfile.authProvider === 'google'
                        ? 'Đăng nhập với Google'
                        : userProfile.authProvider === 'facebook'
                        ? 'Đăng nhập với Facebook'
                        : userProfile.authProvider === 'phone'
                        ? 'Số điện thoại xác thực'
                        : 'Tài khoản Email'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                updateUserProfile({ isLoggedIn: false });
                setProfileModalOpen(false);
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Họ và tên hiển thị
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Mục tiêu học tập
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Sơ cấp 1">Sơ cấp 1 (Từ đầu)</option>
                <option value="TOPIK I">Luyện thi TOPIK I</option>
                <option value="TOPIK II">Luyện thi TOPIK II</option>
                <option value="Giao tiếp hàng ngày">Giao tiếp du lịch & phim ảnh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Mục tiêu từ / ngày
              </label>
              <input
                type="number"
                min={5}
                max={50}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {saveSuccess ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Đã lưu thông tin!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>

        {/* Form 2: Change Password */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
            <KeyRound className="w-4 h-4 text-teal-600" />
            <span>Đổi Mật Khẩu</span>
          </h4>

          {passwordSuccess && (
            <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
              Mật khẩu đã được cập nhật thành công!
            </div>
          )}

          {passwordError && (
            <div className="mb-3 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <input
                type="password"
                required
                placeholder="Mật khẩu hiện tại"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="password"
                required
                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <input
                type="password"
                required
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
