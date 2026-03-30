import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';

interface CommentPayload {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  socketId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private comments: CommentPayload[] = [];

  constructor(private configService: ConfigService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // Send existing comment history to the newly connected client
    if (this.comments.length > 0) {
      client.emit('comment_history', this.comments);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('add_comment')
  handleAddComment(
    @MessageBody() data: CommentPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const comment: CommentPayload = {
      id: data.id || Date.now().toString(),
      author: data.author || 'Anonymous',
      text: data.text || '',
      createdAt: data.createdAt || new Date().toISOString(),
      socketId: client.id,
    };

    // Store in memory
    this.comments.push(comment);

    // Keep only the last 100 comments in memory
    if (this.comments.length > 100) {
      this.comments = this.comments.slice(-100);
    }

    // Broadcast to ALL connected clients (including sender)
    this.server.emit('new_comment', comment);

    return { success: true, comment };
  }
}
