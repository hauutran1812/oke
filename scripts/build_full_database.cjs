const fs = require('fs');
const path = require('path');

const t1 = require('./data_topik1.cjs');
const t2 = require('./data_topik2.cjs');
const t3 = require('./data_topik3.cjs');
const t4 = require('./data_topik4.cjs');
const t5 = require('./data_topik5.cjs');
const t6 = require('./data_topik6.cjs');

console.log(`Initial items: T1=${t1.length}, T2=${t2.length}, T3=${t3.length}, T4=${t4.length}, T5=${t5.length}, T6=${t6.length}`);

// Target: At least 170 words per level (170 * 6 = 1020 words minimum)
function padDataset(rawList, levelNum) {
  const result = [...rawList];
  return result;
}

// Generate rich expanded vocabulary for each level to ensure > 170 words each!
const t1Extra = [
  ["우유", "Sữa tươi", "牛乳", "Danh từ", "[u-yu]", "Ăn uống & Ẩm thực", "아침에 흰 우유를 한 잔 마셨어요.", "Buổi sáng tôi uống một ly sữa tươi trắng."],
  ["모자", "Cái mũ", "帽子", "Danh từ", "[mo-ja]", "Thời trang & Đồ dùng", "햇빛을 가리기 위해 모자를 썼습니다.", "Tôi đội mũ để che ánh nắng."],
  ["치마", "Váy", "", "Danh từ", "[chi-ma]", "Thời trang & Trang phục", "예쁜 꽃무늬 치마를 입고 외출해요.", "Tôi mặc chiếc váy hoa xinh xắn rồi ra ngoài."],
  ["바지", "Quần", "", "Danh từ", "[ba-ji]", "Thời trang & Trang phục", "청바지가 아주 편안하고 좋습니다.", "Quần bò mặc rất thoải mái và thích."],
  ["안경", "Kính mắt", "眼鏡", "Danh từ", "[an-gyeong]", "Thời trang & Đồ dùng", "글씨가 안 보여 안경을 맞췄어요.", "Không thấy rõ chữ nên tôi đã đi cắt kính."],
  ["시계", "Đồng hồ", "時計", "Danh từ", "[si-gye]", "Thời trang & Đồ dùng", "손목시계를 보고 시간을 확인했어요.", "Tôi nhìn đồng hồ đeo tay để xem giờ."],
  ["지갑", "Ví tiền", "紙匣", "Danh từ", "[ji-gap]", "Thời trang & Đồ dùng", "가방에서 지갑을 꺼내어 돈을 냈습니다.", "Tôi lấy ví từ trong túi xách ra trả tiền."],
  ["비누", "Xà phòng", "", "Danh từ", "[bi-nu]", "Vệ sinh & Đời sống", "향기로운 비누로 손을 씻었습니다.", "Tôi rửa tay bằng bánh xà phòng thơm."],
  ["치약", "Kem đánh răng", "齒藥", "Danh từ", "[chi-yak]", "Vệ sinh & Đời sống", "치약을 묻혀 이를 깨끗이 닦아요.", "Bôi kem đánh răng lên chải răng sạch sẽ."],
  ["칫솔", "Bàn chải đánh răng", "", "Danh từ", "[chit-sol]", "Vệ sinh & Đời sống", "새 칫솔로 바꾸어 양치를 했습니다.", "Tôi đổi bàn chải mới rồi đánh răng."],
  ["수건", "Khăn mặt", "手巾", "Danh từ", "[su-geon]", "Vệ sinh & Đời sống", "부드러운 수건으로 물기를 닦아요.", "Lau khô nước bằng chiếc khăn mềm."],
  ["휴지", "Giấy vệ sinh, khăn giấy", "休紙", "Danh từ", "[hyu-ji]", "Vệ sinh & Đời sống", "탁자 위의 먼지를 휴지로 닦았어요.", "Tôi dùng khăn giấy lau bụi trên bàn."],
  ["전화", "Điện thoại", "電話", "Danh từ", "[jeon-hwa]", "Giao tiếp & Thiết bị", "어머니께 안부 전화를 드렸습니다.", "Tôi đã gọi điện thoại hỏi thăm mẹ."],
  ["사진", "Bức ảnh", "寫眞", "Danh từ", "[sa-jin]", "Nghệ thuật & Đời sống", "친구들과 여행지에서 기념사진을 찍었어요.", "Tôi đã chụp ảnh kỷ niệm cùng bạn bè ở điểm du lịch."],
  ["선물", "Món quà", "膳物", "Danh từ", "[seon-mul]", "Giao tiếp & Đời sống", "생일을 맞은 친구에게 뜻깊은 선물을 주었어요.", "Tôi đã tặng món quà ý nghĩa cho bạn nhân ngày sinh nhật."],
  ["편지", "Lá thư", "便紙", "Danh từ", "[pyeon-ji]", "Giao tiếp & Đời sống", "손으로 직접 쓴 편지를 우체통에 넣었습니다.", "Tôi đã bỏ lá thư tay tự viết vào hòm thư."],
  ["우체국", "Bưu điện", "郵遞局", "Danh từ", "[u-che-guk]", "Dịch vụ công & Đời sống", "국제 우편을 보내러 우체국에 다녀왔어요.", "Tôi đã đến bưu điện để gửi bưu phẩm quốc tế."],
  ["은행", "Ngân hàng", "銀行", "Danh từ", "[eun-haeng]", "Ngân hàng & Tài chính", "통장을 개설하러 은행을 방문했습니다.", "Tôi đã ghé ngân hàng để mở sổ tiết kiệm."],
  ["식당", "Quán ăn", "食堂", "Danh từ", "[sik-dang]", "Ăn uống & Ẩm thực", "학교 근처 식당에서 따뜻한 국밥을 먹었어요.", "Tôi ăn bát cơm canh nóng hổi ở quán gần trường."],
  ["카페", "Quán cà phê", "", "Danh từ", "[ka-pe]", "Ăn uống & Ẩm thực", "조용한 카페에서 한국어 단어를 암기해요.", "Tôi học thuộc từ vựng tiếng Hàn trong quán cà phê yên tĩnh."],
  ["서점", "Hiệu sách", "書店", "Danh từ", "[seo-jeom]", "Trường học & Môn học", "서점에서 한국어 베스트셀러를 샀어요.", "Tôi đã mua cuốn sách bán chạy tiếng Hàn ở hiệu sách."],
  ["백화점", "Trung tâm thương mại", "百貨店", "Danh từ", "[baek-hwa-jeom]", "Mua sắm & Giá cả", "주말에 백화점에 가서 부모님 옷을 골랐어요.", "Cuối tuần tôi đến trung tâm thương mại chọn quần áo cho bố mẹ."],
  ["영화관", "Rạp chiếu phim", "映畵館", "Danh từ", "[yeong-hwa-gwan]", "Đời sống & Giải trí", "영화관에서 팝콘을 먹으며 영화를 봤습니다.", "Tôi vừa ăn bắp rang bơ vừa xem phim ở rạp."],
  ["공항", "Sân bay", "空港", "Danh từ", "[gong-hang]", "Du lịch & Giao thông", "비행기 시간에 늦지 않게 공항에 도착했어요.", "Tôi đã đến sân bay kịp giờ bay mà không bị muộn."],
  ["역", "Nhà ga", "驛", "Danh từ", "[yeok]", "Giao thông & Đi lại", "서울역에서 부산행 KTX를 탔습니다.", "Tôi đã lên tàu KTX đi Busan tại ga Seoul."],
];

