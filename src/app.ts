import config from './config';
// typeORM
import "reflect-metadata";
import {createConnection} from "typeorm";
// server stuff
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as bodyParser from 'body-parser';
// authentication
import passport from 'passport';
import * as auth from './auth';
// routes
import ChatRoom from './chatroom';
import authroutes from './routes/auth';
import UserRouter from './routes/user';

createConnection()
.then( async (connection) => {
  // initialize the passport strategies
  auth.init();

  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());

  app.use('/', authroutes);
  const userRoutes = new UserRouter();
  app.use('/friend', passport.authenticate("jwt", { session: false }), userRoutes.router);

  // initialize websocket
  const server = http.createServer(app);

  const wss = new WebSocket.Server({server:server, path:'/chat'});
  const chatRoom = new ChatRoom(wss);

  // test
  app.get("/", (req , res) => {
    res.json({message: "hello world"});
  })

  // error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({message: err.toString()});
  })

  // start server
  server.listen(config.PORT, () => {
    console.log(`Listening at http://localhost:${config.PORT}`);
  })
})
.catch((err) => console.error(err));