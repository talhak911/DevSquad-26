import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Follower, FollowerSchema } from './schemas/follower.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Follower.name) private followerModel: Model<Follower>,
  ) {}

  async create(userData: any): Promise<User> {
    const { username, email, password } = userData;
    
    // Check if user exists
    const existingUser = await this.userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ConflictException('Username or Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return user.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateProfile(userId: string, updateData: any): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  async checkIsFollowing(followerId: string, followingId: string): Promise<boolean> {
    const existingFollow = await this.followerModel.findOne({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });
    return !!existingFollow;
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const existingFollow = await this.followerModel.findOne({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });

    if (existingFollow) {
      throw new ConflictException('Already following');
    }

    await this.followerModel.create({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });

    // Update counts
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });

    return { message: 'Followed successfully' };
  }

  async unfollow(followerId: string, followingId: string) {
    const result = await this.followerModel.findOneAndDelete({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });

    if (!result) {
      throw new NotFoundException('Not following this user');
    }

    // Update counts
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });

    return { message: 'Unfollowed successfully' };
  }
}
