import { ServerMessage } from './servermesssage';
import * as WebSocket from 'ws';
import { jwtToJwtUser } from '../auth/jwt';
import { GroupEntity } from '../entity/group';
import { UserEntity } from '../entity/user';

// generic websocket message
export interface GenericWSMessage<T extends GenericWSPayload> {
  topic: "server" | "error" | "join room" | "chat" | 'history';
  payload: T;
}
export interface GenericWSPayload {
  timestamp: Date;
  message: string;
}
// RX User message
interface RXMessage extends GenericWSMessage<RXPayload> {
  payload: RXPayload
}
interface RXPayload extends GenericWSPayload{
  token: string;
  room: number;
}
// TX User message
interface TXMessage extends GenericWSMessage<TXPayload>{
  payload: TXPayload
}
interface TXPayload extends GenericWSPayload{
  room: number;
  userId: number;
}

// interface for user id and associated websocket
interface IdWebsocket {
  id: number;
  ws: WebSocket;
}

export class ChatRoom{
  public wss: WebSocket.Server;
  // rooms = Map<group.id, Array<user.id>>
  private rooms: Map<number, Array<IdWebsocket>> = new Map();

  constructor(wss:WebSocket.Server){
    this.wss = wss;
    this.setup();
  }

  public setup () {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log("opening websocket");
      // used to store the current state of this websocket
      let roomId: number;
      let userId: number;
      const toEvent = (message: string) => {
        try{
          console.log("parsing incoming message");
          const event: RXMessage = JSON.parse(message);
          ws.emit(event.topic, event.payload);
        } catch(err) {
          console.error("RX messsge on websocket was not a valid json.");
          ws.emit("message error");
        }
      }

      // forward messages to the event emitter
      ws.on('message', toEvent); 
      ws.on('message error', ()=> {
        console.log('message error');
        ws.send(JSON.stringify(ServerMessage.badRequest()));
      })

      ws.on('join room', async (payload: RXPayload) => {
        // parses the token
        // checks that the user and room both exist and that the user can be in that room
        // returns the userId
        const authenticate = async (token: string, room: number): Promise<number | undefined> => {
          const jwtUserInfo = jwtToJwtUser(token);
          try{
            // check the db to see if the user exists
            const user = await UserEntity.findOne({
              where: {id: jwtUserInfo.id},
            });
            const group = await GroupEntity.findOne({
              where: {id: room},
              relations: ["users"]
            })

            if(!user || !group) return;

            for(let find of group.users){
              if(find.id === user.id) {
                return user.id;
              }
            }
          } catch(err) {
            console.error("Error getting user from db at websocket: ", err);
          }
        }

        const tempUserId = await authenticate(payload.token, payload.room);
        // verify that authentication worked
        if (!tempUserId) {
          ws.send(JSON.stringify(ServerMessage.badRequest()));
        } else {
          // user is authenticated
          userId = tempUserId;
          const userIdWS = {id: userId, ws: ws} as IdWebsocket;
          // add the user to the room
          // if the room does exist, add the user to the room
          if(this.rooms.has(payload.room)){
            const room = this.rooms.get(payload.room);
            if(!room) return; // this is just a typesciprt thing, since we've verified that room does exist in the map

            // user is already in room
            if (room.find(idws => idws.id === userId)) return;             
            room.push(userIdWS);
          } else {
          // if the room doesn't exist, create a new room and add the user
            this.rooms.set(payload.room, [userIdWS])
          }
          roomId = payload.room;

          // somewhere here, we should send the history of the chat room.
        }
      });

      ws.on('chat', (payload: RXPayload) => {
        // verify the user is authenticated before allowing to chat
        if(!roomId || !userId) {
          ws.send(JSON.stringify(ServerMessage.notAuthenticated()));
        }

        const room = this.rooms.get(roomId);
        if (!room) return;
        room.forEach( idws => {
          if(idws.ws.readyState === WebSocket.OPEN){
            idws.ws.send(JSON.stringify(payload))
          }
        })
      });

      ws.on('close', () => {
        // remove the user from the room
        const room = this.rooms.get(roomId);
        if (!room) return;

        const userIndex = room.findIndex(idws => idws.id === userId);
        if (userIndex === -1) return;

        room.splice(1, userIndex);

        // delete the room if there are no more users in the room
        if (room.length === 0){
          this.rooms.delete(roomId);
        }
        console.log("closing websocket");
      })
    });
  }
}