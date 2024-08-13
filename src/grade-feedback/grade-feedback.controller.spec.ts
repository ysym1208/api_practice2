import { Test, TestingModule } from '@nestjs/testing';
import { GradeFeedbackController } from './grade-feedback.controller';
import { GradeFeedbackService } from 'src/app.service';

describe('GradeFeedbackController', () => {
  let controller: GradeFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeFeedbackController],
      providers: [GradeFeedbackService],
    }).compile();

    controller = module.get<GradeFeedbackController>(GradeFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
