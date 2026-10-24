import json
import os

# Complete vocabulary list ensuring lessons 1-11 requirements match first 35 words
words = [
  # 0: 안녕하세요
  {
    "id": "w-1", "korean": "안녕하세요", "vietnamese": "Xin chào (lịch sự)",
    "hanja": "安寧하세요 [an ninh]", "partOfSpeech": "Thành ngữ", "pronunciation": "[an-nyeong-ha-se-yo]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Chào hỏi & Giao tiếp",
    "example": {"korean": "안녕하세요! 만나서 반갑습니다.", "vietnamese": "Xin chào! Rất vui được gặp bạn."},
    "synonyms": ["안녕하십니까", "안녕"]
  },
  # 1: 감사합니다
  {
    "id": "w-2", "korean": "감사합니다", "vietnamese": "Cảm ơn (trân trọng)",
    "hanja": "感謝합니다 [cảm tạ]", "partOfSpeech": "Thành ngữ", "pronunciation": "[gam-sa-ham-ni-da]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Chào hỏi & Giao tiếp",
    "example": {"korean": "도와주셔서 정말 감사합니다.", "vietnamese": "Thật sự cảm ơn bạn đã giúp đỡ tôi."},
    "synonyms": ["고맙습니다"]
  },
  # 2: 죄송합니다
  {
    "id": "w-3", "korean": "죄송합니다", "vietnamese": "Xin lỗi (trang trọng)",
    "hanja": "罪悚합니다 [tội tủng]", "partOfSpeech": "Thành ngữ", "pronunciation": "[joe-song-ham-ni-da]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Chào hỏi & Giao tiếp",
    "example": {"korean": "약속 시간에 늦어서 죄송합니다.", "vietnamese": "Tôi xin lỗi vì đến trễ giờ hẹn."},
    "synonyms": ["미안합니다"]
  },
  # 3: 이름
  {
    "id": "w-4", "korean": "이름", "vietnamese": "Tên, họ tên",
    "partOfSpeech": "Danh từ", "pronunciation": "[i-reum]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Chào hỏi & Giao tiếp",
    "example": {"korean": "이름이 무엇입니까?", "vietnamese": "Tên của bạn là gì?"},
    "synonyms": ["성함"]
  },
  # 4: 사람
  {
    "id": "w-5", "korean": "사람", "vietnamese": "Người, con người",
    "partOfSpeech": "Danh từ", "pronunciation": "[sa-ram]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Chào hỏi & Giao tiếp",
    "example": {"korean": "저는 베트남 사람입니다.", "vietnamese": "Tôi là người Việt Nam."},
    "synonyms": ["인간"]
  },
  # 5: 친구
  {
    "id": "w-6", "korean": "친구", "vietnamese": "Bạn bè, người bạn",
    "hanja": "親舊 [thân cựu]", "partOfSpeech": "Danh từ", "pronunciation": "[chin-gu]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Gia đình & Bạn bè",
    "example": {"korean": "주말에 친구를 만나요.", "vietnamese": "Cuối tuần tôi gặp bạn bè."}
  },
  # 6: 가족
  {
    "id": "w-7", "korean": "가족", "vietnamese": "Gia đình",
    "hanja": "家族 [gia tộc]", "partOfSpeech": "Danh từ", "pronunciation": "[ga-jok]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Gia đình & Bạn bè",
    "example": {"korean": "우리 가족은 모두 네 명입니다.", "vietnamese": "Gia đình tôi có tất cả 4 người."}
  },
  # 7: 학교
  {
    "id": "w-8", "korean": "학교", "vietnamese": "Trường học",
    "hanja": "學校 [học hiệu]", "partOfSpeech": "Danh từ", "pronunciation": "[hak-kkyo]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Trường học & Học tập",
    "example": {"korean": "아침마다 학교에 가요.", "vietnamese": "Mỗi sáng tôi đều đến trường."}
  },
  # 8: 선생님
  {
    "id": "w-9", "korean": "선생님", "vietnamese": "Thầy/Cô giáo",
    "hanja": "先生님 [tiên sinh]", "partOfSpeech": "Danh từ", "pronunciation": "[seon-saeng-nim]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Trường học & Học tập",
    "example": {"korean": "선생님, 질문이 하나 있습니다.", "vietnamese": "Thưa thầy, em có một câu hỏi ạ."}
  },
  # 9: 공부하다
  {
    "id": "w-10", "korean": "공부하다", "vietnamese": "Học tập, nghiên cứu bài",
    "hanja": "工夫하다 [công phu]", "partOfSpeech": "Động từ", "pronunciation": "[gong-bu-ha-da]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Trường học & Học tập",
    "example": {"korean": "도서관에서 한국어를 열심히 공부해요.", "vietnamese": "Tôi chăm chỉ học tiếng Hàn ở thư viện."}
  },
  # 10: 도서관
  {
    "id": "w-11", "korean": "도서관", "vietnamese": "Thư viện",
    "hanja": "圖書館 [đồ thư quán]", "partOfSpeech": "Danh từ", "pronunciation": "[do-seo-gwan]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Trường học & Học tập",
    "example": {"korean": "도서관에서 조용히 책을 읽어요.", "vietnamese": "Tôi đọc sách yên lặng trong thư viện."}
  },
  # 11: 시험
  {
    "id": "w-12", "korean": "시험", "vietnamese": "Kỳ thi, bài kiểm tra",
    "hanja": "試驗 [thí nghiệm]", "partOfSpeech": "Danh từ", "pronunciation": "[si-heom]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Trường học & Học tập",
    "example": {"korean": "다음 주에 한국어 시험이 있어요.", "vietnamese": "Tuần sau tôi có bài thi tiếng Hàn."}
  },
  # 12: 음식
  {
    "id": "w-13", "korean": "음식", "vietnamese": "Thức ăn, món ăn",
    "hanja": "飮食 [ẩm thực]", "partOfSpeech": "Danh từ", "pronunciation": "[eum-sik]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Ăn uống & Đời sống",
    "example": {"korean": "한국 음식은 조금 매워요.", "vietnamese": "Đồ ăn Hàn Quốc hơi cay một chút."}
  },
  # 13: 맛있다
  {
    "id": "w-14", "korean": "맛있다", "vietnamese": "Ngon, có vị ngon",
    "partOfSpeech": "Tính từ", "pronunciation": "[ma-sit-da]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Ăn uống & Đời sống",
    "example": {"korean": "이 비빔밥이 정말 맛있어요.", "vietnamese": "Món cơm trộn Bibimbap này thực sự rất ngon."},
    "antonyms": ["맛없다"]
  },
  # 14: 물
  {
    "id": "w-15", "korean": "물", "vietnamese": "Nước, nước uống",
    "partOfSpeech": "Danh từ", "pronunciation": "[mul]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Ăn uống & Đời sống",
    "example": {"korean": "시원한 물 한 잔 주세요.", "vietnamese": "Làm ơn cho tôi một cốc nước mát."}
  },
  # 15: 식당
  {
    "id": "w-16", "korean": "식당", "vietnamese": "Nhà hàng, quán ăn",
    "hanja": "食堂 [thực đường]", "partOfSpeech": "Danh từ", "pronunciation": "[sik-ttang]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Ăn uống & Đời sống",
    "example": {"korean": "학교 앞 식당에서 점심을 먹어요.", "vietnamese": "Tôi ăn trưa ở quán ăn trước cổng trường."}
  },
  # 16: 주문하다
  {
    "id": "w-17", "korean": "주문하다", "vietnamese": "Gọi món, đặt hàng",
    "hanja": "注文하다 [chú văn]", "partOfSpeech": "Động từ", "pronunciation": "[ju-mun-ha-da]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Ăn uống & Đời sống",
    "example": {"korean": "여기 불고기 2인분 주문할게요.", "vietnamese": "Làm ơn cho tôi gọi 2 phần thịt nướng Bulgogi."}
  },
  # 17: 회사
  {
    "id": "w-18", "korean": "회사", "vietnamese": "Công ty, cơ quan",
    "hanja": "會社 [hội xã]", "partOfSpeech": "Danh từ", "pronunciation": "[hoe-sa]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Công sở & Nghề nghiệp",
    "example": {"korean": "저는 IT 회사에 다녀요.", "vietnamese": "Tôi đi làm ở công ty công nghệ thông tin."}
  },
  # 18: 출근하다
  {
    "id": "w-19", "korean": "출근하다", "vietnamese": "Đi làm, đến chỗ làm",
    "hanja": "出勤하다 [xuất cần]", "partOfSpeech": "Động từ", "pronunciation": "[chul-geun-ha-da]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Công sở & Nghề nghiệp",
    "example": {"korean": "매일 아침 8시 반에 출근해요.", "vietnamese": "Mỗi sáng tôi đi làm lúc 8 giờ 30 phút."},
    "antonyms": ["퇴근하다"]
  },
  # 19: 퇴근하다
  {
    "id": "w-20", "korean": "퇴근하다", "vietnamese": "Tan sở, về nhà sau giờ làm",
    "hanja": "退勤하다 [thoái cần]", "partOfSpeech": "Động từ", "pronunciation": "[toe-geun-ha-da]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Công sở & Nghề nghiệp",
    "example": {"korean": "오늘은 일이 많아서 늦게 퇴근했어요.", "vietnamese": "Hôm nay nhiều việc nên tôi tan làm muộn."},
    "antonyms": ["출근하다"]
  },
  # 20: 회의
  {
    "id": "w-21", "korean": "회의", "vietnamese": "Cuộc họp, hội nghị",
    "hanja": "會議 [hội nghị]", "partOfSpeech": "Danh từ", "pronunciation": "[hoe-ui]",
    "level": "TOPIK 3", "topikLevel": 3, "topic": "Công sở & Nghề nghiệp",
    "example": {"korean": "오후에 팀 회의가 있습니다.", "vietnamese": "Buổi chiều có cuộc họp nhóm."}
  },
  # 21: 보고서
  {
    "id": "w-22", "korean": "보고서", "vietnamese": "Bản báo cáo, phúc trình",
    "hanja": "報告書 [báo cáo thư]", "partOfSpeech": "Danh từ", "pronunciation": "[bo-go-seo]",
    "level": "TOPIK 3", "topikLevel": 3, "topic": "Công sở & Nghề nghiệp",
    "example": {"korean": "금요일까지 실적 보고서를 제출하세요.", "vietnamese": "Hãy nộp báo cáo kết quả trước thứ sáu."}
  },
  # 22: 여행
  {
    "id": "w-23", "korean": "여행", "vietnamese": "Du lịch, chuyến đi",
    "hanja": "旅行 [lữ hành]", "partOfSpeech": "Danh từ", "pronunciation": "[yeo-haeng]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Du lịch & Phương tiện",
    "example": {"korean": "여름 휴가 때 제주도로 여행을 가요.", "vietnamese": "Kỳ nghỉ hè tôi đi du lịch đảo Jeju."}
  },
  # 23: 지하철
  {
    "id": "w-24", "korean": "지하철", "vietnamese": "Tàu điện ngầm",
    "hanja": "地下鐵 [địa hạ thiết]", "partOfSpeech": "Danh từ", "pronunciation": "[ji-ha-cheol]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Du lịch & Phương tiện",
    "example": {"korean": "지하철 2호선을 타고 강남역에 가요.", "vietnamese": "Tôi đi tuyến tàu điện số 2 đến ga Gangnam."}
  },
  # 24: 비행기
  {
    "id": "w-25", "korean": "비행기", "vietnamese": "Máy bay",
    "hanja": "飛行機 [phi hành cơ]", "partOfSpeech": "Danh từ", "pronunciation": "[bi-haeng-gi]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Du lịch & Phương tiện",
    "example": {"korean": "비행기 표를 인터넷으로 예매했어요.", "vietnamese": "Tôi đã đặt vé máy bay qua mạng."}
  },
  # 25: 호텔
  {
    "id": "w-26", "korean": "호텔", "vietnamese": "Khách sạn",
    "partOfSpeech": "Danh từ", "pronunciation": "[ho-tel]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Du lịch & Phương tiện",
    "example": {"korean": "해변 근처 호텔을 예약했어요.", "vietnamese": "Tôi đã đặt một khách sạn gần bờ biển."}
  },
  # 26: 행복하다
  {
    "id": "w-27", "korean": "행복하다", "vietnamese": "Hạnh phúc",
    "hanja": "幸福하다 [hạnh phúc]", "partOfSpeech": "Tính từ", "pronunciation": "[haeng-bo-ka-da]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Cảm xúc & Tính cách",
    "example": {"korean": "가족과 함께 있을 때 가장 행복해요.", "vietnamese": "Tôi hạnh phúc nhất khi ở bên gia đình."},
    "antonyms": ["불행하다"]
  },
  # 27: 슬프다
  {
    "id": "w-28", "korean": "슬프다", "vietnamese": "Buồn bã, đau lòng",
    "partOfSpeech": "Tính từ", "pronunciation": "[seul-peu-da]",
    "level": "TOPIK 1", "topikLevel": 1, "topic": "Cảm xúc & Tính cách",
    "example": {"korean": "슬픈 영화를 보고 눈물이 났어요.", "vietnamese": "Xem bộ phim buồn tôi đã rơi nước mắt."},
    "antonyms": ["기쁘다"]
  },
  # 28: 친절하다
  {
    "id": "w-29", "korean": "친절하다", "vietnamese": "Thân thiện, ân cần, niềm nở",
    "hanja": "親切하다 [thân thiết]", "partOfSpeech": "Tính từ", "pronunciation": "[chin-jeo-ra-da]",
    "level": "TOPIK 2", "topikLevel": 2, "topic": "Cảm xúc & Tính cách",
    "example": {"korean": "한국 사람들은 매우 친절해요.", "vietnamese": "Người Hàn Quốc rất thân thiện và nhiệt tình."},
    "antonyms": ["불친절하다"]
  },
  # 29: 노력하다
  {
    "id": "w-30", "korean": "노력하다", "vietnamese": "Nỗ lực, cố gắng hết sức",
    "hanja": "努力하다 [nỗ lực]", "partOfSpeech": "Động từ", "pronunciation": "[no-ryeo-ka-da]",
    "level": "TOPIK 3", "topikLevel": 3, "topic": "TOPIK Cốt Lõi",
    "example": {"korean": "꿈을 이루기 위해 끊임없이 노력해요.", "vietnamese": "Tôi không ngừng nỗ lực để thực hiện ước mơ của mình."}
  },
  # 30: 경험
  {
    "id": "w-31", "korean": "경험", "vietnamese": "Kinh nghiệm, trải nghiệm thực tế",
    "hanja": "經驗 [kinh nghiệm]", "partOfSpeech": "Danh từ", "pronunciation": "[gyeong-heom]",
    "level": "TOPIK 3", "topikLevel": 3, "topic": "TOPIK Cốt Lõi",
    "example": {"korean": "다양한 아르바이트를 통해 좋은 경험을 쌓았어요.", "vietnamese": "Tôi đã tích lũy được nhiều trải nghiệm tốt qua các công việc làm thêm."}
  },
  # 31: 해결하다
  {
    "id": "w-32", "korean": "해결하다", "vietnamese": "Giải quyết, dàn xếp",
    "hanja": "解決하다 [giải quyết]", "partOfSpeech": "Động từ", "pronunciation": "[hae-gyeol-ha-da]",
    "level": "TOPIK 3", "topikLevel": 3, "topic": "TOPIK Cốt Lõi",
    "example": {"korean": "문제가 생기면 대화로 차분하게 해결해야 해요.", "vietnamese": "Khi có vấn đề phát sinh, cần bình tĩnh giải quyết bằng đối thoại."}
  },
  # 32: 발전하다
  {
    "id": "w-33", "korean": "발전하다", "vietnamese": "Phát triển, đi lên",
    "hanja": "發展하다 [phát triển]", "partOfSpeech": "Động từ", "pronunciation": "[bal-jjeon-ha-da]",
    "level": "TOPIK 4", "topikLevel": 4, "topic": "TOPIK Cốt Lõi",
    "example": {"korean": "한국의 IT 산업은 세계적으로 크게 발전했습니다.", "vietnamese": "Ngành công nghiệp IT của Hàn Quốc đã phát triển mạnh mẽ trên toàn cầu."}
  },
  # 33: 영향
  {
    "id": "w-34", "korean": "영향", "vietnamese": "Ảnh hưởng, tác động",
    "hanja": "影響 [ảnh hưởng]", "partOfSpeech": "Danh từ", "pronunciation": "[yeong-hyang]",
    "level": "TOPIK 4", "topikLevel": 4, "topic": "TOPIK Cốt Lõi",
    "example": {"korean": "미디어는 청소년들의 가치관에 큰 영향을 미쳐요.", "vietnamese": "Truyền thông gây ảnh hưởng rất lớn đến hệ giá trị của thanh thiếu niên."}
  },
  # 34: 성공하다
  {
    "id": "w-35", "korean": "성공하다", "vietnamese": "Thành công",
    "hanja": "成功하다 [thành công]", "partOfSpeech": "Động từ", "pronunciation": "[seong-gong-ha-da]",
    "level": "TOPIK 3", "topikLevel": 3, "topic": "TOPIK Cốt Lõi",
    "example": {"korean": "열심히 노력하면 반드시 시험에 성공할 수 있어요.", "vietnamese": "Nếu chăm chỉ nỗ lực, bạn nhất định sẽ thành công trong kỳ thi."},
    "antonyms": ["실패하다"]
  }
]

