import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationType } from './schemas/notification.schema';
import { CommentsGateway } from '../comments/comments.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private readonly gateway: CommentsGateway,
  ) {}

  async create(data: {
    recipient: string;
    sender: string;
    type: NotificationType;
    commentId?: string;
  }) {
    const notification = await this.notificationModel.create({
      recipient: new Types.ObjectId(data.recipient),
      sender: new Types.ObjectId(data.sender),
      type: data.type,
      commentId: data.commentId ? new Types.ObjectId(data.commentId) : undefined,
    });

    const populated = await notification.populate('sender', 'username profilePicture');
    
    // Emit real-time notification to the specific user's room
    this.gateway.server.to(data.recipient).emit('notification', populated);
    
    return populated;
  }

  async broadcastActiveComment(data: any) {
    // Notify all users about a new top-level comment
    this.gateway.server.emit('new_comment', data);
  }

  async findByUserId(userId: string) {
    return this.notificationModel
      .find({ recipient: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate('sender', 'username profilePicture')
      .exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }
}
