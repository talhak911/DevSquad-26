import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, content: string, parentId?: string): Promise<Comment> {
    const comment = await this.commentModel.create({
      content,
      author: new Types.ObjectId(userId),
      parentId: parentId ? new Types.ObjectId(parentId) : null,
    });

    const populated = await comment.populate('author', 'username profilePicture');

    // Handle Notifications
    if (!parentId) {
      // New top-level comment: Notify all users
      await this.notificationsService.broadcastActiveComment(populated);
    } else {
      // Reply: Increment replies count
      const parentComment = await this.commentModel.findByIdAndUpdate(
        parentId,
        { $inc: { repliesCount: 1 } },
        { new: true }
      ).populate('author');

      // Broadcast the reply so the UI updates
      await this.notificationsService.broadcastActiveComment(populated);

      // Targeted notification to the author of the parent comment
      if (parentComment && parentComment.author._id.toString() !== userId) {
        await this.notificationsService.create({
          recipient: parentComment.author._id.toString(),
          sender: userId,
          type: NotificationType.REPLY,
          commentId: comment._id.toString(),
        });
      }
    }

    return populated;
  }

  async findAll(): Promise<Comment[]> {
    // Standard fetch - we will structure nesting on the frontend or via a helper
    return this.commentModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture')
      .exec();
  }

  async toggleLike(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const userIdObj = new Types.ObjectId(userId);
    const index = comment.likedBy.findIndex((id: any) => id.equals(userIdObj));

    if (index === -1) {
      // Like
      comment.likedBy.push(userIdObj as any);
      comment.likesCount += 1;
      
      // Notify author
      if (comment.author.toString() !== userId) {
        await this.notificationsService.create({
          recipient: comment.author.toString(),
          sender: userId,
          type: NotificationType.LIKE,
          commentId: comment._id.toString(),
        });
      }
    } else {
      // Unlike
      comment.likedBy.splice(index, 1);
      comment.likesCount -= 1;
    }

    await comment.save();
    return comment;
  }

  async findReplies(parentId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ parentId: new Types.ObjectId(parentId) })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: 1 })
      .exec();
  }
}
