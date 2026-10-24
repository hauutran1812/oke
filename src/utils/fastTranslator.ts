import { SentenceTranslationResult, SentenceVocabularyItem } from '../types';

// In-memory cache for ultra-fast translations
const translationCache = new Map<string, SentenceTranslationResult>();

// Clean text for fast lookup
export const normalizeText = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[?!.,~…^;:]/g, '')
    .replace(/\s+/g, ' ');
};

interface PhraseEntry {
  korean: string;
  vietnamese: string;
  pronunciation: string;
  politeness: string;
  vocab: SentenceVocabularyItem[];
  grammar: string[];
  alternatives?: string[];
  matchKeywordsKr: string[];
  matchKeywordsVi: string[];
}

const PHRASE_DATABASE: PhraseEntry[] = [
  {
    korean: '안녕하세요! 만나서 반갑습니다.',
    vietnamese: 'Xin chào! Rất vui được gặp bạn.',
    pronunciation: '[an-nyeong-ha-se-yo! man-na-seo ban-gap-sseum-ni-da]',
    politeness: 'Lịch sự trang trọng (하십시오체 & 해요체)',
    vocab: [
      { word: '안녕하세요', meaning: 'Xin chào', partOfSpeech: 'Thành ngữ' },
      { word: '만나다', meaning: 'Gặp gỡ', partOfSpeech: 'Động từ' },
      { word: '반갑다', meaning: 'Vui mừng, hân hạnh', partOfSpeech: 'Tính từ' }
    ],
    grammar: ['-아/어서: Cấu trúc chỉ nguyên nhân/trình tự (Gặp nên rất vui)', '-ㅂ/습니다: Đuôi kết thúc câu trang trọng'],
    alternatives: ['처음 뵙겠습니다 (Rất hân hạnh lần đầu gặp bạn)'],
    matchKeywordsKr: ['안녕하세요', '반갑습니다', '만나서 반갑습니다'],
    matchKeywordsVi: ['xin chào', 'rất vui được gặp', 'chào bạn']
  },
  {
    korean: '도와주셔서 정말 감사합니다.',
    vietnamese: 'Thật sự cảm ơn bạn đã giúp đỡ tôi.',
    pronunciation: '[do-wa-ju-syeo-seo jeong-mal gam-sa-ham-ni-da]',
    politeness: 'Lịch sự trang trọng (하십시오체)',
    vocab: [
      { word: '돕다', meaning: 'Giúp đỡ', partOfSpeech: 'Động từ' },
      { word: '정말', meaning: 'Thực sự, quả thật', partOfSpeech: 'Phó từ' },
      { word: '감사하다', meaning: 'Cảm ơn, cảm tạ', partOfSpeech: 'Động từ' }
    ],
    grammar: ['-아/어 주시다: Làm điều gì đó cho ai (giúp đỡ cho)', '-아서: Vì đã giúp đỡ nên cảm ơn'],
    alternatives: ['도와줘서 고마워요 (Cảm ơn bạn đã giúp - thân mật)', '진심으로 감사드립니다 (Chân thành cảm ơn quý vị)'],
    matchKeywordsKr: ['도와주셔서', '감사합니다', '정말 감사합니다', '고맙습니다'],
    matchKeywordsVi: ['cảm ơn', 'giúp đỡ', 'cảm ơn đã giúp', 'thật sự cảm ơn']
  },
  {
    korean: '약속 시간에 늦어서 죄송합니다.',
    vietnamese: 'Tôi xin lỗi vì đã đến muộn giờ hẹn.',
    pronunciation: '[yak-ssok si-ga-ne neu-jeo-seo joe-song-ham-ni-da]',
    politeness: 'Lịch sự trang trọng (하십시오체)',
    vocab: [
      { word: '약속', meaning: 'Cuộc hẹn, lời hứa', partOfSpeech: 'Danh từ' },
      { word: '시간', meaning: 'Thời gian, giờ', partOfSpeech: 'Danh từ' },
      { word: '늦다', meaning: 'Muộn, trễ', partOfSpeech: 'Tính từ' },
      { word: '죄송하다', meaning: 'Xin lỗi', partOfSpeech: 'Tính từ' }
    ],
    grammar: ['-에: Trợ từ chỉ thời điểm', '-어서: Cấu trúc giải thích lý do (vì trễ nên xin lỗi)'],
    alternatives: ['늦어서 미안해요 (Xin lỗi vì mình đến muộn nhé)'],
    matchKeywordsKr: ['죄송합니다', '늦어서', '약속 시간에 늦어서', '미안합니다'],
    matchKeywordsVi: ['xin lỗi', 'đến muộn', 'trễ hẹn', 'xin lỗi vì muộn']
  },
  {
    korean: '이것은 얼마예요?',
    vietnamese: 'Cái này giá bao nhiêu tiền vậy ạ?',
    pronunciation: '[i-geo-seun eol-ma-ye-yo]',
    politeness: 'Lịch sự thân mật (해요체)',
    vocab: [
      { word: '이것', meaning: 'Cái này, vật này', partOfSpeech: 'Đại từ' },
      { word: '얼마', meaning: 'Bao nhiêu (tiền)', partOfSpeech: 'Đại từ' },
      { word: '이에요/예요', meaning: 'Là', partOfSpeech: 'Trợ từ kết thúc' }
    ],
    grammar: ['-은/는: Trợ từ chủ đề', '얼마예요?: Mẫu câu hỏi giá tiền phổ biến nhất'],
    alternatives: ['얼마인가요? (Giá bao nhiêu vậy?)', '이거 얼마예요? (Nói nhanh giao tiếp)'],
    matchKeywordsKr: ['얼마예요', '이것은 얼마예요', '얼마인가요', '이거 얼마예요'],
    matchKeywordsVi: ['bao nhiêu tiền', 'cái này bao nhiêu', 'giá bao nhiêu']
  },
  {
    korean: '화장실이 어디에 있어요?',
    vietnamese: 'Nhà vệ sinh ở đâu vậy ạ?',
    pronunciation: '[hwa-jang-si-ri eo-di-e it-sseo-yo]',
    politeness: 'Lịch sự thân mật (해요체)',
    vocab: [
      { word: '화장실', meaning: 'Nhà vệ sinh', partOfSpeech: 'Danh từ' },
      { word: '어디', meaning: 'Ở đâu, đâu', partOfSpeech: 'Đại từ nghi vấn' },
      { word: '있다', meaning: 'Có, ở', partOfSpeech: 'Tính từ/Động từ' }
    ],
    grammar: ['-이/가: Trợ từ tiểu từ chủ ngữ', '-에 있다: Có mặt tại vị trí nào đó'],
    alternatives: ['화장실 어디인가요? (Nhà vệ sinh ở đâu ạ?)'],
    matchKeywordsKr: ['화장실', '어디에 있어요', '화장실이 어디예요'],
    matchKeywordsVi: ['nhà vệ sinh ở đâu', 'toilet ở đâu', 'cho hỏi nhà vệ sinh']
  },
  {
    korean: '저는 베트남 사람이고 학생입니다.',
    vietnamese: 'Tôi là người Việt Nam và là học sinh.',
    pronunciation: '[jeo-neun be-teu-nam sa-ra-mi-go hak-saeng-im-ni-da]',
    politeness: 'Lịch sự trang trọng (하십시오체)',
    vocab: [
      { word: '저', meaning: 'Tôi (khiêm tốn)', partOfSpeech: 'Đại từ' },
      { word: '베트남', meaning: 'Việt Nam', partOfSpeech: 'Danh từ riêng' },
      { word: '사람', meaning: 'Người', partOfSpeech: 'Danh từ' },
      { word: '학생', meaning: 'Học sinh/sinh viên', partOfSpeech: 'Danh từ' }
    ],
    grammar: ['-이고: Cấu trúc liên kết "và là..."', '-입니다: Là (đuôi trang trọng)'],
    alternatives: ['저는 베트남에서 온 학생이에요 (Tôi là học sinh đến từ Việt Nam)'],
    matchKeywordsKr: ['베트남 사람', '학생입니다', '저는 베트남'],
    matchKeywordsVi: ['tôi là người việt nam', 'người việt nam', 'tôi là học sinh việt nam']
  },
  {
    korean: '한국어를 열심히 공부하고 있어요.',
    vietnamese: 'Tôi đang chăm chỉ học tiếng Hàn.',
    pronunciation: '[han-gu-geo-reul yeol-sim-hi gong-bu-ha-go it-sseo-yo]',
    politeness: 'Lịch sự thân mật (해요체)',
    vocab: [
      { word: '한국어', meaning: 'Tiếng Hàn', partOfSpeech: 'Danh từ' },
      { word: '열심히', meaning: 'Chăm chỉ, hết mình', partOfSpeech: 'Phó từ' },
      { word: '공부하다', meaning: 'Học tập', partOfSpeech: 'Động từ' }
    ],
    grammar: ['-을/를: Trợ từ tân ngữ', '-고 있다: Cấu trúc diễn tả hành động đang tiếp diễn'],
    alternatives: ['한국어 공부 중이에요 (Tôi đang trong quá trình học tiếng Hàn)'],
    matchKeywordsKr: ['한국어를', '공부하고 있어요', '열심히 공부'],
    matchKeywordsVi: ['tôi đang học tiếng hàn', 'chăm chỉ học tiếng hàn', 'học tiếng hàn']
  },
  {
    korean: '오늘 날씨가 정말 좋네요.',
    vietnamese: 'Hôm nay thời tiết thật là đẹp.',
    pronunciation: '[o-neul nal-ssi-ga jeong-mal jon-ne-yo]',
    politeness: 'Lịch sự cảm thán (해요체 -네)',
    vocab: [
      { word: '오늘', meaning: 'Hôm nay', partOfSpeech: 'Danh từ' },
      { word: '날씨', meaning: 'Thời tiết', partOfSpeech: 'Danh từ' },
      { word: '좋다', meaning: 'Tốt, đẹp', partOfSpeech: 'Tính từ' }
    ],
    grammar: ['-네요: Đuôi câu cảm thán khi vừa nhận ra điều gì thú vị/tươi đẹp'],
    alternatives: ['오늘 날씨가 참 맑아요 (Hôm nay trời rất trong xanh)'],
    matchKeywordsKr: ['오늘 날씨', '날씨가 정말 좋네요', '날씨가 좋아요'],
    matchKeywordsVi: ['thời tiết hôm nay', 'thời tiết thật là đẹp', 'hôm nay thời tiết đẹp']
  },
  {
    korean: '여기서 카드로 계산할 수 있나요?',
    vietnamese: 'Ở đây có thể thanh toán bằng thẻ được không ạ?',
    pronunciation: '[yeo-gi-seo ka-deu-ro gye-san-hal su in-na-yo]',
    politeness: 'Lịch sự hỏi (해요체)',
    vocab: [
      { word: '여기서', meaning: 'Ở đây', partOfSpeech: 'Phó từ' },
      { word: '카드', meaning: 'Thẻ thanh toán', partOfSpeech: 'Danh từ' },
      { word: '계산하다', meaning: 'Thanh toán, tính tiền', partOfSpeech: 'Động từ' }
    ],
    grammar: ['-(으)로: Phương tiện/cách thức (bằng thẻ)', '-(으)ㄹ 수 있다: Có khả năng/có thể làm gì'],
    alternatives: ['카드 결제 되나요? (Có quẹt thẻ được không?)'],
    matchKeywordsKr: ['카드로 계산', '계산할 수 있나요', '카드 결제'],
    matchKeywordsVi: ['thanh toán bằng thẻ', 'quẹt thẻ được không', 'trả bằng thẻ']
  },
  {
    korean: '주말에 무엇을 할 거예요?',
    vietnamese: 'Cuối tuần này bạn dự định sẽ làm gì?',
    pronunciation: '[ju-ma-re mu-eo-seul hal geo-ye-yo]',
    politeness: 'Lịch sự hỏi (해요체)',
    vocab: [
      { word: '주말', meaning: 'Cuối tuần', partOfSpeech: 'Danh từ' },
      { word: '무엇', meaning: 'Cái gì', partOfSpeech: 'Đại từ' },
      { word: '하다', meaning: 'Làm', partOfSpeech: 'Động từ' }
    ],
    grammar: ['-(으)ㄹ 거예요: Cấu trúc hỏi/nói về kế hoạch trong tương lai'],
    alternatives: ['주말에 뭐 해요? (Cuối tuần làm gì?)'],
    matchKeywordsKr: ['주말에 무엇을', '할 거예요', '주말에 뭐'],
    matchKeywordsVi: ['cuối tuần làm gì', 'cuối tuần bạn làm gì', 'kế hoạch cuối tuần']
  },
  {
    korean: '지하철역이 어디인지 알려주시겠어요?',
    vietnamese: 'Bạn có thể chỉ giúp tôi ga tàu điện ngầm ở đâu được không?',
    pronunciation: '[ji-ha-cheol-yeo-gi eo-di-in-ji al-lyeo-ju-si-get-sseo-yo]',
    politeness: 'Lịch sự trang trọng kính ngữ',
    vocab: [
      { word: '지하철역', meaning: 'Ga tàu điện ngầm', partOfSpeech: 'Danh từ' },
      { word: '알리다', meaning: 'Cho biết, thông báo', partOfSpeech: 'Động từ' },
      { word: '주시다', meaning: 'Làm giúp cho', partOfSpeech: 'Động từ kính ngữ' }
    ],
    grammar: ['-(으)시겠어요?: Mẫu câu nhờ vả vô cùng lịch sự và tôn kính', '-인지: Đuôi liên từ gián tiếp (ở đâu)'],
    alternatives: ['지하철역 어디에 있어요? (Ga tàu điện ở đâu thế ạ?)'],
    matchKeywordsKr: ['지하철역', '알려주시겠어요', '지하철 어디'],
    matchKeywordsVi: ['ga tàu điện ở đâu', 'chỉ đường ra ga tàu', 'ga tàu điện ngầm']
  },
  {
    korean: '다시 한번 천천히 말씀해 주세요.',
    vietnamese: 'Làm ơn nói lại một lần nữa thật chậm rãi giúp tôi với ạ.',
    pronunciation: '[da-si han-beon cheon-cheon-hi mal-ssum-hae ju-se-yo]',
    politeness: 'Lịch sự đề nghị (해요체 -주세요)',
    vocab: [
      { word: '다시', meaning: 'Lại, lần nữa', partOfSpeech: 'Phó từ' },
      { word: '한번', meaning: 'Một lần', partOfSpeech: 'Danh từ' },
      { word: '천천히', meaning: 'Chậm rãi, từ từ', partOfSpeech: 'Phó từ' },
      { word: '말씀하다', meaning: 'Nói (kính ngữ)', partOfSpeech: 'Động từ' }
    ],
    grammar: ['-아/어 주세요: Cấu trúc yêu cầu/nhờ vả lịch sự', 'Kính ngữ 말씀하다 thay cho 말하다'],
    alternatives: ['조금만 천천히 말해 주세요 (Nói chậm lại một chút giúp tôi nhé)'],
    matchKeywordsKr: ['다시 한번', '천천히 말씀해', '천천히 말해 주세요'],
    matchKeywordsVi: ['nói lại', 'nói chậm lại', 'làm ơn nói chậm lại', 'nói lại lần nữa']
  }
];

