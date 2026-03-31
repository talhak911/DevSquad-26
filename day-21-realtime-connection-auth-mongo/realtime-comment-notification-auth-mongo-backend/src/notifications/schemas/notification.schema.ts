import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum NotificationType {
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  LIKE = 'LIKE',
  FOLLOW = 'FOLLOW',
}

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId | User;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  commentId?: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
