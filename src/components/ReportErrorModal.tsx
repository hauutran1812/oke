import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flag, X, Check, AlertCircle } from 'lucide-react';

export const ReportErrorModal: React.FC = () => {
  const { reportModal, closeReportModal, userProfile } = useApp();
  const { isOpen, word } = reportModal;

  const [errorType, setErrorType] = useState<string>('Dịch sai nghĩa');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>(userProfile.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: word?.id || 'manual',
          wordKorean: word?.korean || 'Chung',
          errorType,
          description,
          userEmail: email,
        }),
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        closeReportModal();
      }, 1500);
    } catch (err) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        closeReportModal();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-neutral-100 shadow-2xl relative">
        <button
          onClick={closeReportModal}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-left">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <Flag className="w-4 h-4" />
            <span>Báo cáo nội dung</span>
          </div>
          <h3 className="text-xl font-black text-neutral-900 mt-1">
            Báo Cáo Lỗi Từ Vựng / Phát Âm
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Giúp ban quản trị Korean Vocab hoàn thiện dữ liệu chính xác hơn
          </p>
        </div>

        {submitSuccess ? (
          <div className="mt-6 py-8 text-center bg-teal-50 rounded-2xl border border-teal-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white mx-auto flex items-center justify-center mb-2">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-bold text-teal-900 text-sm">Cảm ơn bạn đã phản hồi!</p>
            <p className="text-xs text-neutral-600 mt-0.5">
              Đội ngũ admin sẽ kiểm tra và cập nhật sớm nhất.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {word && (
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] text-xs">
                <span className="text-neutral-400">Từ vựng báo cáo: </span>
                <strong className="text-neutral-900 text-sm">{word.korean}</strong>
                <span className="text-neutral-600"> ({word.vietnamese})</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Loại lỗi gặp phải
              </label>
              <select
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Dịch sai nghĩa">Dịch sai nghĩa tiếng Việt</option>
                <option value="Lỗi phát âm">Lỗi phát âm / Giọng đọc chưa chuẩn</option>
                <option value="Ví dụ câu sai">Ví dụ câu hoặc ngữ pháp chưa chính xác</option>
                <option value="Khác">Góp ý khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Mô tả chi tiết lỗi
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Nghĩa từ này trong ngữ cảnh công sở dịch là... mới chuẩn xác hơn."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Email nhận phản hồi
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@cuaban.com"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 rounded-xl text-neutral-600 text-xs font-semibold hover:bg-neutral-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
