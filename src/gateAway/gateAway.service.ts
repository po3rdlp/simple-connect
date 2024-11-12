import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../chat/chat.service'; // Import ChatService
import { CreateChatDto } from '../chat/dto/create-chat.dto'; // Import DTO for creating a chat message

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateAway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService, // Inject ChatService
  ) {}

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
      this.clientToUserNameMap.set(client.id, userName);

      console.log(`Client Connected, User: ${user.user.id}, Client ID: ${clientId}`);
      client.emit('client-id', { clientId });

      // Send the online status of users to the new client
      this.userOnlineStatus.forEach((isOnline, userId) => {
        client.emit('user-online-status', { userId, online: isOnline });
      });

      // Broadcast user who just came online
      client.broadcast.emit('user-online-status', { userId: user.user.id, online: true });

      // Listen to 'send-message' event and call handleMessage
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
      this.clientToUserNameMap.delete(client.id);
      this.server.emit('user-online-status', { userId, online: false });
    }
  }

  @SubscribeMessage('user-sending-message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const userId = this.clientToUserMap.get(client.id);
    const userName = this.clientToUserNameMap.get(client.id);

    console.log(`Received data from client ${userName} ${client.id}, User: ${userId},`, data);

    // Construct DTO for creating a new chat message
    const createChatDto: CreateChatDto = {
      senderId: userId,
      receiverId: data.receiverId,  // Assuming receiver ID is part of the message data
      message: data.content,
    };

    try {
      // Save the message to the database
      const chat = await this.chatService.sendMessage(createChatDto);

      // Emit the message to the clients
      this.server.emit('new-message', {
        userName,
        userId,
        message: chat.message,
        timestamp: chat.timestamp,
      });

      // Acknowledge message receipt
      client.emit('response-event', { message: 'Message sent successfully!' });

    } catch (err) {
      console.log('Error sending message:', err);
      client.emit('error', { message: 'Failed to send message' });
    }
  }
}
