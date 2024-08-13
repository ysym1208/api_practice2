import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeFeedbackDto } from './create-grade-feedback.dto';

export class UpdateGradeFeedbackDto extends PartialType(
  CreateGradeFeedbackDto,
) {}
