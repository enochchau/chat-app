require('dotenv').config();
const NODE_ENV = process.env.NODE_ENV;

let config =  {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "database": "chat_app_test",
  "username": "test_user",
  "password": "test123",
  "synchronize": true,
  "logging": true,
  "entities": [
    "src/entity/**/*.ts"
  ]
}

if (NODE_ENV === 'prod'){
  config = {
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "database": "chat_app_test",
    "username": "test_user",
    "password": "test123",
    "synchronize": false,
    "logging": false,
    "entities": [
      "build/entity/**/*.js"
    ]
  }
}

if (NODE_ENV === "test"){
  config =  {
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "database": "chat_app_test",
    "username": "test_user",
    "password": "test123",
    "synchronize": true,
    "logging": false,
    "entities": [
      "src/entity/**/*.ts"
    ]
  }
}

module.exports = config;