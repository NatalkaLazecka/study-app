import dotenv from 'dotenv'
dotenv.config()

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_SSL_CA",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const env = {
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  DB_SSL_CA: process.env.DB_SSL_CA,
};
export const PORT = process.env.PORT || 8080
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
export const RESEND_API_KEY = process.env.RESEND_API_KEY
