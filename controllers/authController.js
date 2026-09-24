const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Hiển thị trang đăng nhập
exports.getLoginPage = (req, res) => {
  res.render("user/auth/login", {
    error: req.flash("error"),
    success: req.flash("success"),
    user: req.session.user,
  });
};

// Xử lý đăng nhập
exports.login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    // Tìm người dùng
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    // Kiểm tra mật khẩu
    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch && user.password === password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      isMatch = true;
    }
    if (!isMatch) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    // Thiết lập session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Chuyển hướng dựa trên vai trò
    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error");
    res.redirect("/login");
  }
};

// Hiển thị trang đăng ký
exports.getRegisterPage = (req, res) => {
  res.render("user/auth/register", {
    error: req.flash("error"),
    user: req.session.user,
  });
};

// Xử lý đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Kiểm tra mật khẩu trùng khớp
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/register");
    }

    // Kiểm tra người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash("error", "Email already registered");
      return res.redirect("/register");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error");
    res.redirect("/register");
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
