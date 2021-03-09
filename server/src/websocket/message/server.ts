import { GenericPayload, GenericMessage} from './generic';

// TX Server Message
interface TXServerMessage extends GenericMessage<GenericPayload>{
  payload: GenericPayload;
}

export class Server{
  static invalidToken() {
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "invalid token",
      }
    } as TXServerMessage;
  }

  static serverError() {
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "server error",
      }
    } as TXServerMessage;
  }

  static badRequest() {
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "bad request",
      }
    } as TXServerMessage;
  }

  static notAuthenticated(){
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "user is not authenticated",
      }
    } as TXServerMessage;
  }

  static validToken() {
    return {
      topic: "server",
      payload: {
        timestamp: new Date(),
        message: "valid token",
      }
    } as TXServerMessage;
  }
}