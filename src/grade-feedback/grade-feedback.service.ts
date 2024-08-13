import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.client';
import { CreateGradeFeedbackDto } from './dto/create-grade-feedback.dto';
import { UpdateGradeFeedbackDto } from './dto/update-grade-feedback.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { createExcelFile } from '../utils/excelGenerator';
import { Grade } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';

const execAsync = promisify(exec);

@Injectable()
export class GradeFeedbackService {
  constructor(private prismaService: PrismaService) {}

  async create(createGradeFeedbackDto: CreateGradeFeedbackDto) {
    const { userId, month, scores } = createGradeFeedbackDto;
    let parsedScores;

    try {
      parsedScores = JSON.parse(scores);
    } catch (error) {
      throw new HttpException(
        'Invalid JSON format in scores',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.grade.create({
      data: {
        userId,
        month,
        scores: parsedScores,
        comment: 'Optional comment if needed',
      },
    });
  }

  // 환경 설정 파일이나 .env에서 값을 가져오기
  filePath = process.env.REPORT_PATH || './reports/userData.xlsx';

  async generateAndSendReport(data: any): Promise<void> {
    try {
      await createExcelFile(data, this.filePath);
      console.log('Report generated successfully.');
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw new HttpException(
        'Failed to generate report',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 모든 데이터 조회하지만 id를 제외하고 반환
  async findAll() {
    return await this.prismaService.grade.findMany({
      select: {
        userId: true, // userId 반환
        scores: true, // scores 반환
        month: true, // month 반환
        comment: true, // comment 반환
        // id는 명시하지 않음으로써 반환되지 않음
      },
    });
  }

  // 특정 ID를 기준으로 데이터 조회
  async findOne(id: number): Promise<Grade | null> {
    return await this.prismaService.grade.findUnique({
      where: { id }, // 여기에서 `id` 필드를 명확하게 지정
    });
  }

  // 특정 ID를 기준으로 데이터 업데이트
  async update(id: number, updateGradeFeedbackDto: UpdateGradeFeedbackDto) {
    return await this.prismaService.grade.update({
      where: { id },
      data: updateGradeFeedbackDto,
    });
  }

  // 특정 ID를 기준으로 데이터 삭제
  async remove(id: number) {
    return await this.prismaService.grade.delete({
      where: { id },
    });
  }

  // grade-feedback.service.ts
  async processFileAndGenerateFeedback(input: {
    buffer: Buffer;
  }): Promise<any> {
    // 파일을 파싱하고 데이터를 DB에 저장하는 로직
    const results = await this.parseAndSaveData(input.buffer);
    // 결과 분석 로직
    const feedback = this.analyzeResults(results);
    return feedback;
  }

  private analyzeResults(data: any[]): {
    [subject: string]: { highestScore: number; averageScore: number };
  } {
    const subjectScores: { [key: string]: number[] } = {};

    // 과목별 점수 배열 생성
    data.forEach((entry) => {
      for (const [subject, score] of Object.entries(entry.scores)) {
        if (typeof score === 'number') {
          if (!subjectScores[subject]) {
            subjectScores[subject] = [];
          }
          subjectScores[subject].push(score);
        }
      }
    });

    // 과목별 최고 점수 및 평균 점수 계산
    const results: {
      [subject: string]: { highestScore: number; averageScore: number };
    } = {};
    for (const [subject, scores] of Object.entries(subjectScores)) {
      const highestScore = Math.max(...scores);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      results[subject] = {
        highestScore: highestScore,
        averageScore: averageScore,
      };
    }

    return results;
  }

  private parseExcel(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 명시적으로 header를 배열로 선언
    const header: string[] = jsonData[0] as string[];
    const rows = jsonData.slice(1);

    return rows.map((row) => {
      const entry: any = {};
      header.forEach((key, index) => {
        entry[key] = row[index];
      });
      return entry;
    });
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // 사용자가 없는 경우 추가하거나 에러 발생
      await this.prismaService.user.create({
        data: { id: userId, name: `User${userId}` },
      });
    }
  }

  private async parseAndSaveData(buffer: Buffer): Promise<any[]> {
    const data = this.parseExcel(buffer); // 엑셀 파일 파싱
    const savedResults = [];

    for (const item of data) {
      try {
        const savedResult = await this.saveDataToDatabase(item);
        savedResults.push(savedResult); // 저장 결과를 배열에 추가
      } catch (error) {
        console.error('Failed to save data:', error);
        // 오류 발생시에도 계속 진행
      }
    }

    return savedResults; // 저장된 결과들 반환
  }

  // grade-feedback.service.ts

  private async saveDataToDatabase(item: any): Promise<any> {
    if (!item.userId || !item.month || !item.scores) {
      throw new Error('Missing data fields required for database entry');
    }

    // 사용자 존재 확인 후 데이터베이스에 저장
    const result = await this.prismaService.grade.create({
      data: {
        userId: Number(item.userId),
        month: item.month,
        scores: JSON.parse(item.scores), // JSON 문자열을 객체로 변환
        comment: 'Generated from Excel file',
      },
    });

    return result; // 저장된 객체 반환
  }
}
