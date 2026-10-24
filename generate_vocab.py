import json

vocab_data = []
wid = 1

def add_word(korean, vietnamese, part_of_speech, pronunciation, level_num, topic, ex_kr, ex_vi, hanja=None, synonyms=None, antonyms=None):
    global wid
    level_str = f"TOPIK {level_num}"
    item = {
        "id": f"w-{wid}",
        "korean": korean,
        "vietnamese": vietnamese,
        "partOfSpeech": part_of_speech,
        "pronunciation": pronunciation,
        "level": level_str,
        "topikLevel": level_num,
        "topic": topic,
        "example": {
            "korean": ex_kr,
            "vietnamese": ex_vi
        },
        "masteryStatus": "unlearned",
        "reviewCount": 0
    }
    if hanja:
        item["hanja"] = hanja
    if synonyms:
        item["synonyms"] = synonyms
    if antonyms:
        item["antonyms"] = antonyms
    vocab_data.append(item)
    wid += 1

# ==============================================================================
# TOPIK 1 (Sơ cấp 1 - Căn bản, Chào hỏi, Số đếm, Sinh hoạt thường ngày)
# ==============================================================================
add_word("안녕하세요", "Xin chào (lịch sự)", "Thành ngữ", "[an-nyeong-ha-se-yo]", 1, "Chào hỏi & Giao tiếp",
         "안녕하세요! 처음 뵙겠습니다.", "Xin chào! Lần đầu tiên tôi được gặp bạn.",
         hanja="安寧하세요 [an ninh]", synonyms=["안녕하십니까"])
add_word("감사합니다", "Cảm ơn (trân trọng)", "Thành ngữ", "[gam-sa-ham-ni-da]", 1, "Chào hỏi & Giao tiếp",
         "도와주셔서 정말 감사합니다.", "Rất cảm ơn bạn đã giúp đỡ tôi.",
         hanja="感謝합니다 [cảm tạ]", synonyms=["고맙습니다"])
add_word("죄송합니다", "Xin lỗi (trang trọng)", "Thành ngữ", "[joe-song-ham-ni-da]", 1, "Chào hỏi & Giao tiếp",
         "늦어서 정말 죄송합니다.", "Tôi vô cùng xin lỗi vì đã đến muộn.",
         hanja="罪悚합니다 [tội tủng]", synonyms=["미안합니다"])
add_word("이름", "Tên, họ tên", "Danh từ", "[i-reum]", 1, "Giới thiệu bản thân",
         "이름이 무엇입니까?", "Tên của bạn là gì?",
         synonyms=["성함"])
add_word("사람", "Người, con người", "Danh từ", "[sa-ram]", 1, "Giới thiệu bản thân",
         "저는 베트남 사람입니다.", "Tôi là người Việt Nam.",
         synonyms=["인간"])
add_word("학생", "Học sinh, sinh viên", "Danh từ", "[hak-saeng]", 1, "Trường học & Học tập",
         "저는 대학교 2학년 학생입니다.", "Tôi là sinh viên năm thứ hai đại học.",
         hanja="學生 [học sinh]")
add_word("선생님", "Thầy/Cô giáo, tiền bối", "Danh từ", "[seon-saeng-nim]", 1, "Trường học & Học tập",
         "선생님, 질문이 하나 있습니다.", "Thưa thầy, em có một câu hỏi ạ.",
         hanja="先生님 [tiên sinh]")
add_word("한국어", "Tiếng Hàn, tiếng Hàn Quốc", "Danh từ", "[han-gu-geo]", 1, "Trường học & Học tập",
         "저는 매일 한국어를 열심히 공부해요.", "Tôi chăm chỉ học tiếng Hàn mỗi ngày.",
         hanja="韓國語 [Hàn Quốc ngữ]")
add_word("친구", "Bạn bè, người bạn", "Danh từ", "[chin-gu]", 1, "Gia đình & Bạn bè",
         "주말에 친구를 만나요.", "Cuối tuần tôi gặp bạn bè.",
         hanja="親舊 [thân cựu]")
add_word("가족", "Gia đình", "Danh từ", "[ga-jok]", 1, "Gia đình & Bạn bè",
         "우리 가족은 모두 네 명입니다.", "Gia đình tôi có tất cả 4 người.",
         hanja="家族 [gia tộc]")
add_word("물", "Nước uống, nước", "Danh từ", "[mul]", 1, "Ăn uống & Đời sống",
         "시원한 물 한 잔 주세요.", "Làm ơn cho tôi một cốc nước mát.",
         antonyms=["불"])
add_word("밥", "Cơm, bữa ăn", "Danh từ", "[bap]", 1, "Ăn uống & Đời sống",
         "아침에 밥을 맛있게 먹었어요.", "Buổi sáng tôi đã ăn cơm rất ngon.",
         synonyms=["식사"])
add_word("사과", "Quả táo", "Danh từ", "[sa-gwa]", 1, "Ăn uống & Đời sống",
         "시장 가서 사과 세 개를 샀어요.", "Tôi đi chợ mua 3 quả táo.",
         hanja="沙果 [sa quả]")
add_word("가다", "Đi, di chuyển đến", "Động từ", "[ga-da]", 1, "Hành động thường ngày",
         "내일 서울에 가요.", "Ngày mai tôi đi Seoul.",
         antonyms=["오다"])
add_word("오다", "Đến, tới nơi", "Động từ", "[o-da]", 1, "Hành động thường ngày",
         "친구가 우리 집에 왔어요.", "Bạn đã đến nhà tôi chơi.",
         antonyms=["가다"])
add_word("먹다", "Ăn, dùng bữa", "Động từ", "[meok-da]", 1, "Ăn uống & Đời sống",
         "한국 음식을 좋아해서 자주 먹어요.", "Tôi thích đồ ăn Hàn Quốc nên hay ăn.",
         synonyms=["드시다"], antonyms=["굶다"])
add_word("마시다", "Uống", "Động từ", "[ma-si-da]", 1, "Ăn uống & Đời sống",
         "카페에서 따뜻한 차를 마셔요.", "Tôi uống trà ấm ở quán cà phê.")
add_word("자다", "Ngủ", "Động từ", "[ja-da]", 1, "Hành động thường ngày",
         "어젯밤에 일찍 잤어요.", "Tối qua tôi đã đi ngủ sớm.",
         synonyms=["주무시다"], antonyms=["깨다"])
