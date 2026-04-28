import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai.service';
import { VectorService } from './vector.service';

@Module({
  imports: [ConfigModule],
  providers: [AIService, VectorService],
  exports: [AIService, VectorService],
})
export class AIModule {}
