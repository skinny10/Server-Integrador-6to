import { Server } from 'http';
import WebSocket from 'ws';

class WebSocketServer {
  private wss: WebSocket.Server;
  private connections: Set<WebSocket>;

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.connections = new Set<WebSocket>();

    this.wss.on('connection', (ws: WebSocket) => {
      this.connections.add(ws);
      ws.on('close', () => this.connections.delete(ws));
    });
  }

  broadcast(data: any): void {
    for (const ws of this.connections) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    }
  }
}

export default WebSocketServer;
