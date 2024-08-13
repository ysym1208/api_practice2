import { Module } from '@nestjs/common';
import { GradeFeedbackService } from './grade-feedback.service';
import { GradeFeedbackController } from './grade-feedback.controller';
import { PrismaService } from 'src/prisma.client';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [GradeFeedbackController],
  providers: [GradeFeedbackService, PrismaService],
})
export class GradeFeedbackModule {}
