import WebSocket from "ws"
import { GroupTracker }from '../tracker';

export interface HandlerIds {
  group: number;
  user: number;
}
export class GenericHandler{
  protected id: HandlerIds;
  protected ws: WebSocket;
  protected groupTracker: GroupTracker;

  constructor(ws: WebSocket, groupTracker: GroupTracker){
    this.ws = ws;
    this.groupTracker = groupTracker;
    this.id = {
      group: -1,
      user: -1,
    };
  }
}