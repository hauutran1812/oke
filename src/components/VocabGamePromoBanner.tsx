import React from 'react';
import { Pickaxe, Users, Sparkles, ArrowRight, Coins, Flame, Bomb } from 'lucide-react';

interface VocabGamePromoBannerProps {
  onPlayGame: () => void;
}

export const VocabGamePromoBanner: React.FC<VocabGamePromoBannerProps> = ({ onPlayGame }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white p-4 sm:p-8 shadow-lg shadow-amber-950/20 border border-amber-400/30">
      {/* Decorative background glow & shapes */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-amber-900/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-4 right-8 opacity-15 pointer-events-none text-8xl font-black select-none hidden sm:block">
        금광
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-0.5 sm:py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-black text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>MỚI: TRÒ CHƠI ĐÀO VÀNG TỪ VỰNG</span>
            <span className="bg-amber-400 text-neutral-900 text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase">
              GOLD MINER
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Thả móc đào vàng, kim cương & giải mã từ vựng TOPIK!
          </h2>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
            Hóa thân thành thợ mỏ cừ khôi: căn chuẩn góc móc vàng, dùng thuốc nổ phá đá và trả lời câu hỏi từ vựng để nhân đôi số vàng. Thách đấu bạn bè xem ai đào được nhiều vàng nhất!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-amber-100">
            <span className="flex items-center space-x-1.5 bg-black/25 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Pickaxe className="w-3.5 h-3.5 text-amber-300" />
              <span>Máy đào móc ngoàm</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-black/25 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Coins className="w-3.5 h-3.5 text-yellow-300" />
              <span>Vàng & Kim Cương TOPIK</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-black/25 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Bomb className="w-3.5 h-3.5 text-rose-300" />
              <span>Thuốc nổ & Nước tăng lực</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-black/25 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-cyan-300" />
              <span>Mời bạn bè thách đấu</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-shrink-0">
          <button
            onClick={onPlayGame}
            className="flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-black text-sm sm:text-base shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Pickaxe className="w-5 h-5 text-amber-600" />
            <span>Chơi Đào Vàng Ngay</span>
            <ArrowRight className="w-4 h-4 text-neutral-900" />
          </button>
        </div>
      </div>
    </div>
  );
};
