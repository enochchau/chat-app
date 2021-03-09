import * as WebSocket from 'ws';
import * as Tracker from './tracker/index';
import { WsHandler } from './handler';


export class ChatRoom{
  public wss: WebSocket.Server;
  private groupMap: Tracker.ActiveGroups = new Map();
  private friendMap: Tracker.ActiveFriends = new Tracker.ActiveFriends();
  constructor(wss:WebSocket.Server){
    this.wss = wss;
    this.setup();
  }

  public setup () {
    this.wss.on('connection', (ws) => {
      console.log("opening websocket");
      const wsHandler = new WsHandler(ws, this.groupMap, this.friendMap);
    });
  }
}