import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, Role } from './schemas/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    const superAdmin = await this.userModel.findOne({ role: Role.SUPER_ADMIN }).exec();
    if (!superAdmin) {
      console.log('Seeding super admin...');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('superadmin123', salt);
      await this.userModel.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        passwordHash: hashedPassword,
        role: Role.SUPER_ADMIN,
      });
      console.log('Super admin created. Email: superadmin@example.com / Password: superadmin123');
    }
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    if (!userData.email || !userData.passwordHash) {
        throw new ConflictException('Email and password are required');
    }

    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);

    const createdUser = new this.userModel({
      ...userData,
      passwordHash: hashedPassword,
    });
    return createdUser.save();
  }


  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({}, '-passwordHash').exec(); // exclude passwords
  }

  async findAdmins(): Promise<UserDocument[]> {
    return this.userModel.find({ role: { $in: [Role.ADMIN, Role.SUPER_ADMIN] } }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updatePoints(userId: string, points: number, session?: any): Promise<UserDocument | null> {
    const update = { $inc: { points: points } };
    return this.userModel.findByIdAndUpdate(userId, update, { new: true, session }).exec();
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    let hashedToken: string | null = null;
    if (refreshToken) {
      const salt = await bcrypt.genSalt();
      hashedToken = await bcrypt.hash(refreshToken, salt);
    }
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedToken }).exec();
  }
}


