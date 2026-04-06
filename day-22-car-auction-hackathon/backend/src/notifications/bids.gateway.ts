import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Controller, Get, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.some(o => origin.startsWith(o!)) || /.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
})
export class BidsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinCar')
  handleJoinCar(@MessageBody() carId: string, @ConnectedSocket() client: Socket) {
    client.join(carId);
    console.log(`Client ${client.id} joined car room: ${carId}`);
  }

  @SubscribeMessage('leaveCar')
  handleLeaveCar(@MessageBody() carId: string, @ConnectedSocket() client: Socket) {
    client.leave(carId);
  }

  broadcastNewBid(carId: string, bidData: any) {
    this.server.to(carId).emit('newBid', bidData);
  }

  broadcastAuctionEnded(carId: string, winnerData: any) {
    this.server.to(carId).emit('auctionEnded', winnerData);
  }

  broadcastShippingUpdate(bidId: string, statusData: any) {
    this.server.emit(`shippingUpdate_${bidId}`, statusData);
  }

  // Global Notifications
  notifyNewAuction(car: any) {
    this.server.emit('newAuction', {
      title: car.title,
      id: car._id,
      image: car.images?.[0]
    });
  }

  notifyGlobalBid(bid: any) {
    this.server.emit('globalBid', {
      carTitle: bid.car?.title || 'a car',
      userName: `${bid.user?.firstName || 'Someone'}`,
      amount: bid.amount,
      carId: bid.car?._id || bid.car,
      userId: bid.user?._id || bid.user
    });
  }

  notifyAuctionWinner(bid: any) {
    this.server.emit('auctionWinner', {
      carTitle: bid.car?.title || 'a car',
      userName: `${bid.user?.firstName || 'Someone'}`,
      amount: bid.amount,
      carId: bid.car?._id || bid.car,
      userId: bid.user?._id || bid.user
    });
  }

  notifyAuctionClosed(car: any) {
    this.server.emit('auctionClosed', {
      title: car.title,
      id: car._id
    });
  }
}
