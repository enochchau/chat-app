import { HandlerIds, GenericHandler } from './generic';
import * as Tracker from '../tracker/index';
import { jwtToJwtUser } from '../../auth/jwt';
import { AuthPayload, ChatMessage, ServerMessage } from '../message';
import { WsAuthenticator } from '../auth';
import WebSocket from 'ws';

export class GroupPayloadHandler extends GenericHandler {
  
  constructor(ws: WebSocket, groupTracker: Tracker.ActiveGroups, friendTracker: Tracker.ActiveFriends, id: HandlerIds){
    super(ws, groupTracker, friendTracker);
    this.id = id;
  }

// verify user before adding them to the group
  public async onJoinGroup(payload: AuthPayload) {
    // parse the JWT
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

  private addUserToGroupTracker(userId: number, groupId: number){
    const userIdWs: Tracker.IdWebsocket = {id: userId, ws: this.ws};
    
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

  // ------- GROUP CHATTING
  


  private isAuthedForGroupChat(): boolean{
    if(this.id.group === -1 || this.id.user === -1) return false;
    return true;
  }
}