# Next add rich words for each TOPIK level from 1 to 6
def make_entry(wid, kr, vi, pos, pron, lvl, topic, ex_kr, ex_vi, hanja=None, syn=None, ant=None):
    d = {
        "id": f"w-{wid}",
        "korean": kr,
        "vietnamese": vi,
        "partOfSpeech": pos,
        "pronunciation": pron,
        "level": f"TOPIK {lvl}",
        "topikLevel": lvl,
        "topic": topic,
        "example": {"korean": ex_kr, "vietnamese": ex_vi},
        "masteryStatus": "unlearned",
        "reviewCount": 0
    }
    if hanja: d["hanja"] = hanja
    if syn: d["synonyms"] = syn
    if ant: d["antonyms"] = ant
    return d

wid_counter = 36

# Additional TOPIK 1
t1_add = [
    ("가다", "Đi, rời đi", "Động từ", "[ga-da]", "Sinh hoạt thường ngày", "저는 내일 학교에 가요.", "Ngày mai tôi đi học.", None, None, ["오다"]),
    ("오다", "Đến, tới", "Động từ", "[o-da]", "Sinh hoạt thường ngày", "친구가 집에 와요.", "Bạn đến nhà tôi.", None, None, ["가다"]),
    ("먹다", "Ăn", "Động từ", "[meok-da]", "Sinh hoạt thường ngày", "아침 밥을 맛있게 먹었어요.", "Tôi đã ăn sáng rất ngon.", None, ["식사하다"], None),
    ("마시다", "Uống", "Động từ", "[ma-si-da]", "Sinh hoạt thường ngày", "시원한 물을 마셔요.", "Tôi uống nước mát.", None, None, None),
    ("자다", "Ngủ", "Động từ", "[ja-da]", "Sinh hoạt thường ngày", "어젯밤 11시에 잤어요.", "Tối qua tôi ngủ lúc 11 giờ.", None, ["주무시다"], None),
    ("보다", "Xem, nhìn", "Động từ", "[bo-da]", "Sinh hoạt thường ngày", "극장에서 영화를 봐요.", "Tôi xem phim ở rạp chiếu phim.", None, None, None),
    ("읽다", "Đọc", "Động từ", "[ik-da]", "Sinh hoạt thường ngày", "매일 한국어 책을 읽어요.", "Mỗi ngày tôi đều đọc sách tiếng Hàn.", None, None, None),
    ("쓰다", "Viết (hoặc dùng)", "Động từ", "[sseu-da]", "Sinh hoạt thường ngày", "부모님께 편지를 써요.", "Tôi viết thư cho bố mẹ.", None, None, None),
    ("크다", "To, lớn", "Tính từ", "[keu-da]", "Tính chất & Miêu tả", "이 방은 아주 커요.", "Căn phòng này rất to.", None, None, ["작다"]),
    ("작다", "Nhỏ, bé", "Tính từ", "[jak-da]", "Tính chất & Miêu tả", "가방이 작고 귀여워요.", "Chiếc túi nhỏ nhắn và dễ thương.", None, None, ["크다"]),
    ("많다", "Nhiều", "Tính từ", "[man-ta]", "Số lượng", "도서관에 책이 많아요.", "Ở thư viện có nhiều sách.", None, None, ["적다"]),
    ("적다", "Ít", "Tính từ", "[jeok-da]", "Số lượng", "교실에 학생 수가 적어요.", "Số lượng học sinh trong lớp khá ít.", None, None, ["많다"]),
    ("오늘", "Hôm nay", "Danh từ", "[o-neul]", "Thời gian & Ngày", "오늘 날씨가 맑아요.", "Hôm nay trời trong xanh.", None, None, None),
    ("내일", "Ngày mai", "Danh từ", "[nae-il]", "Thời gian & Ngày", "내일 약속이 있어요.", "Ngày mai tôi có hẹn.", "來日 [lai nhật]", None, None),
    ("어제", "Hôm qua", "Danh từ", "[eo-je]", "Thời gian & Ngày", "어제 시장에 갔어요.", "Hôm qua tôi đi chợ.", None, None, None),
    ("지금", "Bây giờ", "Danh từ", "[ji-geum]", "Thời gian & Ngày", "지금 몇 시예요?", "Bây giờ là mấy giờ rồi?", "只今 [chỉ kim]", None, None),
    ("시계", "Đồng hồ", "Danh từ", "[si-gye]", "Đồ dùng hàng ngày", "벽에 예쁜 시계가 걸려 있어요.", "Trên tường có treo chiếc đồng hồ xinh xắn.", "時計 [thời kế]", None, None),
    ("가방", "Cặp sách, ba lô, túi xách", "Danh từ", "[ga-bang]", "Đồ dùng hàng ngày", "가방 안에 교재가 들어 있어요.", "Trong cặp có sách giáo trình.", None, None, None),
    ("핸드폰", "Điện thoại di động", "Danh từ", "[haen-deu-pon]", "Đồ dùng hàng ngày", "핸드폰으로 사진을 찍어요.", "Tôi chụp ảnh bằng điện thoại di động.", None, ["스마트폰"], None),
    ("모자", "Mũ, nón", "Danh từ", "[mo-ja]", "Trang phục", "햇빛이 강해서 모자를 썼어요.", "Ánh nắng gắt nên tôi đã đội mũ.", "帽子 [mạo tử]", None, None),
]
for kr, vi, pos, pron, top, ex_kr, ex_vi, hj, syn, ant in t1_add:
    words.append(make_entry(wid_counter, kr, vi, pos, pron, 1, top, ex_kr, ex_vi, hj, syn, ant))
    wid_counter += 1

