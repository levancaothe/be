/**
 * Seed Stories — chạy: node src/seed/storiesSeed.js
 * Cần có .env với MONGODB_URI
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Story = require("../models/Story");

const CATEGORY_IDS = [
  "69b6c98b632674ce86a9e9e0",
  "69b6c9a2632674ce86a9e9e1",
  "69b6c9b1632674ce86a9e9e2",
  "69b6ca22632674ce86a9e9e9",
  "69b6ca45632674ce86a9e9eb",
  "69b6ca35632674ce86a9e9ea",
];

const STORIES = [
  {
    title: "One Piece",
    slug: "one-piece",
    description: "Monkey D. Luffy và băng Hải tặc Mũ Rơm phiêu lưu tìm kho báu One Piece để trở thành Vua Hải tặc.",
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400",
    author: "Oda Eiichiro",
    categories: ["69b6c98b632674ce86a9e9e0", "69b6c9a2632674ce86a9e9e1"],
    views: 125000,
    likes: 8900,
    status: "ongoing",
  },
  {
    title: "Thám tử lừng danh Conan",
    slug: "tham-tu-lung-danh-conan",
    description: "Shinichi Kudo bị biến thành cậu bé Conan, tiếp tục điều tra các vụ án với đội thám tử nhí.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    author: "Aoyama Gōshō",
    categories: ["69b6c9a2632674ce86a9e9e1", "69b6c9b1632674ce86a9e9e2"],
    views: 98000,
    likes: 5600,
    status: "ongoing",
  },
  {
    title: "Doraemon",
    slug: "doraemon",
    description: "Chú mèo máy từ tương lai trở về giúp Nobita bằng những bảo bối thần kỳ.",
    author: "Fujiko F. Fujio",
    categories: ["69b6c98b632674ce86a9e9e0", "69b6ca35632674ce86a9e9ea"],
    views: 210000,
    likes: 15200,
    status: "completed",
  },
  {
    title: "Attack on Titan",
    slug: "attack-on-titan",
    description: "Nhân loại sống trong thành lũy đối mặt với Titan. Eren và đồng đội quyết tâm giành lại thế giới.",
    coverImage: "https://images.unsplash.com/photo-1531259683007-3aafc20572a4?w=400",
    author: "Isayama Hajime",
    categories: ["69b6c9b1632674ce86a9e9e2", "69b6ca22632674ce86a9e9e9"],
    views: 187000,
    likes: 12400,
    status: "completed",
  },
  {
    title: "Demon Slayer",
    slug: "demon-slayer",
    description: "Tanjiro trở thành trừ tà diệt quỷ để cứu em gái Nezuko đã hóa quỷ.",
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400",
    author: "Gotōge Koyoharu",
    categories: ["69b6ca22632674ce86a9e9e9", "69b6ca45632674ce86a9e9eb"],
    views: 165000,
    likes: 11200,
    status: "completed",
  },
  {
    title: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen",
    description: "Yuji Itadori nuốt ngón tay của Sukuna và bước vào thế giới Chú thuật sư.",
    coverImage: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400",
    author: "Akutami Gege",
    categories: ["69b6ca45632674ce86a9e9eb", "69b6c98b632674ce86a9e9e0"],
    views: 142000,
    likes: 9800,
    status: "ongoing",
  },
  {
    title: "Spy x Family",
    slug: "spy-x-family",
    description: "Điệp viên Twilight tạo gia đình giả để thực hiện nhiệm vụ, không ngờ vợ là sát thủ, con gái là nhà ngoại cảm.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    author: "Endō Tatsuya",
    categories: ["69b6ca35632674ce86a9e9ea", "69b6c9a2632674ce86a9e9e1"],
    views: 95000,
    likes: 7200,
    status: "ongoing",
  },
  {
    title: "Chainsaw Man",
    slug: "chainsaw-man",
    description: "Denji ký hợp đồng với Pochita, trở thành Chainsaw Man săn quỷ để trả nợ.",
    coverImage: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400",
    author: "Fujimoto Tatsuki",
    categories: ["69b6ca45632674ce86a9e9eb", "69b6c9b1632674ce86a9e9e2"],
    views: 88000,
    likes: 6100,
    status: "ongoing",
  },
  {
    title: "My Hero Academia",
    slug: "my-hero-academia",
    description: "Xã hội siêu năng lực. Izuku Midoriya được All Might trao One For All và theo đuổi ước mơ anh hùng.",
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400",
    author: "Horikoshi Kōhei",
    categories: ["69b6c98b632674ce86a9e9e0", "69b6ca22632674ce86a9e9e9"],
    views: 134000,
    likes: 8900,
    status: "ongoing",
  },
  {
    title: "Slam Dunk",
    slug: "slam-dunk",
    description: "Hanamichi Sakuragi gia nhập đội bóng rổ Shohoku, cùng đồng đội hướng tới giải quốc gia.",
    author: "Inoue Takehiko",
    categories: ["69b6ca35632674ce86a9e9ea", "69b6ca22632674ce86a9e9e9"],
    views: 76000,
    likes: 5400,
    status: "completed",
  },
  {
    title: "Death Note",
    slug: "death-note",
    description: "Light Yagami nhặt được cuốn sổ Death Note, dùng nó để tiêu diệt tội phạm và xây dựng thế giới mới.",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    author: "Ōba Tsugumi",
    categories: ["69b6c9b1632674ce86a9e9e2", "69b6c9a2632674ce86a9e9e1"],
    views: 198000,
    likes: 13500,
    status: "completed",
  },
  {
    title: "Fullmetal Alchemist",
    slug: "fullmetal-alchemist",
    description: "Hai anh em Edward và Alphonse Elric tìm Hòn đá Triết gia để phục hồi cơ thể sau lỗi lầm giả kim thuật.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    author: "Arakawa Hiromu",
    categories: ["69b6ca45632674ce86a9e9eb", "69b6c98b632674ce86a9e9e0", "69b6ca35632674ce86a9e9ea"],
    views: 156000,
    likes: 10200,
    status: "completed",
  },
];

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error("Thiếu MONGODB_URI trong .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);

  const toInsert = STORIES.map((s) => ({
    title: s.title,
    slug: s.slug,
    description: s.description || undefined,
    coverImage: s.coverImage || undefined,
    author: s.author || "Chưa rõ",
    categories: s.categories.map((id) => new mongoose.Types.ObjectId(id)),
    views: s.views ?? 0,
    likes: s.likes ?? 0,
    status: s.status || "ongoing",
  }));

  let toInsertFiltered = toInsert;
  const existing = await Story.find({ slug: { $in: toInsert.map((x) => x.slug) } }).lean();
  if (existing.length > 0) {
    console.log("Đã bỏ qua các slug đã tồn tại:", existing.map((x) => x.slug).join(", "));
    const existingSlugs = new Set(existing.map((x) => x.slug));
    toInsertFiltered = toInsert.filter((s) => !existingSlugs.has(s.slug));
  }

  if (toInsertFiltered.length === 0) {
    console.log("Không có story mới để thêm.");
    await mongoose.disconnect();
    process.exit(0);
  }

  await Story.insertMany(toInsertFiltered);
  console.log("Đã seed", toInsertFiltered.length, "story.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
