import config from './config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as http from 'http';
import * as WebSocket from 'ws';
import ChatRoom from './chatroom';
import * as models from './models';
import sequelize from './db';

async function initDb(){
  try{
    await sequelize.authenticate();
    // await sequelize.sync({force:true});
    // await models.User.sync({force:true});
    // await models.Group.sync({force:true});

    console.log("connected to db");
  } catch{
    console.error('unable to connect to db');
  }
}


const app = express();
app.use(cors());
app.use(helmet());

const server = http.createServer(app);

const wss = new WebSocket.Server({server:server, path:'/chat'});
const chatRoom = new ChatRoom(wss);

app.get("/", (req , res) => {
  res.json({message: "hello world"});
})


initDb().
then( () => {
    server.listen(config.PORT, () => {
      console.log(`Listening at http://localhost:${config.PORT}`);
    })
  }
)