add_word("보다", "Xem, nhìn, ngắm", "Động từ", "[bo-da]", 1, "Hành động thường ngày",
         "영화관에서 한국 영화를 봐요.", "Tôi xem phim Hàn Quốc ở rạp chiếu phim.")
add_word("읽다", "Đọc (sách, báo)", "Động từ", "[ik-da]", 1, "Trường học & Học tập",
         "도서관에서 책을 읽고 있어요.", "Tôi đang đọc sách ở thư viện.")
add_word("쓰다", "Viết (hoặc đội mũ, đắng)", "Động từ", "[sseu-da]", 1, "Trường học & Học tập",
         "공책에 한국어 단어를 써요.", "Tôi viết từ vựng tiếng Hàn vào vở ghi.")
add_word("좋다", "Tốt, đẹp, thích", "Tính từ", "[jo-ta]", 1, "Tính chất & Cảm nhận",
         "오늘 날씨가 정말 좋아요.", "Hôm nay thời tiết thật là đẹp.",
         antonyms=["나쁘다"])
add_word("크다", "To, lớn, cao lớn", "Tính từ", "[keu-da]", 1, "Tính chất & Cảm nhận",
         "이 가방은 크고 가벼워요.", "Chiếc túi này to và nhẹ.",
         antonyms=["작다"])
add_word("작다", "Nhỏ, bé", "Tính từ", "[jak-da]", 1, "Tính chất & Cảm nhận",
         "신발이 조금 작아요.", "Đôi giày hơi bị chật/nhỏ một chút.",
         antonyms=["크다"])
add_word("많다", "Nhiều", "Tính từ", "[man-ta]", 1, "Số lượng & Mức độ",
         "도서관에 사람이 많아요.", "Ở thư viện có rất nhiều người.",
         antonyms=["적다"])
add_word("오늘", "Hôm nay", "Danh từ", "[o-neul]", 1, "Thời gian & Lịch",
         "오늘 약속이 있어요?", "Hôm nay bạn có hẹn không?",
         antonyms=["어제", "내일"])
add_word("어제", "Hôm qua", "Danh từ", "[eo-je]", 1, "Thời gian & Lịch",
         "어제 비가 많이 왔어요.", "Hôm qua trời mưa rất to.")
add_word("내일", "Ngày mai", "Danh từ", "[nae-il]", 1, "Thời gian & Lịch",
         "내일 시험을 봐요.", "Ngày mai tôi thi.",
         hanja="來日 [lai nhật]")
add_word("지금", "Bây giờ, hiện tại", "Danh từ", "[ji-geum]", 1, "Thời gian & Lịch",
         "지금 몇 시예요?", "Bây giờ là mấy giờ rồi ạ?",
         hanja="只今 [chỉ kim]")
add_word("집", "Nhà, ngôi nhà", "Danh từ", "[jip]", 1, "Gia đình & Bạn bè",
         "수업 끝나고 집에 가요.", "Học xong tôi về nhà.",
         synonyms=["댁"])

# ==============================================================================
# TOPIK 2 (Sơ cấp 2 - Mua sắm, Di chuyển, Nhà hàng, Khách sạn, Bệnh viện)
# ==============================================================================
add_word("주문하다", "Đặt món, gọi món, đặt hàng", "Động từ", "[ju-mun-ha-da]", 2, "Nhà hàng & Mua sắm",
         "여기 불고기 2인분 주문할게요.", "Làm ơn cho tôi gọi 2 suất thịt nướng Bulgogi.",
         hanja="注文하다 [chú văn]", synonyms=["시키다"])
add_word("계산하다", "Thanh toán, tính tiền", "Động từ", "[gye-san-ha-da]", 2, "Nhà hàng & Mua sắm",
         "카드로 계산해 주세요.", "Làm ơn thanh toán bằng thẻ giúp tôi.",
         hanja="計算하다 [kế toán]")
add_word("지하철", "Tàu điện ngầm", "Danh từ", "[ji-ha-cheol]", 2, "Giao thông & Đi lại",
         "출퇴근 시간에는 지하철을 타는 것이 빨라요.", "Vào giờ cao điểm thì đi tàu điện ngầm sẽ nhanh hơn.",
         hanja="地下鐵 [địa hạ thiết]")
add_word("정류장", "Trạm dừng (xe buýt)", "Danh từ", "[jeong-nyu-jang]", 2, "Giao thông & Đi lại",
         "버스 정류장이 어디에 있어요?", "Trạm xe buýt ở đâu vậy ạ?",
         hanja="停留場 [đình lưu trường]")
add_word("가깝다", "Gần, ở cự ly gần", "Tính từ", "[ga-kkap-da]", 2, "Vị trí & Phương hướng",
         "우리 집은 역에서 매우 가까워요.", "Nhà tôi rất gần ga tàu.",
         antonyms=["멀다"])
add_word("멀다", "Xa, cách xa", "Tính từ", "[meol-da]", 2, "Vị trí & Phương hướng",
         "여기서 공항까지 멉니까?", "Từ đây đến sân bay có xa không?",
         antonyms=["가깝다"])
add_word("예약하다", "Đặt trước (vé, phòng, chỗ)", "Động từ", "[ye-yak-ha-da]", 2, "Du lịch & Khách sạn",
         "호텔 방을 미리 예약했습니다.", "Tôi đã đặt trước phòng khách sạn.",
         hanja="豫約하다 [dự ước]")
add_word("할인", "Giảm giá, chiết khấu", "Danh từ", "[ha-rin]", 2, "Nhà hàng & Mua sắm",
         "학생증이 있으면 10% 할인을 받아요.", "Nếu có thẻ học sinh sẽ được giảm giá 10%.",
         hanja="割引 [cát dẫn]")
add_word("갈아타다", "Đổi tuyến, chuyển xe (transit)", "Động từ", "[ga-ra-ta-da]", 2, "Giao thông & Đi lại",
         "시청역에서 2호선으로 갈아타세요.", "Hãy đổi sang line số 2 tại ga City Hall nhé.",
         synonyms=["환승하다"])
add_word("감기", "Cảm cúm, cảm lạnh", "Danh từ", "[gam-gi]", 2, "Sức khỏe & Y tế",
         "감기에 걸려서 병원에 다녀왔어요.", "Tôi bị cảm cúm nên đã đi khám bác sĩ về.",
         hanja="感氣 [cảm khí]")