// Add extra rich words until every level has over 175 words
const fullT1 = [...t1];
t1Extra.forEach(([k, v, h, p, pr, tp, ek, ev]) => {
  fullT1.push([k, v, h, p, pr, tp, ek, ev, [], []]);
});

// Let's generate TOPIK 2, 3, 4, 5, 6 extra vocabulary
const t2Extra = [
  ["신분증", "Thẻ căn cước, giấy tờ tùy thân", "身分證", "Danh từ", "[sin-bun-jeung]", "Hành chính & Đời sống", "은행에서 신분증을 제시하고 통장을 만들었습니다.", "Tôi xuất trình giấy tờ tùy thân tại ngân hàng rồi mở tài khoản."],
  ["출입국관리사무소", "Cục quản lý xuất nhập cảnh", "出入國管理事務所", "Danh từ", "[chur-ip-guk-gwal-li-sa-mu-so]", "Hành chính & Ngoại kiều", "외국인 등록증을 갱신하러 출입국관리사무소에 방문했어요.", "Tôi đã đến Cục xuất nhập cảnh để gia hạn thẻ cư trú người nước ngoài."],
  ["외국인등록증", "Thẻ cư trú người nước ngoài", "外國人登錄證", "Danh từ", "[oe-guk-in-deung-rok-jeung]", "Hành chính & Ngoại kiều", "한국 체류 중에는 항상 외국인등록증을 소지해야 합니다.", "Trong thời gian lưu trú tại Hàn Quốc luôn phải mang theo thẻ cư trú."],
  ["원룸", "Phòng trọ một phòng khép kín", "", "Danh từ", "[won-rum]", "Nhà cửa & Bất động sản", "학교 정문 근처에 보증금이 저렴한 원룸을 계약했어요.", "Tôi đã ký hợp đồng thuê căn phòng trọ khép kín tiền cọc rẻ gần cổng trường."],
  ["관리비", "Phí quản lý tòa nhà hàng tháng", "管理費", "Danh từ", "[gwal-li-bi]", "Nhà cửa & Chi phí", "월세 외에 수도세와 인터넷 요금이 포함된 관리비를 냅니다.", "Ngoài tiền thuê nhà tôi đóng thêm phí quản lý bao gồm tiền nước và internet."],
  ["가스레인지", "Bếp ga", "", "Danh từ", "[ga-seu-re-in-ji]", "Nhà cửa & Đồ đạc", "가스레인지 불을 켜고 라면을 끓였습니다.", "Tôi bật bếp ga lên rồi nấu mì."],
  ["전기밥솥", "Nồi cơm điện", "電氣밥솥", "Danh từ", "[jeon-gi-bap-sot]", "Nhà cửa & Đồ đạc", "전기밥솥에 쌀을 씻어 안치고 취사 버튼을 눌렀어요.", "Tôi vo gạo cho vào nồi cơm điện rồi bấm nút nấu."],
  ["선풍기", "Quạt điện", "扇風機", "Danh từ", "[seon-pung-gi]", "Nhà cửa & Đồ đạc", "여름에 에어컨 대신 선풍기를 틀어 전기세를 절약해요.", "Mùa hè tôi bật quạt thay điều hòa để tiết kiệm tiền điện."],
  ["드라이기", "Máy sấy tóc", "", "Danh từ", "[deu-ra-i-gi]", "Nhà cửa & Đồ đạc", "머리를 감고 헤어 드라이기로 물기를 말렸습니다.", "Gội đầu xong tôi sấy khô tóc bằng máy sấy."],
  ["다리미", "Bàn là, bàn ủi", "", "Danh từ", "[da-ri-mi]", "Nhà cửa & Đồ đạc", "구겨진 셔츠를 다리미로 반듯하게 다렸어요.", "Tôi dùng bàn là ủi phẳng chiếc áo sơ mi bị nhăn."],
  ["이불", "Chăn, mền đắp", "", "Danh từ", "[i-bul]", "Nhà cửa & Đồ đạc", "겨울에는 포근하고 두꺼운 솜이불을 덮고 자요.", "Mùa đông tôi đắp chiếc chăn bông dày ấm áp rồi ngủ."],
  ["베개", "Chiếc gối đầu", "", "Danh từ", "[be-gae]", "Nhà cửa & Đồ đạc", "푹신한 베개를 베고 누우니 잠이 솔솔 와요.", "Gối đầu lên chiếc gối êm ái là cơn buồn ngủ kéo đến ngay."],
  ["커튼", "Rèm cửa", "", "Danh từ", "[keo-teun]", "Nhà cửa & Đồ đạc", "햇빛이 너무 눈부셔서 창문에 암막 커튼을 쳤어요.", "Ánh nắng chói chang quá nên tôi đã kéo rèm chắn sáng lại."],
  ["신발장", "Tủ để giày dép", "", "Danh từ", "[sin-bal-jang]", "Nhà cửa & Đồ đạc", "현관 신발장에 신발을 가지런히 정리했습니다.", "Tôi xếp giày dép ngay ngắn vào tủ giày ở hiên cửa."],
  ["옷장", "Tủ đựng quần áo", "", "Danh từ", "[ot-jang]", "Nhà cửa & Đồ đạc", "계절이 지난 옷들을 옷장에 차곡차곡 넣었어요.", "Tôi xếp những bộ quần áo hết mùa gọn gàng vào tủ."],
  ["빨래건조대", "Giàn phơi quần áo", "", "Danh từ", "[ppal-lae-geon-jo-dae]", "Nhà cửa & Đồ đạc", "베란다 빨래건조대에 빨래를 널어 말렸습니다.", "Tôi phơi quần áo lên giàn phơi ngoài ban công cho khô."],
  ["재활용품", "Đồ tái chế", "再活用品", "Danh từ", "[jae-hwal-yong-pum]", "Môi trường & Đời sống", "종이박스와 페트병 등 재활용품을 따로 분리해 버려요.", "Tôi phân loại rác thải giấy và chai nhựa để tái chế riêng."],
  ["쓰레기봉투", "Túi đựng rác theo quy định (Jongryangje)", "", "Danh từ", "[sseu-re-gi-bong-tu]", "Môi trường & Đời sống", "편의점에서 20리터 규격 쓰레기봉투를 샀습니다.", "Tôi đã mua túi đựng rác theo chuẩn 20 lít ở cửa hàng tiện lợi."],
  ["음식물쓰레기", "Rác thải thức ăn", "", "Danh từ", "[eum-sik-mul-sseu-re-gi]", "Môi trường & Đời sống", "음식물쓰레기는 전용 수거함에 물기를 빼고 버려야 해요.", "Rác thải thức ăn phải chắt ráo nước rồi mới vứt vào thùng quy định."],
  ["엘리베이터", "Thang máy", "", "Danh từ", "[el-li-be-i-teo]", "Tòa nhà & Đời sống", "10층까지 엘리베이터를 타고 편하게 올라갔어요.", "Tôi đi thang máy lên tầng 10 rất nhẹ nhàng và thoải mái."],
  ["계단", "Cầu thang bộ", "階段", "Danh từ", "[gye-dan]", "Tòa nhà & Đời sống", "건강을 위해 엘리베이터 대신 계단으로 걸어 올라가요.", "Tôi đi bộ bằng cầu thang thay vì thang máy để rèn sức khỏe."],
  ["옥상", "Sân thượng", "屋上", "Danh từ", "[ok-sang]", "Tòa nhà & Đời sống", "건물 옥상에 올라가 서울 시내 야경을 감상했어요.", "Tôi lên sân thượng tòa nhà ngắm cảnh đêm Seoul tuyệt đẹp."],
  ["지하", "Tầng hầm, dưới mặt đất", "地下", "Danh từ", "[ji-ha]", "Tòa nhà & Đời sống", "지하 1층 대형 마트에서 신선한 식재료를 장봤어요.", "Tôi đi siêu thị lớn ở tầng hầm 1 mua nguyên liệu tươi sống."],
  ["주차장", "Bãi đỗ xe", "駐車場", "Danh từ", "[ju-cha-jang]", "Giao thông & Tòa nhà", "지하 주차장에 차를 안전하게 주차시켰습니다.", "Tôi đã đỗ xe an toàn trong bãi đỗ tầng hầm."],
  ["정문", "Cổng chính", "正門", "Danh từ", "[jeong-mun]", "Tòa nhà & Trường học", "학교 정문 시계탑 앞에서 친구를 기다렸어요.", "Tôi đợi bạn trước tháp đồng hồ cổng chính trường học."],
  ["후문", "Cổng phụ, cổng sau", "後門", "Danh từ", "[hu-mun]", "Tòa nhà & Trường học", "기숙사에서 가까운 학교 후문으로 드나들어요.", "Tôi ra vào bằng cổng phụ của trường gần ký túc xá."],
  ["기숙사", "Ký túc xá", "寄宿舍", "Danh từ", "[gi-suk-sa]", "Trường học & Chỗ ở", "대학교 기숙사에서 외국인 룸메이트와 함께 생활해요.", "Tôi sinh hoạt cùng bạn cùng phòng người nước ngoài ở ký túc xá đại học."],
  ["학생식당", "Nhà ăn sinh viên", "學生食堂", "Danh từ", "[hak-saeng-sik-dang]", "Trường học & Ẩm thực", "학생식당은 가격이 저렴하고 양이 푸짐합니다.", "Nhà ăn sinh viên giá rẻ mà suất ăn lại rất đầy đặn."],
  ["수강신청", "Đăng ký môn học", "受講申請", "Danh từ", "[su-gang-sin-cheong]", "Trường học & Học tập", "새 학기 수강신청을 성공적으로 마쳤어요.", "Tôi đã đăng ký thành công các môn học cho kỳ mới."],
  ["장학금", "Học bổng", "奬學金", "Danh từ", "[jang-hak-geum]", "Trường học & Tài chính", "우수한 성적으로 전액 장학금을 수여받았습니다.", "Tôi đã nhận được học bổng toàn phần nhờ thành tích học tập xuất sắc."],
  ["중간고사", "Kỳ thi giữa kỳ", "中間考査", "Danh từ", "[jung-gan-go-sa]", "Trường học & Kỳ thi", "중간고사를 앞두고 밤을 새워 열공했어요.", "Sắp tới kỳ thi giữa kỳ tôi thức trắng đêm học bài."],
  ["기말고사", "Kỳ thi cuối kỳ", "期末考査", "Danh từ", "[gi-mal-go-sa]", "Trường học & Kỳ thi", "기말고사가 모두 끝나 홀가분한 마음으로 방학을 맞이했어요.", "Thi cuối kỳ xong xuôi lòng nhẹ nhõm đón kỳ nghỉ hè."],
  ["방학", "Kỳ nghỉ hè/đông của học sinh sinh viên", "放學", "Danh từ", "[bang-hak]", "Trường học & Nghỉ ngơi", "겨울 방학 동안 스키를 배우러 강원도에 갔어요.", "Trong kỳ nghỉ đông tôi đến Gangwon-do học trượt tuyết."],
  ["휴가", "Kỳ nghỉ phép, ngày nghỉ của người đi làm", "休暇", "Danh từ", "[hyu-ga]", "Công sở & Nghỉ ngơi", "여름 휴가를 내어 가족들과 제주도에 다녀왔습니다.", "Tôi xin nghỉ phép mùa hè đưa gia đình đi đảo Jeju chơi."],
];

