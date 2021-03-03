import config from './config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as http from 'http';
import * as WebSocket from 'ws';
import passport from 'passport';
import * as bodyParser from 'body-parser';

import ChatRoom from './chatroom';
import { sequelize } from './models/index';
import * as routes from './routes';
import * as auth from './auth';

async function initDb(){
  try{
    await sequelize.authenticate();

    if (config.SYNC_DATABASE){
      await sequelize.sync({force:true});
    }

    console.log("connected to db");
  } catch{
    console.error('unable to connect to db');
  }
}

// initialize the passport strategies
auth.init();

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/', routes.auth);
app.use('/friend', passport.authenticate("jwt", { session: false }), routes.user);

const server = http.createServer(app);

const wss = new WebSocket.Server({server:server, path:'/chat'});
const chatRoom = new ChatRoom(wss);

app.get("/", (req , res) => {
  res.json({message: "hello world"});
})

// error handler
app.use((err: Error, req: express.Request, res: express.Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({message: err.toString()});
})

initDb().
then( () => {
    server.listen(config.PORT, () => {
      console.log(`Listening at http://localhost:${config.PORT}`);
    })
  }
)
