import WebSocket from 'ws';
// interface for user id and associated websocket
export interface IdWebsocket {
  id: number;
  ws: WebSocket;
}