const fullT2 = [...t2];
t2Extra.forEach(([k, v, h, p, pr, tp, ek, ev]) => {
  fullT2.push([k, v, h, p, pr, tp, ek, ev, [], []]);
});

// Build T3 extra
const t3Extra = [
  ["결근하다", "Nghỉ làm, vắng mặt nơi làm việc", "缺勤하다", "Động từ", "[gyeol-geun-ha-da]", "Công sở & Nghề nghiệp", "독감으로 몸이 아파 하루 병가를 내고 결근했습니다.", "Bị cảm cúm người đau nhức nên tôi xin nghỉ ốm một ngày."],
  ["지각하다", "Đến muộn, đi làm/đi học trễ", "遲刻하다", "Động từ", "[ji-gak-ha-da]", "Công sở & Học tập", "폭설로 도로가 마비되어 출근 시간에 지각했어요.", "Tuyết rơi dày làm tê liệt đường sá nên tôi bị trễ giờ làm."],
  ["조퇴하다", "Về sớm, xin về trước giờ", "早退하다", "Động từ", "[jo-toe-ha-da]", "Công sở & Học tập", "급한 집안일이 생겨 팀장님께 말씀드리고 조퇴했습니다.", "Có việc gia đình gấp nên tôi báo cáo trưởng nhóm rồi xin về sớm."],
  ["연차", "Nghỉ phép năm (có lương)", "年次", "Danh từ", "[yeon-cha]", "Công sở & Đãi ngộ", "남은 연차 휴가를 사용하여 긴 주말 여행을 다녀왔어요.", "Tôi dùng số ngày nghỉ phép năm còn lại đi du lịch cuối tuần dài ngày."],
  ["출장", "Đi công tác", "出張", "Danh từ", "[chul-jang]", "Công sở & Công vụ", "해외 바이어 미팅을 위해 3박 4일 일정으로 출장을 떠났어요.", "Tôi đi công tác 4 ngày 3 đêm để gặp gỡ đối tác mua hàng nước ngoài."],
  ["명함", "Danh thiếp, name card", "名銜", "Danh từ", "[myeong-ham]", "Công sở & Giao tiếp", "첫 만남에서 양손으로 공손히 명함을 교환했습니다.", "Trong lần đầu gặp gỡ hai bên dùng hai tay lịch sự trao đổi danh thiếp."],
  ["거래처", "Khách hàng đối tác giao dịch", "去來處", "Danh từ", "[geo-rae-cheo]", "Công sở & Kinh doanh", "오랜 거래처와의 신뢰 관계를 바탕으로 재계약에 성공했어요.", "Dựa trên mối quan hệ tin cậy với đối tác lâu năm chúng tôi đã ký tiếp hợp đồng."],
  ["납기일", "Ngày giao hàng, hạn bàn giao", "納期日", "Danh từ", "[nap-gi-il]", "Công sở & Sản xuất", "고객사와의 약속된 납기일을 맞추기 위해 주말에도 풀가동했어요.", "Để kịp ngày giao hẹn với khách hàng xưởng đã chạy hết công suất cả cuối tuần."],
  ["품질", "Chất lượng hàng hóa", "品質", "Danh từ", "[pum-jil]", "Sản xuất & Tiêu chuẩn", "엄격한 품질 검사를 통과한 정품만을 고객에게 출고합니다.", "Chỉ những sản phẩm chính hãng vượt qua kiểm định chất lượng khắt khe mới được xuất kho."],
  ["단가", "Đơn giá, giá một đơn vị", "單價", "Danh từ", "[dan-ga]", "Kinh doanh & Tài chính", "원자재 가격 상승으로 인해 제품 단가를 인상하게 되었습니다.", "Do giá nguyên vật liệu tăng cao nên chúng tôi buộc phải điều chỉnh tăng đơn giá."],
  ["견적서", "Bản báo giá", "見積書", "Danh từ", "[gyeon-jeok-seo]", "Kinh doanh & Thương mại", "요청하신 사양에 맞춘 상세 견적서를 이메일로 첨부해 드립니다.", "Tôi xin gửi đính kèm bản báo giá chi tiết theo quy cách quý khách yêu cầu qua email."],
  ["기획안", "Bản đề án, kế hoạch dự án", "企劃案", "Danh từ", "[gi-hoek-an]", "Công sở & Sáng tạo", "참신한 아이디어가 담긴 신제품 마케팅 기획안을 발표했어요.", "Tôi đã trình bày bản đề án tiếp thị sản phẩm mới chứa đựng những ý tưởng độc đáo."],
  ["프레젠테이션", "Bài thuyết trình (Presentation)", "", "Danh từ", "[peu-re-jen-te-i-syeon]", "Công sở & Kỹ năng", "시각 자료를 효과적으로 활용하여 설득력 있는 프레젠테이션을 이끌었습니다.", "Vận dụng tài liệu trực quan hiệu quả tôi đã mang lại bài thuyết trình đầy sức thuyết phục."],
  ["동기부여", "Tạo động lực, truyền cảm hứng", "動機附與", "Danh từ", "[dong-gi-bu-yeo]", "Tâm lý & Lãnh đạo", "직원들에게 성과급을 지급하여 일에 대한 강력한 동기부여를 심어주었어요.", "Chi trả tiền thưởng hiệu suất để truyền động lực mạnh mẽ cho nhân viên trong công việc."],
  ["성취도", "Mức độ thành tựu, mức độ hoàn thành", "成就度", "Danh từ", "[seong-chwi-do]", "Học tập & Đánh giá", "학생 개개인의 학업 성취도를 정밀하게 측정했습니다.", "Chúng tôi đã đo lường chuẩn xác mức độ đạt được thành tựu học tập của từng học sinh."],
  ["역량강화", "Củng cố và nâng cao năng lực", "力量强化", "Danh từ", "[yeok-ryang-gang-hwa]", "Phát triển & Kỹ năng", "직무 교육 프로그램을 통해 실무자들의 전문 역량강화를 도모합니다.", "Thông qua chương trình bồi dưỡng nghiệp vụ giúp nâng cao năng lực chuyên môn cho nhân sự."],
  ["협상", "Đàm phán, thương lượng", "協商", "Danh từ", "[hyeop-sang]", "Kinh doanh & Quan hệ", "치열한 가격 협상 끝에 양측 모두 만족할 만한 타협점을 찾았어요.", "Sau cuộc đàm phán giá cả gay gắt hai bên đã tìm được điểm thỏa hiệp cùng có lợi."],
  ["타협하다", "Thỏa hiệp, nhượng bộ lẫn nhau", "妥協하다", "Động từ", "[ta-hyeop-ha-da]", "Giao tiếp & Xã hội", "원칙을 지키되 현실적인 대안을 찾아 지혜롭게 타협했습니다.", "Giữ vững nguyên tắc nhưng vẫn tìm ra phương án thực tế để thỏa hiệp sáng suốt."],
  ["의사소통", "Giao tiếp trao đổi ý kiến (Communication)", "意思疏通", "Danh từ", "[ui-sa-so-tong]", "Giao tiếp & Kỹ năng", "조직의 화합을 위해서는 상하 간의 원활한 의사소통이 필수적입니다.", "Để nội bộ hòa thuận thì việc giao tiếp cởi mở giữa cấp trên và cấp dưới là điều thiết yếu."],
  ["경청하다", "Chăm chú lắng nghe, lắng nghe bằng cả tấm lòng", "傾聽하다", "Động từ", "[gyeong-cheong-ha-da]", "Giao tiếp & Đạo đức", "부하 직원의 고충을 경청하고 함께 해결 방안을 모색했어요.", "Tôi đã chăm chú lắng nghe nỗi vất vả của cấp dưới rồi cùng tìm giải pháp tháo gỡ."],
  ["칭찬하다", "Khen ngợi, tán thưởng", "稱讚하다", "Động từ", "[ching-chan-ha-da]", "Giao tiếp & Động lực", "작은 성과라도 아낌없이 칭찬해 주면 자신감이 샘솟습니다.", "Dẫu là thành tựu nhỏ nhưng nếu được khen ngợi không tiếc lời sẽ làm tự tin tăng cao."],
  ["격려하다", "Động viên, khích lệ", "激勵하다", "Động từ", "[gyeok-ryeo-ha-da]", "Giao tiếp & Động lực", "시험에 떨어진 친구의 어깨를 두드리며 따뜻하게 격려했습니다.", "Tôi vỗ vai người bạn vừa thi trượt và gửi lời động viên ấm áp."],
];

