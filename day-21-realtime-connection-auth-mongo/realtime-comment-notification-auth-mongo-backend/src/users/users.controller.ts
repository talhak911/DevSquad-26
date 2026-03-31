import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfile(
    @Request() req,
    @Body() updateData: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      updateData.profilePicture = uploadResult.secure_url;
    }
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/is-following')
  async isFollowing(@Param('id') followingId: string, @Request() req) {
    const isFollowing = await this.usersService.checkIsFollowing(req.user.userId, followingId);
    return { isFollowing };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Param('id') followingId: string, @Request() req) {
    return this.usersService.follow(req.user.userId, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unfollow')
  async unfollow(@Param('id') followingId: string, @Request() req) {
    return this.usersService.unfollow(req.user.userId, followingId);
  }
}
