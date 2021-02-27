"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
class ChatRoom {
    constructor(wss) {
        this.wss = wss;
        this.users = new Set();
        this.setup();
    }
    setup() {
        this.wss.on('connection', (ws) => {
            ws.send(JSON.stringify({ message: "welcome to websocket land" }));
            console.log('opening websocket');
            ws.on('message', (msg) => {
                console.log('WS:', msg);
                let msgjson;
                try {
                    msgjson = JSON.parse(msg);
                }
                catch (_a) {
                    ws.send(JSON.stringify({ error: "not a valid json" }));
                    return;
                }
                if (msgjson['username'] && msgjson['message']) {
                    this.wss.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(msgjson));
                        }
                    });
                }
            });
            ws.on('close', () => {
                console.log("closing websocket");
            });
        });
    }
}
exports.default = ChatRoom;
