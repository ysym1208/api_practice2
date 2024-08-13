import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GradeFeedbackModule } from './grade-feedback/grade-feedback.module';

@Module({
  imports: [GradeFeedbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