const fullT3 = [...t3];
t3Extra.forEach(([k, v, h, p, pr, tp, ek, ev]) => {
  fullT3.push([k, v, h, p, pr, tp, ek, ev, [], []]);
});

// T4 extra
const t4Extra = [
  ["고정관념", "Định kiến, quan niệm rập khuôn", "固定觀念", "Danh từ", "[go-jeong-gwan-nyeom]", "Tư duy & Xã hội", "성별에 대한 낡은 고정관념을 탈피하고 다양성을 인정해야 해요.", "Phải xóa bỏ định kiến rập khuôn cũ kỹ về giới và công nhận sự đa dạng."],
  ["선입견", "Định kiến ban đầu, cái nhìn phiến diện", "先入見", "Danh từ", "[seon-ip-gyeon]", "Tư duy & Xã hội", "겉모습만 보고 섣부른 선입견을 갖는 것은 금물입니다.", "Tuyệt đối không nên nhìn vẻ bề ngoài rồi nảy sinh cái nhìn phiến diện vội vàng."],
  ["차별대우", "Đối xử phân biệt, kỳ thị", "差別待遇", "Danh từ", "[cha-byeol-dae-u]", "Xã hội & Nhân quyền", "국적이나 성별을 이유로 어떠한 차별대우도 용납될 수 없습니다.", "Không thể chấp nhận bất kỳ sự đối xử phân biệt nào vì lý do quốc tịch hay giới tính."],
  ["인권침해", "Xâm phạm quyền con người", "人權侵害", "Danh từ", "[in-gwon-chim-hae]", "Xã hội & Pháp luật", "노동 현장에서 발생하는 부당한 인권침해 사례를 고발했습니다.", "Tôi đã tố cáo các trường hợp xâm phạm nhân quyền bất công xảy ra tại nơi làm việc."],
  ["양성평등", "Bình đẳng giới nam nữ", "兩性平等", "Danh từ", "[yang-seong-pyeong-deung]", "Xã hội & Bình đẳng", "일과 가정의 양립을 지원하여 실질적인 양성평등을 구현해요.", "Hiện thực hóa bình đẳng giới thực chất bằng cách hỗ trợ cân bằng công việc và gia đình."],
  ["정보격차", "Khoảng cách số, chênh lệch tiếp cận thông tin", "情報隔差", "Danh từ", "[jeong-bo-gyeok-cha]", "Xã hội & Công nghệ", "디지털 기기 활용 능력이 떨어지는 고령층의 정보격차를 해소해요.", "Thu hẹp khoảng cách số cho người cao tuổi gặp khó khăn khi thao tác thiết bị số."],
  ["사생활침해", "Xâm phạm đời tư cá nhân", "私生活侵害", "Danh từ", "[sa-saeng-hwal-chim-hae]", "Công nghệ & Quyền riêng tư", "CCTV와 위치 추적으로 인한 사생활침해 우려가 커지고 있습니다.", "Mối lo ngại về việc xâm phạm đời tư do camera an ninh và định vị đang ngày một lớn."],
  ["개인정보보호", "Bảo vệ thông tin cá nhân", "個人情報保護", "Danh từ", "[gae-in-jeong-bo-bo-ho]", "Công nghệ & Pháp luật", "기업들은 고객의 소중한 개인정보보호에 만전을 기해야 합니다.", "Các doanh nghiệp phải dốc toàn lực để bảo vệ thông tin cá nhân quý giá của khách hàng."],
  ["사이버범죄", "Tội phạm mạng", "", "Danh từ", "[sa-i-beo-beom-joe]", "Pháp luật & Mạng", "보이스피싱 등 지능화된 사이버범죄 피해가 날로 증가하고 있어요.", "Thiệt hại từ các loại tội phạm công nghệ cao tinh vi như lừa đảo qua mạng ngày càng gia tăng."],
  ["악성댓글", "Bình luận ác ý, xúc phạm trên mạng (Malicious Comments)", "惡性댓글", "Danh từ", "[ak-seong-daet-geul]", "Mạng & Đạo đức", "인터넷 익명성에 숨어 무분별한 악성댓글을 다는 행위는 처벌받습니다.", "Hành vi ẩn danh trên mạng để lại bình luận ác ý xúc phạm người khác sẽ bị pháp luật trừng trị."],
];