# Additional TOPIK 2
t2_add = [
    ("계산하다", "Thanh toán, tính tiền", "Động từ", "[gye-san-ha-da]", "Mua sắm & Giá cả", "카드로 계산해 주세요.", "Làm ơn thanh toán bằng thẻ giúp tôi.", "計算하다 [kế toán]", None, None),
    ("할인", "Giảm giá, chiết khấu", "Danh từ", "[ha-rin]", "Mua sắm & Giá cả", "백화점에서 여름 정기 할인을 해요.", "Trung tâm thương mại đang giảm giá định kỳ mùa hè.", "割引 [cát dẫn]", None, None),
    ("정류장", "Trạm dừng (xe buýt)", "Danh từ", "[jeong-nyu-jang]", "Phương tiện & Đi lại", "정류장에서 150번 버스를 기다려요.", "Tôi đợi xe buýt số 150 ở trạm dừng.", "停留場 [đình lưu trường]", None, None),
    ("가깝다", "Gần", "Tính từ", "[ga-kkap-da]", "Vị trí & Khoảng cách", "지하철역이 집에서 아주 가까워요.", "Ga tàu điện rất gần nhà tôi.", None, None, ["멀다"]),
    ("멀다", "Xa", "Tính từ", "[meol-da]", "Vị trí & Khoảng cách", "공항까지 거리가 멀어요.", "Khoảng cách đến sân bay khá xa.", None, None, ["가깝다"]),
    ("갈아타다", "Đổi tuyến xe, chuyển tàu", "Động từ", "[ga-ra-ta-da]", "Phương tiện & Đi lại", "시청역에서 1호선으로 갈아타세요.", "Hãy chuyển sang tuyến số 1 tại ga City Hall.", None, ["환승하다"], None),
    ("예약하다", "Đặt trước (vé, phòng)", "Động từ", "[ye-yak-ha-da]", "Du lịch & Khách sạn", "식당 자리를 미리 예약했습니다.", "Tôi đã đặt trước bàn ở quán ăn.", "豫約하다 [dự ước]", None, None),
    ("출발하다", "Khởi hành, xuất phát", "Động từ", "[chul-bal-ha-da]", "Du lịch & Đi lại", "오전 9시에 부산으로 출발합니다.", "9 giờ sáng chúng tôi xuất phát đi Busan.", "出發하다 [xuất phát]", None, ["도착하다"]),
    ("도착하다", "Đến nơi, cập bến", "Động từ", "[do-cha-ka-da]", "Du lịch & Đi lại", "서울역에 정시에 도착했어요.", "Tôi đã đến ga Seoul đúng giờ.", "到着하다 [đáo trước]", None, ["출발하다"]),
    ("감기", "Bệnh cảm cúm", "Danh từ", "[gam-gi]", "Sức khỏe & Y tế", "감기에 걸려서 기침이 심해요.", "Tôi bị cảm nên ho nhiều.", "感氣 [cảm khí]", None, None),
    ("약국", "Hiệu thuốc tây", "Danh từ", "[yak-guk]", "Sức khỏe & Y tế", "약국에 가서 소화제를 샀어요.", "Tôi ra hiệu thuốc mua thuốc tiêu hóa.", "藥局 [dược cục]", None, None),
    ("병원", "Bệnh viện", "Danh từ", "[byeong-won]", "Sức khỏe & Y tế", "열이 많이 나서 병원에 다녀왔어요.", "Tôi bị sốt cao nên đã đi bệnh viện khám.", "病院 [bệnh viện]", None, None),
    ("날씨", "Thời tiết", "Danh từ", "[nal-ssi]", "Tự nhiên & Thời tiết", "주말 날씨가 매우 따뜻하고 화창해요.", "Thời tiết cuối tuần rất ấm áp và rực rỡ.", None, None, None),
    ("비", "Mưa, cơn mưa", "Danh từ", "[bi]", "Tự nhiên & Thời tiết", "오후부터 비가 내릴 예정이에요.", "Dự kiến từ chiều trời sẽ đổ mưa.", None, None, None),
    ("눈", "Tuyết (hoặc con mắt)", "Danh từ", "[nun]", "Tự nhiên & Thời tiết", "겨울에 하얀 눈이 펑펑 내려요.", "Mùa đông tuyết trắng rơi lất phất.", None, None, None),
    ("선물", "Món quà, quà biếu", "Danh từ", "[seon-mul]", "Giao tiếp xã hội", "친구 생일 선물로 향수를 준비했어요.", "Tôi đã chuẩn bị nước hoa làm quà sinh nhật cho bạn.", "膳物 [thiện vật]", None, None),
    ("소개하다", "Giới thiệu", "Động từ", "[so-gae-ha-da]", "Giao tiếp xã hội", "새로 온 룸메이트를 소개해 줄게요.", "Tôi sẽ giới thiệu bạn cùng phòng mới với bạn nhé.", "紹介하다 [thiệu giới]", None, None),
    ("편리하다", "Thuận tiện, tiện lợi", "Tính từ", "[pyeon-ni-ha-da]", "Tính chất & Đánh giá", "교통카드가 있어서 이동하기 편리해요.", "Có thẻ giao thông nên việc đi lại rất tiện lợi.", "便利하다 [tiện lợi]", None, ["불편하다"]),
    ("불편하다", "Bất tiện, không thoải mái", "Tính từ", "[bul-pyeon-ha-da]", "Tính chất & Đánh giá", "와이파이가 안 돼서 정말 불편해요.", "Không có wifi nên thật sự rất bất tiện.", "不便하다 [bất tiện]", None, ["편리하다"]),
    ("준비하다", "Chuẩn bị, sắm sửa", "Động từ", "[jun-bi-ha-da]", "Kế hoạch hàng ngày", "시험 준비를 철저히 하고 있어요.", "Tôi đang chuẩn bị ôn thi thật kỹ lưỡng.", "準備하다 [chuẩn bị]", None, None),
]
for kr, vi, pos, pron, top, ex_kr, ex_vi, hj, syn, ant in t2_add:
    words.append(make_entry(wid_counter, kr, vi, pos, pron, 2, top, ex_kr, ex_vi, hj, syn, ant))
    wid_counter += 1

