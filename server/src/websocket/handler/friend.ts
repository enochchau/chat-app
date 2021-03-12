import { GenericHandler, HandlerIds } from './generic';
import * as WebSocket from 'ws';
import * as Tracker from '../tracker/index';
import { WsAuthenticator } from '../auth';
import { ChatPayload, AuthPayload, ServerMessage } from '../message';
import { jwtToJwtUser } from '../../auth/jwt';

export class FriendPayloadHandler extends GenericHandler{

  constructor(ws: WebSocket, groupTracker: Tracker.ActiveGroups, friendTracker: Tracker.ActiveFriends, id: HandlerIds){
    super(ws, groupTracker, friendTracker);
    this.id = id;
  }

  public async onJoinFriend(payload: AuthPayload){
    const jwtUserInfo = jwtToJwtUser(payload.token);
    const userId = jwtUserInfo.id;
    const friendId = payload.chatId;

    try {
      const inDatabase = await WsAuthenticator.verifyFriend(userId, friendId);
      if(inDatabase){
        this.id.friend = friendId;
        this.id.user = userId;
      } else {
        this.ws.send(JSON.stringify(ServerMessage.badRequest()));
      }
    } catch (error) {
      console.error("Error verifying websocket user: ", error);
      this.ws.send(JSON.stringify(ServerMessage.serverError()));
    }
  }

  private addUserToFriendTracker(userId: number, friendId: number){
    const userIdWs = [userId, this.ws];
    this.friendTracker.add([userIdWs, null])
  }
}