import { GenericWSPayload, GenericWSMessage} from './chatroom';

// TX Server Message
interface TXServerMessage extends GenericWSMessage<TXServerPayload>{
  payload: TXServerPayload;
}
interface TXServerPayload extends GenericWSPayload{
  status: "error" | "ok";
}

export class ServerMessage {
  static invalidToken() {
    return {
      topic: "authenticate",
      payload: {
        timestamp: new Date(),
        message: "invalid token",
        status: "error"
      }
    } as TXServerMessage;
  }

  static serverError() {
    return {
      topic: "server error",
      payload: {
        timestamp: new Date(),
        message: "server error",
        status: "error"
      }
    } as TXServerMessage;
  }

  static badRequest() {
    return {
      topic: "bad request",
      payload: {
        timestamp: new Date(),
        message: "bad request",
        status: "error"
      }
    } as TXServerMessage;
  }

  static notAuthenticated(){
    return {
      topic: "authenticate",
      payload: {
        timestamp: new Date(),
        message: "user is not authenticated",
        status: "error"
      }
    } as TXServerMessage;
  }

  static validToken() {
    return {
      topic: "authenticate",
      payload: {
        timestamp: new Date(),
        message: "valid token",
        status: "ok"
      }
    } as TXServerMessage;
  }
}