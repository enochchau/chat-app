require('dotenv').config();

const config = {
  PORT: process.env.PORT || 500,
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite:test.db',
  SECRETKEY: process.env.SECRETKEY || "SUPERSECRETKEY",
}

export default config;