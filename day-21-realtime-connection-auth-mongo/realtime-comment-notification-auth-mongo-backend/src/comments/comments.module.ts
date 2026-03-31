import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsGateway } from './comments.gateway';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    forwardRef(() => NotificationsModule),
  ],
  providers: [CommentsGateway, CommentsService],
  controllers: [CommentsController],
  exports: [CommentsGateway, CommentsService],
})
export class CommentsModule {}
