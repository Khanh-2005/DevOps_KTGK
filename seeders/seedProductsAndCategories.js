const fs = require("fs");
const path = require("path");
const { Category, Product, sequelize } = require("../models");

const categoriesData = [
  { name: "Điện tử & Công nghệ" },
  { name: "Thời trang & Phụ kiện" },
  { name: "Thực phẩm & Đồ uống" },
  { name: "Gia dụng & Nhà bếp" },
  { name: "Mỹ phẩm & Làm đẹp" },
];

const productsData = [
  // --- Category 1: Điện tử & Công nghệ (Index 0) ---
  {
    categoryIndex: 0,
    name: "Điện thoại Apple iPhone 15 Pro Max 256GB",
    description:
      "Màn hình Super Retina XDR OLED 6.7 inch, chip Apple A17 Pro mạnh mẽ, khung viền titan cao cấp, camera 48MP zoom quang 5x.",
    price: 1199.0,
    stock: 25,
    unit: "pieces",
    origin: "Mỹ (USA)",
    manufacturer: "Apple",
    barcode: "8938501230011",
    manufacturingDate: new Date("2024-01-10"),
    expiryDate: new Date("2029-01-10"),
  },
  {
    categoryIndex: 0,
    name: "Tai nghe chống ồn Sony WH-1000XM5",
    description:
      "Tai nghe không dây chống ồn chủ động đỉnh cao, thời lượng pin 30 giờ, âm thanh Hi-Res Audio, microphone đàm thoại sắc nét.",
    price: 349.0,
    stock: 15,
    unit: "pieces",
    origin: "Nhật Bản",
    manufacturer: "Sony",
    barcode: "8938501230028",
    manufacturingDate: new Date("2024-02-15"),
    expiryDate: new Date("2029-02-15"),
  },
  {
    categoryIndex: 0,
    name: "Laptop Apple MacBook Air 13.6 inch M2",
    description:
      "Thiết kế siêu mỏng nhẹ, chip Apple M2 8 nhân, RAM 8GB, SSD 256GB, màn hình Liquid Retina tuyệt đẹp, pin kéo dài 18 tiếng.",
    price: 999.0,
    stock: 18,
    unit: "pieces",
    origin: "Mỹ (USA)",
    manufacturer: "Apple",
    barcode: "8938501230035",
    manufacturingDate: new Date("2024-01-05"),
    expiryDate: new Date("2030-01-05"),
  },
  {
    categoryIndex: 0,
    name: "Đồng hồ thông minh Apple Watch Series 9",
    description:
      "Màn hình Retina Always-On 2000 nits, chip S9 SiP thao tác Double Tap chạm hai lần, đo nhịp tim, ECG và nồng độ oxy trong máu.",
    price: 399.0,
    stock: 30,
    unit: "pieces",
    origin: "Mỹ (USA)",
    manufacturer: "Apple",
    barcode: "8938501230042",
    manufacturingDate: new Date("2024-03-01"),
    expiryDate: new Date("2029-03-01"),
  },
  {
    categoryIndex: 0,
    name: "Loa Bluetooth Marshall Acton III",
    description:
      "Loa Bluetooth để bàn thiết kế phong cách vintage hoài cổ, công suất 60W âm trường rộng, kết nối Bluetooth 5.2 nhanh chóng.",
    price: 279.0,
    stock: 8,
    unit: "pieces",
    origin: "Vương quốc Anh",
    manufacturer: "Marshall",
    barcode: "8938501230059",
    manufacturingDate: new Date("2024-02-20"),
    expiryDate: new Date("2029-02-20"),
  },
  {
    categoryIndex: 0,
    name: "Chuột không dây Logitech MX Master 3S",
    description:
      "Chuột công thái học cao cấp, cảm biến 8000 DPI trên mọi bề mặt, con lăn điện từ MagSpeed cuộn 1000 dòng/giây, click cực êm.",
    price: 99.0,
    stock: 45,
    unit: "pieces",
    origin: "Thụy Sĩ",
    manufacturer: "Logitech",
    barcode: "8938501230066",
    manufacturingDate: new Date("2024-03-10"),
    expiryDate: new Date("2029-03-10"),
  },

  // --- Category 2: Thời trang & Phụ kiện (Index 1) ---
  {
    categoryIndex: 1,
    name: "Áo Polo nam Cotton Pique thoáng khí",
    description:
      "Chất liệu cotton dệt mắt chim cao cấp, co giãn 4 chiều, chống nhăn tự nhiên, thấm hút mồ hôi tốt, kiểu dáng lịch lãm.",
    price: 29.5,
    stock: 85,
    unit: "pieces",
    origin: "Việt Nam",
    manufacturer: "Coolmate",
    barcode: "8938501230073",
    manufacturingDate: new Date("2024-04-01"),
    expiryDate: new Date("2028-04-01"),
  },
  {
    categoryIndex: 1,
    name: "Quần Jean nam Slim Fit co giãn",
    description:
      "Vải denim cotton dày dặn co giãn nhẹ, form dáng ôm tôn dáng hiện đại, độ bền màu cao, khóa kéo YKK kim loại chống gỉ.",
    price: 45.0,
    stock: 50,
    unit: "pieces",
    origin: "Việt Nam",
    manufacturer: "An Phước",
    barcode: "8938501230080",
    manufacturingDate: new Date("2024-03-15"),
    expiryDate: new Date("2028-03-15"),
  },
  {
    categoryIndex: 1,
    name: "Áo Hoodie Unisex nỉ lót bông mềm mại",
    description:
      "Áo hoodie form rộng phong cách trẻ trung năng động, chất vải nỉ bông giữ ấm tối đa trong mùa lạnh, túi kangaroo phía trước rộng rãi.",
    price: 38.0,
    stock: 40,
    unit: "pieces",
    origin: "Việt Nam",
    manufacturer: "Dirty Coins",
    barcode: "8938501230097",
    manufacturingDate: new Date("2024-02-10"),
    expiryDate: new Date("2028-02-10"),
  },
  {
    categoryIndex: 1,
    name: "Giày Sneaker Nike Air Force 1 '07",
    description:
      "Biểu tượng sneaker toàn cầu với tông màu trắng tinh khôi, đệm khí Nike Air êm ái đàn hồi tốt, bề mặt da trơn cao cấp dễ vệ sinh.",
    price: 110.0,
    stock: 22,
    unit: "pieces",
    origin: "Việt Nam",
    manufacturer: "Nike",
    barcode: "8938501230103",
    manufacturingDate: new Date("2024-01-20"),
    expiryDate: new Date("2029-01-20"),
  },
  {
    categoryIndex: 1,
    name: "Balo chống nước đựng laptop Arctic Hunter",
    description:
      "Balo đa năng có ngăn chống sốc chuyên dụng cho laptop 15.6 inch, chất liệu vải Oxford trượt nước bền bỉ, cổng sạc USB thông minh ngoài.",
    price: 42.0,
    stock: 35,
    unit: "pieces",
    origin: "Hồng Kông",
    manufacturer: "Arctic Hunter",
    barcode: "8938501230110",
    manufacturingDate: new Date("2024-03-05"),
    expiryDate: new Date("2029-03-05"),
  },
  {
    categoryIndex: 1,
    name: "Kính mát phi công phân cực Ray-Ban Aviator",
    description:
      "Kính mát gọng kim loại mạ vàng sang trọng, tròng phân cực polarized chống lóa và ngăn chặn 100% tia tử ngoại UVA/UVB gây hại.",
    price: 165.0,
    stock: 9,
    unit: "pieces",
    origin: "Ý (Italy)",
    manufacturer: "Luxottica",
    barcode: "8938501230127",
    manufacturingDate: new Date("2024-01-15"),
    expiryDate: new Date("2029-01-15"),
  },

  // --- Category 3: Thực phẩm & Đồ uống (Index 2) ---
  {
    categoryIndex: 2,
    name: "Cà phê Arabica Cầu Đất Đà Lạt rang xay 500g",
    description:
      "Hạt cà phê Arabica thượng hạng được thu hái thủ công tại độ cao 1500m, mùi hương nồng nàn quyến rũ, vị chua thanh thoát hậu ngọt.",
    price: 12.5,
    stock: 65,
    unit: "packs",
    origin: "Lâm Đồng, Việt Nam",
    manufacturer: "Cầu Đất Farm",
    barcode: "8938501230134",
    manufacturingDate: new Date("2024-05-01"),
    expiryDate: new Date("2025-05-01"),
  },
  {
    categoryIndex: 2,
    name: "Trà Ô Long Kim Tuyên hảo hạng 250g",
    description:
      "Búp trà xanh Ô Long chế biến theo công nghệ Đài Loan truyền thống, vị chát dịu êm, thoảng hương sữa hoa cỏ thơm ngọt tự nhiên.",
    price: 16.0,
    stock: 45,
    unit: "boxes",
    origin: "Lâm Đồng, Việt Nam",
    manufacturer: "Tâm Châu",
    barcode: "8938501230141",
    manufacturingDate: new Date("2024-04-10"),
    expiryDate: new Date("2026-04-10"),
  },
  {
    categoryIndex: 2,
    name: "Hạt Macca sấy nứt vỏ Đắk Lắk loại 1 500g",
    description:
      "Hạt macca sấy giòn thơm béo ngậy, giàu vitamin E, canxi và Omega-3 tốt cho hệ tim mạch và trí não, đi kèm dụng cụ tách vỏ.",
    price: 14.0,
    stock: 55,
    unit: "boxes",
    origin: "Đắk Lắk, Việt Nam",
    manufacturer: "Tây Nguyên Food",
    barcode: "8938501230158",
    manufacturingDate: new Date("2024-05-15"),
    expiryDate: new Date("2025-05-15"),
  },
  {
    categoryIndex: 2,
    name: "Mật ong hoa rừng tràm nguyên chất U Minh 1000ml",
    description:
      "Mật ong tự nhiên 100% từ rừng tràm U Minh nguyên sinh, màu cánh gián vàng óng, độ sánh đậm đặc, giàu chất kháng khuẩn tự nhiên.",
    price: 21.0,
    stock: 28,
    unit: "liters",
    origin: "Cà Mau, Việt Nam",
    manufacturer: "U Minh Honey",
    barcode: "8938501230165",
    manufacturingDate: new Date("2024-03-20"),
    expiryDate: new Date("2026-03-20"),
  },
  {
    categoryIndex: 2,
    name: "Yến mạch nguyên hạt cán dẹt Quaker Oats 1kg",
    description:
      "Yến mạch hữu cơ nhập khẩu trực tiếp từ Mỹ, giàu chất xơ hòa tan beta-glucan giúp no lâu, hỗ trợ giảm cân và bảo vệ tim mạch hiệu quả.",
    price: 8.5,
    stock: 75,
    unit: "kg",
    origin: "Mỹ (USA)",
    manufacturer: "Quaker Oats",
    barcode: "8938501230172",
    manufacturingDate: new Date("2024-04-01"),
    expiryDate: new Date("2025-10-01"),
  },
  {
    categoryIndex: 2,
    name: "Socola đen Lindt Excellence 85% Cacao Thụy Sĩ 100g",
    description:
      "Thanh sô cô la đen nguyên chất 85% cacao thượng hạng từ Thụy Sĩ, vị đắng dịu hòa quyện hương vị trái cây khô và gỗ sồi sang trọng.",
    price: 6.8,
    stock: 90,
    unit: "pieces",
    origin: "Thụy Sĩ",
    manufacturer: "Lindt & Sprüngli",
    barcode: "8938501230189",
    manufacturingDate: new Date("2024-02-10"),
    expiryDate: new Date("2025-08-10"),
  },

  // --- Category 4: Gia dụng & Nhà bếp (Index 3) ---
  {
    categoryIndex: 3,
    name: "Nồi chiên không dầu Philips XXL 7.2L HD9285",
    description:
      "Nồi chiên thông minh kết nối Wifi điều khiển từ xa, công nghệ Rapid Air giảm 90% chất béo, giỏ chiên dung tích lớn chế biến cả con gà.",
    price: 189.0,
    stock: 16,
    unit: "pieces",
    origin: "Hà Lan",
    manufacturer: "Philips",
    barcode: "8938501230196",
    manufacturingDate: new Date("2024-01-20"),
    expiryDate: new Date("2029-01-20"),
  },
  {
    categoryIndex: 3,
    name: "Robot hút bụi lau nhà Roborock Q Revo",
    description:
      "Lực hút 5500Pa cực mạnh, trạm sạc tự giặt và sấy khô giẻ lau bằng luồng khí nóng, cảm biến LiDAR lập bản đồ nhà 3D chính xác.",
    price: 699.0,
    stock: 7,
    unit: "pieces",
    origin: "Trung Quốc",
    manufacturer: "Roborock",
    barcode: "8938501230202",
    manufacturingDate: new Date("2024-03-01"),
    expiryDate: new Date("2029-03-01"),
  },
  {
    categoryIndex: 3,
    name: "Bộ nồi chảo Inox 304 nguyên khối Elmich 4 món",
    description:
      "Bộ nồi chảo inox 304 3 lớp đúc liền khối tỏa nhiệt đều và giữ nhiệt lâu, không sinh chất độc hại khi đun nấu, dùng tốt trên bếp từ.",
    price: 125.0,
    stock: 20,
    unit: "boxes",
    origin: "Cộng hòa Séc",
    manufacturer: "Elmich",
    barcode: "8938501230219",
    manufacturingDate: new Date("2024-02-05"),
    expiryDate: new Date("2034-02-05"),
  },
  {
    categoryIndex: 3,
    name: "Máy xay sinh tố cầm tay Braun MultiQuick 5 MQ5235",
    description:
      "Công suất mạnh 1000W với 21 tốc độ điều khiển thông minh, công nghệ lưỡi dao chuông xoắn PowerBell xay nhuyễn thực phẩm nhanh chóng.",
    price: 79.0,
    stock: 32,
    unit: "pieces",
    origin: "Đức",
    manufacturer: "Braun",
    barcode: "8938501230226",
    manufacturingDate: new Date("2024-03-12"),
    expiryDate: new Date("2029-03-12"),
  },
  {
    categoryIndex: 3,
    name: "Ấm siêu tốc thông minh Xiaomi Smart Kettle Pro",
    description:
      "Bình đun nước siêu tốc dung tích 1.5L ruột inox 304 nguyên khối, màn hình kỹ thuật số hiển thị nhiệt độ, hỗ trợ giữ nhiệt đến 12 tiếng.",
    price: 42.0,
    stock: 28,
    unit: "pieces",
    origin: "Trung Quốc",
    manufacturer: "Xiaomi",
    barcode: "8938501230233",
    manufacturingDate: new Date("2024-04-05"),
    expiryDate: new Date("2029-04-05"),
  },
  {
    categoryIndex: 3,
    name: "Máy lọc không khí Levoit Core 300S Smart HEPA",
    description:
      "Bộ lọc HEPA H13 loại bỏ 99.97% hạt bụi siêu mịn PM2.5, phấn hoa và mùi hôi khó chịu, vận hành cực êm ái thích hợp cho phòng ngủ.",
    price: 119.0,
    stock: 14,
    unit: "pieces",
    origin: "Mỹ (USA)",
    manufacturer: "Levoit",
    barcode: "8938501230240",
    manufacturingDate: new Date("2024-02-18"),
    expiryDate: new Date("2029-02-18"),
  },

  // --- Category 5: Mỹ phẩm & Làm đẹp (Index 4) ---
  {
    categoryIndex: 4,
    name: "Kem chống nắng kiểm soát dầu La Roche-Posay Anthelios 50ml",
    description:
      "Chống nắng quang phổ rộng SPF50+ bảo vệ da trước tia UVA/UVB dài, kiềm dầu suốt 8 giờ, kết cấu khô thoáng không bóng nhờn.",
    price: 19.5,
    stock: 65,
    unit: "pieces",
    origin: "Pháp",
    manufacturer: "La Roche-Posay",
    barcode: "8938501230257",
    manufacturingDate: new Date("2024-03-01"),
    expiryDate: new Date("2027-03-01"),
  },
  {
    categoryIndex: 4,
    name: "Serum rau má Skin1004 Madagascar Centella 100ml",
    description:
      "Tinh chất rau má nguyên chất 100% từ vùng đảo Madagascar giúp làm dịu nốt mụn, phục hồi và củng cố hàng rào bảo vệ da khỏe mạnh.",
    price: 15.0,
    stock: 50,
    unit: "pieces",
    origin: "Hàn Quốc",
    manufacturer: "Skin1004",
    barcode: "8938501230264",
    manufacturingDate: new Date("2024-04-15"),
    expiryDate: new Date("2027-04-15"),
  },
  {
    categoryIndex: 4,
    name: "Nước tẩy trang Bioderma Sensibio H2O hồng 500ml",
    description:
      "Nước tẩy trang dịu nhẹ cho da nhạy cảm số 1 tại Pháp, công nghệ micellar water làm sạch sâu lớp makeup và bụi bẩn mà không làm khô da.",
    price: 18.0,
    stock: 45,
    unit: "pieces",
    origin: "Pháp",
    manufacturer: "Bioderma",
    barcode: "8938501230271",
    manufacturingDate: new Date("2024-02-01"),
    expiryDate: new Date("2027-02-01"),
  },
  {
    categoryIndex: 4,
    name: "Kem dưỡng phục hồi da Dear Klairs Midnight Blue 60ml",
    description:
      "Chiết xuất cúc La Mã Guaiazulene sắc xanh tự nhiên giúp làm dịu làn da cháy nắng hoặc sau tổn thương mụn, dưỡng ẩm sâu ban đêm.",
    price: 22.0,
    stock: 35,
    unit: "pieces",
    origin: "Hàn Quốc",
    manufacturer: "Dear, Klairs",
    barcode: "8938501230288",
    manufacturingDate: new Date("2024-03-10"),
    expiryDate: new Date("2027-03-10"),
  },
  {
    categoryIndex: 4,
    name: "Son kem lì Black Rouge Air Fit Velvet Tint Ver 8",
    description:
      "Chất son velvet nhung xốp mịn lướt nhẹ trên môi, khả năng bám màu lâu trôi, sắc son thời thượng không lộ vân môi.",
    price: 11.5,
    stock: 85,
    unit: "pieces",
    origin: "Hàn Quốc",
    manufacturer: "Black Rouge",
    barcode: "8938501230295",
    manufacturingDate: new Date("2024-04-20"),
    expiryDate: new Date("2027-04-20"),
  },
  {
    categoryIndex: 4,
    name: "Sữa rửa mặt tạo bọt CeraVe Foaming Cleanser 473ml",
    description:
      "Chứa 3 loại Ceramide thiết yếu, Niacinamide và Hyaluronic Acid giúp loại bỏ bã nhờn dư thừa mà không phá vỡ hàng rào ẩm tự nhiên của da.",
    price: 17.5,
    stock: 40,
    unit: "pieces",
    origin: "Mỹ (USA)",
    manufacturer: "CeraVe",
    barcode: "8938501230301",
    manufacturingDate: new Date("2024-01-25"),
    expiryDate: new Date("2027-01-25"),
  },
];

