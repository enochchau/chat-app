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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const websocket_1 = __importDefault(require("./websocket"));
const app = express_1.default();
app.use(cors_1.default());
app.use(helmet_1.default());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server, path: '/chat' });
const chatRoom = new websocket_1.default(wss);
app.get("/", (req, res) => {
    res.json({ message: "hello world" });
});
server.listen(config_1.default.PORT, () => {
    console.log(`Listening at http://localhost:${config_1.default.PORT}`);
});
