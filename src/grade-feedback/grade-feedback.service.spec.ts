import { Test, TestingModule } from '@nestjs/testing';
import { GradeFeedbackService } from './grade-feedback.service';

describe('GradeFeedbackService', () => {
  let service: GradeFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradeFeedbackService],
    }).compile();

    service = module.get<GradeFeedbackService>(GradeFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
