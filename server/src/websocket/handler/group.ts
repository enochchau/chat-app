import { HandlerIds, GenericHandler } from './generic';
import * as Tracker from '../tracker/index';
import { jwtToJwtUser } from '../../auth/jwt';
import * as Msg from '../message/index';
import { WsGroupAuthenticator } from '../auth';
import WebSocket from 'ws';

export class GroupChatHandler extends GenericHandler {
  
  constructor(ws: WebSocket, groupTracker: Tracker.ActiveGroups, friendTracker: Tracker.ActiveFriends, id: HandlerIds){
    super(ws, groupTracker, friendTracker);
    this.id = id;
  }
// verify user before adding them to the group
  public async onJoinGroup(payload: Msg.User.RXPayload) {
    // parse the JWT
    const jwtUserInfo = jwtToJwtUser(payload.token);
    const userId = jwtUserInfo.id;
    const groupId = payload.groupId;
    
    try {
      // verify the group and user and in the DB
      const inDatabase = await WsGroupAuthenticator.verifyInDatabase(userId, groupId);
      if(inDatabase){
        this.addUserToGroupTracker(userId, groupId);
        this.id.group = groupId;
        this.id.user = userId;
        // send group chat history
      } else {
        // else tell the user it was a bad request
        this.ws.send(JSON.stringify(Msg.Server.badRequest()));
      }
    } catch(error) {
      console.error("Error verifying webosocket user: ", error);
      this.ws.send(JSON.stringify(Msg.Server.serverError()));
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
  
  public onChatGroup(payload: Msg.User.RXPayload){
    // verify the user is authenticated before allowing to chat
    if(this.isAuthedForGroupChat()) {
      const group = this.groupTracker.get(this.id.group);
      if (!group) return;

      // LOG MESSAGE HERE
      this.dispersePayloadToGroup(group, payload);

    } else {
      this.ws.send(JSON.stringify(Msg.Server.notAuthenticated()));
    }
  }

  private dispersePayloadToGroup(group: Tracker.IdWebsocket[], payload: Msg.User.RXPayload){
    group.forEach( idws => {
      if(idws.ws.readyState === WebSocket.OPEN){
        idws.ws.send(JSON.stringify(payload))
      }
    });
  }

  private isAuthedForGroupChat(): boolean{
    if(this.id.group === -1 || this.id.user === -1) return false;
    return true;
  }
}