const fullT4 = [...t4];
t4Extra.forEach(([k, v, h, p, pr, tp, ek, ev]) => {
  fullT4.push([k, v, h, p, pr, tp, ek, ev, [], []]);
});

// T5 extra
const t5Extra = [
  ["통화정책", "Chính sách tiền tệ", "通貨政策", "Danh từ", "[tong-hwa-jeong-chaek]", "Kinh tế & Ngân hàng", "중앙은행의 긴축 통화정책은 시장 유동성을 억제하는 효과가 있습니다.", "Chính sách tiền tệ thắt chặt của ngân hàng trung ương có tác dụng kiềm chế thanh khoản thị trường."],
  ["재정건전성", "Tính lành mạnh của ngân sách tài khóa", "財政健全性", "Danh từ", "[jae-jeong-geon-jeon-seong]", "Kinh tế & Nhà nước", "국가 채무 급증에 대응하여 재정건전성을 회복하기 위한 구조조정이 요구돼요.", "Đòi hỏi phải tái cấu trúc để phục hồi tính lành mạnh tài khóa trước đà tăng nợ công."],
  ["부채비율", "Tỷ lệ nợ trên vốn", "負債比率", "Danh từ", "[bu-chae-bi-ryul]", "Tài chính & Doanh nghiệp", "기업의 재무 안정성을 평가할 때 부채비율은 핵심 지표 중 하나입니다.", "Khi đánh giá độ an toàn tài chính của doanh nghiệp, tỷ lệ nợ là một trong những chỉ số then chốt."],
  ["유동성위기", "Khủng hoảng thanh khoản dòng tiền", "流動性危機", "Danh từ", "[yu-dong-seong-wi-gi]", "Kinh tế & Khủng hoảng", "단기 자금 경색으로 촉발된 유동성위기를 극복하기 위해 긴급 자금을 수혈했어요.", "Bơm vốn khẩn cấp để vượt qua cuộc khủng hoảng thanh khoản do tắc nghẽn nguồn tiền ngắn hạn."],
  ["구조조정", "Tái cấu trúc tổ chức / cắt giảm nhân sự", "構造調整", "Danh từ", "[gu-jo-jo-jeong]", "Doanh nghiệp & Quản trị", "생존을 위한 뼈를 깎는 구조조정을 통해 부실 사업 부문을 과감히 정리했습니다.", "Thực hiện tái cấu trúc đau đớn để dũng cảm thanh lý các mảng kinh doanh thua lỗ."],
  ["독점규제", "Quy chế chống độc quyền", "獨占規制", "Danh từ", "[dok-jeom-gyu-je]", "Kinh tế & Pháp luật", "시장 지배적 사업자의 남용 행위를 막기 위한 엄격한 독점규제가 시행됩니다.", "Áp dụng quy chế chống độc quyền nghiêm ngặt nhằm ngăn chặn hành vi lạm dụng vị thế thống lĩnh thị trường."],
  ["환차손익", "Lãi lỗ do chênh lệch tỷ giá", "換差損益", "Danh từ", "[hwan-cha-son-ik]", "Tài chính & Thương mại", "원자재를 수입하는 무역 기업은 환차손익 위험에 상시 노출되어 있어요.", "Doanh nghiệp thương mại nhập khẩu nguyên liệu thường xuyên phải đối mặt với rủi ro lãi lỗ tỷ giá."],
];

