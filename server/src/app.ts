import { config } from './config';
// typeORM
import "reflect-metadata";
import {createConnection} from "typeorm";
// server middleware
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as http from 'http';
import * as WebSocket from 'ws';
// authentication
import passport from 'passport';
import { PassportStrategy } from './auth/auth';
// routes
import { ChatRoom } from './websocket';
import { AuthRouter } from './routes/auth';
import { FriendRouter } from './routes/friendship';
import { GroupRouter } from './routes/group';

export class App {
  public app = express();

  constructor() {
    PassportStrategy.initialize();

    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: false}));
    this.app.use(express.json());
    this.app.use(passport.initialize());

    // create routes
    const authRoutes = new AuthRouter();
    this.app.use('/api/auth', authRoutes.router); 
    const friendRoutes = new FriendRouter();
    this.app.use('/api/friend', passport.authenticate("jwt", { session: false }), friendRoutes.router);
    const groupRoutes = new GroupRouter();
    this.app.use('/api/group', passport.authenticate("jwt", { session: false }), groupRoutes.router);

    // test route
    this.app.get("/", (req , res) => {
      res.json({message: "hello world"});
    })

    // error handler
    this.app.use((err: Error, req: express.Request, res: express.Response, next: any) => {
      console.error(err.stack);
      res.status(500).json({message: err.toString()});
    })
  }

  public createWebsocketServer() {
    // initialize websocket
    const server = http.createServer(this.app);

    const wss = new WebSocket.Server({
      server: server, 
      path:'/chat',
    });
    const chatRoom = new ChatRoom(wss);

    return server;
  }

  public createServer(){
    const server = http.createServer(this.app);
    return server;
  }
}

if(require.main === module){

  createConnection()
  .then((connection) => {
    const app = new App();
    const server = app.createWebsocketServer();

    // start server
    server.listen(config.PORT, () => {
      console.log(`Listening at http://localhost:${config.PORT}`);
    })
  })
  .catch((err) => console.error(err));
}