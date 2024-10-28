import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateAway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private authService: AuthService) {}

  private clientToUserMap = new Map<string, number>();
  private clientIdToSocketMap = new Map<string, string>();
  private userOnlineStatus = new Map<number, boolean>();
  private clientToUserNameMap = new Map<string, string>();

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    const clientId = client.handshake.query.clientId as string;
    const userName = client.handshake.query.username as string;

    try {
      const user = await this.authService.validateToken(token);
      this.clientToUserMap.set(client.id, user.user.id);
      this.clientIdToSocketMap.set(clientId, client.id);
      this.userOnlineStatus.set(user.user.id, true);
      this.clientToUserNameMap.set(client.id, userName)
      

      console.log(`Client Connected, User: ${user.user.id}, Client ID: ${clientId}`);
      client.emit('client-id', { clientId });

      // user baru online ?
      this.userOnlineStatus.forEach((isOnline, userId) => {
        client.emit('user-online-status', { userId, online: isOnline });
      });

      // Broadcast user yang baru online ?
      client.broadcast.emit('user-online-status', { userId: user.user.id, online: true });

      // Kirim pesan ke semua user ?
      client.on('send-message', (message) => this.handleMessage(client, message));


    } catch (err: any) {
      console.log('Unauthorized connection attempt:', err.message);
      client.emit('error', { message: err.message });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.clientToUserMap.get(client.id);
    const clientId = [...this.clientIdToSocketMap].find(([key, value]) => value === client.id)?.[0];

    if (userId) {
      console.log(`Client disconnected: ${client.id}, User: ${userId}`);
      this.clientToUserMap.delete(client.id);
      this.clientIdToSocketMap.delete(clientId);
      this.userOnlineStatus.set(userId, false);
      this.clientToUserNameMap.delete(client.id)
      this.server.emit('user-online-status', { userId, online: false });
    }
  }

  @SubscribeMessage('user-sending-message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const userId = this.clientToUserMap.get(client.id);
    const userName = this.clientToUserNameMap.get(client.id)
    console.log(`Received data from client ${userName} ${client.id}, User: ${userId},`, data);
    client.emit('response-event', { message: 'Data received' });

       // Broadcast the message to all connected clients
       this.server.emit('new-message', {
        userName,
        userId,
        message: data.content,
        timestamp: new Date(),
      });
  }
}
