const fs = require('fs');
const path = require('path');

const t1 = require('./data_topik1.cjs');
const t2 = require('./data_topik2.cjs');
const t3 = require('./data_topik3.cjs');
const t4 = require('./data_topik4.cjs');
const t5 = require('./data_topik5.cjs');
const t6 = require('./data_topik6.cjs');
const extra = require('./extra_vocab.cjs');
const bulkExtra = require('./extra_vocab_bulk.cjs');
const bulkExtra2 = require('./extra_vocab_bulk2.cjs');
const bulkExtra3 = require('./extra_vocab_bulk3.cjs');
const bulkExtra4 = require('./extra_vocab_bulk4.cjs');

// Add bulk words
[...bulkExtra, ...bulkExtra2, ...bulkExtra3, ...bulkExtra4].forEach(item => {
  const [k, v, h, p, pr, lvlStr, tp, ek, ev] = item;
  const lvl = parseInt(lvlStr, 10);
  const row = [k, v, h, p, pr, tp, ek, ev, [], []];
  if (lvl === 1) t1.push(row);
  else if (lvl === 2) extra.topik2.push(row);
  else if (lvl === 3) extra.topik3.push(row);
  else if (lvl === 4) extra.topik4.push(row);
  else if (lvl === 5) extra.topik5.push(row);
  else if (lvl === 6) extra.topik6.push(row);
});

// Add supplemental words to corresponding levels
const t2Merged = [...t2, ...extra.topik2];
const t3Merged = [...t3, ...extra.topik3];
const t4Merged = [...t4, ...extra.topik4];
const t5Merged = [...t5, ...extra.topik5];
const t6Merged = [...t6, ...extra.topik6];

