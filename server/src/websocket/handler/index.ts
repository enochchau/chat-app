import WebSocket from "ws"
import { ChatGroup, GroupTracker } from '../tracker';
import { GenericHandler } from './generic';

import { jwtToJwtUser } from '../../auth/jwt';
import { WsAuthenticator } from '../auth';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import { ChatMessage, AuthMessage, ServerMessage } from '../message';

export class WsHandler extends GenericHandler{
  constructor(ws: WebSocket, groupTracker: GroupTracker){
    super(ws, groupTracker);

    // send new messages to the handler to parse out topic and payload
    this.ws.on('message', this.toEvent); 
    // error handler
    this.ws.on('message error', ()=> {
      console.log('message error');
      ws.send(JSON.stringify(ServerMessage.badRequest()));
    });

    // authenticate user and add them to a group
    this.ws.on('auth', async (message: AuthMessage) => {
    });
    // send a group chat message to other users that are connected
    this.ws.on('chat', (message: ChatMessage) => {
      this.onChat(message);
    });

    this.ws.on('close', () => {
      this.onClose();
    });
  }
// ----- general helpers
  private isAuthed(): boolean{
    if(this.id.group === -1 || this.id.user === -1) return false;
    return true;
  }

  private toEvent = (message: string) => {
    try{
      const event = JSON.parse(message);

      const onAuthLeft = (errors: t.Errors) => {
        this.ws.emit("message error");
      }
      const onAuthRight = (event: AuthMessage) => {
        this.ws.emit(event.topic, event);
      }
      const onChatLeft = (errors: t.Errors) => {
        // pipe into auth checker
        pipe(AuthMessage.decode(event), fold(onAuthLeft, onAuthRight));
      }
      const onChatRight = (event: ChatMessage) => {
        this.ws.emit(event.topic, event);
      }

      pipe(ChatMessage.decode(event), fold(onChatLeft, onChatRight));
    } catch(err) {
      console.error("RX messsge on websocket was not a valid json: ", err);
      this.ws.emit("message error");
    }
  }

// -------CLOSIng the websocket

  private onClose(){
    // remove the user from the room
    const currentGroup = this.groupTracker.get(this.id.group);
    if (currentGroup){
      this.removeUserFromGroup(this.id.user, currentGroup);

      if (currentGroup.size === 0) this.deleteEmptyGroup(this.id.group, this.groupTracker);
    }
    console.log(`[WEBSOCKET] Closing websocket for UserId: ${this.id.user} on GroupId: ${this.id.group}`);
  }

  private deleteEmptyGroup(groupId: number, groupTracker: GroupTracker){
    groupTracker.delete(groupId);
  }

  private removeUserFromGroup(userId: number, group: ChatGroup){
    group.delete(userId);
  }

//--------------------- When a new chat message is sent out
  public onChat(message: ChatMessage){
    // verify the user is authenticated before allowing to chat
    if(this.isAuthed()) {
      const group = this.groupTracker.get(this.id.group);
      if (!group) {
        this.ws.send(JSON.stringify(ServerMessage.badRequest()));
        return;
      }

      // LOG MESSAGE HERE
      this.dispersePayloadToGroup(group, message);

    } else {
      this.ws.send(JSON.stringify(ServerMessage.notAuthenticated()));
    }
  }
  private dispersePayloadToGroup(group: ChatGroup, message: ChatMessage){
    group.forEach( ws => {
      if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify(message));
      }
    });
  }

// --------- authentication
  public async onJoin(message: ChatMesage){
    const payload = message.payload;

    const jwtUserInfo = jwtToJwtUser(payload.token);
    const userId = jwtUserInfo.id;
    const groupId = payload.chatId;
    try {
      // verify the group and user and in the DB
      const inDatabase = await WsAuthenticator.verifyGroup(userId, groupId);
      if(inDatabase){
        this.addUserToGroupTracker(userId, groupId);
        this.id.group = groupId;
        this.id.user = userId;
        // send group chat history
      } else {
        // else tell the user it was a bad request
        this.ws.send(JSON.stringify(ServerMessage.badRequest()));
      }
    } catch(error) {
      console.error("Error verifying websocket user: ", error);
      this.ws.send(JSON.stringify(ServerMessage.serverError()));
    }
  }
  
  private isGroupActive(groupId: number): boolean{
    if(this.groupTracker.has(groupId)) return true;
    return false;
  }

  private addUserToGroupTracker(userId: number, groupId: number){
    // verify the group is currently active
    if (this.groupTracker.has(groupId)){
      const group = this.groupTracker.get(groupId);
      // check if the user is already in the group
      if(group){
        if(!group.find(idws => idws.id === userId)){
          group.push(userIdWs);
        }
      } else { // group is not active so we have to create it
        this.groupTracker.set(groupId, [userIdWs])
      }
    }
  }
}