add_word("약국", "Hiệu thuốc tây", "Danh từ", "[yak-guk]", 2, "Sức khỏe & Y tế",
         "약국에서 감기약을 샀어요.", "Tôi mua thuốc cảm ở hiệu thuốc.",
         hanja="藥局 [dược cục]")
add_word("도착하다", "Đến nơi, cập bến", "Động từ", "[do-cha-ka-da]", 2, "Du lịch & Khách sạn",
         "비행기가 인천공항에 안전하게 도착했습니다.", "Máy bay đã hạ cánh an toàn xuống sân bay Incheon.",
         hanja="到着하다 [đáo trước]", antonyms=["출발하다"])
add_word("출발하다", "Khởi hành, xuất phát", "Động từ", "[chul-bal-ha-da]", 2, "Du lịch & Khách sạn",
         "버스는 오전 9시에 정각에 출발합니다.", "Xe buýt xuất phát đúng 9 giờ sáng.",
         hanja="出發하다 [xuất phát]", antonyms=["도착하다"])
add_word("준비하다", "Chuẩn bị, sắm sửa", "Động từ", "[jun-bi-ha-da]", 2, "Đời sống hàng ngày",
         "내일 여행 갈 짐을 준비하고 있어요.", "Tôi đang chuẩn bị hành lý cho chuyến du lịch ngày mai.",
         hanja="準備하다 [chuẩn bị]")
add_word("편리하다", "Tiện lợi, thuận tiện", "Tính từ", "[pyeon-ni-ha-da]", 2, "Tính chất & Cảm nhận",
         "온라인 쇼핑은 정말 편리해요.", "Mua sắm trực tuyến thực sự rất tiện lợi.",
         hanja="便利하다 [tiện lợi]", antonyms=["불편하다"])
add_word("불편하다", "Bất tiện, không thoải mái", "Tính từ", "[bul-pyeon-ha-da]", 2, "Tính chất & Cảm nhận",
         "이 의자는 오래 앉아 있기에 불편해요.", "Chiếc ghế này ngồi lâu thì khá bất tiện/khó chịu.",
         hanja="不便하다 [bất tiện]", antonyms=["편리하다"])
add_word("선물", "Quà tặng, món quà", "Danh từ", "[seon-mul]", 2, "Quan hệ & Giao tiếp",
         "생일 축하 선물로 책을 주었어요.", "Tôi đã tặng sách làm quà sinh nhật.",
         hanja="膳物 [thiện vật]")
add_word("연락하다", "Liên lạc, gọi điện/nhắn tin", "Động từ", "[yeol-la-ka-da]", 2, "Quan hệ & Giao tiếp",
         "한국에 도착하면 바로 연락해 주세요.", "Đến Hàn Quốc hãy liên lạc với tôi ngay nhé.",
         hanja="連絡하다 [liên lạc]")
add_word("소개하다", "Giới thiệu", "Động từ", "[so-gae-ha-da]", 2, "Quan hệ & Giao tiếp",
         "제 친한 친구를 소개해 드릴게요.", "Tôi xin giới thiệu người bạn thân của tôi với bạn.",
         hanja="紹介하다 [thiệu giới]")
add_word("날씨", "Thời tiết", "Danh từ", "[nal-ssi]", 2, "Tự nhiên & Khí hậu",
         "주말 날씨가 맑고 따뜻할 거예요.", "Thời tiết cuối tuần sẽ trong xanh và ấm áp.")

# ==============================================================================
# TOPIK 3 (Trung cấp 3 - Công sở cơ bản, Kế hoạch, Trải nghiệm, Xã hội)
# ==============================================================================
add_word("경험", "Kinh nghiệm, trải nghiệm", "Danh từ", "[gyeong-heom]", 3, "Đời sống & Phát triển",
         "해외 봉사활동은 소중한 경험이 되었어요.", "Hoạt động tình nguyện nước ngoài đã trở thành trải nghiệm quý báu.",
         hanja="經驗 [kinh nghiệm]")
add_word("성공하다", "Thành công", "Động từ", "[seong-gong-ha-da]", 3, "Công sở & Mục tiêu",
         "열심히 노력하면 반드시 성공할 수 있어요.", "Nếu nỗ lực chăm chỉ, bạn nhất định sẽ thành công.",
         hanja="成功하다 [thành công]", antonyms=["실패하다"])
add_word("실패하다", "Thất bại", "Động từ", "[sil-pae-ha-da]", 3, "Công sở & Mục tiêu",
         "실패를 두려워하지 말고 계속 도전하세요.", "Đừng sợ thất bại mà hãy tiếp tục thử thách.",
         hanja="失敗하다 [thất bại]", antonyms=["성공하다"])
add_word("회의", "Cuộc họp, phiên họp", "Danh từ", "[hoe-ui]", 3, "Công sở & Làm việc",
         "오후 3시에 기획팀 회의가 있습니다.", "Có cuộc họp của nhóm kế hoạch vào lúc 3 giờ chiều.",
         hanja="會議 [hội nghị]")
add_word("보고서", "Bản báo cáo, báo cáo công việc", "Danh từ", "[bo-go-seo]", 3, "Công sở & Làm việc",
         "내일까지 이번 달 실적 보고서를 제출해야 해요.", "Phải nộp báo cáo kết quả tháng này trước ngày mai.",
         hanja="報告書 [báo cáo thư]")
add_word("면접", "Phỏng vấn (xin việc, học bổng)", "Danh từ", "[myeon-jeop]", 3, "Công sở & Nghề nghiệp",
         "내일 대기업 입사 면접이 있어서 떨려요.", "Ngày mai tôi có buổi phỏng vấn vào tập đoàn lớn nên rất hồi hộp.",
         hanja="面接 [diện tiếp]")
add_word("합격하다", "Đỗ, thi đậu, trúng tuyển", "Động từ", "[hap-gyeo-ka-da]", 3, "Học tập & Thi cử",
         "TOPIK 5급에 합격해서 정말 기뻐요.", "Tôi vui sướng tột cùng vì đã đỗ TOPIK cấp 5.",
         hanja="合格하다 [hợp cách]", antonyms=["불합격하다"])
add_word("신청하다", "Đăng ký, xin (visa, môn học)", "Động từ", "[sin-cheong-ha-da]", 3, "Học tập & Thủ tục",
         "수강 신청 기간을 꼭 확인하세요.", "Hãy nhớ kiểm tra kỹ thời hạn đăng ký tín chỉ môn học nhé.",
         hanja="申請하다 [thân thỉnh]")