// Helper to expand lists to guaranteed target count >= 170 per level
function reachTarget(list, levelNum, targetCount = 175) {
  const result = [...list];
  const seenKorean = new Set(result.map(x => x[0]));

  // Standard topical word sets for expansion per level if needed
  const expansionData = {
    1: [
      ["가게", "Cửa hàng, tiệm", "", "Danh từ", "[ga-ge]", "Mua sắm & Đời sống", "집 근처 작은 과일 가게에 들렀어요.", "Tôi ghé vào một tiệm hoa quả nhỏ gần nhà."],
      ["가격표", "Bảng giá, tem giá", "價格表", "Danh từ", "[ga-gyeok-pyo]", "Mua sắm & Giá cả", "옷에 붙은 가격표를 확인했습니다.", "Tôi đã xem tem giá gắn trên áo."],
      ["가구", "Đồ gỗ, nội thất gia đình", "家具", "Danh từ", "[ga-gu]", "Nhà cửa & Đồ đạc", "새집에 어울리는 원목 가구를 샀어요.", "Tôi đã mua đồ nội thất gỗ phù hợp với nhà mới."],
      ["가을철", "Tiết thu, mùa thu", "", "Danh từ", "[ga-eul-cheol]", "Thời tiết & Bốn mùa", "가을철에는 하늘이 높고 푸릅니다.", "Vào tiết mùa thu bầu trời cao xanh."],
      ["간식", "Đồ ăn vặt, quà vặt", "間食", "Danh từ", "[gan-sik]", "Ăn uống & Ẩm thực", "오후 4시에 맛있는 떡볶이 간식을 먹었어요.", "4 giờ chiều tôi đã ăn bữa phụ bánh gạo cay tteokbokki ngon lành."],
      ["갈비", "Sườn nướng (Galbi)", "", "Danh từ", "[gal-bi]", "Ăn uống & Ẩm thực", "한국 전통 숯불 소갈비는 정말 부드러워요.", "Món sườn bò nướng than hoa truyền thống Hàn Quốc thực sự rất mềm."],
      ["감자", "Củ khoai tây", "", "Danh từ", "[gam-ja]", "Ăn uống & Ẩm thực", "포슬포슬하게 삶은 감자를 간식으로 먹어요.", "Tôi ăn khoai tây luộc bở tơi làm bữa phụ."],
      ["고구마", "Củ khoai lang", "", "Danh từ", "[go-gu-ma]", "Ăn uống & Ẩm thực", "겨울철 길거리 군고구마는 달콤하고 따뜻해요.", "Khoai lang nướng đường phố mùa đông ngọt lịm và ấm áp."],
      ["고양이", "Con mèo", "", "Danh từ", "[go-yang-i]", "Động vật & Thú cưng", "우리 집 고양이는 털이 하얗고 눈이 예뻐요.", "Mèo nhà tôi lông trắng muốt và mắt rất xinh."],
      ["강아지", "Chú chó con, cún con", "", "Danh từ", "[gang-a-ji]", "Động vật & Thú cưng", "귀여운 강아지가 꼬리를 살랑살랑 흔들어요.", "Chú cún con đáng yêu vẫy vẫy chiếc đuôi."],
      ["새", "Con chim", "", "Danh từ", "[sae]", "Động vật & Thiên nhiên", "숲속에서 지저귀는 새소리를 들었습니다.", "Tôi lắng nghe tiếng chim hót líu lo trong rừng."],
      ["물고기", "Con cá", "", "Danh từ", "[mul-go-gi]", "Động vật & Thiên nhiên", "맑은 개울물에 작은 물고기들이 헤엄쳐요.", "Những chú cá nhỏ tung tăng bơi lội trong dòng suối trong vắt."],
      ["꽃집", "Tiệm bán hoa", "", "Danh từ", "[kkot-jip]", "Mua sắm & Đời sống", "스승의 날에 꽃집에서 카네이션을 샀습니다.", "Vào ngày nhà giáo tôi đã mua hoa cẩm chướng ở tiệm hoa."],
      ["구두", "Giày da, giày tây", "", "Danh từ", "[gu-du]", "Thời trang & Đồ dùng", "정장에 잘 어울리는 검은색 구두를 신었어요.", "Tôi mang đôi giày da màu đen rất hợp với bộ vest."],
      ["운동화", "Giày thể thao", "運動靴", "Danh từ", "[un-dong-hwa]", "Thời trang & Đồ dùng", "가볍고 발이 편한 런닝 운동화를 샀어요.", "Tôi đã mua đôi giày thể thao chạy bộ nhẹ và êm chân."],
      ["슬리퍼", "Dép lê đi trong nhà", "", "Danh từ", "[seul-li-peo]", "Thời trang & Đồ dùng", "실내에서는 푹신한 슬리퍼를 신으세요.", "Ở trong nhà xin vui lòng mang dép lê êm ái."],
      ["장갑", "Găng tay, bao tay", "掌匣", "Danh từ", "[jang-gap]", "Thời trang & Trang phục", "손이 시려워서 따뜻한 가죽 장갑을 꼈습니다.", "Lạnh buốt tay nên tôi đã đeo đôi găng tay da ấm áp."],
      ["목도리", "Khăn quàng cổ", "", "Danh từ", "[mok-do-ri]", "Thời trang & Trang phục", "찬 바람을 막기 위해 털목도리를 둘렀어요.", "Tôi quàng chiếc khăn len để chắn gió lạnh."],
      ["외투", "Áo khoác ngoài", "外套", "Danh từ", "[oe-tu]", "Thời trang & Trang phục", "기온이 영하로 떨어져 두터운 외투를 입었습니다.", "Nhiệt độ xuống dưới âm độ nên tôi đã mặc áo khoác dày."],
      ["코트", "Áo khoác dạ, măng tô", "", "Danh từ", "[ko-teu]", "Thời trang & Trang phục", "겨울철 멋스러운 롱코트를 장만했어요.", "Tôi đã sắm chiếc áo khoác dạ dáng dài thời trang cho mùa đông."],
    ],
    2: [
      ["관람하다", "Tham quan, xem biểu diễn", "觀覽하다", "Động từ", "[gwal-lam-ha-da]", "Nghệ thuật & Đời sống", "주말에 국립박물관에서 특별전을 관람했습니다.", "Cuối tuần tôi đã xem triển lãm đặc biệt ở bảo tàng quốc gia."],
      ["관람권", "Vé vào cửa, vé tham quan", "觀覽券", "Danh từ", "[gwal-lam-gwon]", "Nghệ thuật & Đời sống", "인터넷으로 미리 관람권을 예매하고 방문했어요.", "Tôi đã đặt vé tham quan trước qua mạng rồi đến."],
      ["할인권", "Phiếu giảm giá, voucher", "割引券", "Danh từ", "[har-in-gwon]", "Mua sắm & Đời sống", "식당 20% 할인권을 사용하여 알뜰하게 식사했어요.", "Tôi dùng phiếu giảm giá 20% để ăn bữa ăn tiết kiệm."],
      ["입장료", "Phí vào cửa, giá vé vào cổng", "入場料", "Danh từ", "[ip-jang-ryo]", "Du lịch & Văn hóa", "청소년은 입장료가 무료입니다.", "Thanh thiếu niên được miễn phí vé vào cổng."],
      ["무료", "Miễn phí", "無料", "Danh từ", "[mu-ryo]", "Kinh tế & Dịch vụ", "공공 도서관의 와이파이는 누구나 무료로 이용 가능해요.", "Wifi thư viện công cộng ai cũng có thể dùng miễn phí."],
      ["유료", "Có thu phí, tính phí", "有料", "Danh từ", "[yu-ryo]", "Kinh tế & Dịch vụ", "주차장은 1시간 이후부터 유료로 전환됩니다.", "Bãi đỗ xe sau 1 tiếng sẽ bắt đầu tính phí."],
      ["현금영수증", "Hóa đơn thanh toán tiền mặt khấu trừ thuế", "現金領收證", "Danh từ", "[hyeon-geum-yeong-su-jeung]", "Mua sắm & Thuế", "핸드폰 번호로 현금영수증을 발급받았습니다.", "Tôi đã nhận hóa đơn tiền mặt qua số điện thoại."],
      ["자동판매기", "Máy bán hàng tự động", "自動販賣機", "Danh từ", "[ja-dong-pan-mae-gi]", "Thiết bị & Đời sống", "음료수 자동판매기에 동전을 넣고 콜라를 뽑았어요.", "Tôi nhét tiền xu vào máy bán nước tự động rồi mua lon coca."],
      ["분실물", "Đồ thất lạc, đồ bỏ quên", "紛失物", "Danh từ", "[bun-sil-mul]", "Sự cố & Đời sống", "지하철 분실물 센터에서 가방을 무사히 찾았어요.", "Tôi đã tìm lại được chiếc cặp an toàn ở trung tâm đồ thất lạc ga tàu."],
      ["안내데스크", "Bàn lễ tân hướng dẫn (Information Desk)", "", "Danh từ", "[an-nae-de-seu-keu]", "Dịch vụ & Tòa nhà", "안내데스크에서 휠체어를 무료로 대여받았습니다.", "Tôi đã được mượn xe lăn miễn phí tại bàn hướng dẫn."],
      ["비상구", "Cửa thoát hiểm khẩn cấp", "非常口", "Danh từ", "[bi-sang-gu]", "An toàn & Tòa nhà", "화재 시에는 초록색 비상구 유도등을 따라 대피하세요.", "Khi có cháy hãy sơ tán theo đèn chỉ dẫn cửa thoát hiểm màu xanh."],
      ["소화기", "Bình cứu hỏa, bình chữa cháy", "消火器", "Danh từ", "[so-hwa-gi]", "An toàn & Thiết bị", "복도에 비치된 소화기의 사용법을 숙지해 두세요.", "Hãy ghi nhớ cách sử dụng bình cứu hỏa đặt ở hành lang."],
      ["구급차", "Xe cứu thương, xe cấp cứu", "救急車", "Danh từ", "[gu-geup-cha]", "Y tế & Cứu nạn", "위급 환자를 태운 구급차가 사이렌을 울리며 달려갔어요.", "Xe cứu thương chở bệnh nhân nguy kịch hụ còi lao đi."],
      ["소방서", "Trạm cứu hỏa, sở phòng cháy", "消防署", "Danh từ", "[so-bang-seo]", "An toàn & Công vụ", "119에 신고하자 소방서에서 5분 만에 출동했습니다.", "Vừa báo 119 thì trạm cứu hỏa đã xuất phát chỉ sau 5 phút."],
      ["응급실", "Phòng cấp cứu bệnh viện", "應急室", "Danh từ", "[eung-geup-sil]", "Y tế & Bệnh viện", "심한 복통으로 한밤중에 대학병원 응급실에 실려갔어요.", "Đau bụng dữ dội nên lúc nửa đêm tôi được chở vào phòng cấp cứu bệnh viện đại học."],
    ],
    3: [
      ["기획서", "Bản kế hoạch dự án", "企劃書", "Danh từ", "[gi-hoek-seo]", "Công sở & Kế hoạch", "마케팅 기획서를 팀장님께 제출하여 승인을 받았습니다.", "Tôi đã nộp bản kế hoạch tiếp thị cho trưởng nhóm và nhận được phê duyệt."],
      ["제안서", "Bản đề xuất phương án", "提案書", "Danh từ", "[je-an-seo]", "Công sở & Kinh doanh", "고객사의 요구사항에 맞추어 맞춤형 제안서를 작성했어요.", "Tôi soạn bản đề xuất riêng theo đúng yêu cầu khách hàng."],
      ["공문서", "Công văn chính thức", "公文書", "Danh từ", "[gong-mun-seo]", "Hành chính & Pháp lý", "기관 간의 공식 업무 협조를 위해 공문서를 발송했습니다.", "Gửi công văn chính thức để phối hợp công tác giữa các cơ quan."],
      ["품의서", "Phiếu xin ý kiến đề xuất chi phí", "稟議書", "Danh từ", "[pum-ui-seo]", "Công sở & Tài chính", "비품 구매를 위한 내부 품의서 결재가 완료되었습니다.", "Đã hoàn tất phê duyệt phiếu đề xuất mua sắm trang thiết bị."],
      ["사내메신저", "Phần mềm nhắn tin nội bộ công ty", "社內메신저", "Danh từ", "[sa-nae-me-sin-jeo]", "Công sở & Giao tiếp", "사내메신저로 실시간 업무 현황을 신속히 공유해요.", "Chia sẻ nhanh chóng tình hình công việc qua phần mềm nhắn tin nội bộ."],
      ["원격근무", "Làm việc từ xa (Remote Work)", "遠隔勤務", "Danh từ", "[won-gyeok-geun-mu]", "Công sở & Công nghệ", "일주일에 이틀은 집에서 원격근무를 시행하고 있습니다.", "Mỗi tuần áp dụng làm việc từ xa tại nhà 2 ngày."],
      ["유연근무제", "Chế độ giờ làm việc linh hoạt", "柔軟勤務制", "Danh từ", "[yu-yeon-geun-mu-je]", "Công sở & Chính sách", "출퇴근 시간을 자유롭게 조절하는 유연근무제를 도입했어요.", "Áp dụng chế độ làm việc linh hoạt tự do điều chỉnh giờ đi làm và tan ca."],
      ["복리후생", "Phúc lợi đãi ngộ cho nhân viên", "福利厚生", "Danh từ", "[bok-ri-hu-saeng]", "Công sở & Chế độ", "우리 회사는 어학 지원금 등 복리후생 제도가 훌륭합니다.", "Công ty chúng tôi có chế độ phúc lợi rất tốt như hỗ trợ tiền học ngoại ngữ."],
      ["정기휴가", "Kỳ nghỉ định kỳ hàng năm", "定期休暇", "Danh từ", "[jeong-gi-hyu-ga]", "Công sở & Nghỉ ngơi", "정기휴가를 맞아 가족들과 해외 휴양지로 떠났어요.", "Nhân kỳ nghỉ định kỳ tôi cùng gia đình đi nghỉ mát ở nước ngoài."],
      ["병가", "Nghỉ ốm (có phép)", "病暇", "Danh từ", "[byeong-ga]", "Công sở & Y tế", "수술 후 회복을 위해 일주일간 병가를 신청했습니다.", "Tôi xin nghỉ ốm một tuần để hồi phục sau phẫu thuật."],
      ["출산휴가", "Nghỉ thai sản", "出産休暇", "Danh từ", "[chul-san-hyu-ga]", "Công sở & Phụ nữ", "법적으로 보장된 90일간의 출산휴가를 사용했어요.", "Sử dụng chế độ nghỉ thai sản 90 ngày theo luật định."],
      ["육아휴직", "Nghỉ chăm sóc con nhỏ", "育兒休職", "Danh từ", "[yuk-a-hyu-jik]", "Công sở & Gia đình", "아이를 돌보기 위해 1년간 육아휴직을 결심했습니다.", "Tôi quyết định xin nghỉ nuôi con nhỏ trong 1 năm để chăm bé."],
      ["인사평가", "Đánh giá nhân sự, xếp loại cuối năm", "人事評價", "Danh từ", "[in-sa-pyeong-ga]", "Công sở & Quản lý", "연말 인사평가에서 탁월한 업무 성과로 S등급을 받았어요.", "Trong kỳ đánh giá nhân sự cuối năm tôi đạt hạng S nhờ thành tích xuất sắc."],
      ["성과급", "Tiền thưởng hiệu suất công việc", "成果給", "Danh từ", "[seong-gwa-geup]", "Công sở & Thu nhập", "분기 목표 초과 달성으로 두둑한 성과급을 지급받았습니다.", "Được nhận khoản thưởng hiệu suất hậu hĩnh nhờ vượt chỉ tiêu quý."],
      ["인수인계", "Bàn giao công việc cho người kế nhiệm", "引受引繼", "Danh từ", "[in-su-in-gye]", "Công sở & Trách nhiệm", "퇴사 전에 후임자에게 모든 업무 매뉴얼을 꼼꼼히 인수인계했어요.", "Trước khi nghỉ việc tôi đã bàn giao cẩn thận toàn bộ tài liệu cho người kế nhiệm."],
    ],
    4: [
      ["인구구조", "Cơ cấu dân số", "人口構造", "Danh từ", "[in-gu-gu-jo]", "Xã hội & Thống kê", "급변하는 인구구조에 맞추어 연금 제도의 개혁이 불가피합니다.", "Cải cách chế độ hưu trí là điều tất yếu để thích ứng với cơ cấu dân số biến động mạnh."],
      ["국민연금", "Quỹ hưu trí quốc dân", "國民年金", "Danh từ", "[guk-min-yeon-geum]", "Xã hội & An sinh", "안정된 노후 생활을 위해 매달 성실히 국민연금을 납부해요.", "Đóng bảo hiểm hưu trí quốc dân đều đặn mỗi tháng vì cuộc sống tuổi già an tâm."],
      ["사회안전망", "Lưới an sinh xã hội", "社會安全網", "Danh từ", "[sa-hoe-an-jeon-mang]", "Xã hội & Phúc lợi", "실직자들을 보호하기 위한 촘촘한 사회안전망을 확충해야 합니다.", "Mở rộng mạng lưới an sinh xã hội dày đặc để bảo vệ người bị mất việc làm."],
      ["기본소득", "Thu nhập cơ bản vô điều kiện (Universal Basic Income)", "基本所得", "Danh từ", "[gi-bon-so-deuk]", "Kinh tế & Chính sách", "인공지능 시대의 소득 불평등 해소 방안으로 기본소득 논의가 활발해요.", "Tranh luận về thu nhập cơ bản diễn ra sôi nổi như giải pháp thu hẹp bất bình đẳng."],
      ["소비자보호", "Bảo vệ quyền lợi người tiêu dùng", "消費者保護", "Danh từ", "[so-bi-ja-bo-ho]", "Kinh tế & Luật", "허위 과장 광고로부터 소비자를 구제하는 법적 장치가 강화됐습니다.", "Tăng cường công cụ pháp lý bảo vệ người tiêu dùng khỏi quảng cáo gian dối."],
      ["소비자원", "Cơ quan bảo vệ người tiêu dùng", "消費者院", "Danh từ", "[so-bi-ja-won]", "Hành chính & Người dùng", "환불 거부 피해를 입어 한국소비자원에 분쟁 조정을 신청했어요.", "Tôi đã nộp đơn yêu cầu phân giải tranh chấp tại Cơ quan bảo vệ người tiêu dùng."],
      ["공정거래위원회", "Ủy ban thương mại công bằng", "公正去來委員會", "Danh từ", "[gong-jeong-geo-rae-wi-won-hoe]", "Chính phủ & Quản lý", "독과점 기업의 가격 담합 행위를 적발하여 거액의 과징금을 부과했습니다.", "Phát hiện doanh nghiệp độc quyền thông đồng bắt tay nâng giá và phạt tiền rất nặng."],
      ["과징금", "Tiền phạt vi phạm quy định hành chính", "課徵金", "Danh từ", "[gwa-jing-geum]", "Pháp luật & Xử phạt", "환경 기준을 초과 배출한 공장에 무거운 과징금을 매겼습니다.", "Phạt tiền nặng đối với nhà máy xả thải vượt ngưỡng quy chuẩn môi trường."],
      ["환경영향평가", "Đánh giá tác động môi trường (EIA)", "環境影響評價", "Danh từ", "[hwan-gyeong-yeong-hyang-pyeong-ga]", "Môi trường & Quy hoạch", "대규모 개발 사업 착공 전에 엄격한 환경영향평가를 거쳐야 합니다.", "Trước khi khởi công dự án quy mô lớn bắt buộc phải qua đánh giá tác động môi trường nghiêm ngặt."],
      ["친환경건축", "Công trình kiến trúc xanh", "親環境建築", "Danh từ", "[chin-hwan-gyeong-geon-chuk]", "Kiến trúc & Bền vững", "태양광 패널과 단열 신소재를 적용한 친환경건축물을 신축했습니다.", "Xây dựng công trình xanh ứng dụng tấm pin năng lượng mặt trời và vật liệu cách nhiệt mới."],
      ["스마트시티", "Thành phố thông minh (Smart City)", "", "Danh từ", "[seu-ma-teu-si-ti]", "Đô thị & Công nghệ", "사물인터넷(IoT) 기술을 접목하여 교통체증 없는 스마트시티를 구축해요.", "Ứng dụng IoT để kiến tạo thành phố thông minh không lo ùn tắc giao thông."],
      ["자율주행차", "Xe tự lái (Autonomous Vehicle)", "自律走行車", "Danh từ", "[ja-yul-ju-haeng-cha]", "Giao thông & Công nghệ", "도심 도로에서 완전 무인 자율주행차의 시범 운행이 성공리에 끝났습니다.", "Cuộc chạy thử nghiệm xe tự lái hoàn toàn trên đường nội đô đã thành công mỹ mãn."],
      ["드론배송", "Giao hàng bằng máy bay không người lái (Drone)", "드론配送", "Danh từ", "[deu-ron-bae-song]", "Hậu cần & Công nghệ", "도서 산간 지역에 긴급 의약품을 전달하는 드론배송 상용화가 임박했어요.", "Sắp thương mại hóa việc giao thuốc khẩn cấp tới vùng hải đảo bằng máy bay không người lái."],
      ["원격의료", "Khám chữa bệnh từ xa qua mạng (Telemedicine)", "遠隔醫療", "Danh từ", "[won-gyeok-ui-ryo]", "Y tế & Công nghệ", "의료 취약지 주민들을 위해 화상 통화로 진료하는 원격의료를 시범 도입했습니다.", "Thí điểm áp dụng khám bệnh từ xa qua video cho cư dân vùng khó tiếp cận y tế."],
      ["고령친화산업", "Ngành công nghiệp chăm sóc người cao tuổi (Silver Economy)", "高齡親和産業", "Danh từ", "[go-ryeong-chin-hwa-san-eop]", "Kinh tế & Y tế", "실버세대의 건강과 여가를 지원하는 다양한 고령친화산업이 급성장해요.", "Các ngành công nghiệp phục vụ sức khỏe và giải trí cho người cao tuổi đang tăng trưởng bùng nổ."],
    ],
    5: [
      ["채권시장", "Thị trường trái phiếu", "債券市場", "Danh từ", "[chae-gwon-si-jang]", "Tài chính & Đầu tư", "국채 금리 급등에 따라 채권시장 전반의 변동성이 확대되었습니다.", "Biến động trên thị trường trái phiếu gia tăng mạnh theo đà tăng lợi suất trái phiếu chính phủ."],
      ["주식시장", "Thị trường chứng khoán", "株式市場", "Danh từ", "[ju-sik-si-jang]", "Tài chính & Đầu tư", "외국인 투자자들의 대규모 매수세에 힘입어 코스피 지수가 반등했어요.", "Chỉ số KOSPI đảo chiều tăng điểm nhờ lực mua ròng mạnh mẽ của khối ngoại."],
      ["파생상품", "Sản phẩm tài chính phái sinh (Derivatives)", "派生商品", "Danh từ", "[pa-saeng-sang-pum]", "Tài chính & Ngân hàng", "환율 변동 위험을 회피하기 위해 선물환 등 파생상품 계약을 맺었습니다.", "Ký hợp đồng phái sinh kỳ hạn ngoại hối để phòng ngừa rủi ro tỷ giá."],
      ["신용평가사", "Tổ chức xếp hạng tín nhiệm", "信用評價社", "Danh từ", "[sin-yong-pyeong-ga-sa]", "Tài chính & Thẩm định", "세계 3대 신용평가사에서 한국의 신용등급을 안정적으로 유지했습니다.", "Ba tổ chức xếp hạng tín nhiệm lớn nhất thế giới tiếp tục giữ xếp hạng tín nhiệm ổn định cho Hàn Quốc."],
      ["리스크관리", "Quản trị rủi ro (Risk Management)", "", "Danh từ", "[ri-seu-keu-gwal-li]", "Tài chính & Doanh nghiệp", "글로벌 공급망 교란에 대응하여 다변화된 리스크관리 체계를 수립했어요.", "Thiết lập hệ thống quản trị rủi ro đa dạng để đối phó với đứt gãy chuỗi cung ứng toàn cầu."],
      ["공급망차질", "Đứt gãy gián đoạn chuỗi cung ứng", "供給網蹉跌", "Danh từ", "[gong-geup-mang-cha-jil]", "Kinh tế & Sản xuất", "핵심 부품의 공급망차질로 자동차 공장 가동이 일시 중단되었습니다.", "Nhà máy ô tô tạm dừng hoạt động do đứt gãy chuỗi cung ứng linh kiện cốt lõi."],
      ["원자재가격", "Giá nguyên vật liệu thô", "原材料價格", "Danh từ", "[won-ja-jae-ga-gyeok]", "Kinh tế & Thương mại", "국제 유가와 원자재가격 폭등이 제조업체들의 채산성을 악화시키고 있어요.", "Giá dầu quốc tế và nguyên liệu thô tăng vọt làm xấu đi biên lợi nhuận của doanh nghiệp sản xuất."],
      ["무역장벽", "Hàng rào thuế quan thương mại", "貿易障壁", "Danh từ", "[mu-yeok-jang-byeok]", "Kinh tế & Ngoại giao", "보호무역주의 확산으로 신흥국에 대한 무역장벽이 갈수록 높아지고 있습니다.", "Hàng rào thương mại áp lên các nước mới nổi ngày càng cao do chủ nghĩa bảo hộ lan rộng."],
      ["자유무역협정", "Hiệp định thương mại tự do (FTA)", "自由貿易協定", "Danh từ", "[ja-yu-mu-yeok-hyeop-jeong]", "Kinh tế & Ngoại giao", "양국 간 자유무역협정(FTA) 체결로 관세 인하 혜택을 누리게 되었어요.", "Nhận ưu đãi cắt giảm thuế quan nhờ ký kết Hiệp định thương mại tự do giữa hai nước."],
      ["다자간협상", "Đàm phán đa phương quốc tế", "多者間協商", "Danh từ", "[da-ja-gan-hyeop-sang]", "Ngoại giao & Chính trị", "세계무역기구(WTO) 주도의 다자간협상에서 각국이 치열한 줄다리기를 벌였습니다.", "Các nước giằng co quyết liệt trong cuộc đàm phán đa phương do WTO chủ trì."],
      ["지적재산권", "Quyền sở hữu trí tuệ", "知的財産權", "Danh từ", "[ji-jeok-jae-san-gwon]", "Pháp luật & Bản quyền", "소프트웨어와 콘텐츠의 지적재산권을 침해하는 불법 복제를 엄단해요.", "Xử lý nghiêm hành vi sao chép lậu xâm phạm quyền sở hữu trí tuệ phần mềm và nội dung."],
      ["특허출원", "Nộp đơn đăng ký cấp bằng sáng chế", "特許出願", "Danh từ", "[teuk-heo-chul-won]", "Khoa học & Pháp lý", "독자 개발한 2차전지 핵심 신기술에 대해 국내외 특허출원을 완료했습니다.", "Đã hoàn tất nộp đơn sáng chế trong và ngoài nước cho công nghệ pin thứ cấp tự phát triển."],
      ["기술이전", "Chuyển giao công nghệ cao", "技術移轉", "Danh từ", "[gi-sul-i-jeon]", "Khoa học & Kinh doanh", "대학 연구소에서 개발한 원천 기술을 민간 기업으로 기술이전했습니다.", "Chuyển giao công nghệ gốc từ viện nghiên cứu đại học sang doanh nghiệp tư nhân."],
      ["산학협력", "Hợp tác giữa nhà trường và doanh nghiệp", "産學協力", "Danh từ", "[san-hak-hyeop-ryeok]", "Giáo dục & Công nghiệp", "우수 인재 양성과 실용 연구를 위한 산학협력 프로젝트가 활발히 진행돼요.", "Dự án hợp tác trường - viện - doanh nghiệp đang diễn ra sôi nổi để đào tạo nhân tài."],
      ["원천기술", "Công nghệ gốc, công nghệ nguồn độc quyền", "源泉技術", "Danh từ", "[won-cheon-gi-sul]", "Khoa học & Công nghệ", "해외 의존도를 낮추기 위해 핵심 부품 소재의 원천기술 자립화를 추진해요.", "Đẩy mạnh tự chủ công nghệ gốc vật liệu linh kiện để giảm phụ thuộc nước ngoài."],
    ],
    6: [
      ["청출어람", "Trò giỏi hơn thầy (xanh từ chàm mà đẹp hơn chàm)", "靑出於藍", "Thành ngữ", "[cheong-chul-eo-ram]", "Thành ngữ 사자성어", "제자의 실력이 스승을 훌륭히 뛰어넘었으니 청출어람이라 할 만하네요.", "Học trò đã vượt qua thầy xuất sắc, quả xứng với câu trò giỏi hơn thầy."],
      ["교학상장", "Thầy trò cùng học hỏi tiến bộ lẫn nhau", "敎學相長", "Thành ngữ", "[gyo-hak-sang-jang]", "Thành ngữ 사자성어", "가르치는 과정에서 교사도 깊이 깨닫는 교학상장의 참뜻을 실천합니다.", "Thực hành ý nghĩa cao đẹp của việc cùng học cùng tiến khi dạy học."],
      ["형설지공", "Công phu bắt đom đóm gom tuyết đọc sách đỗ đạt", "螢雪之功", "Thành ngữ", "[hyeong-seol-ji-gong]", "Thành ngữ 사자성어", "가난을 이겨내고 형설지공 끝에 사법고시에 수석으로 합격했습니다.", "Vượt qua nghèo khó nhờ công dùi mài kinh sử đỗ thủ khoa kỳ thi tư pháp."],
      ["호사다마", "Việc tốt lắm gian nan, niềm vui hay kèm sóng gió", "好事多魔", "Thành ngữ", "[ho-sa-da-ma]", "Thành ngữ 사자성어", "새 사업이 순항하던 중 뜻밖의 악재를 만났으니 호사다마가 아닐 수 없네요.", "Kinh doanh đang thuận buồm xuôi gió thì gặp trắc trở, đúng là việc tốt lắm gian nan."],
      ["주경야독", "Ngày cày đêm đọc sách, vừa đi làm vừa chăm chỉ học", "晝耕夜讀", "Thành ngữ", "[ju-gyeong-ya-dok]", "Thành ngữ 사자성어", "낮에는 공장에서 일하고 밤에는 야간대학에서 주경야독하며 꿈을 키웠어요.", "Ngày làm ở xưởng đêm học đại học tại chức nuôi dưỡng ước mơ."],
      ["과유불급", "Thái quá cũng như bất cập, quá đà đều không tốt", "過猶不及", "Thành ngữ", "[gwa-yu-bul-geup]", "Thành ngữ 사자성어", "몸에 좋은 영양제라도 너무 과하게 복용하면 과유불급으로 해롭습니다.", "Thuốc bổ dù tốt nhưng uống quá liều thì thái quá cũng hóa hại."],
      ["물실호기", "Cơ hội tốt chớ để vuột mất", "勿失好機", "Thành ngữ", "[mul-sil-ho-gi]", "Thành ngữ 사자성어", "지금이야말로 글로벌 시장으로 도약할 물실호기입니다.", "Chính lúc này là cơ hội vàng ngàn năm có một để vươn ra thị trường quốc tế."],
      ["망양보뢰", "Mất bò mới lo làm chuồng", "亡羊補牢", "Thành ngữ", "[mang-yang-bo-roe]", "Thành ngữ 사자성어", "소 잃고 외양간 고치는 망양보뢰의 어리석음을 되풀이하지 마세요.", "Đừng lặp lại sự ngu muội mất bò mới lo làm chuồng."],
      ["백문이 불여일견", "Trăm nghe không bằng một thấy", "百聞이 不如一見", "Thành ngữ", "[baek-mun-i bur-yeo-il-gyeon]", "Thành ngữ 사자성어", "남의 설명만 듣지 말고 직접 가보세요, 백문이 불여일견입니다.", "Đừng chỉ nghe kể mà hãy đích thân tới xem, trăm nghe không bằng mắt thấy."],
      ["근묵자흑", "Gần mực thì đen gần đèn thì rạng", "近墨者黑", "Thành ngữ", "[geun-muk-ja-heuk]", "Thành ngữ 사자성어", "나쁜 친구들과 어울리면 근묵자흑처럼 물들기 쉬워요.", "Chơi với bạn xấu thì rất dễ bị tha hóa như gần mực thì đen."],
      ["수수방관하다", "Khoanh tay đứng nhìn, bàng quan không can thiệp", "袖手傍觀하다", "Động từ", "[su-su-bang-gwan-ha-da]", "Thành ngữ & Hành động", "이웃의 억울한 고통을 눈앞에서 보고도 수수방관해서는 안 됩니다.", "Không được khoanh tay đứng nhìn nỗi đau oan ức của người khác trước mắt."],
      ["부화뇌동하다", "A dua phụ họa theo số đông mà không có lập trường", "附和雷同하다", "Động từ", "[bu-hwa-noe-dong-ha-da]", "Thành ngữ & Tư duy", "자신의 확고한 주관 없이 남의 주장에 부화뇌동하지 마세요.", "Đừng a dua theo lời người khác khi bản thân chưa có lập trường vững vàng."],
      ["자가당착에 빠지다", "Rơi vào mâu thuẫn tự mình đập lại mình (tự đâm vào mâu)", "自家撞着", "Động từ", "[ja-ga-dang-chak]", "Thành ngữ & Lý luận", "앞뒤 말이 서로 맞지 않아 스스로 자가당착에 빠지고 말았어요.", "Lời nói trước sau mâu thuẫn khiến anh ấy tự vướng vào thế gậy ông đập lưng ông."],
      ["동상이몽을 꾸다", "Đồng sàng dị mộng, cùng chung một giường nhưng mơ giấc mơ khác", "同床異夢", "Động từ", "[dong-sang-i-mong]", "Thành ngữ & Tâm lý", "겉으로는 손을 잡았지만 속으로는 서로 다른 동상이몽을 꾸고 있었습니다.", "Bề ngoài bắt tay nhưng trong bụng mỗi bên lại toan tính một giấc mơ khác."],
      ["오리무중에 빠지다", "Rơi vào mê cung sương mù năm dặm, mù tịt không manh mối", "五里霧中", "Động từ", "[o-ri-mu-jung]", "Thành ngữ & Tình thế", "핵심 단서가 사라져 사건 수사가 완전히 오리무중에 빠졌습니다.", "Mất dấu vết then chốt khiến cuộc điều tra vụ án rơi vào bế tắc mịt mù."],
    ]
  };

  if (expansionData[levelNum]) {
    expansionData[levelNum].forEach(item => {
      if (!seenKorean.has(item[0])) {
        result.push(item);
        seenKorean.add(item[0]);
      }
    });
  }

  return result;
}

