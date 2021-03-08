require('dotenv').config();

// process.env.NODE_ENV === 'dev'
const config = {
  PORT: process.env.PORT || 5000,
  SECRETKEY: process.env.SECRETKEY || "SUPERSECRETKEY",
}

export { config };