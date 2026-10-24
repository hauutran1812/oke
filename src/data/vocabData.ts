import { VocabWord } from '../types';
import { ALL_VOCAB_WORDS } from './allVocabWords';

export interface TopikLevelMeta {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  badge: string;
  levelKey: 'TOPIK 1' | 'TOPIK 2' | 'TOPIK 3' | 'TOPIK 4' | 'TOPIK 5' | 'TOPIK 6';
  category: 'Sơ cấp' | 'Trung cấp' | 'Cao cấp';
  targetScore: string;
  wordCountLabel: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  keySkills: string[];
}

export const TOPIK_LEVELS_INFO: TopikLevelMeta[] = [
  {
    level: 1,
    name: 'Sơ cấp 1 (Nhập môn & Chào hỏi)',
    badge: 'TOPIK 1',
    levelKey: 'TOPIK 1',
    category: 'Sơ cấp',
    targetScore: '80+ điểm TOPIK I',
    wordCountLabel: '280+ từ vựng cốt lõi',
    color: 'emerald',
    bgGradient: 'from-emerald-500/10 to-teal-500/5',
    borderColor: 'border-emerald-300',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-white',
    description: 'Chữ cái Hangul, giới thiệu bản thân, số đếm, gia đình, ăn uống và sinh hoạt hàng ngày căn bản.',
    keySkills: ['Kính ngữ lịch sự 이에요/예요', 'Trợ từ chủ ngữ 은/는, 이/가', 'Hành động hiện tại 아/어요', 'Số từ Hán Hàn & Thuần Hàn']
  },
  {
    level: 2,
    name: 'Sơ cấp 2 (Giao tiếp đời sống thực tế)',
    badge: 'TOPIK 2',
    levelKey: 'TOPIK 2',
    category: 'Sơ cấp',
    targetScore: '140+ điểm TOPIK I',
    wordCountLabel: '190+ từ vựng thực tế',
    color: 'teal',
    bgGradient: 'from-teal-500/10 to-cyan-500/5',
    borderColor: 'border-teal-300',
    badgeBg: 'bg-teal-600',
    badgeText: 'text-white',
    description: 'Đi lại bằng tàu điện, xe buýt, mua sắm, hỏi đường, đặt phòng khách sạn, giao tiếp bưu điện & y tế.',
    keySkills: ['Thể quá khứ 았/었어요, tương lai (으)ㄹ 거예요', 'Đổi tuyến tàu/xe, chỉ đường', 'Cấu trúc định ngữ danh từ', 'Thanh toán & đặt phòng']
  },
  {
    level: 3,
    name: 'Trung cấp 3 (Đời sống xã hội & Công sở cơ bản)',
    badge: 'TOPIK 3',
    levelKey: 'TOPIK 3',
    category: 'Trung cấp',
    targetScore: '120+ điểm TOPIK II',
    wordCountLabel: '160+ từ vựng công sở',
    color: 'blue',
    bgGradient: 'from-blue-500/10 to-indigo-500/5',
    borderColor: 'border-blue-300',
    badgeBg: 'bg-blue-600',
    badgeText: 'text-white',
    description: 'Bắt đầu làm việc nhóm, viết email công việc cơ bản, báo cáo kết quả, bày tỏ cảm xúc và giải quyết mâu thuẫn.',
    keySkills: ['Gián tiếp câu 기로 하다, (으)ㄴ/는 것 같다', 'Cấu trúc nguyên nhân - kết quả (으)므로, 아/어서', 'Giao tiếp công sở & phỏng vấn', 'Kỹ năng thích nghi văn hóa']
  },
  {
    level: 4,
    name: 'Trung cấp 4 (Tin tức, Văn hóa & Thảo luận)',
    badge: 'TOPIK 4',
    levelKey: 'TOPIK 4',
    category: 'Trung cấp',
    targetScore: '150+ điểm TOPIK II',
    wordCountLabel: '140+ từ vựng tin tức',
    color: 'indigo',
    bgGradient: 'from-indigo-500/10 to-violet-500/5',
    borderColor: 'border-indigo-300',
    badgeBg: 'bg-indigo-600',
    badgeText: 'text-white',
    description: 'Đọc hiểu báo chí thường thức, phỏng vấn xin việc chuyên nghiệp, thảo luận các vấn đề xã hội & môi trường.',
    keySkills: ['Đọc hiểu văn bản tin tức, biểu đồ', 'Cấu trúc nhượng bộ (으)ㄹ지라도, -에도 불구하고', 'Phân tích nguyên nhân & giải pháp', 'Viết đoạn văn nghị luận 300 từ']
  },
  {
    level: 5,
    name: 'Cao cấp 5 (Kinh tế, Học thuật & Viết luận)',
    badge: 'TOPIK 5',
    levelKey: 'TOPIK 5',
    category: 'Cao cấp',
    targetScore: '190+ điểm TOPIK II',
    wordCountLabel: '120+ từ vựng học thuật',
    color: 'purple',
    bgGradient: 'from-purple-500/10 to-fuchsia-500/5',
    borderColor: 'border-purple-300',
    badgeBg: 'bg-purple-600',
    badgeText: 'text-white',
    description: 'Sử dụng tiếng Hàn trong nghiên cứu học thuật, viết luận chuyên sâu về kinh tế, chính sách và hiện tượng xã hội.',
    keySkills: ['Từ vựng âm Hán cao cấp (양극화, 지속가능성...)', 'Viết luận điểm câu 54 TOPIK 700 chữ', 'Ngôn luận học thuật khách quan', 'Tư duy phản biện bằng tiếng Hàn']
  },
  {
    level: 6,
    name: 'Cao cấp 6 (Học thuật đỉnh cao, Thành ngữ & Pháp lý)',
    badge: 'TOPIK 6',
    levelKey: 'TOPIK 6',
    category: 'Cao cấp',
    targetScore: '230+ điểm TOPIK II',
    wordCountLabel: '140+ thành ngữ & học thuật',
    color: 'amber',
    bgGradient: 'from-amber-500/10 to-orange-500/5',
    borderColor: 'border-amber-300',
    badgeBg: 'bg-amber-600',
    badgeText: 'text-white',
    description: 'Thành thạo như người bản xứ, tinh thông Tứ tự thành ngữ 사자성어, quán dụng ngữ, văn bản ngoại giao & triết học.',
    keySkills: ['Tứ tự thành ngữ (사자성어) chuẩn đề TOPIK', 'Quán dụng ngữ (관용구) bản xứ', 'Văn bản ngoại giao & pháp chế', 'Thấu triệt sắc thái ngôn ngữ tinh tế']
  }
];

