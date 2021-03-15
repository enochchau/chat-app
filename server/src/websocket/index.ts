import * as WebSocket from 'ws';
import { GroupTracker } from './tracker';
import { WsHandler } from './handler';


export class ChatRoom{
  public wss: WebSocket.Server;
  private groupTracker: GroupTracker = new Map();
  constructor(wss:WebSocket.Server){
    this.wss = wss;
    this.setup();
  }

  public setup () {
    this.wss.on('connection', (ws) => {
      console.log("[WEBSOCKET] Opening new connection.");
      const wsHandler = new WsHandler(ws, this.groupTracker);
    });
  }
}