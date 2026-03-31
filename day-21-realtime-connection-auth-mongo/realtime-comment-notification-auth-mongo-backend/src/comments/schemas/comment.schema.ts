import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentId: Types.ObjectId | null;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  repliesCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  likedBy: User[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