# Additional TOPIK 3
t3_add = [
    ("면접", "Phỏng vấn (xin việc, học bổng)", "Danh từ", "[myeon-jeop]", "Công sở & Nghề nghiệp", "내일 인턴 면접을 보러 가요.", "Ngày mai tôi đi phỏng vấn thực tập sinh.", "面接 [diện tiếp]", None, None),
    ("합격하다", "Thi đỗ, trúng tuyển", "Động từ", "[hap-gyeo-ka-da]", "Học tập & Sự nghiệp", "원하던 대학교에 최종 합격했어요.", "Tôi đã đỗ vòng cuối vào trường đại học mơ ước.", "合格하다 [hợp cách]", None, ["불합격하다"]),
    ("실패하다", "Thất bại", "Động từ", "[sil-pae-ha-da]", "Học tập & Sự nghiệp", "한 번 실패했다고 포기하지 마세요.", "Đừng bỏ cuộc chỉ vì một lần thất bại.", "失敗하다 [thất bại]", None, ["성공하다"]),
    ("신청하다", "Đăng ký, gửi đơn xin", "Động từ", "[sin-cheong-ha-da]", "Hành chính & Thủ tục", "온라인으로 외국인등록증을 신청했어요.", "Tôi đã đăng ký thẻ cư trú người nước ngoài qua mạng.", "申請하다 [thân thỉnh]", None, None),
    ("취소하다", "Hủy bỏ, thu hồi", "Động từ", "[chwi-so-ha-da]", "Hành chính & Thủ tục", "비행기 예약을 불가피하게 취소했어요.", "Tôi đành phải hủy đặt vé máy bay.", "取消하다 [thủ tiêu]", None, None),
    ("선택하다", "Lựa chọn, tuyển chọn", "Động từ", "[seon-tae-ka-da]", "Tư duy & Đời sống", "스스로 원하는 전공을 선택하세요.", "Hãy tự mình chọn ngành học mà bạn yêu thích.", "選擇하다 [tuyển trạch]", ["고르다"], None),
    ("중요하다", "Quan trọng, trọng đại", "Tính từ", "[jung-yo-ha-da]", "Giá trị & Tính chất", "약속 시간을 지키는 것은 매우 중요해요.", "Việc đúng giờ hẹn là điều vô cùng quan trọng.", "重要하다 [trọng yếu]", None, None),
    ("필요하다", "Cần thiết, cần có", "Tính từ", "[pil-ryo-ha-da]", "Giá trị & Tính chất", "도움이 필요하면 언제든 말씀하세요.", "Nếu cần giúp đỡ bạn hãy nói bất cứ lúc nào nhé.", "必要하다 [tất yếu]", None, None),
    ("문제", "Vấn đề, sự cố, câu hỏi thi", "Danh từ", "[mun-je]", "Tư duy & Phân tích", "이 문제의 원인을 먼저 파악해야 합니다.", "Trước tiên phải tìm ra nguyên nhân của vấn đề này.", "問題 [vấn đề]", None, None),
    ("관심", "Sự quan tâm, hứng thú", "Danh từ", "[gwan-sim]", "Tâm lý & Sở thích", "한국 드라마 덕분에 한국 문화에 관심이 생겼어요.", "Nhờ phim truyền hình mà tôi có hứng thú với văn hóa Hàn.", "關心 [quan tâm]", None, None),
    ("익숙하다", "Quen thuộc, thành thạo", "Tính từ", "[ik-su-ka-da]", "Thích nghi", "한국 음식의 매운맛에 이제 익숙해요.", "Bây giờ tôi đã quen với vị cay của món ăn Hàn Quốc.", None, None, ["낯설다"]),
    ("낯설다", "Bỡ ngỡ, xa lạ", "Tính từ", "[nat-seol-da]", "Thích nghi", "처음 한국에 왔을 때는 낯선 곳이 많았어요.", "Lần đầu đến Hàn Quốc có rất nhiều nơi bỡ ngỡ xa lạ.", None, None, ["익숙하다"]),
    ("기대하다", "Kỳ vọng, mong chờ", "Động từ", "[gi-dae-ha-da]", "Tâm lý & Cảm xúc", "이번 여행에서 많은 추억을 기대하고 있어요.", "Tôi rất mong chờ nhiều kỷ niệm trong chuyến đi này.", "期待하다 [kỳ đãi]", None, None),
    ("부탁하다", "Nhờ vả, gửi gắm", "Động từ", "[bu-ta-ka-da]", "Giao tiếp xã hội", "선배에게 이력서 첨삭을 부탁드렸어요.", "Tôi đã nhờ tiền bối sửa giúp bài viết sơ yếu lý lịch.", "付託하다 [phó thác]", None, None),
    ("동료", "Đồng nghiệp", "Danh từ", "[dong-nyo]", "Công sở & Quan hệ", "직장 동료들과 함께 점심을 먹었습니다.", "Tôi đã cùng ăn trưa với các đồng nghiệp ở cơ quan.", "同僚 [đồng liêu]", None, None),
    ("자신감", "Lòng tự tin", "Danh từ", "[ja-sin-gam]", "Tâm lý cá nhân", "한국어 말하기 연습을 많이 해서 자신감이 생겼어요.", "Nhờ luyện nói tiếng Hàn nhiều mà tôi đã có sự tự tin.", "自信感 [tự tín cảm]", None, None),
    ("취미", "Sở thích", "Danh từ", "[chwi-mi]", "Đời sống tinh thần", "제 취미는 주말마다 산에 가는 등산이에요.", "Sở thích của tôi là leo núi vào mỗi dịp cuối tuần.", "趣味 [thú vị]", None, None),
    ("상담하다", "Tư vấn, tham vấn", "Động từ", "[sang-dam-ha-da]", "Học tập & Đời sống", "진로 문제로 교수님과 면담하여 상담했어요.", "Tôi đã gặp gỡ và xin tư vấn của giáo sư về định hướng tương lai.", "相談하다 [tương đàm]", None, None),
    ("약속", "Lời hứa, cuộc hẹn", "Danh từ", "[yak-ssok]", "Giao tiếp xã hội", "친구와 저녁 7시에 강남에서 만날 약속이 있어요.", "Tôi có hẹn gặp bạn lúc 7 giờ tối ở Gangnam.", "約束 [ước thúc]", None, None),
    ("결심하다", "Quyết tâm, hạ quyết tâm", "Động từ", "[gyeol-ssim-ha-da]", "Mục tiêu cá nhân", "올해 안에 TOPIK 4급을 따기로 결심했어요.", "Tôi đã quyết tâm lấy được chứng chỉ TOPIK 4 trong năm nay.", "決心하다 [quyết tâm]", None, None),
]
for kr, vi, pos, pron, top, ex_kr, ex_vi, hj, syn, ant in t3_add:
    words.append(make_entry(wid_counter, kr, vi, pos, pron, 3, top, ex_kr, ex_vi, hj, syn, ant))
    wid_counter += 1