export const INITIAL_VOCAB_LIST: VocabWord[] = ALL_VOCAB_WORDS;

export const VOCAB_TOPICS = [
  {
    id: 'all',
    name: 'Tất cả các từ',
    topicKey: 'all',
    icon: 'Layers',
    count: INITIAL_VOCAB_LIST.length,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Toàn bộ kho từ vựng tiếng Hàn phân cấp từ TOPIK 1 đến TOPIK 6',
  },
  {
    id: 'topik-1',
    name: 'TOPIK 1 (Sơ cấp 1)',
    topicKey: 'TOPIK 1',
    isTopikLevel: true,
    topikLevel: 1,
    icon: 'Award',
    count: INITIAL_VOCAB_LIST.filter(w => w.level === 'TOPIK 1' || w.topikLevel === 1).length,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Chào hỏi, số đếm, gia đình, ăn uống và sinh hoạt thường nhật',
  },
  {
    id: 'topik-2',
    name: 'TOPIK 2 (Sơ cấp 2)',
    topicKey: 'TOPIK 2',
    isTopikLevel: true,
    topikLevel: 2,
    icon: 'Award',
    count: INITIAL_VOCAB_LIST.filter(w => w.level === 'TOPIK 2' || w.topikLevel === 2).length,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Mua sắm, giao thông, nhà hàng, khách sạn và bệnh viện',
  },
  {
    id: 'topik-3',
    name: 'TOPIK 3 (Trung cấp 3)',
    topicKey: 'TOPIK 3',
    isTopikLevel: true,
    topikLevel: 3,
    icon: 'Award',
    count: INITIAL_VOCAB_LIST.filter(w => w.level === 'TOPIK 3' || w.topikLevel === 3).length,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Công sở cơ bản, kế hoạch, trải nghiệm và hòa nhập xã hội',
  },
  {
    id: 'topik-4',
    name: 'TOPIK 4 (Trung cấp 4)',
    topicKey: 'TOPIK 4',
    isTopikLevel: true,
    topikLevel: 4,
    icon: 'Award',
    count: INITIAL_VOCAB_LIST.filter(w => w.level === 'TOPIK 4' || w.topikLevel === 4).length,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Báo chí, môi trường, phỏng vấn xin việc và phân tích xã hội',
  },
  {
    id: 'topik-5',
    name: 'TOPIK 5 (Cao cấp 5)',
    topicKey: 'TOPIK 5',
    isTopikLevel: true,
    topikLevel: 5,
    icon: 'Award',
    count: INITIAL_VOCAB_LIST.filter(w => w.level === 'TOPIK 5' || w.topikLevel === 5).length,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Kinh tế, học thuật, viết luận câu 54 và thuật ngữ trừu tượng',
  },
  {
    id: 'topik-6',
    name: 'TOPIK 6 (Cao cấp 6)',
    topicKey: 'TOPIK 6',
    isTopikLevel: true,
    topikLevel: 6,
    icon: 'Award',
    count: INITIAL_VOCAB_LIST.filter(w => w.level === 'TOPIK 6' || w.topikLevel === 6).length,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Tứ tự thành ngữ 사자성어, quán dụng ngữ bản xứ và văn bản ngoại giao',
  },
  {
    id: 'daily',
    name: 'Giao tiếp hàng ngày',
    topicKey: 'Chào hỏi & Giao tiếp',
    icon: 'MessageCircle',
    count: INITIAL_VOCAB_LIST.filter(w => w.topic.includes('Chào hỏi') || w.topic.includes('Giao tiếp')).length,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Chào hỏi, xin lỗi, cảm ơn, hỏi tên, giới thiệu bản thân',
  },
  {
    id: 'office',
    name: 'Công sở & Nghề nghiệp',
    topicKey: 'Công sở & Nghề nghiệp',
    icon: 'Briefcase',
    count: INITIAL_VOCAB_LIST.filter(w => w.topic.includes('Công sở')).length,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Đi làm, tan sở, họp hành, đồng nghiệp, báo cáo công việc',
  },
  {
    id: 'travel',
    name: 'Du lịch & Phương tiện',
    topicKey: 'Du lịch & Phương tiện',
    icon: 'Plane',
    count: INITIAL_VOCAB_LIST.filter(w => w.topic.includes('Du lịch') || w.topic.includes('Phương tiện')).length,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Tàu điện ngầm, xe buýt, sân bay, vé máy bay và khách sạn',
  },
];
