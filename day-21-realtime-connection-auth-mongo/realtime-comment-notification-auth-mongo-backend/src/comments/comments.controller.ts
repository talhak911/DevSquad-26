import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() body: { content: string; parentId?: string }) {
    return this.commentsService.create(req.user.userId, body.content, body.parentId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/like')
  toggleLike(@Request() req, @Param('id') id: string) {
    return this.commentsService.toggleLike(req.user.userId, id);
  }

  @Get(':id/replies')
  findReplies(@Param('id') id: string) {
    return this.commentsService.findReplies(id);
  }
}
