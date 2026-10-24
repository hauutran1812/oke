import { QuizTest } from '../types';

export const MOCK_EXAMS: QuizTest[] = [
  {
    "id": "topik-1-exam-1",
    "title": "Đề Thi Thử TOPIK 1 - Đề 01: Nhập Môn & Chào Hỏi Hàng Ngày",
    "level": "TOPIK 1",
    "topikLevel": 1,
    "description": "Kiểm tra phản xạ các câu chào hỏi căn bản, đại từ nhân xưng, đồ vật phòng học và giới thiệu bản thân.",
    "durationMinutes": 10,
    "questions": [
      {
        "id": "q1-1-1",
        "type": "kr_to_vn",
        "prompt": "Từ \"학교\" trong tiếng Việt có nghĩa là gì?",
        "options": [
          "Trường học",
          "Thư viện",
          "Bệnh viện",
          "Công ty"
        ],
        "correctAnswer": "Trường học",
        "explanation": "\"학교\" [hak-kyo] có gốc Hán là 學校 (học hiệu), nghĩa là Trường học."
      },
      {
        "id": "q1-1-2",
        "type": "vn_to_kr",
        "prompt": "Từ tiếng Hàn nào mang nghĩa là \"Xin chào (lịch sự)\"?",
        "options": [
          "안녕하세요",
          "감사합니다",
          "죄송합니다",
          "안녕히 가세요"
        ],
        "correctAnswer": "안녕하세요",
        "explanation": "\"안녕하세요\" [an-nyeong-ha-se-yo] là lời chào hỏi lịch sự thông dụng nhất."
      },
      {
        "id": "q1-1-3",
        "type": "fill_blank",
        "prompt": "Điền từ vào chỗ trống: \"저는 베트남 사람_____. 반갑습니다.\"",
        "options": [
          "이에요",
          "예요",
          "있어요",
          "없어요"
        ],
        "correctAnswer": "이에요",
        "explanation": "\"사람\" có patchim (phụ âm dưới) nên đi với đuôi câu kính ngữ \"이에요\"."
      },
      {
        "id": "q1-1-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm mẫu và chọn từ vựng tương ứng:",
        "audioText": "선생님",
        "options": [
          "선생님",
          "학생",
          "의사",
          "경찰"
        ],
        "correctAnswer": "선생님",
        "explanation": "Phát âm chuẩn là [seon-saeng-nim], nghĩa là Thầy/Cô giáo."
      },
      {
        "id": "q1-1-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"물\" có nghĩa là gì?",
        "options": [
          "Nước uống",
          "Cơm",
          "Bánh mì",
          "Sữa tươi"
        ],
        "correctAnswer": "Nước uống",
        "explanation": "\"물\" [mul] nghĩa là Nước."
      },
      {
        "id": "q1-1-6",
        "type": "fill_blank",
        "prompt": "Điền trợ từ thích hợp: \"사과_____ 맛있어요.\" (Quả táo ngon)",
        "options": [
          "가",
          "이",
          "을",
          "를"
        ],
        "correctAnswer": "가",
        "explanation": "\"사과\" kết thúc bằng nguyên âm (không patchim) nên đi với trợ từ chủ ngữ \"가\"."
      },
      {
        "id": "q1-1-7",
        "type": "vn_to_kr",
        "prompt": "Từ nào chỉ \"Hôm nay\" trong tiếng Hàn?",
        "options": [
          "오늘",
          "내일",
          "어제",
          "모레"
        ],
        "correctAnswer": "오늘",
        "explanation": "\"오늘\" [o-neul] là Hôm nay (내일: ngày mai, 어제: hôm qua)."
      },
      {
        "id": "q1-1-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn nghĩa tiếng Việt của từ:",
        "audioText": "감사합니다",
        "options": [
          "Cảm ơn",
          "Xin lỗi",
          "Tạm biệt",
          "Chúc ngủ ngon"
        ],
        "correctAnswer": "Cảm ơn",
        "explanation": "\"감사합니다\" [gam-sa-ham-ni-da] nghĩa là Cảm ơn trân trọng."
      }
    ]
  },
  {
    "id": "topik-1-exam-2",
    "title": "Đề Thi Thử TOPIK 1 - Đề 02: Gia Đình, Đồ Vật & Số Đếm",
    "level": "TOPIK 1",
    "topikLevel": 1,
    "description": "Ôn luyện từ vựng thành viên gia đình, số đếm thuần Hàn/Hán Hàn, thời gian và địa điểm quen thuộc.",
    "durationMinutes": 10,
    "questions": [
      {
        "id": "q1-2-1",
        "type": "kr_to_vn",
        "prompt": "Từ \"부모님\" mang ý nghĩa gì?",
        "options": [
          "Cha mẹ, phụ huynh",
          "Ông bà",
          "Anh chị em",
          "Bạn bè"
        ],
        "correctAnswer": "Cha mẹ, phụ huynh",
        "explanation": "\"부모님\" (父母님 - phụ mẫu) là Cha mẹ kính cẩn."
      },
      {
        "id": "q1-2-2",
        "type": "fill_blank",
        "prompt": "Chọn số từ thuần Hàn chỉ \"3 giờ\": \"지금은 _____ 시입니다.\"",
        "options": [
          "세",
          "삼",
          "셋",
          "넷"
        ],
        "correctAnswer": "세",
        "explanation": "Khi đếm giờ dùng số thuần Hàn kết hợp danh từ đơn vị: \"세 시\" (3 giờ)."
      },
      {
        "id": "q1-2-3",
        "type": "vn_to_kr",
        "prompt": "Từ nào chỉ \"Bàn học\" trong tiếng Hàn?",
        "options": [
          "책상",
          "의자",
          "침대",
          "창문"
        ],
        "correctAnswer": "책상",
        "explanation": "\"책상\" (冊床 - sách sàng) là Bàn học, bàn làm việc."
      },
      {
        "id": "q1-2-4",
        "type": "audio_choice",
        "prompt": "Nghe và chọn từ phát âm đúng:",
        "audioText": "가족",
        "options": [
          "가족",
          "친구",
          "이웃",
          "동생"
        ],
        "correctAnswer": "가족",
        "explanation": "\"가족\" [ga-jok] (家族 - gia tộc) nghĩa là Gia đình."
      },
      {
        "id": "q1-2-5",
        "type": "kr_to_vn",
        "prompt": "Nghĩa của câu \"도서관에서 책을 읽어요\" là:",
        "options": [
          "Đọc sách ở thư viện",
          "Mua sách ở hiệu sách",
          "Mượn sách ở trường",
          "Học bài tại nhà"
        ],
        "correctAnswer": "Đọc sách ở thư viện",
        "explanation": "\"도서관\" là thư viện, \"책을 읽다\" là đọc sách."
      },
      {
        "id": "q1-2-6",
        "type": "fill_blank",
        "prompt": "Điền từ thích hợp: \"교실에 컴퓨터가 _____.\" (Trong lớp không có máy tính)",
        "options": [
          "없어요",
          "있어요",
          "가요",
          "봐요"
        ],
        "correctAnswer": "없어요",
        "explanation": "\"없어요\" nghĩa là không có."
      },
      {
        "id": "q1-2-7",
        "type": "vn_to_kr",
        "prompt": "Chọn từ tiếng Hàn mang nghĩa \"Điện thoại di động\":",
        "options": [
          "휴대폰",
          "시계",
          "지갑",
          "안경"
        ],
        "correctAnswer": "휴대폰",
        "explanation": "\"휴대폰\" (휴대전화) là Điện thoại di động."
      },
      {
        "id": "q1-2-8",
        "type": "audio_choice",
        "prompt": "Nghe âm thanh và chọn số lượng tương ứng:",
        "audioText": "다섯",
        "options": [
          "5",
          "3",
          "4",
          "6"
        ],
        "correctAnswer": "5",
        "explanation": "\"다섯\" [da-seot] là số 5 thuần Hàn."
      }
    ]
  },
  {
    "id": "topik-2-exam-1",
    "title": "Đề Thi Thử TOPIK 2 - Đề 01: Giao Thông, Đi Lại & Mua Sắm",
    "level": "TOPIK 2",
    "topikLevel": 2,
    "description": "Thực hành các mẫu câu hỏi đường, đổi tuyến tàu điện ngầm, mua sắm đồ đạc và hỏi giá tiền tại Seoul.",
    "durationMinutes": 12,
    "questions": [
      {
        "id": "q2-1-1",
        "type": "kr_to_vn",
        "prompt": "Từ \"지하철역\" có nghĩa là gì?",
        "options": [
          "Ga tàu điện ngầm",
          "Bến xe buýt",
          "Sân bay quốc tế",
          "Bến xe lửa"
        ],
        "correctAnswer": "Ga tàu điện ngầm",
        "explanation": "\"지하철역\" (地下鐵驛 - địa hạ thiết dịch) là Ga tàu điện ngầm."
      },
      {
        "id": "q2-1-2",
        "type": "fill_blank",
        "prompt": "Điền từ đi phương tiện: \"시청역에서 2호선으로 _____.\" (Chuyển sang tuyến số 2)",
        "options": [
          "갈아타요",
          "출근해요",
          "예약해요",
          "주문해요"
        ],
        "correctAnswer": "갈아타요",
        "explanation": "\"갈아타다\" nghĩa là chuyển tuyến, đổi xe/tàu."
      },
      {
        "id": "q2-1-3",
        "type": "vn_to_kr",
        "prompt": "\"Cái áo này giá bao nhiêu tiền?\" dịch sang tiếng Hàn là:",
        "options": [
          "이 옷은 얼마예요?",
          "이 옷은 어디에 있어요?",
          "이 옷은 어때요?",
          "이 옷을 입어 보세요."
        ],
        "correctAnswer": "이 옷은 얼마예요?",
        "explanation": "\"얼마예요?\" là mẫu câu hỏi giá tiền phổ biến nhất."
      },
      {
        "id": "q2-1-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn phương tiện giao thông:",
        "audioText": "비행기",
        "options": [
          "비행기",
          "기차",
          "자전거",
          "택시"
        ],
        "correctAnswer": "비행기",
        "explanation": "\"비행기\" [bi-haeng-gi] (飛行機 - phi hành cơ) là Máy bay."
      },
      {
        "id": "q2-1-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"환불하다\" mang nghĩa là gì khi mua sắm?",
        "options": [
          "Hoàn tiền, trả lại hàng lấy lại tiền",
          "Đổi sang món khác",
          "Giảm giá sản phẩm",
          "Thanh toán bằng thẻ"
        ],
        "correctAnswer": "Hoàn tiền, trả lại hàng lấy lại tiền",
        "explanation": "\"환불하다\" (還拂) là Trả lại tiền / hoàn tiền."
      },
      {
        "id": "q2-1-6",
        "type": "fill_blank",
        "prompt": "Điền từ: \"동대문시장에서 옷을 싸게 _____.\"",
        "options": [
          "샀어요",
          "봤어요",
          "잤어요",
          "왔어요"
        ],
        "correctAnswer": "샀어요",
        "explanation": "Tại chợ thì hành động mua quần áo giá rẻ là \"샀어요\" (quá khứ của 사다 - mua)."
      },
      {
        "id": "q2-1-7",
        "type": "vn_to_kr",
        "prompt": "Từ nào mang nghĩa là \"Thẻ giao thông T-Money\"?",
        "options": [
          "교통카드",
          "신용카드",
          "외국인등록증",
          "학생증"
        ],
        "correctAnswer": "교통카드",
        "explanation": "\"교통카드\" là thẻ giao thông dùng quẹt tàu điện & xe buýt."
      },
      {
        "id": "q2-1-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn ý nghĩa:",
        "audioText": "편리하다",
        "options": [
          "Tiện lợi, thuận tiện",
          "Khó khăn, phức tạp",
          "Nhanh chóng",
          "Chậm chạp"
        ],
        "correctAnswer": "Tiện lợi, thuận tiện",
        "explanation": "\"편리하다\" [pyeon-ri-ha-da] (便利) là tiện lợi."
      }
    ]
  },
  {
    "id": "topik-2-exam-2",
    "title": "Đề Thi Thử TOPIK 2 - Đề 02: Ẩm Thực, Nhà Hàng & Bệnh Viện",
    "level": "TOPIK 2",
    "topikLevel": 2,
    "description": "Từ vựng các món ăn truyền thống, triệu chứng ốm sốt, mua thuốc và đặt hẹn khám bệnh.",
    "durationMinutes": 12,
    "questions": [
      {
        "id": "q2-2-1",
        "type": "kr_to_vn",
        "prompt": "Khi ở quán ăn, câu \"주문하시겠어요?\" nghĩa là gì?",
        "options": [
          "Quý khách muốn gọi món gì ạ?",
          "Quý khách thanh toán tiền mặt hay thẻ?",
          "Quán ăn đã đóng cửa rồi ạ.",
          "Món ăn đã chuẩn bị xong rồi ạ."
        ],
        "correctAnswer": "Quý khách muốn gọi món gì ạ?",
        "explanation": "\"주문하시겠어요?\" là lời mời gọi món lịch sự của nhân viên phục vụ."
      },
      {
        "id": "q2-2-2",
        "type": "fill_blank",
        "prompt": "Điền từ mô tả triệu chứng: \"머리가 너무 아프고 열이 _____.\"",
        "options": [
          "나요",
          "먹어요",
          "가요",
          "봐요"
        ],
        "correctAnswer": "나요",
        "explanation": "Cụm từ \"열이 나다\" nghĩa là bị sốt, phát sốt."
      },
      {
        "id": "q2-2-3",
        "type": "vn_to_kr",
        "prompt": "Làm thế nào để nói \"Xin đừng làm cay quá ạ\"?",
        "options": [
          "너무 맵지 않게 해 주세요.",
          "더 맵게 해 주세요.",
          "물 좀 주세요.",
          "메뉴판을 보여 주세요."
        ],
        "correctAnswer": "너무 맵지 않게 해 주세요.",
        "explanation": "\"너무 맵지 않게 해 주세요\" là câu nhờ đầu bếp không nấu quá cay."
      },
      {
        "id": "q2-2-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn từ chỉ địa điểm:",
        "audioText": "약국",
        "options": [
          "약국",
          "병원",
          "식당",
          "은행"
        ],
        "correctAnswer": "약국",
        "explanation": "\"약국\" [yak-guk] (藥局 - dược cục) là Hiệu thuốc."
      },
      {
        "id": "q2-2-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"소화제\" là loại thuốc gì?",
        "options": [
          "Thuốc tiêu hóa",
          "Thuốc cảm sốt",
          "Thuốc đau đầu",
          "Thuốc nhỏ mắt"
        ],
        "correctAnswer": "Thuốc tiêu hóa",
        "explanation": "\"소화제\" (消化劑 - tiêu hóa tế) là thuốc hỗ trợ tiêu hóa."
      },
      {
        "id": "q2-2-6",
        "type": "fill_blank",
        "prompt": "Điền từ: \"밥을 먹은 후에 이 약을 하루에 세 번 _____.\"",
        "options": [
          "드세요",
          "가세요",
          "오세요",
          "주세요"
        ],
        "correctAnswer": "드세요",
        "explanation": "Kính ngữ khuyên uống thuốc sau bữa ăn dùng \"드세요\" (hoặc 복용하세요)."
      },
      {
        "id": "q2-2-7",
        "type": "vn_to_kr",
        "prompt": "Từ nào chỉ vị \"Ngọt ngào\" trong tiếng Hàn?",
        "options": [
          "달다",
          "짜다",
          "쓰다",
          "시다"
        ],
        "correctAnswer": "달다",
        "explanation": "\"달다\" là ngọt (짜다: mặn, 쓰다: đắng, 시다: chua)."
      },
      {
        "id": "q2-2-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn nghĩa tương ứng:",
        "audioText": "맛있다",
        "options": [
          "Ngon miệng",
          "Dở tệ",
          "Nóng hổi",
          "Mát lạnh"
        ],
        "correctAnswer": "Ngon miệng",
        "explanation": "\"맛있다\" [ma-sit-da] nghĩa là Ngon miệng."
      }
    ]
  },
  {
    "id": "topik-3-exam-1",
    "title": "Đề Thi Thử TOPIK 3 - Đề 01: Công Sở, Email & Phỏng Vấn",
    "level": "TOPIK 3",
    "topikLevel": 3,
    "description": "Từ vựng môi trường doanh nghiệp Hàn Quốc, họp giao ban, viết báo cáo và phỏng vấn tuyển dụng.",
    "durationMinutes": 12,
    "questions": [
      {
        "id": "q3-1-1",
        "type": "kr_to_vn",
        "prompt": "Từ \"보고서\" trong môi trường làm việc có nghĩa là:",
        "options": [
          "Bản báo cáo công việc",
          "Bản hợp đồng lao động",
          "Hóa đơn tài chính",
          "Giấy phép kinh doanh"
        ],
        "correctAnswer": "Bản báo cáo công việc",
        "explanation": "\"보고서\" (報告書) là Bản báo cáo."
      },
      {
        "id": "q3-1-2",
        "type": "fill_blank",
        "prompt": "Điền từ: \"내일 오전 10시에 신제품 관련 회의를 _____.\"",
        "options": [
          "진행할 예정입니다",
          "퇴근할 예정입니다",
          "주문할 예정입니다",
          "포기할 예정입니다"
        ],
        "correctAnswer": "진행할 예정입니다",
        "explanation": "Tiến hành cuộc họp dùng cụm \"회의를 진행하다\"."
      },
      {
        "id": "q3-1-3",
        "type": "vn_to_kr",
        "prompt": "Từ nào mang nghĩa là \"Đồng nghiệp trong công ty\"?",
        "options": [
          "직장 동료",
          "선생님",
          "동창",
          "친척"
        ],
        "correctAnswer": "직장 동료",
        "explanation": "\"직장 동료\" (職場 同僚) là bạn đồng nghiệp nơi công sở."
      },
      {
        "id": "q3-1-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn từ vựng đúng:",
        "audioText": "경험",
        "options": [
          "경험",
          "경제",
          "경영",
          "경쟁"
        ],
        "correctAnswer": "경험",
        "explanation": "\"경험\" [gyeong-heom] (經驗) nghĩa là Kinh nghiệm, trải nghiệm."
      },
      {
        "id": "q3-1-5",
        "type": "kr_to_vn",
        "prompt": "Nghĩa của từ \"야근하다\" là gì?",
        "options": [
          "Làm việc thêm giờ ban đêm (tăng ca)",
          "Nghỉ phép năm",
          "Đi công tác xa",
          "Đi làm đúng giờ"
        ],
        "correctAnswer": "Làm việc thêm giờ ban đêm (tăng ca)",
        "explanation": "\"야근하다\" (夜勤) là làm đêm, tăng ca ban đêm."
      },
      {
        "id": "q3-1-6",
        "type": "fill_blank",
        "prompt": "Điền từ: \"면접관의 질문에 차분하고 자신 있게 _____.\"",
        "options": [
          "답변했습니다",
          "출근했습니다",
          "예약했습니다",
          "취소했습니다"
        ],
        "correctAnswer": "답변했습니다",
        "explanation": "Trả lời câu hỏi của người phỏng vấn dùng \"답변하다\" (đáp biện)."
      },
      {
        "id": "q3-1-7",
        "type": "vn_to_kr",
        "prompt": "Từ nào đồng nghĩa với \"Giải quyết vấn đề\"?",
        "options": [
          "문제 해결",
          "문제 발생",
          "문제 포기",
          "문제 연기"
        ],
        "correctAnswer": "문제 해결",
        "explanation": "\"해결\" (解決) là giải quyết."
      },
      {
        "id": "q3-1-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn nghĩa:",
        "audioText": "계획",
        "options": [
          "Kế hoạch",
          "Kết quả",
          "Nguyên nhân",
          "Phương pháp"
        ],
        "correctAnswer": "Kế hoạch",
        "explanation": "\"계획\" [gye-hoek] (計劃) là Kế hoạch."
      }
    ]
  },
  {
    "id": "topik-3-exam-2",
    "title": "Đề Thi Thử TOPIK 3 - Đề 02: Đời Sống Xã Hội & Cảm Xúc",
    "level": "TOPIK 3",
    "topikLevel": 3,
    "description": "Từ vựng diễn tả trạng thái tâm lý, vượt qua stress, kết bạn mới và hòa nhập cuộc sống du học sinh.",
    "durationMinutes": 12,
    "questions": [
      {
        "id": "q3-2-1",
        "type": "kr_to_vn",
        "prompt": "Từ \"적응하다\" có nghĩa là gì?",
        "options": [
          "Thích nghi, thích ứng với hoàn cảnh mới",
          "Từ bỏ mục tiêu",
          "Tranh cãi bất đồng",
          "Cạnh tranh gay gắt"
        ],
        "correctAnswer": "Thích nghi, thích ứng với hoàn cảnh mới",
        "explanation": "\"적응하다\" (適應) là thích nghi."
      },
      {
        "id": "q3-2-2",
        "type": "fill_blank",
        "prompt": "Điền từ giải tỏa căng thẳng: \"주말마다 운동을 하면서 스트레스를 _____.\"",
        "options": [
          "풀어요",
          "쌓아요",
          "만들어요",
          "받아요"
        ],
        "correctAnswer": "풀어요",
        "explanation": "Cụm \"스트레스를 풀다\" nghĩa là giải tỏa áp lực/căng thẳng."
      },
      {
        "id": "q3-2-3",
        "type": "vn_to_kr",
        "prompt": "Từ nào mang nghĩa \"Hối tiếc, ân hận\"?",
        "options": [
          "후회하다",
          "만족하다",
          "기대하다",
          "자랑하다"
        ],
        "correctAnswer": "후회하다",
        "explanation": "\"후회하다\" (後悔) là hối hận."
      },
      {
        "id": "q3-2-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn tâm trạng tương ứng:",
        "audioText": "외롭다",
        "options": [
          "Cô đơn, quạnh quẽ",
          "Vui vẻ, hân hoan",
          "Tức giận, bực bội",
          "Sợ hãi, hoang mang"
        ],
        "correctAnswer": "Cô đơn, quạnh quẽ",
        "explanation": "\"외롭다\" [oe-rop-da] là Cô đơn."
      },
      {
        "id": "q3-2-5",
        "type": "kr_to_vn",
        "prompt": "Nghĩa của câu \"그의 따뜻한 위로에 큰 감동을 받았습니다\" là:",
        "options": [
          "Tôi đã vô cùng xúc động trước lời an ủi ấm áp của anh ấy.",
          "Tôi cảm thấy thất vọng vì không nhận được lời an ủi.",
          "Anh ấy đã xin lỗi tôi một cách chân thành.",
          "Chúng tôi đã có một buổi trò chuyện rất vui vẻ."
        ],
        "correctAnswer": "Tôi đã vô cùng xúc động trước lời an ủi ấm áp của anh ấy.",
        "explanation": "\"위로\" là lời an ủi, \"감동을 받다\" là nhận được sự cảm động/xúc động."
      },
      {
        "id": "q3-2-6",
        "type": "fill_blank",
        "prompt": "Điền từ: \"시험 결과에 대해 매우 _____ 하고 있습니다.\" (Rất hài lòng)",
        "options": [
          "만족",
          "실망",
          "불만",
          "포기"
        ],
        "correctAnswer": "만족",
        "explanation": "\"만족하다\" (滿足) nghĩa là Hài lòng, thỏa mãn."
      },
      {
        "id": "q3-2-7",
        "type": "vn_to_kr",
        "prompt": "Từ trái nghĩa với \"낙관적이다\" (Lạc quan) là:",
        "options": [
          "비관적이다",
          "적극적이다",
          "긍정적이다",
          "활동적이다"
        ],
        "correctAnswer": "비관적이다",
        "explanation": "\"비관적이다\" (悲觀的) là Bi quan."
      },
      {
        "id": "q3-2-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn nghĩa đúng:",
        "audioText": "노력",
        "options": [
          "Sự nỗ lực, cố gắng",
          "Sự thông minh",
          "Sự may mắn",
          "Sự chuẩn bị"
        ],
        "correctAnswer": "Sự nỗ lực, cố gắng",
        "explanation": "\"노력\" [no-ryeok] (努力) là Nỗ lực."
      }
    ]
  },
  {
    "id": "topik-4-exam-1",
    "title": "Đề Thi Thử TOPIK 4 - Đề 01: Thời Sự, Báo Chí & Đọc Biểu Đồ",
    "level": "TOPIK 4",
    "topikLevel": 4,
    "description": "Rèn luyện khả năng đọc hiểu từ vựng biểu đồ, thống kê xu hướng gia tăng/giảm sút và tiêu đề báo chí thời sự.",
    "durationMinutes": 15,
    "questions": [
      {
        "id": "q4-1-1",
        "type": "kr_to_vn",
        "prompt": "Trong bài phân tích biểu đồ TOPIK, từ \"급증하다\" có nghĩa là:",
        "options": [
          "Tăng vọt đột biến",
          "Giảm mạnh nhanh chóng",
          "Duy trì trạng thái cân bằng",
          "Dao động liên tục"
        ],
        "correctAnswer": "Tăng vọt đột biến",
        "explanation": "\"급증하다\" (急增) là tăng nhanh đột ngột, tăng vọt."
      },
      {
        "id": "q4-1-2",
        "type": "fill_blank",
        "prompt": "Điền cụm từ biểu đồ: \"조사 결과에 따르면 1인 가구의 비율이 절반을 _____.\" (Vượt quá một nửa)",
        "options": [
          "차지하고 있습니다",
          "감소하고 있습니다",
          "중단하고 있습니다",
          "포기하고 있습니다"
        ],
        "correctAnswer": "차지하고 있습니다",
        "explanation": "Cụm \"비율을 차지하다\" nghĩa là chiếm tỷ lệ."
      },
      {
        "id": "q4-1-3",
        "type": "vn_to_kr",
        "prompt": "Từ tiếng Hàn nào mang nghĩa \"Giảm dần theo thời gian\"?",
        "options": [
          "감소하다",
          "증가하다",
          "발생하다",
          "유지하다"
        ],
        "correctAnswer": "감소하다",
        "explanation": "\"감소하다\" (減少) là giảm sút."
      },
      {
        "id": "q4-1-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn từ vựng thời sự:",
        "audioText": "영향",
        "options": [
          "영향",
          "원인",
          "현상",
          "대책"
        ],
        "correctAnswer": "영향",
        "explanation": "\"영향\" [yeong-hyang] (影響) là Ảnh hưởng, tác động."
      },
      {
        "id": "q4-1-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"전망되다\" trên các bản tin kinh tế nghĩa là:",
        "options": [
          "Được dự báo, triển vọng sẽ diễn ra",
          "Đã hoàn thành xong",
          "Bị đình chỉ thi hành",
          "Được kiểm chứng chính xác"
        ],
        "correctAnswer": "Được dự báo, triển vọng sẽ diễn ra",
        "explanation": "\"전망되다\" (展望되다) là được dự báo trước."
      },
      {
        "id": "q4-1-6",
        "type": "fill_blank",
        "prompt": "Điền từ: \"전문가들은 문제 해결을 위해 실질적인 _____을 마련해야 한다고 지적했습니다.\"",
        "options": [
          "대책",
          "갈등",
          "사고",
          "부작용"
        ],
        "correctAnswer": "대책",
        "explanation": "Cụm từ \"대책을 마련하다\" (對策) nghĩa là đề ra đối sách, biện pháp giải quyết."
      },
      {
        "id": "q4-1-7",
        "type": "vn_to_kr",
        "prompt": "Từ nào chỉ \"Ý kiến dư luận xã hội\"?",
        "options": [
          "여론",
          "광고",
          "소문",
          "비판"
        ],
        "correctAnswer": "여론",
        "explanation": "\"여론\" (輿論 - dư luận) là ý kiến công chúng."
      },
      {
        "id": "q4-1-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn nghĩa đúng:",
        "audioText": "설문조사",
        "options": [
          "Cuộc khảo sát thăm dò ý kiến",
          "Cuộc thi tuyển dụng",
          "Kỳ họp quốc hội",
          "Hội thảo khoa học"
        ],
        "correctAnswer": "Cuộc khảo sát thăm dò ý kiến",
        "explanation": "\"설문조사\" (設問調査) là khảo sát lấy ý kiến bằng bảng hỏi."
      }
    ]
  },
  {
    "id": "topik-4-exam-2",
    "title": "Đề Thi Thử TOPIK 4 - Đề 02: Môi Trường & Hiện Tượng Xã Hội",
    "level": "TOPIK 4",
    "topikLevel": 4,
    "description": "Chuyên đề biến đổi khí hậu, năng lượng tái tạo, già hóa dân số và văn hóa tiêu dùng bền vững.",
    "durationMinutes": 15,
    "questions": [
      {
        "id": "q4-2-1",
        "type": "kr_to_vn",
        "prompt": "Cụm từ \"지구 온난화\" có nghĩa là gì?",
        "options": [
          "Sự nóng lên toàn cầu",
          "Băng tan ở cực",
          "Mưa axit kéo dài",
          "Thủng tầng ozon"
        ],
        "correctAnswer": "Sự nóng lên toàn cầu",
        "explanation": "\"지구 온난화\" (地球 溫暖化) là hiện tượng nóng lên của trái đất."
      },
      {
        "id": "q4-2-2",
        "type": "fill_blank",
        "prompt": "Điền từ bảo vệ môi trường: \"일회용품 사용을 줄이고 재활용을 _____.\"",
        "options": [
          "생활화해야 합니다",
          "포기해야 합니다",
          "중단해야 합니다",
          "금지해야 합니다"
        ],
        "correctAnswer": "생활화해야 합니다",
        "explanation": "\"생활화하다\" nghĩa là biến thành nếp sống thường ngày."
      },
      {
        "id": "q4-2-3",
        "type": "vn_to_kr",
        "prompt": "Từ nào chỉ hiện tượng \"Già hóa dân số\"?",
        "options": [
          "고령화",
          "저출산",
          "도시화",
          "다문화"
        ],
        "correctAnswer": "고령화",
        "explanation": "\"고령화\" (高齡化) là quá trình già hóa dân số (저출산: tỷ lệ sinh giảm)."
      },
      {
        "id": "q4-2-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn thuật ngữ tương ứng:",
        "audioText": "지속가능성",
        "options": [
          "Tính bền vững",
          "Tính khả thi",
          "Tính ổn định",
          "Tính an toàn"
        ],
        "correctAnswer": "Tính bền vững",
        "explanation": "\"지속가능성\" (持續可能性 - Sustainability) là tính bền vững."
      },
      {
        "id": "q4-2-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"재생에너지\" mang ý nghĩa là:",
        "options": [
          "Năng lượng tái tạo",
          "Nhiên liệu hóa thạch",
          "Năng lượng hạt nhân",
          "Điện năng truyền thống"
        ],
        "correctAnswer": "Năng lượng tái tạo",
        "explanation": "\"재생에너지\" (再生 energy) là năng lượng tái tạo (mặt trời, gió,...)."
      },
      {
        "id": "q4-2-6",
        "type": "fill_blank",
        "prompt": "Điền từ: \"무분별한 환경 개발은 생태계 파괴를 _____.\"",
        "options": [
          "초래할 수 있습니다",
          "예방할 수 있습니다",
          "해결할 수 있습니다",
          "보호할 수 있습니다"
        ],
        "correctAnswer": "초래할 수 있습니다",
        "explanation": "Cụm \"파괴를 초래하다\" nghĩa là dẫn đến / gây ra sự hủy hoại."
      },
      {
        "id": "q4-2-7",
        "type": "vn_to_kr",
        "prompt": "Từ đồng nghĩa với \"Ý thức của người dân\" là:",
        "options": [
          "시민의식",
          "시민권",
          "사회제도",
          "복지정책"
        ],
        "correctAnswer": "시민의식",
        "explanation": "\"시민의식\" (市民意識) là ý thức công dân."
      },
      {
        "id": "q4-2-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn ý nghĩa:",
        "audioText": "심각하다",
        "options": [
          "Nghiêm trọng, nguy cấp",
          "Bình thường, giản đơn",
          "Lạc quan, tươi sáng",
          "Thuận lợi, êm đẹp"
        ],
        "correctAnswer": "Nghiêm trọng, nguy cấp",
        "explanation": "\"심각하다\" [sim-gak-ha-da] (深刻) là nghiêm trọng."
      }
    ]
  },
  {
    "id": "topik-5-exam-1",
    "title": "Đề Thi Thử TOPIK 5 - Đề 01: Kinh Tế, Tài Chính & Toàn Cầu Hóa",
    "level": "TOPIK 5",
    "topikLevel": 5,
    "description": "Từ vựng viết luận câu 54 TOPIK II: Lạm phát, phân hóa giàu nghèo, thị trường tiền tệ và suy thoái kinh tế.",
    "durationMinutes": 15,
    "questions": [
      {
        "id": "q5-1-1",
        "type": "kr_to_vn",
        "prompt": "Thuật ngữ kinh tế \"양극화 현상\" có nghĩa là gì?",
        "options": [
          "Hiện tượng phân cực (khoảng cách giàu nghèo nới rộng)",
          "Hiện tượng lạm phát phi mã",
          "Sự sụt giảm giá trị đồng tiền",
          "Sự cân bằng thị trường cung cầu"
        ],
        "correctAnswer": "Hiện tượng phân cực (khoảng cách giàu nghèo nới rộng)",
        "explanation": "\"양극화\" (兩極化) là hiện tượng phân hóa hai cực giàu nghèo rõ rệt."
      },
      {
        "id": "q5-1-2",
        "type": "fill_blank",
        "prompt": "Điền từ kinh tế: \"물가 급등으로 인해 서민들의 실질 소득이 크게 _____.\"",
        "options": [
          "감소하고 있습니다",
          "창출되고 있습니다",
          "상승하고 있습니다",
          "확대되고 있습니다"
        ],
        "correctAnswer": "감소하고 있습니다",
        "explanation": "Bão giá khiến thu nhập thực tế giảm sút: \"실질 소득 감소\"."
      },
      {
        "id": "q5-1-3",
        "type": "vn_to_kr",
        "prompt": "Từ nào chỉ \"Tỷ lệ thất nghiệp\" trong phân tích kinh tế?",
        "options": [
          "실업률",
          "취업률",
          "환율",
          "물가상승률"
        ],
        "correctAnswer": "실업률",
        "explanation": "\"실업률\" (失業率) là tỷ lệ thất nghiệp (취업률 là tỷ lệ có việc làm)."
      },
      {
        "id": "q5-1-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn khái niệm học thuật:",
        "audioText": "부가가치",
        "options": [
          "Giá trị gia tăng",
          "Chi phí sản xuất",
          "Doanh thu thuần",
          "Lợi nhuận gộp"
        ],
        "correctAnswer": "Giá trị gia tăng",
        "explanation": "\"부가가치\" (附加價値 - Value-added) là giá trị gia tăng."
      },
      {
        "id": "q5-1-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"긴축재정\" trong chính sách nhà nước nghĩa là gì?",
        "options": [
          "Chính sách tài khóa thắt chặt",
          "Gói kích cầu tài chính",
          "Chính sách nới lỏng tiền tệ",
          "Miễn giảm thuế doanh nghiệp"
        ],
        "correctAnswer": "Chính sách tài khóa thắt chặt",
        "explanation": "\"긴축재정\" (緊縮財政) là thắt chặt chi tiêu công, kiềm chế lạm phát."
      },
      {
        "id": "q5-1-6",
        "type": "fill_blank",
        "prompt": "Điền từ liên từ viết luận: \"경제 성장을 추구해야 한다. _____, 그 과정에서 분배의 형평성을 간과해서는 안 된다.\"",
        "options": [
          "그럼에도 불구하고",
          "따라서",
          "그러므로",
          "게다가"
        ],
        "correctAnswer": "그럼에도 불구하고",
        "explanation": "Cấu trúc chuyển ý mang tính lập luận phản biện: \"그럼에도 불구하고\" (Dẫu vậy / Tuy nhiên)."
      },
      {
        "id": "q5-1-7",
        "type": "vn_to_kr",
        "prompt": "Từ đồng nghĩa với \"Tạo ra công ăn việc làm mới\" là:",
        "options": [
          "일자리 창출",
          "일자리 감소",
          "구직 활동",
          "인력 감축"
        ],
        "correctAnswer": "일자리 창출",
        "explanation": "\"창출하다\" (創出) là tạo ra, sáng tạo ra."
      },
      {
        "id": "q5-1-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn ý nghĩa:",
        "audioText": "경쟁력",
        "options": [
          "Năng lực cạnh tranh",
          "Khả năng sinh lời",
          "Sự mâu thuẫn đối kháng",
          "Hiệu suất lao động"
        ],
        "correctAnswer": "Năng lực cạnh tranh",
        "explanation": "\"경쟁력\" [gyeong-jaeng-nyeok] (競爭力) là năng lực cạnh tranh."
      }
    ]
  },
  {
    "id": "topik-5-exam-2",
    "title": "Đề Thi Thử TOPIK 5 - Đề 02: Khoa Học, AI & Luận Điểm Học Thuật",
    "level": "TOPIK 5",
    "topikLevel": 5,
    "description": "Từ vựng cách mạng công nghiệp 4.0, đạo đức trí tuệ nhân tạo, bảo mật sinh trắc học và cấu trúc viết văn nghị luận.",
    "durationMinutes": 15,
    "questions": [
      {
        "id": "q5-2-1",
        "type": "kr_to_vn",
        "prompt": "Khái niệm \"인공지능 윤리\" trong công nghệ nghĩa là:",
        "options": [
          "Đạo đức trí tuệ nhân tạo",
          "Tốc độ tính toán của máy tính",
          "Quyền sở hữu bằng sáng chế",
          "Thuật toán học máy chuyên sâu"
        ],
        "correctAnswer": "Đạo đức trí tuệ nhân tạo",
        "explanation": "\"인공지능 윤리\" (AI Ethics) là quy chuẩn đạo đức khi phát triển trí tuệ nhân tạo."
      },
      {
        "id": "q5-2-2",
        "type": "fill_blank",
        "prompt": "Điền từ: \"새로운 기술의 도입은 삶의 편의를 증진시키는 반면 예기치 못한 부작용을 _____.\"",
        "options": [
          "수반하기도 합니다",
          "제거하기도 합니다",
          "방지하기도 합니다",
          "거부하기도 합니다"
        ],
        "correctAnswer": "수반하기도 합니다",
        "explanation": "Cụm từ học thuật \"부작용을 수반하다\" (隨伴) nghĩa là mang lại / kèm theo tác dụng phụ."
      },
      {
        "id": "q5-2-3",
        "type": "vn_to_kr",
        "prompt": "Từ nào mang nghĩa \"Xâm phạm quyền riêng tư cá nhân\"?",
        "options": [
          "사생활 침해",
          "개인정보 보호",
          "알 권리",
          "표현의 자유"
        ],
        "correctAnswer": "사생활 침해",
        "explanation": "\"침해\" (侵害) là xâm phạm, xâm hại."
      },
      {
        "id": "q5-2-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn từ vựng:",
        "audioText": "패러다임",
        "options": [
          "Hệ hình, mô thức tư duy",
          "Phương trình toán học",
          "Cơ chế vận hành",
          "Quy luật vật lý"
        ],
        "correctAnswer": "Hệ hình, mô thức tư duy",
        "explanation": "\"패러다임\" (Paradigm) là khuôn mẫu lý thuyết, hệ hình tư duy."
      },
      {
        "id": "q5-2-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"불가피하다\" trong văn bản học thuật nghĩa là:",
        "options": [
          "Không thể tránh khỏi, tất yếu phải xảy ra",
          "Dễ dàng loại bỏ",
          "Hoàn toàn không thể",
          "Rất đáng hoan nghênh"
        ],
        "correctAnswer": "Không thể tránh khỏi, tất yếu phải xảy ra",
        "explanation": "\"불가피하다\" (不可避) là bất khả tị, không thể né tránh."
      },
      {
        "id": "q5-2-6",
        "type": "fill_blank",
        "prompt": "Chọn đuôi câu khách quan cho bài viết luận TOPIK câu 54: \"정부는 관련 법안을 신속히 _____.\"",
        "options": [
          "마련해야 한다",
          "마련해 주세요",
          "마련합시다",
          "마련하시겠습니까"
        ],
        "correctAnswer": "마련해야 한다",
        "explanation": "Trong văn phong nghị luận học thuật TOPIK, bắt buộc dùng đuôi văn viết khẳng định khách quan \"-ㄴ/는다\" hoặc \"-(으)ㄹ 필요가 있다/해야 한다\"."
      },
      {
        "id": "q5-2-7",
        "type": "vn_to_kr",
        "prompt": "Từ nào có nghĩa là \"Hai mặt của một đồng xu (vừa lợi vừa hại)\"?",
        "options": [
          "양날의 검",
          "일거양득",
          "금상첨화",
          "사필귀정"
        ],
        "correctAnswer": "양날의 검",
        "explanation": "\"양날의 검\" (gươm hai lưỡi) biểu thị tính chất hai mặt lợi - hại song hành."
      },
      {
        "id": "q5-2-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn nghĩa tương ứng:",
        "audioText": "검증하다",
        "options": [
          "Kiểm chứng, thẩm định độ chính xác",
          "Nghi ngờ không có căn cứ",
          "Công bố rộng rãi",
          "Khen ngợi nhiệt liệt"
        ],
        "correctAnswer": "Kiểm chứng, thẩm định độ chính xác",
        "explanation": "\"검증하다\" [geom-jeung-ha-da] (檢證) là kiểm chứng khoa học."
      }
    ]
  },
  {
    "id": "topik-6-exam-1",
    "title": "Đề Thi Thử TOPIK 6 - Đề 01: Tứ Tự Thành Ngữ 사자성어 & Quán Dụng Ngữ",
    "level": "TOPIK 6",
    "topikLevel": 6,
    "description": "Chinh phục Tứ tự thành ngữ Hán Hàn 사자성어 xuất hiện dày đặc trong đề đọc hiểu và nghe TOPIK II cấp 6.",
    "durationMinutes": 15,
    "questions": [
      {
        "id": "q6-1-1",
        "type": "kr_to_vn",
        "prompt": "Thành ngữ \"유비무환(有備無患)\" mang ý nghĩa sâu xa gì?",
        "options": [
          "Có chuẩn bị chu đáo trước thì không phải lo sợ tai họa",
          "Một mũi tên bắn trúng hai con chim",
          "Hết khổ ải thì ngày quả ngọt sẽ đến",
          "Thầy giáo học hỏi ngược lại từ học trò"
        ],
        "correctAnswer": "Có chuẩn bị chu đáo trước thì không phải lo sợ tai họa",
        "explanation": "\"유비무환\" (Hữu bị vô hoạn) nghĩa là luôn sẵn sàng phòng bị thì không lo biến cố."
      },
      {
        "id": "q6-1-2",
        "type": "vn_to_kr",
        "prompt": "Thành ngữ nào chỉ \"Học trò giỏi hơn thầy, thế hệ sau vượt bậc\"?",
        "options": [
          "청출어람",
          "대기만성",
          "동병상련",
          "각골난망"
        ],
        "correctAnswer": "청출어람",
        "explanation": "\"청출어람\" (靑出於藍 - thanh xuất ư lam) có nghĩa là màu xanh lam từ cỏ lam nhưng thẫm đẹp hơn, ví trò giỏi hơn thầy."
      },
      {
        "id": "q6-1-3",
        "type": "fill_blank",
        "prompt": "Điền thành ngữ phù hợp: \"오랜 무명 시절의 고난을 이겨내고 마침내 _____의 결실을 맺었다.\"",
        "options": [
          "고진감래",
          "자승자박",
          "풍전등화",
          "배은망덕"
        ],
        "correctAnswer": "고진감래",
        "explanation": "\"고진감래\" (苦盡甘來 - Khổ tận cam lai) nghĩa là hết ngày đắng cay sẽ đến hồi quả ngọt."
      },
      {
        "id": "q6-1-4",
        "type": "audio_choice",
        "prompt": "Nghe thành ngữ và chọn ý nghĩa chính xác:",
        "audioText": "일거양득",
        "options": [
          "Một hành động đạt được cả hai điều lợi (Nhất cử lưỡng tiện)",
          "Tự mình lấy dây trói mình",
          "Giữ vững chí hướng trước sau như một",
          "Khắc sâu ơn nghĩa trong lòng"
        ],
        "correctAnswer": "Một hành động đạt được cả hai điều lợi (Nhất cử lưỡng tiện)",
        "explanation": "\"일거양득\" [il-geo-yang-deuk] (一擧兩得) nghĩa là một mũi tên trúng hai đích."
      },
      {
        "id": "q6-1-5",
        "type": "kr_to_vn",
        "prompt": "Quán dụng ngữ \"오리무중에 빠지다\" diễn tả tình cảnh gì?",
        "options": [
          "Rơi vào tình thế mù mịt như trong sương mù dày đặc, không có manh mối",
          "Đạt được thành công ngoài mong đợi",
          "Bị mọi người xung quanh chỉ trích",
          "Tìm thấy giải pháp đột phá"
        ],
        "correctAnswer": "Rơi vào tình thế mù mịt như trong sương mù dày đặc, không có manh mối",
        "explanation": "\"오리무중\" (五里霧中 - ngũ lý vụ trung) chỉ tình thế sương mù năm dặm, bế tắc không rõ phương hướng."
      },
      {
        "id": "q6-1-6",
        "type": "fill_blank",
        "prompt": "Chọn thành ngữ diễn tả người đứng đầu làm gương: \"지도자가 먼저 _____하여 솔선해야 구성원들이 따른다.\"",
        "options": [
          "솔선수범",
          "동상이몽",
          "자포자기",
          "속수무책"
        ],
        "correctAnswer": "솔선수범",
        "explanation": "\"솔선수범\" (率先垂範 - suất tiên thùy phạm) là làm gương đi đầu."
      },
      {
        "id": "q6-1-7",
        "type": "vn_to_kr",
        "prompt": "Thành ngữ chỉ việc \"Chính nghĩa tất thắng, mọi việc ắt quy về lẽ phải\" là:",
        "options": [
          "사필귀정",
          "청출어람",
          "유비무환",
          "대기만성"
        ],
        "correctAnswer": "사필귀정",
        "explanation": "\"사필귀정\" (事必歸正 - sự tất quy chính) là lẽ phải muôn đời chiến thắng gian tà."
      },
      {
        "id": "q6-1-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn thành ngữ tương ứng:",
        "audioText": "환골탈태",
        "options": [
          "환골탈태",
          "각골난망",
          "초지일관",
          "언행일치"
        ],
        "correctAnswer": "환골탈태",
        "explanation": "\"환골탈태\" [hwan-gol-tal-tae] (換骨奪胎) nghĩa là lột xác hoàn toàn, thay da đổi thịt."
      }
    ]
  },
  {
    "id": "topik-6-exam-2",
    "title": "Đề Thi Thử TOPIK 6 - Đề 02: Triết Học, Pháp Chế & Diễn Ngôn Bác Học",
    "level": "TOPIK 6",
    "topikLevel": 6,
    "description": "Văn bản ngoại giao, lý luận triết học, tư pháp và ngôn ngữ học thuật đỉnh cao chuẩn đề thi TOPIK II 100 điểm.",
    "durationMinutes": 15,
    "questions": [
      {
        "id": "q6-2-1",
        "type": "kr_to_vn",
        "prompt": "Từ học thuật \"규명하다\" trong văn bản pháp luật và điều tra mang nghĩa:",
        "options": [
          "Điều tra tường tận làm sáng tỏ chân tướng / nguyên nhân cốt lõi",
          "Quyết định tha bổng can phạm",
          "Ủy quyền cho cơ quan cấp dưới",
          "Bảo lưu ý kiến xét xử"
        ],
        "correctAnswer": "Điều tra tường tận làm sáng tỏ chân tướng / nguyên nhân cốt lõi",
        "explanation": "\"규명하다\" (糾明) là điều tra làm sáng tỏ rành mạch sự thật."
      },
      {
        "id": "q6-2-2",
        "type": "fill_blank",
        "prompt": "Điền từ bác học: \"과거의 뼈아픈 역사를 끊임없이 _____하여 같은 실수를 되풀이하지 말아야 한다.\"",
        "options": [
          "반추",
          "잠식",
          "척결",
          "배척"
        ],
        "correctAnswer": "반추",
        "explanation": "\"반추하다\" (反芻) nghĩa bóng là suy ngẫm, chiêm nghiệm sâu sắc quá khứ."
      },
      {
        "id": "q6-2-3",
        "type": "vn_to_kr",
        "prompt": "Từ nào chỉ năng lực \"Nhìn thấu bản chất vấn đề, tầm nhìn thấu suốt\"?",
        "options": [
          "통찰력",
          "추진력",
          "설득력",
          "기억력"
        ],
        "correctAnswer": "통찰력",
        "explanation": "\"통찰력\" (洞察力 - Insight) là năng lực thấu thị bản chất."
      },
      {
        "id": "q6-2-4",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn từ vựng cấp cao:",
        "audioText": "초미의 관심사",
        "options": [
          "Tiêu điểm quan tâm hàng đầu nóng bỏng nhất",
          "Vấn đề phụ không đáng kể",
          "Kế hoạch bị hủy bỏ giữa chừng",
          "Tin đồn thất thiệt vô căn cứ"
        ],
        "correctAnswer": "Tiêu điểm quan tâm hàng đầu nóng bỏng nhất",
        "explanation": "\"초미의 관심사\" (焦眉의 關心事 - lông mày cháy) nghĩa là việc cấp bách nóng bỏng số 1."
      },
      {
        "id": "q6-2-5",
        "type": "kr_to_vn",
        "prompt": "Từ \"폄훼하다\" mang sắc thái phê phán nào?",
        "options": [
          "Cố ý bôi nhọ, hạ bệ, dìm thấp giá trị công lao của người khác",
          "Tán dương một cách thái quá",
          "Khách quan đánh giá hai chiều",
          "Đồng tình và ủng hộ vô điều kiện"
        ],
        "correctAnswer": "Cố ý bôi nhọ, hạ bệ, dìm thấp giá trị công lao của người khác",
        "explanation": "\"폄훼하다\" (貶毁) là biếm hủy, hạ thấp và bôi xấu giá trị thành quả."
      },
      {
        "id": "q6-2-6",
        "type": "fill_blank",
        "prompt": "Điền động từ tuyên bố đanh thép: \"정부는 국가 안보 수호에 대한 확고한 의지를 전 세계에 _____.\"",
        "options": [
          "천명했습니다",
          "잠식했습니다",
          "상쇄했습니다",
          "방관했습니다"
        ],
        "correctAnswer": "천명했습니다",
        "explanation": "\"천명하다\" (闡明) là tuyên bố đanh thép, khẳng định dứt khoát lập trường."
      },
      {
        "id": "q6-2-7",
        "type": "vn_to_kr",
        "prompt": "Từ nào có nghĩa là \"Trừ tiệt, nhổ tận gốc rễ tệ nạn, bài trừ tiêu cực\"?",
        "options": [
          "척결하다",
          "옹호하다",
          "수렴하다",
          "도출하다"
        ],
        "correctAnswer": "척결하다",
        "explanation": "\"척결하다\" (剔抉) là bài trừ tận gốc rễ tham nhũng hay tệ nạn."
      },
      {
        "id": "q6-2-8",
        "type": "audio_choice",
        "prompt": "Nghe phát âm và chọn nghĩa chính xác:",
        "audioText": "자명하다",
        "options": [
          "Hiển nhiên, tự nó đã rõ ràng không cần chứng minh",
          "Còn nhiều điểm hồ nghi",
          "Vô cùng bí ẩn khó hiểu",
          "Tạm thời chưa thể xác định"
        ],
        "correctAnswer": "Hiển nhiên, tự nó đã rõ ràng không cần chứng minh",
        "explanation": "\"자명하다\" [ja-myeong-ha-da] (自明) nghĩa là rõ rành rành, hiển nhiên."
      }
    ]
  }
];