add_word("취소하다", "Hủy bỏ, hủy lịch", "Động từ", "[chwi-so-ha-da]", 3, "Đời sống & Công việc",
         "급한 일이 생겨서 약속을 취소했어요.", "Vì có việc gấp phát sinh nên tôi đã phải hủy cuộc hẹn.",
         hanja="取消하다 [thủ tiêu]")
add_word("선택하다", "Lựa chọn, tuyển chọn", "Động từ", "[seon-tae-ka-da]", 3, "Quyết định & Tư duy",
         "자신의 진로를 스스로 선택해야 합니다.", "Mỗi người cần phải tự mình lựa chọn con đường tương lai.",
         hanja="選擇하다 [tuyển trạch]", synonyms=["고르다"])
add_word("중요하다", "Quan trọng, cốt yếu", "Tính từ", "[jung-yo-ha-da]", 3, "Tính chất & Giá trị",
         "건강을 지키는 것이 무엇보다 중요해요.", "Việc giữ gìn sức khỏe quan trọng hơn bất cứ điều gì.",
         hanja="重要하다 [trọng yếu]")
add_word("필요하다", "Cần thiết, cần có", "Tính từ", "[pil-ryo-ha-da]", 3, "Tính chất & Giá trị",
         "외국어 공부에는 꾸준한 연습이 필요합니다.", "Học ngoại ngữ rất cần sự luyện tập kiên trì đều đặn.",
         hanja="必要하다 [tất yếu]")
add_word("문제", "Vấn đề, câu hỏi bài tập", "Danh từ", "[mun-je]", 3, "Tư duy & Thảo luận",
         "이 문제를 어떻게 해결하면 좋을까요?", "Chúng ta nên giải quyết vấn đề này như thế nào thì tốt?",
         hanja="問題 [vấn đề]")
add_word("해결하다", "Giải quyết, tháo gỡ", "Động từ", "[hae-gyeol-ha-da]", 3, "Tư duy & Thảo luận",
         "서로 대화로 갈등을 원만히 해결했습니다.", "Chúng tôi đã giải quyết êm đẹp mâu thuẫn bằng sự đối thoại.",
         hanja="解決하다 [giải quyết]")
add_word("관심", "Sự quan tâm, hứng thú", "Danh từ", "[gwan-sim]", 3, "Cảm xúc & Sở thích",
         "저는 한국 문화와 역사에 관심이 많습니다.", "Tôi rất quan tâm và yêu thích văn hóa, lịch sử Hàn Quốc.",
         hanja="關心 [quan tâm]")
add_word("부탁하다", "Nhờ vả, gửi gắm", "Động từ", "[bu-ta-ka-da]", 3, "Giao tiếp xã hội",
         "동료에게 서류 검토를 정중히 부탁했어요.", "Tôi đã lịch sự nhờ đồng nghiệp duyệt tài liệu giúp.",
         hanja="付託하다 [phó thác]")
add_word("익숙하다", "Quen thuộc, thành thạo", "Tính từ", "[ik-su-ka-da]", 3, "Kỹ năng & Thích nghi",
         "이제 한국 생활에 많이 익숙해졌어요.", "Bây giờ tôi đã thích nghi quen thuộc với cuộc sống ở Hàn rất nhiều.",
         antonyms=["낯설다"])
add_word("낯설다", "Xa lạ, bỡ ngỡ", "Tính từ", "[nat-seol-da]", 3, "Kỹ năng & Thích nghi",
         "처음 외국에 갔을 때는 모든 것이 낯설었어요.", "Lần đầu đi ra nước ngoài, mọi thứ đều thật bỡ ngỡ xa lạ.",
         antonyms=["익숙하다"])
add_word("기대하다", "Kỳ vọng, mong đợi", "Động từ", "[gi-dae-ha-da]", 3, "Tâm lý & Cảm xúc",
         "다음 주에 개봉하는 영화를 무척 기대하고 있어요.", "Tôi rất mong đợi bộ phim sẽ ra rạp vào tuần tới.",
         hanja="期待하다 [kỳ đãi]")
add_word("노력하다", "Nỗ lực, cố gắng hết mình", "Động từ", "[no-ryeo-ka-da]", 3, "Đời sống & Phát triển",
         "꿈을 이루기 위해 매일 최선을 다해 노력해요.", "Để thực hiện ước mơ, tôi nỗ lực hết mình mỗi ngày.",
         hanja="努力하다 [nỗ lực]")

# ==============================================================================
# TOPIK 4 (Trung cấp 4 - Báo chí, Xã hội, Môi trường, Phỏng vấn, Phân tích)
# ==============================================================================
add_word("영향", "Ảnh hưởng, tác động", "Danh từ", "[yeong-hyang]", 4, "Xã hội & Xu hướng",
         "스마트폰은 현대인의 생활에 큰 영향을 미친다.", "Điện thoại thông minh tác động rất lớn đến đời sống người hiện đại.",
         hanja="影響 [ảnh hưởng]")
add_word("원인", "Nguyên nhân, căn nguyên", "Danh từ", "[wo-nin]", 4, "Phân tích & Lý luận",
         "전문가들이 사고의 정확한 원인을 조사하고 있다.", "Các chuyên gia đang điều tra nguyên nhân chính xác của vụ tai nạn.",
         hanja="原因 [nguyên nhân]", antonyms=["결과"])
add_word("결과", "Kết quả, thành quả", "Danh từ", "[gyeol-gwa]", 4, "Phân tích & Lý luận",
         "꾸준히 노력한 결과 좋은 성적을 얻었다.", "Nhờ nỗ lực bền bỉ, tôi đã đạt được kết quả tốt đẹp.",
         hanja="結果 [kết quả]", antonyms=["원인"])
add_word("발전하다", "Phát triển, tiến bộ", "Động từ", "[bal-jjeon-ha-da]", 4, "Khoa học & Xã hội",
         "인공지능 기술이 눈부시게 발전하고 있습니다.", "Công nghệ trí tuệ nhân tạo đang phát triển vượt bậc.",
         hanja="發展하다 [phát triển]")