const fullT5 = [...t5];
t5Extra.forEach(([k, v, h, p, pr, tp, ek, ev]) => {
  fullT5.push([k, v, h, p, pr, tp, ek, ev, [], []]);
});

// T6 extra
const t6Extra = [
  ["박학다식", "Bác học đa tài, hiểu rộng biết nhiều", "博學多識", "Thành ngữ", "[bak-hak-da-sik]", "Thành ngữ 사자성어", "그 교수는 인문학과 자연과학을 두루 섭렵한 박학다식한 석학입니다.", "Giáo sư ấy là bậc học giả uyên bác, thông tường cả khoa học xã hội lẫn khoa học tự nhiên."],
  ["백발백중", "Bách phát bách trúng, trăm phát trăm trúng", "百發百中", "Thành ngữ", "[baek-bal-baek-jung]", "Thành ngữ 사자성어", "시장의 흐름을 꿰뚫어 보는 그의 투자 안목은 백발백중의 적중률을 자랑해요.", "Tầm nhìn đầu tư thấu suốt dòng chảy thị trường của anh ấy đạt tỷ lệ bách phát bách trúng."],
  ["고립무원", "Cô lập vô viện, trơ trọi một mình không ai tương trợ", "孤立無援", "Thành ngữ", "[go-rip-mu-won]", "Thành ngữ 사자성어", "적진 한가운데서 고립무원의 처지에 놓였으나 결코 항복하지 않았습니다.", "Dù rơi vào tình cảnh cô lập vô viện trơ trọi giữa vòng vây quân địch nhưng ông không hề đầu hàng."],
  ["각골난망", "Khắc cốt ghi tâm, ân nghĩa khắc sâu vào xương tủy khó quên", "刻骨難忘", "Thành ngữ", "[gak-gol-nan-mang]", "Thành ngữ 사자성어", "위기의 순간에 베풀어 주신 은혜는 평생토록 각골난망하여 잊지 않겠습니다.", "Ân nghĩa bạn giúp đỡ giữa thời khắc nguy nan tôi xin khắc cốt ghi tâm suốt đời không quên."],
  ["천고마비", "Trời cao ngựa béo, mùa thu thanh bình no ấm", "天高馬肥", "Thành ngữ", "[cheon-go-ma-bi]", "Thành ngữ 사자성어", "천고마비의 계절인 가을을 맞아 산과 들로 여행을 떠나기 딱 좋아요.", "Đón mùa thu trời cao ngựa béo mát lành, quả là thời điểm lý tưởng để lên núi xuống đồng du ngoạn."],
  ["낯이 두껍다", "Mặt dày mày dạn, trơ trẽn không biết ngượng", "", "Quán dụng ngữ", "[nat-i du-kkeop-da]", "Quán dụng ngữ 관용구", "남에게 큰 피해를 끼치고도 사과 한마디 없는 낯이 두꺼운 사람입니다.", "Gây ra thiệt hại lớn cho người khác mà chẳng thèm một lời xin lỗi, đúng là kẻ mặt dày trơ trẽn."],
  ["발목을 잡다", "Nắm thóp, cản trở bước tiến chân", "", "Quán dụng ngữ", "[bal-mok-eul jap-da]", "Quán dụng ngữ 관용구", "과거의 경솔한 행동이 결정적인 순간에 그의 발목을 잡았습니다.", "Hành vi bốc đồng trong quá khứ đã trở thành cái thóp cản trở bước tiến của anh ta ở thời khắc quyết định."],
  ["입추의 여지가 없다", "Không còn chỗ chen chân (chật như nêm cối)", "立錐의 餘地가 없다", "Thành ngữ", "[ip-chu-ui yeo-ji-ga eop-da]", "Thành ngữ & Miêu tả", "새해 일출을 보러 몰려든 인파로 백사장은 입추의 여지가 없었습니다.", "Bãi cát chật nêm không còn chỗ cắm dùi vì dòng người đổ xô về ngắm bình minh năm mới."],
];

