import WebSocket from "ws"
import * as Tracker from '../tracker/index';
import * as Msg from '../message/index';
import { GenericHandler } from './generic';
import { GroupChatHandler } from "./group";

export class WsHandler extends GenericHandler{
  private groupChatHandler: GroupChatHandler;

  constructor(ws: WebSocket, groupTracker: Tracker.ActiveGroups, friendTracker: Tracker.ActiveFriends){
    super(ws, groupTracker, friendTracker);

    this.groupChatHandler = new GroupChatHandler(this.ws, this.groupTracker, this.friendTracker, this.id);

    // send new messages to the handler to parse out topic and payload
    this.ws.on('message', this.toEvent); 
    // error handler
    this.ws.on('message error', ()=> {
      console.log('message error');
      ws.send(JSON.stringify(Msg.Server.badRequest()));
    });

    // authenticate user and add them to a group
    this.ws.on('join group', async (payload: Msg.User.RXPayload) => {
      await this.groupChatHandler.onJoinGroup(payload);
    });
    // send a group chat message to other users that are connected
    this.ws.on('chat group', (payload: Msg.User.RXPayload) => {
      this.groupChatHandler.onChatGroup(payload);
    });

    this.ws.on('close', () => {
      this.onClose();
    });
  }
// ----- general helpers
  private isAuthedForFriendChat(): boolean{
    if(this.id.friend === -1 || this.id.user === -1) return false;
    return true;
  }

  private toEvent = (message: string) => {
    try{
      const event: Msg.User.RXMessage = JSON.parse(message);
      this.ws.emit(event.topic, event.payload);
    } catch(err) {
      console.error("RX messsge on websocket was not a valid json.");
      this.ws.emit("message error");
    }
  }

// -------CLOSIng the websocket

  private onClose(){
    // remove the user from the room
    const currentGroup = this.groupTracker.get(this.id.group);
    if (currentGroup){
      this.removeUserFromGroup(this.id.user, currentGroup);

      if (currentGroup.length === 0)
        this.deleteEmptyGroup(this.groupTracker, this.id.group);
    }
    console.log("closing websocket");
  }

  private deleteEmptyGroup(groupTracker: Tracker.ActiveGroups, groupId: number){
    groupTracker.delete(groupId);
  }

  private removeUserFromGroup(userId: number, group: Array<Tracker.IdWebsocket>){
    const userIndex = group.findIndex(idws => idws.id === userId);
    if (userIndex !== -1){
      group.splice(1, userIndex);
    } 
  }

}