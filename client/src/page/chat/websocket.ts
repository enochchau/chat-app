import { UserData } from '../../api/validators/entity';
import { RxChatMessage, RxChatMessageValidator } from '../../api/validators/websocket';
import { WSURL } from '../../api/index';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export type UserIdMap = Map<number, UserData>;
export const createUserIdMap = (userData: UserData[]): UserIdMap => {
  return (userData.reduce((map, user) => {
    map.set(user.id, user);
    return map;
  }, new Map() as UserIdMap));
}

export class ChatHandler {
  public ws: WebSocket;
  public groupMap: UserIdMap
  constructor(groupMap: UserIdMap){
    this.ws = new WebSocket(WSURL);
    this.groupMap = groupMap;

    this.ws.onmessage = (event): void => {
      const data = JSON.parse(event.data);
    }
  }

  private validateRxChatMsg(data: any){
    const onLeft = (errors: t.Errors):void => {this.validateServerMsg(data)}
    const onRight = (data: RxChatMessage): void => {this.handleRxChatMsg}
    pipe(RxChatMessageValidator.decode(data), fold(onLeft, onRight));
  }

  private 
}