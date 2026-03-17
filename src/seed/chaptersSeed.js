/**
 * Seed Chapters — chạy: node src/seed/chaptersSeed.js
 * Chạy sau khi đã seed stories. Thêm chương mẫu cho các truyện chưa có.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");

const CHAPTERS_BY_SLUG = {
  "one-piece": [
    {
      title: "Chương 1: Luffy - Chàng trai đến từ biển Đông",
      order: 1,
      content: `Ngày xưa, có một cậu bé tên Monkey D. Luffy sống ở làng Fuusha. Cậu mơ ước trở thành Vua Hải tặc và tìm ra kho báu One Piece huyền thoại.

Một ngày nọ, Shanks – thuyền trưởng băng hải tặc đỏ ghé thăm làng. Luffy ngưỡng mộ Shanks và quyết tâm ra khơi. Trong một lần bảo vệ bạn, cậu vô tình ăn phải trái ác quỷ Gomu Gomu và trở thành người cao su.

Shanks đã hy sinh cánh tay để cứu Luffy khỏi Vua biển. Trước khi rời đi, ông trao cho cậu chiếc mũ rơm và nói: "Hãy trả nó cho ta khi cậu trở thành hải tặc vĩ đại."

Nhiều năm sau, Luffy đặt chân lên con tàu của mình và bắt đầu hành trình chinh phục biển cả.`,
    },
    {
      title: "Chương 2: Thợ săn hải tặc Roronoa Zoro",
      order: 2,
      content: `Luffy đến thị trấn và nghe tin có một tên "thợ săn hải tặc" bị trói ở trụ gỗ vì bảo vệ một cô bé. Tên anh ta là Roronoa Zoro – kiếm sĩ tam đao với ước mơ trở thành kiếm sĩ mạnh nhất thế giới.

Luffy muốn Zoro gia nhập băng. Zoro từ chối vì đang chờ chết sau ba ngày không ăn uống – đó là điều kiện để thả cô bé Helmeppo. Luffy đánh bại cha của Helmeppo – hải quân tham nhũng Morgan – và cứu thị trấn.

Zoro chấp nhận đi cùng Luffy với điều kiện: nếu ước mơ của Luffy cản trở ước mơ của anh, anh sẽ từ bỏ. Hai người cùng nhau ra khơi, bắt đầu tìm kiếm đồng đội tiếp theo.`,
    },
    {
      title: "Chương 3: Nami – Nhà hàng hải và kẻ trộm",
      order: 3,
      content: `Trên đường đi, Luffy và Zoro gặp Nami – một cô gái tự xưng là kẻ trộm, thực ra là nhà hàng hải thiên tài. Cô đánh cắp con tàu của họ nhưng sau đó bị băng Buggy bắt.

Luffy và Zoro đuổi theo, đánh bại Buggy và cứu Nami. Dần dần, Nami chấp nhận đi cùng hai người dù vẫn nói mình chỉ là "đồng minh tạm thời". Cô đang âm thầm gom tiền để mua lại làng Cocoyashi khỏi tay băng Arlong.

Băng Hải tặc Mũ Rơm giờ đã có ba thành viên: thuyền trưởng Luffy, kiếm sĩ Zoro và hàng hải Nami. Họ hướng về Grand Line – vùng biển nguy hiểm nhất thế giới.`,
    },
  ],
  doraemon: [
    {
      title: "Chương 1: Doraemon đến từ tương lai",
      order: 1,
      content: `Nobita là cậu bé học kém, hay bị bạn bắt nạt và luôn đi trễ. Tương lai của cậu vô cùng ảm đạm: thi trượt, công ty phá sản, nợ nần chồng chất.

Chắt của Nobita – Sewashi – từ thế kỷ 22 gửi chú mèo máy Doraemon về quá khứ để giúp ông cố thay đổi số phận. Doraemon có túi bốn chiều chứa vô số bảo bối thần kỳ từ tương lai.

Ban đầu Nobita sợ và không thích Doraemon. Nhưng khi Doraemon dùng bảo bối giúp cậu, hai người dần trở thành bạn thân. Doraemon ở lại nhà Nobita và mỗi ngày lại có những cuộc phiêu lưu kỳ thú.`,
    },
    {
      title: "Chương 2: Cánh cửa thần kỳ",
      order: 2,
      content: `Một trong những bảo bối nổi tiếng nhất của Doraemon là "Cánh cửa thần kỳ" – đặt cánh cửa bất kỳ ở đâu, mở ra là đến nơi mình muốn.

Nobita dùng cánh cửa để đi học không cần đi đường, nhưng cuối cùng lại lạc vào rừng vì đặt nhầm địa điểm. Doraemon và Nobita còn dùng cánh cửa để đi du lịch khắp nơi, thăm bạn bè, hoặc trốn bố mẹ khi bị mắng.

Dù có bảo bối, Nobita vẫn thường dùng sai cách và gây ra hàng đống rắc rối. Nhưng qua mỗi lần như vậy, cậu học được bài học và trưởng thành hơn.`,
    },
  ],
  "tham-tu-lung-danh-conan": [
    {
      title: "Chương 1: Thám tử trung học bị teo nhỏ",
      order: 1,
      content: `Shinichi Kudo là thám tử trung học nổi tiếng. Trong một lần đi theo hai người đàn ông đáng ngờ tại công viên, cậu bị đánh từ phía sau và bị ép uống thứ thuốc độc bí ẩn của tổ chức áo đen.

Thay vì chết, cậu tỉnh dậy với thân hình của một đứa trẻ lớp một. Để che giấu thân phận và tiếp tục điều tra tổ chức, cậu đổi tên thành Conan Edogawa và sống tại nhà Ran – cô bạn thời thơ ấu – với danh nghĩa con của người họ hàng xa.`,
    },
    {
      title: "Chương 2: Giải mã vụ án đầu tiên",
      order: 2,
      content: `Với trí tuệ của thám tử lừng danh nhưng ngoại hình trẻ con, Conan phải nhờ ông Kogoro Mori – bố của Ran, thám tử tư hay ngủ gật – làm "bình phong" để đưa ra các suy luận.

Conan dùng súng bắn thuốc mê của tiến sĩ Agasa để khiến ông Kogoro ngủ và giả giọng ông phát biểu phá án. Vụ án đầu tiên được giải quyết, và Conan bắt đầu hành trình tìm lại hình dáng cũ trong khi phá từng vụ án.`,
    },
  ],
  "attack-on-titan": [
    {
      title: "Chương 1: Ngày tận thế – Titan phá vỡ tường",
      order: 1,
      content: `Nhân loại sống trong ba bức tường khổng lồ: Maria, Rose và Sina. Bên ngoài là thế giới của Titan – những sinh vật khổng lồ ăn thịt người.

Một ngày, Titan Siêu lớn xuất hiện, đá vỡ cổng thành. Titan bước vào, tàn sát. Eren Yeager chứng kiến mẹ mình bị ăn thịt. Cậu thề sẽ tiêu diệt toàn bộ Titan và giành lại thế giới.`,
    },
    {
      title: "Chương 2: Gia nhập Đội Tình báo",
      order: 2,
      content: `Sau khi tường Maria bị mất, Eren và bạn bè Mikasa, Armin gia nhập quân đội. Eren thể hiện quyết tâm đi vào Đội Tình báo – đơn vị ra ngoài tường chiến đấu với Titan.

Trong bài tập dùng thiết bị 3D Maneuver Gear, Eren gần như bị đuổi vì kém. Nhờ sự giúp đỡ và ý chí, cậu vượt qua. Bí mật về năng lực Titan của Eren dần hé lộ khi cậu bị một Titan nuốt và bất ngờ biến thành Titan để cứu đồng đội.`,
    },
  ],
  "demon-slayer": [
    {
      title: "Chương 1: Gia đình bị quỷ sát hại",
      order: 1,
      content: `Tanjiro Kamado sống với mẹ và các em trên núi, bán than. Một lần về nhà, cậu phát hiện cả nhà bị quỷ giết chết. Chỉ còn em gái Nezuko sống sót nhưng đã hóa quỷ.

Tanjiro quyết tâm tìm cách đưa Nezuko trở lại làm người. Gặp Giyu Tomioka – trừ tà diệt quỷ – Nezuko vẫn bảo vệ anh trai thay vì tấn công. Giyu để hai anh em đi và chỉ đường tới người thầy để Tanjiro trở thành trừ tà diệt quỷ.`,
    },
    {
      title: "Chương 2: Huấn luyện và Hơi thở Nước",
      order: 2,
      content: `Tanjiro trải qua khóa huấn luyện khắc nghiệt dưới núi với thầy Urokodaki. Nezuko ngủ trong hòm, không ăn người. Tanjiro học Hơi thở Nước – một trong các kỹ thuật chiến đấu chống quỷ.

Sau khi vượt qua kỳ tuyển chọn trên núi toàn quỷ, Tanjiro chính thức trở thành trừ tà diệt quỷ. Cậu nhận nhiệm vụ đầu tiên và cùng Nezuko bước vào thế giới đầy quỷ và máu.`,
    },
  ],
  "jujutsu-kaisen": [
    {
      title: "Chương 1: Ngón tay và Sukuna",
      order: 1,
      content: `Yuji Itadori là học sinh khỏe mạnh, sống với ông nội. Ông trước khi mất dặn Yuji "hãy giúp đỡ mọi người". Bạn học của Yuji mở con dấu của bảo vật chứa ngón tay quỷ vương Ryomen Sukuna, thu hút linh hồn quỷ vào trường.

Để cứu bạn, Yuji nuốt ngón tay và trở thành vessel của Sukuna. Thầy Gojo Satoru quyết định đưa Yuji đến trường Jujutsu, cho cậu ăn hết các ngón tay rồi hành hình để tiêu diệt Sukuna vĩnh viễn.`,
    },
    {
      title: "Chương 2: Trường Jujutsu và nhiệm vụ đầu tiên",
      order: 2,
      content: `Yuji nhập học trường Jujutsu Tokyo, gặp Megumi Fushiguro và Nobara Kugisaki. Cậu học cách kiểm soát sức mạnh và chung sống với Sukuna trong cơ thể.

Nhiệm vụ đầu tiên: giải cứu học sinh bị linh hồn quỷ bắt. Yuji dùng nắm đấm kết hợp chú lực để chiến đấu. Sukuna thỉnh thoảng chiếm thể xác, tạo ra nguy hiểm khó lường. Cuộc chiến chống lời nguyền và bảo vệ mọi người mới chỉ bắt đầu.`,
    },
  ],
  "spy-x-family": [
    {
      title: "Chương 1: Nhiệm vụ Strix – Tạo gia đình giả",
      order: 1,
      content: `Twilight – điệp viên hàng đầu của WISE – nhận nhiệm vụ Strix: tiếp cận Desmond, kẻ đe dọa hòa bình, bằng cách cho con trai vào học tại Học viện Eden danh giá. Để có con đi học, Twilight cần lập gia đình giả.

Twilight đến trại trẻ mồ côi nhận cô bé Anya – thực ra là nhà ngoại cảm đọc được suy nghĩ. Anya biết Twilight là điệp viên và rất háo hức được làm "con của điệp viên". Hai cha con giả bắt đầu tìm "mẹ" để hoàn thiện gia đình.`,
    },
    {
      title: "Chương 2: Yor – Người vợ là sát thủ",
      order: 2,
      content: `Để không bị đồng nghiệp nghi ngờ vì độc thân, Yor – sát thủ bí mật với biệt danh Cô Gái Gai – cần một người chồng giả. Cô gặp Twilight (đang dùng tên Loid Forger) tại cửa hàng.

Hai bên thỏa thuận kết hôn giả: Loid có vợ để hoàn thành hồ sơ gia đình, Yor có chồng để an toàn. Anya gọi Yor là "Mama" và vô cùng vui. Gia đình Forger chính thức thành lập – không ai biết thân phận thật của ai.`,
    },
  ],
  "chainsaw-man": [
    {
      title: "Chương 1: Denji và Pochita",
      order: 1,
      content: `Denji mắc nợ cha để lại, phải làm thợ săn quỷ trả nợ cùng con quỷ Pochita – hình chó với mũi cưa. Hai bên sống lay lắt, bị lợi dụng.

Một ngày Denji bị phản bội và giết chết. Pochita ký hợp đồng với Denji: Pochita trở thành trái tim của Denji, Denji sống lại và có thể biến thành Chainsaw Man. Denji dùng sức mạnh mới để trả thù và bắt đầu cuộc đời mới.`,
    },
    {
      title: "Chương 2: Cục An ninh Công cộng",
      order: 2,
      content: `Denji được Makima – nhân vật bí ẩn của Cục An ninh Công cộng – thu nạp. Cậu gặp Aki và Power, cùng đơn vị săn quỷ. Denji mơ ước đơn giản: được ăn no, có bạn gái.

Nhiệm vụ săn quỷ nguy hiểm liên tiếp. Power – Quỷ Xác – sống chung với Denji và Aki. Denji dần hiểu thế giới quỷ và giá trị của đồng đội, trong khi Makima luôn quan sát và dẫn dắt từ phía sau.`,
    },
  ],
  "my-hero-academia": [
    {
      title: "Chương 1: Izuku – Cậu bé không có năng lực",
      order: 1,
      content: `Trong thế giới mà hầu hết mọi người có Siêu năng lực (Quirk), Izuku Midoriya là thiểu số không có năng lực. Cậu vẫn mơ ước trở thành anh hùng như All Might – biểu tượng hòa bình số một.

Izuku bị bạn cùng lớp Bakugo bắt nạt vì "không có năng lực mà dám mơ". Một lần gặp quái vật, Izuku lao vào cứu Bakugo dù không có sức mạnh. All Might chứng kiến và quyết định trao cho Izuku One For All – năng lực tích lũy của các anh hùng.`,
    },
    {
      title: "Chương 2: Học viện UA và One For All",
      order: 2,
      content: `Sau mười tháng rèn luyện cơ thể, Izuku nhận One For All và thi đỗ vào Học viện Anh hùng UA. Cậu gặp thầy Aizawa, bạn bè và đối thủ. One For All quá mạnh, mỗi lần dùng là gãy xương.

Izuku học cách kiểm soát sức mạnh, từ "Full Cowl" 5% đến tăng dần. Cậu kết bạn với Uraraka, Iida, và tiếp tục cạnh tranh với Bakugo. Các bài học và trận chiến tại UA mở ra con đường trở thành anh hùng vĩ đại.`,
    },
  ],
  "slam-dunk": [
    {
      title: "Chương 1: Hanamichi Sakuragi – Gã đầu gấu vào đội bóng",
      order: 1,
      content: `Hanamichi Sakuragi cao to, hay đánh nhau, bị từ chối tình cảm 50 lần. Cậu vào trường Shohoku và gặp Haruko Akagi – cô gái khiến cậu phải lòng. Để gần Haruko, Hanamichi gia nhập đội bóng rổ dù chưa biết chơi.

Anh trai Haruko – Akagi – là đội trưởng đội bóng, rất nghiêm khắc. Hanamichi bộc lộ thể lực và sự bùng nổ thiên bẩm, nhưng kỹ thuật bằng không. Cậu bắt đầu hành trình từ con số 0 để trở thành cầu thủ thực thụ.`,
    },
    {
      title: "Chương 2: Trận đấu đầu tiên",
      order: 2,
      content: `Hanamichi luyện tập không ngừng: ném rổ, chạy, phòng thủ. Cậu được cho ra sân trong trận giao hữu. Dù mắc lỗi liên tục và bị chế nhạo, cậu ghi điểm nhờ khả năng bật cao và không bỏ cuộc.

Đội Shohoku có Rukawa – tài năng lạnh lùng – và Akagi – trụ cột. Hanamichi dần tìm được vị trí của mình: tranh bóng, phòng thủ và tạo cơ hội. Giấc mơ chinh phục giải quốc gia của Shohoku bắt đầu.`,
    },
  ],
  "death-note": [
    {
      title: "Chương 1: Cuốn sổ Death Note",
      order: 1,
      content: `Light Yagami là học sinh xuất sắc, cảm thấy thế giới thối nát vì tội phạm. Một ngày cậu nhặt được cuốn sổ Death Note rơi từ thế giới Shinigami: viết tên người vào sổ, người đó sẽ chết.

Light thử nghiệm và tin vào sức mạnh. Cậu quyết định dùng Death Note để tiêu diệt tội phạm, trở thành "Kira" – thần công lý trong mắt một bộ phận và kẻ giết người trong mắt cảnh sát. Cảnh sát quốc tế và thiên tài điều tra L bắt đầu truy tìm Kira.`,
    },
    {
      title: "Chương 2: Cuộc đối đầu với L",
      order: 2,
      content: `L – thám tử bí ẩn nhất thế giới – xuất hiện và thu hẹp nghi phạm. Light phải vừa che giấu thân phận vừa tiếp tục "công lý" của Kira. L đặt bẫy, Light phản bẫy, hai bên chơi trò mèo vờn chuột.

Light vào trường đại học và tiếp cận nhóm điều tra. Shinigami Ryuk – chủ nhân cũ của cuốn sổ – chỉ đứng xem vì thích thú. Cuộc chiến trí tuệ giữa Light và L leo thang, với cái chết và sự thật luôn kề cận.`,
    },
  ],
  "fullmetal-alchemist": [
    {
      title: "Chương 1: Giả kim thuật và cái giá",
      order: 1,
      content: `Edward và Alphonse Elric dùng Giả kim thuật – biến đổi vật chất theo quy luật – để cố hồi sinh mẹ đã mất. Giao dịch thất bại: Edward mất chân, Alphonse mất toàn bộ cơ thể; Edward đổi cánh tay để gắn linh hồn Al vào bộ giáp.

Hai anh em quyết tâm tìm Hòn đá Triết gia để phục hồi cơ thể. Họ trở thành Giả kim thuật sĩ Nhà nước và bắt đầu hành trình qua Amestris, đối mặt với âm mưu, quân đội và sự thật đen tối về Hòn đá.`,
    },
    {
      title: "Chương 2: Những kẻ thù và đồng minh",
      order: 2,
      content: `Ed và Al gặp Winry – bạn thời thơ ấu, thợ cơ khí chuyên chân tay giả cho Ed – và đại tá Mustang. Họ đụng độ Homunculus – sinh vật bất tử được tạo từ giao dịch cấm.

Mỗi bước đi hé lộ thêm về Hòn đá Triết gia và âm mưu của Father. Ed và Al kết bạn với những người cùng chí hướng và chiến đấu với kẻ thù mạnh hơn. Hành trình đổi lại cơ thể còn dài và đầy máu.`,
    },
  ],
};

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error("Thiếu MONGODB_URI trong .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);

  let total = 0;
  for (const [slug, chapters] of Object.entries(CHAPTERS_BY_SLUG)) {
    const story = await Story.findOne({ slug });
    if (!story) {
      console.log("Bỏ qua (không tìm thấy truyện):", slug);
      continue;
    }
    const existing = await Chapter.countDocuments({ story: story._id });
    if (existing > 0) {
      console.log("Đã có chương cho truyện", slug, "- bỏ qua.");
      continue;
    }
    const toInsert = chapters.map((ch) => ({
      story: story._id,
      title: ch.title,
      order: ch.order,
      content: ch.content,
    }));
    await Chapter.insertMany(toInsert);
    total += toInsert.length;
    console.log("Đã thêm", toInsert.length, "chương cho:", story.title);
  }

  console.log("Tổng cộng đã seed", total, "chương.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
