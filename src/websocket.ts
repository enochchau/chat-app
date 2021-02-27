import { json } from 'express';
import * as WebSocket from 'ws';

interface Message {
  username: string,
  newuser: string,
  message: string
}

class ChatRoom{
  wss: WebSocket.Server;
  users: Set<string>;

  constructor(wss:WebSocket.Server){
    this.wss = wss;
    this.users = new Set();
    this.setup();
  }

  setup () {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.send(JSON.stringify({message: "welcome to websocket land"}));
      console.log('opening websocket');

      ws.on('message', (msg:string) => {
        console.log('WS:', msg);

        let msgjson: Message;
        try{
          msgjson = JSON.parse(msg);
        } catch{
          ws.send(JSON.stringify({error: "not a valid json"}));
          return;
        }

        if (msgjson['username'] && msgjson['message']){
          this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN){
              client.send(JSON.stringify(msgjson));
            }
          })            
        }
      })

      ws.on('close', () => {
        console.log("closing websocket");
      })
    });
  }
}



export default ChatRoom;