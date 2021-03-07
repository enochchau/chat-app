import { ServerMessage } from './servermesssage';
import * as WebSocket from 'ws';
import { jwtToJwtUser } from '../auth/jwt';
import { GroupEntity } from '../entity/group';
import { UserEntity } from '../entity/user';
import { WsGroupAuthenticator } from './auth';
import { WsHandler } from './wshandler';

// generic websocket message
export interface GenericWSMessage<T extends GenericWSPayload> {
  topic: "server" | "error" | "join group" | "chat group" | "join friend" | "chat friend";
  payload: T;
}
export interface GenericWSPayload {
  timestamp: Date;
  message: string;
}

// interface for user id and associated websocket
export interface IdWebsocket {
  id: number;
  ws: WebSocket;
}

export class ChatRoom{
  public wss: WebSocket.Server;
  // groupMap = Map<group.id, Array<user.id>>
  private groupMap: Map<number, Array<IdWebsocket>> = new Map();
  // friendMap = Map<friendId, userId>
  private friendMap: Map<number, number> = new Map();
  constructor(wss:WebSocket.Server){
    this.wss = wss;
    this.setup();
  }

  public setup () {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log("opening websocket");
      const wsHandler = new WsHandler(ws, this.groupMap, this.friendMap);
    });
  }
}