# Additional TOPIK 4
t4_add = [
    ("원인", "Nguyên nhân, căn nguyên", "Danh từ", "[wo-nin]", "Tư duy & Phân tích", "환경오염의 주요 원인은 플라스틱 쓰레기입니다.", "Nguyên nhân chủ yếu của ô nhiễm môi trường là rác thải nhựa.", "原因 [nguyên nhân]", None, ["결과"]),
    ("결과", "Kết quả, thành tựu", "Danh từ", "[gyeol-gwa]", "Tư duy & Phân tích", "끊임없는 노력의 결과로 훌륭한 성과를 거두었다.", "Nhờ kết quả của sự nỗ lực không ngừng, tôi đã gặt hái thành quả rực rỡ.", "結果 [kết quả]", None, ["원인"]),
    ("환경보호", "Bảo vệ môi trường", "Danh từ", "[hwan-gyeong-bo-ho]", "Môi trường & Xã hội", "지구 온난화를 막기 위해 환경보호 운동에 동참합시다.", "Hãy cùng tham gia phong trào bảo vệ môi trường để ngăn chặn hiện tượng ấm lên toàn cầu.", "環境保護 [hoàn cảnh bảo hộ]", None, None),
    ("자연재해", "Thiên tai, thảm họa tự nhiên", "Danh từ", "[ja-yeon-jae-hae]", "Môi trường & Xã hội", "태풍과 홍수 등 자연재해에 철저히 대비해야 합니다.", "Cần phải chuẩn bị ứng phó kỹ lưỡng với các thiên tai như bão và lũ lụt.", "自然災害 [tự nhiên tai hại]", None, None),
    ("제공하다", "Cung cấp, đem lại", "Động từ", "[je-gong-ha-da]", "Kinh tế & Dịch vụ", "이 플랫폼은 맞춤형 학습 콘텐츠를 무료로 제공합니다.", "Nền tảng này cung cấp miễn phí các nội dung học tập theo yêu cầu cá nhân.", "提供하다 [đề cung]", None, None),
    ("참여하다", "Tham gia, góp mặt", "Động từ", "[cham-yeo-ha-da]", "Cộng đồng & Xã hội", "많은 청년들이 공공 정책 토론회에 적극 참여했다.", "Nhiều bạn trẻ đã tích cực tham gia vào buổi tọa đàm chính sách công.", "參與하다 [tham dự]", ["참가하다"], None),
    ("증가하다", "Gia tăng, tăng lên", "Động từ", "[jeung-ga-ha-da]", "Kinh tế & Số liệu", "한국어 학습자 수가 매년 꾸준히 증가하고 있습니다.", "Số lượng người học tiếng Hàn đang tăng đều đặn qua từng năm.", "增加하다 [tăng gia]", None, ["감소하다"]),
    ("감소하다", "Giảm bớt, suy giảm", "Động từ", "[gam-so-ha-da]", "Kinh tế & Số liệu", "경기 불황으로 인해 소비 지출이 크게 감소했다.", "Do suy thoái kinh tế nên chi tiêu tiêu dùng đã giảm mạnh.", "減少하다 [giảm thiểu]", None, ["증가하다"]),
    ("주장하다", "Chủ trương, khẳng định quan điểm", "Động từ", "[ju-jang-ha-da]", "Biện luận & Nghị luận", "자신의 의견을 타당한 근거를 들어 논리적으로 주장하세요.", "Hãy nêu luận điểm của mình một cách logic kèm theo căn cứ xác đáng.", "主張하다 [chủ trương]", None, None),
    ("설득하다", "Thuyết phục", "Động từ", "[seol-ddeu-ka-da]", "Giao tiếp & Đàm phán", "데이터 분석 결과를 제시하여 투자자들을 성공적으로 설득했다.", "Bằng cách đưa ra kết quả phân tích dữ liệu, tôi đã thuyết phục thành công các nhà đầu tư.", "說得하다 [thuyết đắc]", None, None),
    ("차이점", "Điểm khác biệt", "Danh từ", "[cha-i-jjeom]", "So sánh & Đánh giá", "두 문화 사이의 차이점을 올바르게 이해해야 오해가 없다.", "Phải hiểu đúng những điểm khác biệt giữa hai nền văn hóa thì mới tránh được hiểu lầm.", "差異點 [sai dị điểm]", None, ["공통점"]),
    ("공통점", "Điểm tương đồng, điểm chung", "Danh từ", "[gong-tong-jjeom]", "So sánh & Đánh giá", "아시아 각국의 음식 문화에는 쌀을 주식으로 한다는 공통점이 있다.", "Văn hóa ẩm thực các nước châu Á có điểm chung là lấy lúa gạo làm lương thực chính.", "共通點 [cộng thông điểm]", None, ["차이점"]),
    ("태도", "Thái độ, tác phong", "Danh từ", "[tae-do]", "Tâm lý & Ứng xử", "실수를 인정하고 개선하려는 성실한 태도가 중요하다.", "Thái độ chân thành biết nhận lỗi và sửa sai là điều rất quan trọng.", "態度 [thái độ]", None, None),
    ("인식", "Nhận thức, ý thức", "Danh từ", "[in-sik]", "Xã hội & Tư tưởng", "환경 문제에 대한 대중의 인식이 날로 높아지고 있다.", "Nhận thức của công chúng về vấn đề môi trường ngày một nâng cao.", "認識 [nhận thức]", None, None),
    ("제도", "Chế độ, chính sách nhà nước", "Danh từ", "[je-do]", "Xã hội & Pháp chế", "근로시간 단축 제도가 도입되어 삶의 질이 향상되었다.", "Chế độ giảm giờ làm được áp dụng giúp chất lượng cuộc sống được nâng cao.", "制度 [chế độ]", None, None),
    ("조사하다", "Điều tra, khảo sát thống kê", "Động từ", "[jo-sa-ha-da]", "Nghiên cứu & Dữ liệu", "청년 실업률의 실태를 파악하기 위해 현장을 조사했다.", "Chúng tôi đã khảo sát thực địa để nắm bắt thực trạng tỷ lệ thất nghiệp của thanh niên.", "調査하다 [điều tra]", None, None),
    ("소비자", "Người tiêu dùng", "Danh từ", "[so-bi-ja]", "Kinh tế & Thị trường", "소비자의 권익을 보호하기 위한 법적 장치가 마련되었다.", "Hành lang pháp lý bảo vệ quyền lợi người tiêu dùng đã được thiết lập.", "消費者 [tiêu phí giả]", None, None),
    ("경쟁력", "Năng lực cạnh tranh", "Danh từ", "[gyeong-jaeng-nyeok]", "Kinh tế & Doanh nghiệp", "기술 혁신을 통해 글로벌 시장 경쟁력을 강화해야 한다.", "Cần tăng cường năng lực cạnh tranh trên thị trường quốc tế thông qua đổi mới công nghệ.", "競爭力 [cạnh tranh lực]", None, None),
    ("전문가", "Chuyên gia, nhà chuyên môn", "Danh từ", "[jeon-mun-ga]", "Học thuật & Xã hội", "의료 분야 전문가들의 조언을 바탕으로 방역 지침을 세웠다.", "Đã thiết lập hướng dẫn phòng dịch dựa trên lời khuyên của các chuyên gia y tế.", "專門家 [chuyên môn gia]", None, None),
    ("극복하다", "Khắc phục, vượt qua nghịch cảnh", "Động từ", "[geuk-bbo-ka-da]", "Phát triển cá nhân", "모든 역경을 슬기롭게 극복하고 마침내 목표를 달성했다.", "Khắc phục mọi nghịch cảnh một cách thông thái và cuối cùng đã hoàn thành mục tiêu.", "克服하다 [khắc phục]", None, None),
]
for kr, vi, pos, pron, top, ex_kr, ex_vi, hj, syn, ant in t4_add:
    words.append(make_entry(wid_counter, kr, vi, pos, pron, 4, top, ex_kr, ex_vi, hj, syn, ant))
    wid_counter += 1

