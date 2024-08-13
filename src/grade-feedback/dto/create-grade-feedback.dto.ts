import { IsNumber, IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreateGradeFeedbackDto {
  @IsNumber()
  userId: number;

  @IsString()
  month: string;

  @IsJSON()
  @IsNotEmpty()
  scores: string; // JSON 형식의 문자열로 업데이트
}
