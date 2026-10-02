require('dotenv').config();
const Sequelize = require("sequelize");

const dialect = (process.env.DB_DIALECT || "mysql").toLowerCase();
const logging =
  process.env.NODE_ENV === "development" ? console.log : false;
let sequelize;

if (dialect === "postgres" || dialect === "postgresql") {
  require("pg");

  const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL (or DB_URL) is required when DB_DIALECT=postgres.",
    );
  }

  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging,
    dialectOptions:
      process.env.DB_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  });
} else if (dialect === "mysql") {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect,
      logging,
      port: process.env.DB_PORT,
    },
  );
} else {
  throw new Error(`Unsupported DB_DIALECT: ${dialect}`);
}

module.exports = sequelize;