# Additional TOPIK 5
t5_add = [
    ("다양성", "Tính đa dạng, sự phong phú", "Danh từ", "[da-yang-seong]", "Học thuật & Xã hội", "문화적 다양성을 존중할 때 진정한 사회 통합이 이루어진다.", "Khi tôn trọng tính đa dạng văn hóa thì mới đạt được sự gắn kết xã hội đích thực.", "多樣性 [đa dạng tính]", None, None),
    ("지속가능성", "Tính bền vững lâu dài", "Danh từ", "[ji-sok-ga-neung-seong]", "Môi trường & Kinh tế", "친환경 에너지로의 전환은 인류의 지속가능성을 위한 필수 과제다.", "Chuyển đổi sang năng lượng thân thiện với môi trường là nhiệm vụ tất yếu vì sự phát triển bền vững.", "持續可能性 [trì tục khả năng tính]", None, None),
    ("양극화", "Hiện tượng phân cực hóa", "Danh từ", "[yang-geu-kwa]", "Kinh tế & Xã hội", "사회적 양극화는 사회 갈등을 심화시키는 주된 요인으로 꼽힌다.", "Sự phân cực xã hội được coi là yếu tố chính làm sâu sắc thêm các mâu thuẫn xã hội.", "兩極化 [lưỡng cực hóa]", None, None),
    ("기여하다", "Đóng góp, cống hiến", "Động từ", "[gi-yeo-ha-da]", "Xã hội & Học thuật", "이 발명은 인류의 질병 퇴치에 결정적으로 기여했다.", "Phát minh này đã đóng góp mang tính quyết định vào việc đẩy lùi bệnh tật cho nhân loại.", "寄與하다 [ký dữ]", ["이바지하다"], None),
    ("불가피하다", "Bất khả kháng, không thể tránh", "Tính từ", "[bul-ga-pi-ha-da]", "Biện luận & Đánh giá", "급변하는 시장 환경 속에서 구조 혁신은 불가피한 선택이다.", "Trong môi trường thị trường biến đổi nhanh chóng, đổi mới cấu trúc là lựa chọn không thể tránh khỏi.", "不可避하다 [bất khả tị]", None, None),
    ("타당성", "Tính thỏa đáng, hợp lý khoa học", "Danh từ", "[ta-dang-seong]", "Nghiên cứu & Luận chứng", "제시된 이론의 논리적 타당성을 엄밀하게 입증해야 한다.", "Cần phải chứng minh một cách chặt chẽ tính thỏa đáng logic của lý thuyết được đưa ra.", "妥當性 [thỏa đương tính]", None, None),
    ("모순", "Mâu thuẫn", "Danh từ", "[mo-sun]", "Triết học & Biện chứng", "언행이 일치하지 않는 그의 태도는 심각한 모순을 안고 있다.", "Thái độ nói một đằng làm một nẻo của anh ta chứa đựng mâu thuẫn trầm trọng.", "矛盾 [mâu thuẫn]", None, None),
    ("유발하다", "Gây ra, khơi mào, làm phát sinh", "Động từ", "[yu-bal-ha-da]", "Cơ chế & Nguyên nhân", "수면 부족은 뇌 기능 저하를 유발할 수 있다.", "Thiếu ngủ có thể làm suy giảm chức năng não bộ.", "誘發하다 [dụ phát]", None, None),
    ("구축하다", "Xây dựng, kiến tạo hệ thống", "Động từ", "[gu-chu-ka-da]", "Công nghệ & Quản trị", "안전한 금융 거래를 위해 인공지능 보안망을 구축했다.", "Chúng tôi đã xây dựng mạng lưới an ninh AI để đảm bảo các giao dịch tài chính an toàn.", "構築하다 [cấu trúc]", None, None),
    ("전망하다", "Dự báo, nhận định tương lai", "Động từ", "[jeon-mang-ha-da]", "Kinh tế & Xu hướng", "경제학자들은 올해 하반기 수출 회복을 긍정적으로 전망하고 있다.", "Các nhà kinh tế học đang đưa ra nhận định tích cực về sự phục hồi xuất khẩu trong nửa cuối năm nay.", "展望하다 [triển vọng]", None, None),
    ("간과하다", "Xem nhẹ, bỏ qua, sơ hở", "Động từ", "[gan-gwa-ha-da]", "Phê bình & Tư duy", "작은 오차라고 해서 결코 간과하고 넘어가서는 안 된다.", "Dù chỉ là sai số nhỏ cũng tuyệt đối không được xem nhẹ bỏ qua.", "看過하다 [khán quá]", None, None),
    ("침체되다", "Đình trệ, đóng băng, suy thoái", "Động từ", "[chim-che-doe-da]", "Kinh tế vĩ mô", "부동산 시장이 침체되면서 건설 경기 전반이 얼어붙었다.", "Thị trường bất động sản đình trệ khiến toàn bộ nền kinh tế xây dựng bị đóng băng.", "沈滯되다 [trầm trệ]", None, None),
    ("도모하다", "Mưu cầu, tính toán thúc đẩy", "Động từ", "[do-mo-ha-da]", "Chính sách & Phát triển", "기업 간 상생 협력을 통해 동반 성장을 도모해야 한다.", "Cần thông qua hợp tác cùng có lợi giữa các doanh nghiệp để thúc đẩy sự tăng trưởng song hành.", "圖謀하다 [đồ mưu]", None, None),
    ("수반하다", "Kéo theo, kèm theo tất yếu", "Động từ", "[su-ban-ha-da]", "Quy luật xã hội", "기술의 혁신은 언제나 윤리적 쟁점을 수반하기 마련이다.", "Đổi mới công nghệ bao giờ cũng tất yếu kéo theo những tranh luận đạo đức.", "隨伴하다 [tùy bạn]", None, None),
    ("고령화", "Hiện tượng già hóa dân số", "Danh từ", "[go-ryeong-hwa]", "Xã hội học", "인구 고령화에 대비하여 연금 제도의 개혁이 불가피하다.", "Để đối phó với tình trạng già hóa dân số, việc cải cách chế độ lương hưu là điều không thể tránh khỏi.", "高齡化 [cao linh hóa]", None, None),
    ("창의성", "Tính sáng tạo, tư duy đột phá", "Danh từ", "[chang-ui-seong]", "Tư duy & Giáo dục", "정답만을 요구하는 주입식 교육은 아이들의 창의성을 해친다.", "Nền giáo dục nhồi sọ chỉ đòi hỏi một đáp án đúng sẽ bóp nghẹt tính sáng tạo của trẻ nhỏ.", "創意性 [sáng ý tính]", None, None),
    ("상관관계", "Mối tương quan qua lại", "Danh từ", "[sang-gwan-gwan-gye]", "Thống kê & Khoa học", "스트레스 지수와 업무 능률 간에는 명백한 음의 상관관계가 있다.", "Giữa chỉ số căng thẳng và hiệu quả công việc có mối tương quan nghịch rõ rệt.", "相關關係 [tương quan quan hệ]", None, None),
    ("배제하다", "Bài trừ, loại trừ hoàn toàn", "Động từ", "[bae-je-ha-da]", "Tư duy phản biện", "사적인 감정을 배제하고 원칙에 입각하여 공정하게 처리했다.", "Tôi đã loại trừ cảm xúc cá nhân và xử lý công bằng dựa trên nguyên tắc.", "排除하다 [bài trừ]", None, None),
    ("자율성", "Tính tự chủ, quyền tự quyết", "Danh từ", "[ja-yul-seong]", "Quản trị nhân sự", "자율성이 보장된 근무 환경에서 창의적인 아이디어가 샘솟는다.", "Trong môi trường làm việc đảm bảo tính tự chủ, các ý tưởng sáng tạo sẽ tuôn trào.", "自律性 [tự luật tính]", None, None),
    ("근절하다", "Diệt tận gốc, triệt tiêu tệ nạn", "Động từ", "[geun-jeol-ha-da]", "Pháp luật & Trật tự", "사이버 범죄를 근절하기 위한 국제 공조 수사가 확대되고 있다.", "Cuộc điều tra phối hợp quốc tế nhằm nhổ tận gốc tội phạm mạng đang được mở rộng.", "根絕하다 [căn tuyệt]", None, None),
]
for kr, vi, pos, pron, top, ex_kr, ex_vi, hj, syn, ant in t5_add:
    words.append(make_entry(wid_counter, kr, vi, pos, pron, 5, top, ex_kr, ex_vi, hj, syn, ant))
    wid_counter += 1

