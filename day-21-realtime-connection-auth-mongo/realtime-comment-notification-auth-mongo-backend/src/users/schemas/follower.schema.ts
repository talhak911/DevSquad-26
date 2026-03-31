import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Follower extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  follower: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  following: User;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
// Define unique index to prevent duplicate follows
FollowerSchema.index({ follower: 1, following: 1 }, { unique: true });
