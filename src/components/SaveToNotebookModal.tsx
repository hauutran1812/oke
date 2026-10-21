import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, Check, Plus, X } from 'lucide-react';

export const SaveToNotebookModal: React.FC = () => {
  const {
    saveWordModal,
    closeSaveWordModal,
    customNotebooks,
    saveWordToNotebook,
    createCustomNotebook,
  } = useApp();

  const { isOpen, word } = saveWordModal;
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !word) return null;

  const handleSave = () => {
    if (!selectedNotebookId) return;
    saveWordToNotebook(word.id, selectedNotebookId);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeSaveWordModal();
    }, 1200);
  };

  const handleCreateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newId = createCustomNotebook(newTitle.trim(), 'from-teal-400 to-emerald-600', '📌');
    saveWordToNotebook(word.id, newId);
    setNewTitle('');
    setIsCreatingNew(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeSaveWordModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-neutral-100 shadow-2xl relative">
        <button
          onClick={closeSaveWordModal}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-left">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            <span>Lưu từ vựng</span>
          </div>
          <h3 className="text-xl font-black text-neutral-900 mt-1">
            Lưu Vào Sổ Tay Tự Chọn
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Từ đã chọn: <strong className="text-neutral-800">{word.korean}</strong> ({word.vietnamese})
          </p>
        </div>

        {savedSuccess ? (
          <div className="mt-6 py-8 text-center bg-teal-50 rounded-2xl border border-teal-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white mx-auto flex items-center justify-center mb-2">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-bold text-teal-900 text-sm">Đã lưu từ vựng vào sổ tay thành công!</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Chọn một sổ tay từ vựng:
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {customNotebooks.map((nb) => {
                const isAlreadyIn = nb.wordIds.includes(word.id);
                const isSelected = selectedNotebookId === nb.id;
                return (
                  <button
                    key={nb.id}
                    onClick={() => setSelectedNotebookId(nb.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-600'
                        : 'bg-[#FAF8F5] border-[#E8E2D9] text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{nb.icon}</span>
                      <div>
                        <span className="font-bold">{nb.title}</span>
                        {isAlreadyIn && (
                          <span className="ml-2 text-[10px] text-teal-700 font-bold bg-teal-100 px-1.5 py-0.5 rounded">
                            Đã có
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400 font-normal">
                      {nb.wordIds.length} từ
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick create new notebook button */}
            {!isCreatingNew ? (
              <button
                type="button"
                onClick={() => setIsCreatingNew(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-neutral-300 text-teal-700 hover:bg-teal-50 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo nhanh sổ tay mới</span>
              </button>
            ) : (
              <form onSubmit={handleCreateAndSave} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Tên sổ tay mới:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ví dụ: Từ vựng IT, Phim Hàn..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
                  >
                    Tạo & Lưu
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeSaveWordModal}
                className="px-4 py-2 rounded-xl text-neutral-600 text-xs font-semibold hover:bg-neutral-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedNotebookId}
                className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Xác nhận lưu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