# Additional TOPIK 6
t6_add = [
    ("일석이조", "Một mũi tên trúng hai đích (nhất cử lưỡng tiện)", "Thành ngữ", "[il-sseo-gi-jo]", "Thành ngữ Tứ tự (사자성어)", "자전거로 출퇴근하면 교통비도 아끼고 건강도 챙기니 일석이조다.", "Đi làm bằng xe đạp vừa tiết kiệm tiền xe vừa rèn luyện sức khỏe, đúng là một mũi tên trúng hai đích.", "一石二鳥 [nhất thạch nhị điểu]", ["일거양득 (一擧兩得)"], None),
    ("고진감래", "Khổ tận cam lai (hết khổ đến sướng, sau cơn mưa trời lại sáng)", "Thành ngữ", "[go-jin-gam-rae]", "Thành ngữ Tứ tự (사자성어)", "수년간의 고된 연구 끝에 노벨상을 수상했으니 실로 고진감래라 하겠다.", "Sau nhiều năm nghiên cứu gian khổ cuối cùng đã đoạt giải Nobel, thật đúng là khổ tận cam lai.", "苦盡甘來 [khổ tận cam lai]", None, None),
    ("역지사지", "Đặt mình vào vị trí người khác để suy nghĩ (dịch địa tư chi)", "Thành ngữ", "[yeok-ji-sa-ji]", "Thành ngữ Tứ tự (사자성어)", "진정한 소통은 역지사지의 마음가짐에서 출발하는 법이다.", "Giao tiếp đích thực phải bắt nguồn từ tâm thế biết đặt mình vào hoàn cảnh của đối phương.", "易地思之 [dịch địa tư chi]", None, None),
    ("작심삼일", "Quyết tâm ba ngày (chỉ kiên trì được 3 hôm rồi nản chí)", "Thành ngữ", "[jak-ssim-sam-il]", "Thành ngữ Tứ tự (사자성어)", "아무리 원대한 목표라도 작심삼일에 그친다면 결코 이룰 수 없다.", "Dù mục tiêu có to lớn đến đâu mà chỉ quyết tâm ba ngày rồi bỏ cuộc thì vĩnh viễn chẳng thể đạt được.", "作心三日 [tác tâm tam nhật]", None, None),
    ("전화위복", "Chuyển họa thành phúc (trong cái rủi có cái may)", "Thành ngữ", "[jeon-hwa-wi-bok]", "Thành ngữ Tứ tự (사자성어)", "회사의 부도 위기를 전화위복의 발판으로 삼아 신사업을 개척했다.", "Lấy nguy cơ phá sản của công ty làm bàn đạp chuyển họa thành phúc để khai phá mảng kinh doanh mới.", "轉禍爲福 [chuyển họa vi phúc]", None, None),
    ("과유불급", "Thái quá bất cập (cái gì quá mức cũng dở như chưa tới)", "Thành ngữ", "[gwa-yu-bul-geup]", "Thành ngữ Tứ tự (사자성어)", "의욕이 넘쳐 무리하게 일정을 추진하는 것은 과유불급의 우를 범하기 쉽다.", "Hăng hái quá đà mà ép tiến độ quá sức rất dễ phạm phải sai lầm thái quá bất cập.", "過猶不及 [quá do bất cập]", None, None),
    ("동병상련", "Đồng bệnh tương lân (những người cùng cảnh ngộ dễ đồng cảm)", "Thành ngữ", "[dong-byeong-sang-nyeon]", "Thành ngữ Tứ tự (사자성어)", "같은 아픔을 겪은 이재민들은 동병상련의 정으로 서로를 위로했다.", "Những nạn nhân cùng chịu đựng nỗi đau thiên tai đã an ủi nhau bằng sự đồng cảm của người cùng cảnh ngộ.", "同病相憐 [đồng bệnh tương lân]", None, None),
    ("발 벗고 나서다", "Nhiệt tình xắn tay áo vào giúp (quán dụng ngữ)", "Thành ngữ", "[bal beot-go na-seo-da]", "Quán dụng ngữ (관용구)", "자연재해 피해 복구를 위해 전국의 자원봉사자들이 발 벗고 나섰다.", "Các tình nguyện viên trên cả nước đã nhiệt tình xắn tay áo vào giúp khắc phục hậu quả thiên tai.", None, None, None),
    ("귀를 기울이다", "Lắng tai nghe, chăm chú lắng nghe tâm tư", "Thành ngữ", "[gwi-reul gi-u-ri-da]", "Quán dụng ngữ (관용구)", "고객의 불만 사항에도 귀를 기울여 서비스 품질을 개선해야 한다.", "Cần phải lắng tai nghe cả những lời phàn nàn của khách hàng để cải tiến chất lượng dịch vụ.", None, None, None),
    ("손을 떼다", "Rút tay ra, ngừng can thiệp dứt khoát", "Thành ngữ", "[so-neul tte-da]", "Quán dụng ngữ (관용구)", "적자가 누적되자 대표이사는 마침내 그 프로젝트에서 손을 떼었다.", "Khi thua lỗ chồng chất, giám đốc điều hành rốt cuộc đã rút tay hoàn toàn khỏi dự án đó.", None, None, None),
    ("눈길을 끌다", "Thu hút ánh nhìn, lọt vào mắt xanh", "Thành ngữ", "[nun-gi-reul kkeul-da]", "Quán dụng ngữ (관용구)", "한국 전통문양을 현대적으로 재해석한 건축물이 전 세계의 눈길을 끌고 있다.", "Công trình kiến trúc tái hiện hoa văn truyền thống Hàn Quốc theo phong cách hiện đại đang thu hút ánh nhìn của toàn thế giới.", None, None, None),
    ("천명하다", "Tuyên bố rành mạch trước thiên hạ", "Động từ", "[cheon-myeong-ha-da]", "Chính trị & Ngoại giao", "국가 수반은 어떤 무력 도발에도 굴복하지 않겠다는 결의를 천명했다.", "Người đứng đầu quốc gia đã tuyên bố rành mạch quyết tâm không bao giờ khuất phục trước bất kỳ sự khiêu khích vũ trang nào.", "闡明하다 [xiển minh]", None, None),
    ("상정하다", "Giả định tình huống / Đệ trình thảo luận", "Động từ", "[sang-jeong-ha-da]", "Học thuật & Chiến lược", "최악의 기후 재난 상황을 상정하여 국가 방재 시스템을 전면 재정비했다.", "Đã giả định tình huống thảm họa khí hậu tồi tệ nhất để tái thiết toàn diện hệ thống phòng chống thiên tai quốc gia.", "想定하다 [tưởng định]", None, None),
    ("통찰력", "Nhãn quan sâu sắc, thấu tỏ bản chất", "Danh từ", "[tong-chal-lyeok]", "Triết học & Nhận thức", "격변하는 국제 정세를 정확히 짚어내는 탁월한 통찰력이 필요하다.", "Rất cần nhãn quan sâu sắc xuất chúng để nắm bắt chính xác cục diện quốc tế đầy biến động.", "洞察力 [đỗng sát lực]", None, None),
    ("초월하다", "Vượt lên trên mọi giới hạn, siêu việt", "Động từ", "[cho-wol-ha-da]", "Triết học & Nghệ thuật", "인간의 숭고한 사랑은 시대와 공간을 초월하여 영원한 울림을 준다.", "Tình yêu thương cao cả của con người vượt qua mọi thời đại và không gian để mang lại tiếng vang vĩnh cửu.", "超越하다 [siêu việt]", None, None),
    ("궤변", "Ngụy biện, lý lẽ lươn lẹo", "Danh từ", "[gwe-byeon]", "Luận chiến & Logic", "명백한 사실을 왜곡하려는 그의 발언은 얄팍한 궤변에 지나지 않는다.", "Phát biểu nhằm bóp méo sự thật rõ ràng của ông ta chẳng qua chỉ là ngụy biện nông cạn.", "詭辯 [quỷ biện]", None, None),
    ("묵과하다", "Nhắm mắt làm ngơ, dung túng bao che", "Động từ", "[muk-gwa-ha-da]", "Pháp luật & Đạo đức", "공직자의 비리와 부정을 더 이상 묵과하는 일은 없을 것이다.", "Sẽ không bao giờ có chuyện nhắm mắt làm ngơ trước những hành vi tham nhũng tiêu cực của công chức nữa.", "默過하다 [mặc quá]", None, None),
    ("패러다임", "Hình mẫu tư duy, hệ hình tư tưởng (paradigm)", "Danh từ", "[pae-reo-da-im]", "Khoa học & Xã hội học", "생성형 인공지능의 등장은 인류 지식 생산의 패러다임을 송두리째 바꾸어 놓았다.", "Sự ra đời của AI tạo sinh đã thay đổi hoàn toàn hình mẫu tư duy sản sinh tri thức của nhân loại.", None, None, None),
    ("희열", "Niềm hân hoan tột bực, khoái cảm tinh thần", "Danh từ", "[hui-yeol]", "Tâm lý học", "목표했던 시험에 수석으로 합격한 순간 가슴 벅찬 희열을 느꼈다.", "Khoảnh khắc đỗ thủ khoa kỳ thi mục tiêu, tôi cảm nhận được niềm hân hoan dâng trào trong lồng ngực.", "喜悅 [hỷ duyệt]", None, None),
    ("일도양단", "Chặt đứt dứt khoát làm đôi (hành động quyết đoán)", "Thành ngữ", "[il-do-yang-dan]", "Thành ngữ Tứ tự (사자성어)", "지지부진하던 협상에 종지부를 찍기 위해 대표는 일도양단의 결단을 내렸다.", "Để chấm dứt cuộc đàm phán trì trệ kéo dài, người đại diện đã đưa ra quyết định dứt khoát chặt đứt làm đôi.", "一刀兩斷 [nhất đao lưỡng đoạn]", None, None),
]
for kr, vi, pos, pron, top, ex_kr, ex_vi, hj, syn, ant in t6_add:
    words.append(make_entry(wid_counter, kr, vi, pos, pron, 6, top, ex_kr, ex_vi, hj, syn, ant))
    wid_counter += 1

