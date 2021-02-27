import * as WebSocket from 'ws';

interface Message {
  username: string,
  message: string,
  timestamp: number,
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
      console.log("opening websocket");

      ws.on('message', (msg:string) => {

        let msgjson: Message;

        try{
          msgjson = JSON.parse(msg);
        } catch{
          ws.send(JSON.stringify({error: "not a valid message json"}));
          return;
        }

        if (!(msgjson['username'] && msgjson['message'] && msgjson['timestamp'])){
          ws.send(JSON.stringify({error: "not a valid message json"}));

        } else {          
          this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN){
              client.send(JSON.stringify(msgjson));
            }
          });

        }
      })

      ws.on('close', () => {
        console.log("closing websocket");
      })
    });
  }
}



export default ChatRoom;