import * as WebSocket from 'ws';
import { ActiveFriendChat } from './user_tracker/activefriendchat';
import { WsHandler } from './wshandler';
import { IdWebsocket, IdWsPair } from './user_tracker/idwebsocket';

// generic websocket message
export interface GenericWSMessage<T extends GenericWSPayload> {
  topic: "server" | "error" | "join group" | "chat group" | "join friend" | "chat friend";
  payload: T;
}
export interface GenericWSPayload {
  timestamp: Date;
  message: string;
}

export type ActiveChatGroups = Map<number, Map<number, IdWebsocket>>;

export class ChatRoom{
  public wss: WebSocket.Server;
  // groupMap = Map<group.id, Array<user.id>>
  private groupMap: ActiveChatGroups = new Map();
  // friendMap = Map<friendId, userId>
  private friendMap: ActiveFriendChat = new ActiveFriendChat();
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