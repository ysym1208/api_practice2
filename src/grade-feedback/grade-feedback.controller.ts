import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GradeFeedbackService } from './grade-feedback.service';
import { CreateGradeFeedbackDto } from './dto/create-grade-feedback.dto';
import { UpdateGradeFeedbackDto } from './dto/update-grade-feedback.dto';
import { Response } from 'express';

@Controller('grade-feedback')
export class GradeFeedbackController {
  constructor(private readonly gradeFeedbackService: GradeFeedbackService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded.', HttpStatus.BAD_REQUEST);
    }

    try {
      const feedback =
        await this.gradeFeedbackService.processFileAndGenerateFeedback({
          buffer: file.buffer, // 'input' 대신 'buffer'를 바로 사용
        });
      return res.status(HttpStatus.OK).json({
        message: 'File processed successfully',
        feedback,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error processing file.',
      });
    }
  }

  @Post()
  async create(@Body() createGradeFeedbackDto: CreateGradeFeedbackDto) {
    try {
      const result = await this.gradeFeedbackService.create(
        createGradeFeedbackDto,
      );
      return { status: 'success', data: result };
    } catch (error) {
      throw new HttpException('Error creating data', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.gradeFeedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeFeedbackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGradeFeedbackDto: UpdateGradeFeedbackDto,
  ) {
    return this.gradeFeedbackService.update(+id, updateGradeFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeFeedbackService.remove(+id);
  }
}
