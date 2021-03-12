import * as t from 'io-ts';

type ServerTopic = "okay" | "error";
// TX Server Message
type ServerMessage = {
  topic: ServerTopic,
  payload: {
    timestamp: Date,
    message: string
  }
}

export class Server{
  static invalidToken() {
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "invalid token",
      }
    } as ServerMessage;
  }

  static serverError() {
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "server error",
      }
    } as ServerMessage;
  }

  static badRequest() {
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "bad request",
      }
    } as ServerMessage;
  }

  static notAuthenticated(){
    return {
      topic: "error",
      payload: {
        timestamp: new Date(),
        message: "user is not authenticated",
      }
    } as ServerMessage;
  }

  static validToken() {
    return {
      topic: "okay",
      payload: {
        timestamp: new Date(),
        message: "valid token",
      }
    } as ServerMessage;
  }
}