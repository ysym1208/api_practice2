// excelGenerator.ts
import Excel from 'exceljs';

export async function createExcelFile(
  data: any[],
  filePath: string,
): Promise<void> {
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet('Data');

  // 데이터로 엑셀 파일 행 채우기
  data.forEach((item, index) => {
    sheet.addRow({ id: index + 1, ...item });
  });

  // 파일 시스템에 엑셀 파일 저장
  await workbook.xlsx.writeFile(filePath);
}
