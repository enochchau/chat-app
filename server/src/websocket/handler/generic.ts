import WebSocket from "ws"
import * as Tracker from '../tracker/index';

export interface HandlerIds {
  group: number;
  user: number;
  friend: number;
}
export class GenericHandler{
  protected id: HandlerIds
  protected ws: WebSocket;
  protected groupTracker: Tracker.ActiveGroups;
  protected friendTracker: Tracker.ActiveFriends;

  constructor(ws: WebSocket, groupTracker: Tracker.ActiveGroups, friendTracker: Tracker.ActiveFriends){
    this.ws = ws;
    this.groupTracker = groupTracker;
    this.friendTracker = friendTracker;
    this.id.group === -1;
    this.id.friend === -1;
    this.id.user === -1;
  }
}