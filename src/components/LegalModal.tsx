import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, X } from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { legalModal, closeLegalModal } = useApp();
  const { isOpen, type } = legalModal;

  if (!isOpen) return null;

  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 border border-neutral-100 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={closeLegalModal}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            {isTerms ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-neutral-900">
              {isTerms ? 'Điều Khoản Dịch Vụ' : 'Chính Sách Bảo Mật'}
            </h3>
            <p className="text-xs text-neutral-400">Ứng dụng học tiếng Hàn thông minh KOREAN VOCAB</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-neutral-600 space-y-4 leading-relaxed pr-2">
          {isTerms ? (
            <>
              <p>
                Chào mừng bạn đến với <strong>KOREAN VOCAB</strong>. Khi truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau:
              </p>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm">1. Quyền sử dụng nội dung</h4>
                <p>
                  Tất cả các tài liệu từ vựng, câu ví dụ, bài thi thử và file âm thanh phát âm được cung cấp cho mục đích học tập cá nhân, phi thương mại.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm">2. Trách nhiệm người dùng</h4>
                <p>
                  Người dùng cam kết không sử dụng hệ thống để phát tán nội dung phản cảm, không spam hoặc phá hoại dịch vụ AI kiểm tra ngữ pháp.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm">3. Tính chính xác của AI</h4>
                <p>
                  Tính năng kiểm tra ngữ pháp và chấm điểm giọng nói sử dụng mô hình trí tuệ nhân tạo tiên tiến nhằm hỗ trợ học tập. Người học có thể sử dụng nút "Báo cáo lỗi" để đóng góp ý kiến hoàn thiện.
                </p>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>KOREAN VOCAB</strong> cam kết bảo vệ thông tin riêng tư và dữ liệu cá nhân của người học:
              </p>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm">1. Dữ liệu thu thập</h4>
                <p>
                  Chúng tôi lưu trữ tiến độ học tập, lịch sử tra cứu, danh sách từ vựng trong sổ tay cá nhân và kết quả thi thử trên trình duyệt của bạn để tối ưu trải nghiệm học lặp lại ngắt quãng (Spaced Repetition).
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm">2. Quyền riêng tư âm thanh & giọng nói</h4>
                <p>
                  Dữ liệu âm thanh từ Microphone chỉ được xử lý tạm thời để đối chiếu văn bản và chấm điểm phát âm tiếng Hàn, hoàn toàn không được lưu trữ vĩnh viễn hoặc chia sẻ cho bên thứ ba.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm">3. Bảo mật tài khoản</h4>
                <p>
                  Thông tin đăng nhập của bạn được mã hóa an toàn. Bạn có toàn quyền xóa dữ liệu học tập hoặc yêu cầu xuất dữ liệu bất cứ lúc nào.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={closeLegalModal}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
