import WebSocket from "ws"
import { ChatGroup, GroupTracker } from './tracker';

import { MessageEntity } from '../entity/message';

import { jwtToJwtUser } from '../auth/jwt';
import { WsAuthenticator } from './auth';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import { ChatMessage, AuthMessage, ServerMessage } from './message';

interface HandlerIds {
  group: number;
  user: number;
}
export class WsHandler {
  private id: HandlerIds;
  private ws: WebSocket;
  private groupTracker: GroupTracker;

  constructor(ws: WebSocket, groupTracker: GroupTracker){
    this.ws = ws;
    this.groupTracker = groupTracker;
    this.id = {
      group: -1,
      user: -1,
    };

    // send new messages to the handler to parse out topic and payload
    this.ws.on('message', this.toEvent); 
    // error handler
    this.ws.on('message error', ()=> {
      console.log('[WEBSOCKET] message error');
      ws.send(JSON.stringify(ServerMessage.badRequest()));
    });

    // authenticate user and add them to a group
    this.ws.on('auth', async (message: AuthMessage) => {
      this.onAuth(message);
    });
    // send a group chat message to other users that are connected
    this.ws.on('chat', (message: ChatMessage) => {
      this.onChat(message);
    });

    this.ws.on('close', () => {
      this.onClose();
    });
  }

  private getGroup = (groupId: number): ChatGroup | undefined => this.groupTracker.get(groupId);

// ------ on message helper
  private toEvent = (message: string) => {
    // console.log('[WEBSOCKET] message: ', message);
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

      // start here
      pipe(ChatMessage.decode(event), fold(onChatLeft, onChatRight));
    } catch(err) {
      console.error("RX messsge on websocket was not a valid json: ", err);
      this.ws.emit("message error");
    }
  }

// -------CLOSIng the websocket

  private onClose(){
    const removeUserFromGroup = (currentGroup: ChatGroup) => {
      currentGroup.delete(this.ws);
    }
    const deleteEmptyGroup = () => {
      this.groupTracker.delete(this.id.group);
    }

    // remove the user from the room
    const currentGroup = this.groupTracker.get(this.id.group);
    if (currentGroup){
      removeUserFromGroup(currentGroup);

      if (currentGroup.size === 0) deleteEmptyGroup();
    }
    console.log(`[WEBSOCKET] Closing websocket for UserId: ${this.id.user} on GroupId: ${this.id.group}`);
  }

//--------------------- When a new chat message is sent out
  public async onChat(message: ChatMessage){
    const isAuthed = (): boolean => !(this.id.group === -1 || this.id.user === -1);
    const dispersePayload = (group: ChatGroup) => {
      group.forEach( ws => {
        if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message))
      });
    }

    if(isAuthed()) {
      const group = this.getGroup(this.id.group);

      if (group) {
        // logg the message into the database
        const loggedMsg = new MessageEntity();
        loggedMsg.timestamp = message.payload.timestamp;
        loggedMsg.userId = message.payload.userId;
        loggedMsg.groupId = message.payload.groupId;
        loggedMsg.message = message.payload.message;
        const reMsg = await MessageEntity.save(loggedMsg);

        // send out the logged message
        // the databse is the single source of truth
        message.payload = reMsg;

        dispersePayload(group);
      } else this.ws.send(JSON.stringify(ServerMessage.badRequest()));
    } else this.ws.send(JSON.stringify(ServerMessage.notAuthenticated()));
  }

// --------- authentication
  public async onAuth(message: AuthMessage){
    const sendValidTokenMsg = () => this.ws.send(JSON.stringify(ServerMessage.validToken()));
    const sendInvalidTokenMsg = () => this.ws.send(JSON.stringify(ServerMessage.invalidToken()));
    const storeIds = () => {
      this.id.group = groupId;
      this.id.user = userId;
    }

    const payload = message.payload;
    const jwtUserInfo = jwtToJwtUser(payload.token);

    if(!jwtUserInfo) {
      sendInvalidTokenMsg();
      return;
    }

    const userId = jwtUserInfo.id;
    const groupId = payload.groupId;
    try {
      // verify the group and user and in the DB
      const inDatabase = await WsAuthenticator.verifyGroup(userId, groupId);
      if(inDatabase){
        this.addUserToGroupTracker(this.ws, groupId);
        storeIds();
        sendValidTokenMsg();

        // send group chat history
        const messageHistory = await MessageEntity.findMessagesOfGroupId(groupId, 50, new Date());
        this.ws.send(JSON.stringify({topic: 'history', payload: messageHistory}));

      } else {
        // else tell the user it was a bad request
        this.ws.send(JSON.stringify(ServerMessage.badRequest()));
      }
    } catch(error) {
      console.error(`Error verifying websocket UserId: ${userId}, GroupId: ${groupId}: `, error);
      this.ws.send(JSON.stringify(ServerMessage.serverError()));
    }
  }
  
  private addUserToGroupTracker(ws: WebSocket, groupId: number){
    const groupExsitsInTracker = (): boolean => this.groupTracker.has(groupId);
    const createNewGroupWithWebSocket = () => this.groupTracker.set(groupId, new Set([ws]));

    if (groupExsitsInTracker()){
      const group = this.getGroup(groupId);
      if(group) group.add(ws);
    } else { 
      // group is not active so we have to create it
      createNewGroupWithWebSocket();
    }
  }
}