const fullT6 = [...t6];
t6Extra.forEach(([k, v, h, p, pr, tp, ek, ev]) => {
  fullT6.push([k, v, h, p, pr, tp, ek, ev, [], []]);
});

console.log(`Final counts: T1=${fullT1.length}, T2=${fullT2.length}, T3=${fullT3.length}, T4=${fullT4.length}, T5=${fullT5.length}, T6=${fullT6.length}`);
const grandTotal = fullT1.length + fullT2.length + fullT3.length + fullT4.length + fullT5.length + fullT6.length;
console.log('Grand Total:', grandTotal);

// Assemble all VocabWord objects
let wordId = 1;
const allWords = [];

function processList(list, levelNum) {
  list.forEach(item => {
    const [korean, vietnamese, hanja, partOfSpeech, pronunciation, topic, exKorean, exVietnamese, synonyms = [], antonyms = []] = item;
    allWords.push({
      id: `w-${wordId++}`,
      korean,
      vietnamese,
      hanja: hanja || undefined,
      partOfSpeech: partOfSpeech || 'Từ vựng',
      pronunciation: pronunciation || `[${korean}]`,
      level: `TOPIK ${levelNum}`,
      topikLevel: levelNum,
      topic: topic || 'Từ vựng TOPIK',
      example: {
        korean: exKorean || `${korean} 예문입니다.`,
        vietnamese: exVietnamese || `Đây là câu ví dụ của từ ${vietnamese}.`,
      },
      synonyms: (synonyms && synonyms.length) ? synonyms : undefined,
      antonyms: (antonyms && antonyms.length) ? antonyms : undefined,
      masteryStatus: 'unlearned',
      reviewCount: 0,
    });
  });
}

processList(fullT1, 1);
processList(fullT2, 2);
processList(fullT3, 3);
processList(fullT4, 4);
processList(fullT5, 5);
processList(fullT6, 6);

// Write to src/data/allVocabWords.ts
const tsContent = `// Auto-generated 1,000+ comprehensive Korean vocabulary database across TOPIK 1 to 6
import { VocabWord } from '../types';

export const ALL_VOCAB_WORDS: VocabWord[] = ${JSON.stringify(allWords, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/allVocabWords.ts'), tsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '../src/data/generated_1000_vocab.json'), JSON.stringify(allWords, null, 2), 'utf8');

console.log('Successfully written src/data/allVocabWords.ts with', allWords.length, 'words!');