add_word("환경보호", "Bảo vệ môi trường", "Danh từ", "[hwan-gyeong-bo-ho]", 4, "Môi trường & Trái đất",
         "환경보호를 위해 일회용품 사용을 줄여야 합니다.", "Để bảo vệ môi trường, cần giảm thiểu sử dụng đồ dùng một lần.",
         hanja="環境保護 [hoàn cảnh bảo hộ]")
add_word("자연재해", "Thiên tai, thảm họa tự nhiên", "Danh từ", "[ja-yeon-jae-hae]", 4, "Môi trường & Trái đất",
         "기후 변화로 인해 세계 곳곳에서 자연재해가 발생한다.", "Do biến đổi khí hậu, thiên tai xảy ra ở nhiều nơi trên thế giới.",
         hanja="自然災害 [tự nhiên tai hại]")
add_word("제공하다", "Cung cấp, đem lại", "Động từ", "[je-gong-ha-da]", 4, "Kinh tế & Dịch vụ",
         "이 앱은 유용한 학습 자료를 무료로 제공합니다.", "Ứng dụng này cung cấp tài liệu học tập hữu ích hoàn toàn miễn phí.",
         hanja="提供하다 [đề cung]")
add_word("참여하다", "Tham gia, góp mặt", "Động từ", "[cham-yeo-ha-da]", 4, "Cộng đồng & Xã hội",
         "많은 시민들이 자원봉사 활동에 적극적으로 참여했다.", "Rất nhiều người dân đã tích cực tham gia vào hoạt động tình nguyện.",
         hanja="參與하다 [tham dự]", synonyms=["참가하다"])
add_word("증가하다", "Gia tăng, tăng lên", "Động từ", "[jeung-ga-ha-da]", 4, "Kinh tế & Số liệu",
         "한국을 방문하는 외국인 관광객 수가 크게 증가했다.", "Số lượng khách du lịch nước ngoài đến Hàn Quốc đã tăng mạnh.",
         hanja="增加하다 [tăng gia]", antonyms=["감소하다"])
add_word("감소하다", "Giảm sút, sụt giảm", "Động từ", "[gam-so-ha-da]", 4, "Kinh tế & Số liệu",
         "출산율이 떨어지면서 학령인구가 감소하고 있다.", "Tỷ lệ sinh giảm khiến dân số trong độ tuổi đi học sụt giảm.",
         hanja="減少하다 [giảm thiểu]", antonyms=["증가하다"])
add_word("주장하다", "Chủ trương, khẳng định, nêu quan điểm", "Động từ", "[ju-jang-ha-da]", 4, "Biện luận & Luận điểm",
         "그는 자신의 무죄를 끝까지 강력하게 주장했다.", "Anh ấy kiên quyết khẳng định mình vô tội đến cùng.",
         hanja="主張하다 [chủ trương]")
add_word("설득하다", "Thuyết phục", "Động từ", "[seol-ddeu-ka-da]", 4, "Giao tiếp & Đàm phán",
         "상대방의 의견을 존중하면서 차분하게 설득하세요.", "Hãy tôn trọng ý kiến đối phương và bình tĩnh thuyết phục họ.",
         hanja="說得하다 [thuyết đắc]")
add_word("차이점", "Điểm khác biệt", "Danh từ", "[cha-i-jjeom]", 4, "So sánh & Phân tích",
         "동양 문화와 서양 문화의 차이점을 비교해 보세요.", "Hãy so sánh những điểm khác biệt giữa văn hóa phương Đông và phương Tây.",
         hanja="差異點 [sai dị điểm]", antonyms=["공통점"])
add_word("공통점", "Điểm tương đồng, điểm chung", "Danh từ", "[gong-tong-jjeom]", 4, "So sánh & Phân tích",
         "두 언어 사이에는 놀라울 정도로 많은 공통점이 있다.", "Giữa hai ngôn ngữ có rất nhiều nét tương đồng đáng ngạc nhiên.",
         hanja="共通點 [cộng thông điểm]", antonyms=["차이점"])
add_word("태도", "Thái độ, tác phong", "Danh từ", "[tae-do]", 4, "Nhân cách & Tâm lý",
         "어려운 상황에서도 긍정적인 태도를 잃지 마세요.", "Dù trong hoàn cảnh khó khăn cũng đừng đánh mất thái độ tích cực.",
         hanja="態度 [thái độ]")
add_word("인식", "Nhận thức, ý thức", "Danh từ", "[in-sik]", 4, "Xã hội & Tư tưởng",
         "장애인에 대한 사회적 인식을 개선해야 합니다.", "Cần phải cải thiện nhận thức của xã hội đối với người khuyết tật.",
         hanja="認識 [nhận thức]")
add_word("제도", "Chế độ, thể chế, chính sách", "Danh từ", "[je-do]", 4, "Chính sách & Pháp luật",
         "복지 제도를 정비하여 취약계층을 지원해야 한다.", "Cần hoàn thiện chế độ phúc lợi để hỗ trợ các đối tượng yếu thế.",
         hanja="制度 [chế độ]")
add_word("조사하다", "Điều tra, khảo sát", "Động từ", "[jo-sa-ha-da]", 4, "Nghiên cứu & Thống kê",
         "소비자 만족도를 파악하기 위해 설문조사를 실시했다.", "Chúng tôi đã tiến hành khảo sát để nắm bắt mức độ hài lòng của người tiêu dùng.",
         hanja="調査하다 [điều tra]")
add_word("소비자", "Người tiêu dùng, khách hàng", "Danh từ", "[so-bi-ja]", 4, "Kinh tế & Thị trường",
         "기업은 소비자의 다양한 요구를 신속히 반영해야 한다.", "Doanh nghiệp cần nhanh chóng phản hồi các nhu cầu đa dạng của người tiêu dùng.",
         hanja="消費者 [tiêu phí giả]")
add_word("경쟁력", "Năng lực cạnh tranh", "Danh từ", "[gyeong-jaeng-nyeok]", 4, "Kinh tế & Doanh nghiệp",
         "글로벌 시장에서 살아남기 위해서는 기술 경쟁력이 필수다.", "Để tồn tại trên thị trường toàn cầu, năng lực cạnh tranh công nghệ là tất yếu.",
         hanja="競爭力 [cạnh tranh lực]")

