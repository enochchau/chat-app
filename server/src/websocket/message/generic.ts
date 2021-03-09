// generic websocket message
export interface GenericMessage<T extends GenericPayload> {
  topic: "server" | "error" | "join group" | "chat group" | "join friend" | "chat friend";
  payload: T;
}
export interface GenericPayload{
  timestamp: Date;
  message: string;
}