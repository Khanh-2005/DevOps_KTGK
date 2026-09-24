require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const sequelize = require("./config/database");
const models = require("./models");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const createDefaultAccounts = require("./seeders/createDefaultAccounts");
const seedProductsAndCategories = require("./seeders/seedProductsAndCategories");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using https
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Method override và flash messages
app.use(methodOverride("_method"));
app.use(flash());

// Routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

// Đăng ký routes
app.use("/admin", adminRoutes);
app.use("/", userRoutes);
app.use("/cart", cartRoutes);
app.use("/", authRoutes);
app.use("/orders", orderRoutes);
app.use("/order", orderRoutes);
app.use("/", profileRoutes);

// Sync database
sequelize
  .sync({ alter: true })
  .then(async () => {
    await createDefaultAccounts();
    await seedProductsAndCategories();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