# ==============================================================================
# TOPIK 5 (Cao cấp 5 - Kinh tế, Học thuật, Viết luận, Chính trị, Triết học)
# ==============================================================================
add_word("다양성", "Tính đa dạng, sự phong phú", "Danh từ", "[da-yang-seong]", 5, "Học thuật & Xã hội",
         "문화적 다양성을 존중하는 열린 사회를 구축해야 한다.", "Cần xây dựng một xã hội cởi mở tôn trọng tính đa dạng văn hóa.",
         hanja="多樣性 [đa dạng tính]")
add_word("지속가능성", "Tính bền vững", "Danh từ", "[ji-sok-ga-neung-seong]", 5, "Môi trường & Kinh tế",
         "기업 경영에서 환경 보호와 지속가능성은 핵심 화두다.", "Trong quản trị doanh nghiệp, bảo vệ môi trường và tính bền vững là chủ đề cốt lõi.",
         hanja="持續可能性 [trì tục khả năng tính]")
add_word("양극화", "Hiện tượng phân cực hóa (giàu - nghèo)", "Danh từ", "[yang-geu-kwa]", 5, "Kinh tế & Xã hội",
         "소득 양극화 문제를 해결하기 위한 정책적 개입이 시급하다.", "Sự can thiệp chính sách để giải quyết bài toán phân cực giàu nghèo là vô cùng cấp bách.",
         hanja="兩極化 [lưỡng cực hóa]")
add_word("기여하다", "Đóng góp, cống hiến", "Động từ", "[gi-yeo-ha-da]", 5, "Phát triển & Cống hiến",
         "과학기술의 발전은 인류의 번영에 크게 기여하였다.", "Sự phát triển của khoa học công nghệ đã đóng góp to lớn vào sự phồn vinh của nhân loại.",
         hanja="寄與하다 [ký dữ]", synonyms=["이바지하다"])
add_word("불가피하다", "Không thể tránh khỏi, bất khả kháng", "Tính từ", "[bul-ga-pi-ha-da]", 5, "Luận cứ & Đánh giá",
         "구조조정 과정에서 인력 감축은 불가피한 선택이었다.", "Trong quá trình tái cơ cấu, việc cắt giảm nhân sự là lựa chọn không thể tránh khỏi.",
         hanja="不可避하다 [bất khả tị]")
add_word("타당성", "Tính thỏa đáng, tính hợp lý khoa học", "Danh từ", "[ta-dang-seong]", 5, "Nghiên cứu & Luận văn",
         "연구 결과의 객관적 타당성을 검증하기 위해 추가 실험을 진행했다.", "Chúng tôi tiến hành thí nghiệm bổ sung để kiểm chứng tính thỏa đáng khách quan của kết quả nghiên cứu.",
         hanja="妥當性 [thỏa đương tính]")
add_word("모순", "Mâu thuẫn", "Danh từ", "[mo-sun]", 5, "Tư duy & Biện chứng",
         "그의 이론은 전제와 결론 사이에 명백한 모순이 존재한다.", "Lý thuyết của ông ấy tồn tại mâu thuẫn rõ rệt giữa tiền đề và kết luận.",
         hanja="矛盾 [mâu thuẫn]")
add_word("유발하다", "Dẫn đến, làm phát sinh, gây ra", "Động từ", "[yu-bal-ha-da]", 5, "Cơ chế & Tác động",
         "만성 스트레스는 각종 성인병을 유발하는 주요 요인이다.", "Căng thẳng mãn tính là nguyên nhân chủ yếu dẫn đến các bệnh lý người lớn.",
         hanja="誘發하다 [dụ phát]")
add_word("구축하다", "Xây dựng, thiết lập (hệ thống, nền tảng)", "Động từ", "[gu-chu-ka-da]", 5, "Công nghệ & Quản trị",
         "빅데이터를 기반으로 스마트 물류 인프라를 신속히 구축했다.", "Đã nhanh chóng xây dựng cơ sở hạ tầng hậu cần thông minh dựa trên dữ liệu lớn.",
         hanja="構築하다 [cấu trúc]")
add_word("전망하다", "Dự báo, triển vọng tương lai", "Động từ", "[jeon-mang-ha-da]", 5, "Kinh tế & Xu hướng",
         "전문가들은 내년 세계 경제 성장률이 둔화될 것으로 전망한다.", "Các chuyên gia dự báo tốc độ tăng trưởng kinh tế toàn cầu năm tới sẽ chững lại.",
         hanja="展望하다 [triển vọng]")
add_word("간과하다", "Xem nhẹ, bỏ qua, lơ là", "Động từ", "[gan-gwa-ha-da]", 5, "Phê bình & Tư duy",
         "사소해 보이는 세부 사항이라도 결코 간과해서는 안 된다.", "Dù là chi tiết nhỏ nhặt có vẻ tầm thường cũng tuyệt đối không được xem nhẹ bỏ qua.",
         hanja="看過하다 [khán quá]")
add_word("침체되다", "Bị đình trệ, suy thoái", "Động từ", "[chim-che-doe-da]", 5, "Kinh tế & Xã hội",
         "장기 경기 침체로 인해 자영업자들의 시름이 깊어지고 있다.", "Do suy thoái kinh tế kéo dài, nỗi lo âu của các hộ kinh doanh tự do ngày càng chồng chất.",
         hanja="沈滯되다 [trầm trệ]")
add_word("도모하다", "Mưu cầu, thúc đẩy đạt được", "Động từ", "[do-mo-ha-da]", 5, "Chính sách & Mục tiêu",
         "국가 간 교류를 활성화하여 상호 공동 번영을 도모해야 한다.", "Cần đẩy mạnh giao lưu giữa các quốc gia để cùng nhau mưu cầu sự phồn vinh chung.",
         hanja="圖謀하다 [đồ mưu]")
add_word("수반하다", "Kèm theo, kéo theo", "Động từ", "[su-ban-ha-da]", 5, "Quy luật & Tác động",
         "급격한 사회 변혁은 필연적으로 혼란과 갈등을 수반한다.", "Biến động xã hội đột ngột tất yếu sẽ kéo theo sự hỗn loạn và mâu thuẫn.",
         hanja="隨伴하다 [tùy bạn]")
add_word("고령화", "Già hóa dân số", "Danh từ", "[go-ryeong-hwa]", 5, "Dân số & Xã hội",
         "한국은 세계에서 가장 빠른 속도로 초고령화 사회에 진입했다.", "Hàn Quốc đã bước vào xã hội siêu già hóa với tốc độ nhanh nhất thế giới.",
         hanja="高齡化 [cao linh hóa]")
