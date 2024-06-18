require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  SECRET: process.env.SECRET,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_API_SECRET: process.env.PINATA_API_SECRET,
  PINATA_JWT: process.env.PINATA_JWT,
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  MORALIS_API_KEY: process.env.MORALIS_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
};
