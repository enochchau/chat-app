import config from './config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as http from 'http';
import * as WebSocket from 'ws';
import ChatRoom from './websocket';

const app = express();
app.use(cors());
app.use(helmet());

const server = http.createServer(app);

const wss = new WebSocket.Server({server:server, path:'/chat'});
const chatRoom = new ChatRoom(wss);

app.get("/", (req , res) => {
  res.json({message: "hello world"});
})

server.listen(config.PORT, () => {
  console.log(`Listening at http://localhost:${config.PORT}`);
})