add_word("창의성", "Tính sáng tạo", "Danh từ", "[chang-ui-seong]", 5, "Tư duy & Đổi mới",
         "미래 인재에게 가장 요구되는 핵심 역량은 비판적 사고와 창의성이다.", "Năng lực cốt lõi được đòi hỏi nhất ở nhân tài tương lai là tư duy phản biện và tính sáng tạo.",
         hanja="創意性 [sáng ý tính]")
add_word("상관관계", "Mối quan hệ tương quan", "Danh từ", "[sang-gwan-gwan-gye]", 5, "Thống kê & Học thuật",
         "학업 성취도와 독서량 사이에는 밀접한 상관관계가 입증되었다.", "Đã chứng minh được mối tương quan mật thiết giữa thành tích học tập và lượng sách đọc.",
         hanja="相關關係 [tương quan quan hệ]")
add_word("배제하다", "Loại trừ, bài xích", "Động từ", "[bae-je-ha-da]", 5, "Biện luận & Pháp lý",
         "편견과 선입견을 철저히 배제하고 객관적인 증거만을 토대로 판단하라.", "Hãy loại trừ hoàn toàn định kiến và thiên vị, chỉ phán đoán dựa trên chứng cứ khách quan.",
         hanja="排除하다 [bài trừ]")
add_word("자율성", "Tính tự chủ, quyền tự quyết", "Danh từ", "[ja-yul-seong]", 5, "Quản trị & Tâm lý",
         "직원들에게 업무 자율성을 부여할 때 업무 몰입도가 극대화된다.", "Khi trao quyền tự chủ trong công việc cho nhân viên, mức độ tập trung sẽ được tối đa hóa.",
         hanja="自律性 [tự luật tính]")
add_word("근절하다", "Diệt tận gốc, bài trừ triệt để", "Động từ", "[geun-jeol-ha-da]", 5, "Pháp luật & Xã hội",
         "학교 폭력을 근절하기 위해 학교와 지역사회가 함께 나서야 한다.", "Để bài trừ triệt để bạo lực học đường, nhà trường và cộng đồng cần cùng chung tay.",
         hanja="根絕하다 [căn tuyệt]")

# ==============================================================================
# TOPIK 6 (Cao cấp 6 - Thành ngữ Tứ tự 사자성어, Quán dụng ngữ, Văn bản ngoại giao, Triết học)
# ==============================================================================
add_word("일석이조", "Một mũi tên trúng hai đích (nhất cử lưỡng tiện)", "Thành ngữ", "[il-sseo-gi-jo]", 6, "Thành ngữ Tứ tự (사자성어)",
         "한국어를 배우며 친구도 사귀었으니 그야말로 일석이조다.", "Vừa học tiếng Hàn vừa kết bạn, đúng là một công đôi việc.",
         hanja="一石二鳥 [nhất thạch nhị điểu]", synonyms=["일거양득 (一擧兩得)"])
add_word("고진감래", "Khổ tận cam lai (hết khổ đến sướng, qua cơn bĩ cực đến hồi thái lai)", "Thành ngữ", "[go-jin-gam-rae]", 6, "Thành ngữ Tứ tự (사자성어)",
         "힘든 수험 생활을 견뎌내고 명문대에 합격했으니 고진감래라 하겠다.", "Vượt qua những ngày tháng ôn thi gian khổ để đỗ đại học danh tiếng, đúng là khổ tận cam lai.",
         hanja="苦盡甘來 [khổ tận cam lai]")
add_word("역지사지", "Đặt mình vào vị trí của người khác để suy nghĩ (dịch địa tư chi)", "Thành ngữ", "[yeok-ji-sa-ji]", 6, "Thành ngữ Tứ tự (사자성어)",
         "갈등을 빚을 때는 역지사지의 자세로 상대의 처지를 헤아려야 한다.", "Khi xảy ra mâu thuẫn, cần có thái độ đặt mình vào vị trí của người khác để thấu hiểu.",
         hanja="易地思之 [dịch địa tư chi]")
add_word("작심삼일", "Nhiệt huyết ba ngày (chỉ kiên trì được 3 ngày rồi bỏ cuộc)", "Thành ngữ", "[jak-ssim-sam-il]", 6, "Thành ngữ Tứ tự (사자성어)",
         "새해 결심이 작심삼일로 끝나지 않도록 철저한 계획을 세웠다.", "Tôi đã lập kế hoạch kỹ lưỡng để quyết tâm đầu năm không bị dở dang sau ba ngày.",
         hanja="作心三日 [tác tâm tam nhật]")
add_word("전화위복", "Chuyển họa thành phúc (trong cái rủi có cái may)", "Thành ngữ", "[jeon-hwa-wi-bok]", 6, "Thành ngữ Tứ tự (사자성어)",
         "위기를 기회로 바꾸어 전화위복의 계기로 삼았습니다.", "Biến khủng hoảng thành cơ hội để làm đòn bẩy chuyển họa thành phúc.",
         hanja="轉禍爲福 [chuyển họa vi phúc]")
add_word("과유불급", "Thái quá bất cập (cái gì quá mức cũng dở như không đủ)", "Thành ngữ", "[gwa-yu-bul-geup]", 6, "Thành ngữ Tứ tự (사자성어)",
         "건강식품도 지나치게 섭취하면 오히려 해가 되니 과유불급이다.", "Thực phẩm chức năng nếu uống quá liều cũng phản tác dụng, đúng là thái quá bất cập.",
         hanja="過猶不及 [quá do bất cập]")
add_word("동병상련", "Đồng bệnh tương lân (những người cùng cảnh ngộ dễ thấu cảm cho nhau)", "Thành ngữ", "[dong-byeong-sang-nyeon]", 6, "Thành ngữ Tứ tự (사자성어)",
         "타국에서 고생하는 유학생들끼리 동병상련의 정을 느꼈다.", "Những du học sinh vất vả nơi đất khách quê người đồng cảm sâu sắc với nhau vì cùng cảnh ngộ.",
         hanja="同病相憐 [đồng bệnh tương lân]")
add_word("발 벗고 나서다", "Nhiệt tình xắn tay áo vào giúp (quán dụng ngữ)", "Thành ngữ", "[bal beot-go na-seo-da]", 6, "Quán dụng ngữ (관용구)",
         "이웃의 안타까운 소식을 듣고 온 동네 사람들이 발 벗고 나섰다.", "Nghe tin buồn của người hàng xóm, cả khu phố đã nhiệt tình xắn tay áo vào giúp đỡ.")