// Check instant translation
export const getFastTranslation = (text: string): SentenceTranslationResult | null => {
  if (!text || !text.trim()) return null;

  const raw = text.trim();
  const normalized = normalizeText(raw);

  // 1. Direct cache check
  if (translationCache.has(normalized)) {
    return translationCache.get(normalized)!;
  }

  const isKorean = /[\uac00-\ud7af\u1100-\u11ff]/.test(raw);

  // 2. Exact match in phrase database
  for (const entry of PHRASE_DATABASE) {
    if (isKorean) {
      if (normalizeText(entry.korean) === normalized || entry.matchKeywordsKr.some(k => normalized.includes(normalizeText(k)))) {
        const res: SentenceTranslationResult = {
          sourceText: raw,
          translatedText: entry.vietnamese,
          sourceLanguage: 'ko',
          targetLanguage: 'vi',
          pronunciation: entry.pronunciation,
          politeness: entry.politeness,
          vocabularyBreakdown: entry.vocab,
          grammarStructures: entry.grammar,
          alternativeTranslations: entry.alternatives,
        };
        translationCache.set(normalized, res);
        return res;
      }
    } else {
      if (normalizeText(entry.vietnamese) === normalized || entry.matchKeywordsVi.some(k => normalized.includes(normalizeText(k)))) {
        const res: SentenceTranslationResult = {
          sourceText: raw,
          translatedText: entry.korean,
          sourceLanguage: 'vi',
          targetLanguage: 'ko',
          pronunciation: entry.pronunciation,
          politeness: entry.politeness,
          vocabularyBreakdown: entry.vocab,
          grammarStructures: entry.grammar,
          alternativeTranslations: entry.alternatives,
        };
        translationCache.set(normalized, res);
        return res;
      }
    }
  }

  return null;
};

// Store translated result into fast cache
export const cacheTranslation = (sourceText: string, result: SentenceTranslationResult) => {
  const norm = normalizeText(sourceText);
  translationCache.set(norm, result);
};
