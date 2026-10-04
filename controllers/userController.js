const { Product, Category } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const PRODUCT_COLLECTION_SIZE = 16;

const getCollectionProductIds = async (collection) => {
  if (collection !== "new-arrivals" && collection !== "featured") {
    return null;
  }

  const products = await Product.findAll({
    attributes: ["id"],
    order: [["id", "DESC"]],
    limit: PRODUCT_COLLECTION_SIZE,
    offset: collection === "featured" ? PRODUCT_COLLECTION_SIZE : 0,
  });

  return products.map((product) => product.id);
};

// Trang chủ
exports.getHomePage = async (req, res) => {
  try {
    const [products, categories] = await Promise.all([
      Product.findAll({
        include: [{ model: Category, as: "category" }],
        order: [["id", "DESC"]],
        limit: PRODUCT_COLLECTION_SIZE * 2,
      }),
      Category.findAll(),
    ]);

    res.render("user/home", {
      newArrivals: products.slice(0, PRODUCT_COLLECTION_SIZE),
      featuredProducts: products.slice(
        PRODUCT_COLLECTION_SIZE,
        PRODUCT_COLLECTION_SIZE * 2
      ),
      categories,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Danh sách sản phẩm với bộ lọc
exports.getProducts = async (req, res) => {
  try {
    const { category, collection, search, sort } = req.query;
    let where = {};
    let order = [];

    const collectionProductIds = await getCollectionProductIds(collection);
    if (collectionProductIds) {
      where.id = { [Op.in]: collectionProductIds };
    }

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (sort) {
      switch (sort) {
        case "price_asc":
          order.push(["price", "ASC"]);
          break;
        case "price_desc":
          order.push(["price", "DESC"]);
          break;
      }
    }

    if (collectionProductIds && order.length === 0) {
      order.push(["id", "DESC"]);
    }

    const products = await Product.findAll({
      where,
      order,
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    const currentCategory = category ? await Category.findByPk(category) : null;

    res.render("user/products", {
      products,
      categories,
      currentCategory,
      collection:
        collection === "new-arrivals" || collection === "featured"
          ? collection
          : "",
      search,
      sort,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Chi tiết sản phẩm
exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }],
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const relatedProducts = product.categoryId
      ? await Product.findAll({
          where: {
            categoryId: product.categoryId,
            id: { [Op.ne]: product.id },
          },
          include: [{ model: Category, as: "category" }],
          limit: 4,
          order: [["id", "DESC"]],
        })
      : [];

    return res.render("user/product-detail", {
      product,
      relatedProducts,
      moment,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};

// Danh sách sản phẩm theo danh mục
exports.getCategoryProducts = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    const { collection, search, sort } = req.query;
    const where = { categoryId: category.id };
    const order = [];

    const collectionProductIds = await getCollectionProductIds(collection);
    if (collectionProductIds) {
      where.id = { [Op.in]: collectionProductIds };
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (sort === "price_asc") {
      order.push(["price", "ASC"]);
    } else if (sort === "price_desc") {
      order.push(["price", "DESC"]);
    } else if (collectionProductIds) {
      order.push(["id", "DESC"]);
    }

    const [products, categories] = await Promise.all([
      Product.findAll({
        where,
        order,
        include: [{ model: Category, as: "category" }],
      }),
      Category.findAll({ order: [["name", "ASC"]] }),
    ]);

    return res.render("user/products", {
      products,
      categories,
      currentCategory: category,
      collection:
        collection === "new-arrivals" || collection === "featured"
          ? collection
          : "",
      search,
      sort,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};

// Trang tổng hợp danh mục
exports.getCategoriesPage = async (req, res) => {
  try {
    const [categories, products] = await Promise.all([
      Category.findAll({ order: [["name", "ASC"]] }),
      Product.findAll({
        include: [{ model: Category, as: "category" }],
        order: [["id", "DESC"]],
      }),
    ]);

    return res.render("user/products", {
      products,
      categories,
      currentCategory: null,
      search: "",
      sort: "",
      user: req.session.user || null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};