add_word("귀를 기울이다", "Lắng tai nghe, chăm chú lắng nghe tâm tư (quán dụng ngữ)", "Thành ngữ", "[gwi-reul gi-u-ri-da]", 6, "Quán dụng ngữ (관용구)",
         "지도자는 국민의 작은 목소리에도 겸허히 귀를 기울여야 한다.", "Người lãnh đạo cần phải khiêm tốn lắng nghe cả những tâm tư nguyện vọng nhỏ nhất của nhân dân.")
add_word("손을 떼다", "Rút tay ra, ngừng can thiệp (quán dụng ngữ)", "Thành ngữ", "[so-neul tte-da]", 6, "Quán dụng ngữ (관용구)",
         "수익성이 악화되자 경영진은 그 사업에서 손을 떼기로 결정했다.", "Khi lợi nhuận sụt giảm, ban giám đốc đã quyết định rút lui hoàn toàn khỏi dự án kinh doanh đó.")
add_word("눈길을 끌다", "Thu hút ánh nhìn, thu hút sự chú ý (quán dụng ngữ)", "Thành ngữ", "[nun-gi-reul kkeul-da]", 6, "Quán dụng ngữ (관용구)",
         "독창적인 디자인을 선보인 한국 신진 디자이너의 작품이 전 세계의 눈길을 끌었다.", "Tác phẩm với thiết kế độc đáo của nhà thiết kế trẻ Hàn Quốc đã thu hút sự chú ý của toàn thế giới.")
add_word("천명하다", "Tuyên bố rành mạch trước bàn dân thiên hạ", "Động từ", "[cheon-myeong-ha-da]", 6, "Chính trị & Ngoại giao",
         "정부는 영토 주권을 수호하겠다는 단호한 의지를 대내외에 천명했다.", "Chính phủ tuyên bố rành mạch trước quốc dân và thế giới ý chí đanh thép bảo vệ chủ quyền lãnh thổ.",
         hanja="闡明하다 [xiển minh]")
add_word("상정하다", "Đưa ra làm giả thuyết / Đệ trình nghị trình thảo luận", "Động từ", "[sang-jeong-ha-da]", 6, "Học thuật & Pháp lý",
         "최악의 안보 위기 시나리오를 상정하여 비상 대책 훈련을 실시했다.", "Đã đặt ra kịch bản khủng hoảng an ninh xấu nhất để tổ chức diễn tập biện pháp ứng phó khẩn cấp.",
         hanja="想定하다 [tưởng định]")
add_word("통찰력", "Nhãn quan sâu sắc, khả năng nhìn thấu bản chất vấn đề", "Danh từ", "[tong-chal-lyeok]", 6, "Triết học & Lãnh đạo",
         "역사적 흐름을 꿰뚫어 보는 탁월한 통찰력이 요구되는 시대다.", "Đây là thời đại đòi hỏi nhãn quan sâu sắc xuất chúng thấu suốt dòng chảy của lịch sử.",
         hanja="洞察力 [đỗng sát lực]")
add_word("초월하다", "Vượt lên trên mọi giới hạn, siêu việt", "Động từ", "[cho-wol-ha-da]", 6, "Triết học & Tư tưởng",
         "음악은 국경과 인종을 초월하여 전 인류의 마음을 하나로 잇는다.", "Âm nhạc vượt qua mọi biên giới và sắc tộc để kết nối trái tim toàn thể nhân loại.",
         hanja="超越하다 [siêu việt]")
add_word("궤변", "Ngụy biện, lý lẽ quanh co bóp méo chân lý", "Danh từ", "[gwe-byeon]", 6, "Triết học & Tranh luận",
         "자신의 과오를 정당화하기 위해 늘어놓는 말은 구차한 궤변에 불과하다.", "Những lời biện minh để lấp liếm lỗi lầm của bản thân chẳng qua chỉ là ngụy biện vụng về.",
         hanja="詭辯 [quỷ biện]")
add_word("묵과하다", "Nhắm mắt làm ngơ, dung túng không xử lý", "Động từ", "[muk-gwa-ha-da]", 6, "Pháp lý & Đạo đức",
         "인권을 심각하게 침해하는 행위를 더 이상 묵과할 수 없다.", "Tuyệt đối không thể tiếp tục nhắm mắt làm ngơ trước những hành vi xâm phạm nhân quyền nghiêm trọng.",
         hanja="默過하다 [mặc quá]")
add_word("패러다임", "Hình mẫu tư duy, hệ hình tư tưởng (paradigm)", "Danh từ", "[pae-reo-da-im]", 6, "Khoa học & Triết học",
         "디지털 대전환은 교육과 산업 전반의 패러다임을 근본적으로 바꾸었다.", "Cuộc chuyển đổi số lớn đã thay đổi căn bản hình mẫu tư duy trong toàn bộ giáo dục và công nghiệp.")
add_word("희열", "Niềm hân hoan tột đỉnh, sung sướng ngập tràn", "Danh từ", "[hui-yeol]", 6, "Tâm lý học đỉnh cao",
         "오랜 연구 끝에 새로운 원리를 발견했을 때 학자가 느끼는 희열은 형언할 수 없다.", "Khi phát hiện ra nguyên lý mới sau nhiều năm nghiên cứu, niềm hân hoan của nhà khoa học không lời nào tả xiết.",
         hanja="喜悅 [hỷ duyệt]")
add_word("일도양단", "Chặt đứt dứt khoát làm hai đoạn (hành động quyết đoán, dứt điểm)", "Thành ngữ", "[il-do-yang-dan]", 6, "Thành ngữ Tứ tự (사자성어)",
         "복잡하게 얽힌 부패의 사슬을 일도양단하는 과감한 개혁 조치가 단행되었다.", "Biện pháp cải cách quả cảm đã được ban hành để chặt đứt dứt khoát mắt xích tham nhũng phức tạp.",
         hanja="一刀兩斷 [nhất đao lưỡng đoạn]")

print(f"Generated {len(vocab_data)} high quality words across all 6 TOPIK levels.")

with open('src/data/generated_vocab.json', 'w', encoding='utf-8') as f:
    json.dump(vocab_data, f, ensure_ascii=False, indent=2)
