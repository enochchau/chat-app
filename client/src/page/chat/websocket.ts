import { UserData } from '../../api/validators/entity';
import { WSURL } from '../../api/index';
import { 
  ChatHistory, 
  RxChatMessage, 
  RxChatMessageValidator, 
  ServerMessageValidator, 
  ServerMessage, 
  ChatHistoryValidator
} from 'api/validators/websocket';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

export type UserIdMap = Map<number, UserData>;

export class ChatHandler {
  public ws: WebSocket;
  public groupMap: UserIdMap

  constructor(userData: UserData[]){
    this.ws = new WebSocket(WSURL);
    this.groupMap = this.createUserIdMap(userData);
  }
  private createUserIdMap(userData: UserData[]): UserIdMap {
    return (userData.reduce((map, user) => {
      map.set(user.id, user);
      return map;
    }, new Map() as UserIdMap));
  }

  public validateMessage(message: any, handleNewMessage: (message: RxChatMessage) => void, handleHist: (message:ChatHistory) => void){
    const onHistLeft = (_errors: t.Errors): void => {
      console.log('Unable to validate chat history message', PathReporter.report(ChatHistoryValidator.decode(message)));
      console.log("Unable to validate recieved message at websocket.");
    }
    // if Server message decode fails pipe into historical message
    const onBadServerMessage = (_errors: t.Errors): void => {
      console.log('Server message validation error: ', PathReporter.report(ServerMessageValidator.decode(message)));
      pipe(ChatHistoryValidator.decode(message), fold(onHistLeft, handleHist));
    }
    const handleServerMessage = (message: ServerMessage): void => {
      console.log('Server Message: ', message)
    }
    // if ChatMessage decode fails, pipe into ServerMessage
    const tryServerMessage = (_errors: t.Errors): void => {
      console.log('Chat message validation error: ', PathReporter.report(RxChatMessageValidator.decode(message)));
      pipe(ServerMessageValidator.decode(message), fold(onBadServerMessage, handleServerMessage));
    }
    pipe(RxChatMessageValidator.decode(message), fold(tryServerMessage, handleNewMessage));
  }
}
