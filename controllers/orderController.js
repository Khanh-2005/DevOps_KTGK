const { Order, OrderItem, Product, User } = require("../models");
const moment = require("moment");

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { fullName, phone, email, address, city, district, ward, note } =
      req.body;

    // Lấy giỏ hàng từ session
    const cart = req.session.cart || [];
    if (cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Tạo đơn hàng
    const order = await Order.create({
      userId: req.session.user.id,
      fullName,
      phone,
      email,
      address,
      city,
      district,
      ward,
      note,
      status: "pending",
      totalAmount: 0,
    });

    // Tạo chi tiết đơn hàng và tính tổng tiền
    let totalAmount = 0;
    for (const item of cart) {
      const product = await Product.findByPk(item.productId);
      if (!product) continue;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;

      // Cập nhật số lượng tồn kho
      await product.update({
        stock: product.stock - item.quantity,
      });
    }

    // Cập nhật tổng tiền đơn hàng
    await order.update({ totalAmount });

    // Xóa giỏ hàng
    req.session.cart = [];
    await req.session.save();

    res.json({
      message: "Order created successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Xem chi tiết đơn hàng (cho user)
exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.session.user.id,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.render("user/order-detail", {
      order,
      user: req.session.user,
      moment: moment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Admin: Xem danh sách đơn hàng
exports.getAdminOrderList = async (req, res) => {
  try {
    if (req.session.user.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["name", "price"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.render("admin/orders", {
      orders,
      user: req.session.user,
      moment: moment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Admin: Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status });

    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
