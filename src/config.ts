require('dotenv').config();

// process.env.NODE_ENV === 'dev'
const config = {
  PORT: process.env.PORT || 500,
  SECRETKEY: process.env.SECRETKEY || "SUPERSECRETKEY",
  DB: {
    type: "postgres" as any, 
    host: 'localhost',
    port: 5432,
    database: "chat_app_test",
    username: "test_user",
    password: 'test123',
    synchronize: true,
    logging: true,
    entities: [
      __dirname + "/enitty/*.ts"
    ]
  }
}

if (process.env.NODE_ENV === "prod"){
  config.DB.logging =  false;
  config.DB.synchronize = false;
  // parse the env.DATABSE_URL and fill in the other DB stuff
}

export { config };