# Ensure all words have required fields
for w in words:
    if "masteryStatus" not in w:
        w["masteryStatus"] = "unlearned"
    if "reviewCount" not in w:
        w["reviewCount"] = 0

print(f"Total vocabulary items: {len(words)}")

# Write to typescript file
ts_content = """import { VocabWord } from '../types';

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
    wordCountLabel: '25+ từ vựng cốt lõi',
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
    wordCountLabel: '25+ từ vựng thông dụng',
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
    wordCountLabel: '25+ từ vựng trung cấp',
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
    wordCountLabel: '25+ từ vựng nâng cao',
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
    wordCountLabel: '25+ từ vựng chuyên sâu',
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
    wordCountLabel: '25+ từ vựng đỉnh cao',
    color: 'amber',
    bgGradient: 'from-amber-500/10 to-orange-500/5',
    borderColor: 'border-amber-300',
    badgeBg: 'bg-amber-600',
    badgeText: 'text-white',
    description: 'Thành thạo như người bản xứ, tinh thông Tứ tự thành ngữ 사자성어, quán dụng ngữ, văn bản ngoại giao & triết học.',
    keySkills: ['Tứ tự thành ngữ (사자성어) chuẩn đề TOPIK', 'Quán dụng ngữ (관용구) bản xứ', 'Văn bản ngoại giao & pháp chế', 'Thấu triệt sắc thái ngôn ngữ tinh tế']
  }
];

export const INITIAL_VOCAB_LIST: VocabWord[] = """ + json.dumps(words, ensure_ascii=False, indent=2) + """;

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
"""

with open('src/data/vocabData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Successfully written rich vocab data to src/data/vocabData.ts")
