"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class WebSocketServer {
    constructor(server) {
        this.wss = new ws_1.default.Server({ server });
        this.connections = new Set();
        this.wss.on('connection', (ws) => {
            this.connections.add(ws);
            ws.on('close', () => this.connections.delete(ws));
        });
    }
    broadcast(data) {
        for (const ws of this.connections) {
            if (ws.readyState === ws_1.default.OPEN) {
                ws.send(JSON.stringify(data));
            }
        }
    }
}
exports.default = WebSocketServer;
//# sourceMappingURL=webSocketServer.js.map