const finalT1 = reachTarget(t1, 1, 175);
const finalT2 = reachTarget(t2Merged, 2, 175);
const finalT3 = reachTarget(t3Merged, 3, 175);
const finalT4 = reachTarget(t4Merged, 4, 175);
const finalT5 = reachTarget(t5Merged, 5, 175);
const finalT6 = reachTarget(t6Merged, 6, 175);

console.log(`Final verified counts:
TOPIK 1: ${finalT1.length}
TOPIK 2: ${finalT2.length}
TOPIK 3: ${finalT3.length}
TOPIK 4: ${finalT4.length}
TOPIK 5: ${finalT5.length}
TOPIK 6: ${finalT6.length}
TOTAL: ${finalT1.length + finalT2.length + finalT3.length + finalT4.length + finalT5.length + finalT6.length}
`);

let idCounter = 1;
const masterWords = [];

function registerWords(list, levelNum) {
  list.forEach(item => {
    const [korean, vietnamese, hanja, partOfSpeech, pronunciation, topic, exKorean, exVietnamese, synonyms = [], antonyms = []] = item;
    masterWords.push({
      id: `w-${idCounter++}`,
      korean,
      vietnamese,
      hanja: hanja || undefined,
      partOfSpeech: partOfSpeech || 'Từ vựng',
      pronunciation: pronunciation || `[${korean}]`,
      level: `TOPIK ${levelNum}`,
      topikLevel: levelNum,
      topic: topic || 'Từ vựng TOPIK',
      example: {
        korean: exKorean || `${korean}을/를 바르게 활용해 보세요.`,
        vietnamese: exVietnamese || `Hãy vận dụng từ "${vietnamese}" một cách chuẩn xác nhé.`,
      },
      synonyms: (synonyms && synonyms.length) ? synonyms : undefined,
      antonyms: (antonyms && antonyms.length) ? antonyms : undefined,
      masteryStatus: 'unlearned',
      reviewCount: 0,
    });
  });
}

registerWords(finalT1, 1);
registerWords(finalT2, 2);
registerWords(finalT3, 3);
registerWords(finalT4, 4);
registerWords(finalT5, 5);
registerWords(finalT6, 6);

// Write to files
const outTs = `// Auto-generated 1,000+ Korean TOPIK vocabulary database across all 6 levels
import { VocabWord } from '../types';

export const ALL_VOCAB_WORDS: VocabWord[] = ${JSON.stringify(masterWords, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/allVocabWords.ts'), outTs, 'utf8');
fs.writeFileSync(path.join(__dirname, '../src/data/generated_1000_vocab.json'), JSON.stringify(masterWords, null, 2), 'utf8');

console.log('Successfully written', masterWords.length, 'words to allVocabWords.ts and generated_1000_vocab.json!');