async function seedData() {
  try {
    console.log("Starting seeding process...");

    // 1. Prepare images directory and ensure 30 product images exist
    const productsUploadDir = path.join(
      __dirname,
      "../public/uploads/products",
    );
    if (!fs.existsSync(productsUploadDir)) {
      fs.mkdirSync(productsUploadDir, { recursive: true });
    }

    const existingFiles = fs
      .readdirSync(productsUploadDir)
      .filter((f) => f.endsWith(".jpg") || f.endsWith(".png"));
    const baseSource =
      existingFiles.length > 0
        ? path.join(productsUploadDir, existingFiles[0])
        : null;

    const assignedImages = [];
    for (let i = 0; i < productsData.length; i++) {
      const fileName = `product-${i + 1}.jpg`;
      const targetPath = path.join(productsUploadDir, fileName);

      // If target file doesn't exist, copy from an existing image if available
      if (!fs.existsSync(targetPath)) {
        if (existingFiles.length > 0) {
          const srcFile = path.join(
            productsUploadDir,
            existingFiles[i % existingFiles.length],
          );
          fs.copyFileSync(srcFile, targetPath);
        } else if (baseSource) {
          fs.copyFileSync(baseSource, targetPath);
        }
      }

      assignedImages.push(`/uploads/products/${fileName}`);
    }

    // Also ensure fallback images in public/images
    const imagesDir = path.join(__dirname, "../public/images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    if (existingFiles.length > 0) {
      const sampleImg = path.join(productsUploadDir, existingFiles[0]);
      const defaultProduct = path.join(imagesDir, "default-product.jpg");
      const defaultCategory = path.join(imagesDir, "default-category.jpg");
      const heroBg = path.join(imagesDir, "hero-bg.jpg");

      if (!fs.existsSync(defaultProduct))
        fs.copyFileSync(sampleImg, defaultProduct);
      if (!fs.existsSync(defaultCategory))
        fs.copyFileSync(sampleImg, defaultCategory);
      if (!fs.existsSync(heroBg)) fs.copyFileSync(sampleImg, heroBg);
    }

    // 2. Create or find Categories
    const createdCategories = [];
    for (const catData of categoriesData) {
      let category = await Category.findOne({ where: { name: catData.name } });
      if (!category) {
        category = await Category.create(catData);
        console.log(`Created Category: ${category.name} (ID: ${category.id})`);
      } else {
        console.log(
          `Category already exists: ${category.name} (ID: ${category.id})`,
        );
      }
      createdCategories.push(category);
    }

    // 3. Create Products
    for (let i = 0; i < productsData.length; i++) {
      const pData = productsData[i];
      const category = createdCategories[pData.categoryIndex];
      const imagePath = assignedImages[i];

      const existingProduct = await Product.findOne({
        where: { name: pData.name },
      });

      if (!existingProduct) {
        await Product.create({
          name: pData.name,
          description: pData.description,
          price: pData.price,
          stock: pData.stock,
          unit: pData.unit,
          origin: pData.origin,
          manufacturer: pData.manufacturer,
          barcode: pData.barcode,
          manufacturingDate: pData.manufacturingDate,
          expiryDate: pData.expiryDate,
          image: imagePath,
          categoryId: category.id,
        });
        console.log(`Created Product ${i + 1}/30: ${pData.name}`);
      } else {
        console.log(`Product already exists: ${pData.name}`);
      }
    }

    const totalCategories = await Category.count();
    const totalProducts = await Product.count();
    console.log(`\n--- Seeding Complete ---`);
    console.log(`Total Categories in DB: ${totalCategories}`);
    console.log(`Total Products in DB: ${totalProducts}`);
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

if (require.main === module) {
  seedData().then(() => {
    process.exit(0);
  });
}

module.exports = seedData;
