require('dotenv').config();

const config = {
  PORT: process.env.PORT || 500,
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite:test.db',
  SECRETKEY: process.env.SECRETKEY || "SUPERSECRETKEY",
  SYNC_DATABASE: process.env.SYNC_DATABASE || false,
}

export default config;