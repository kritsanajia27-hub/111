import * as XLSX from 'xlsx';
import { Student, RawStudentData } from '../types';
import { EXCEL_HEADERS, MAX_SCORES } from '../constants';
import { calculateStudentStats } from '../utils/calculation';

export const generateTemplate = () => {
  const headers = [
    {
      [EXCEL_HEADERS.ID]: "66001",
      [EXCEL_HEADERS.NAME]: "ตัวอย่าง สมชาย ใจดี",
      [EXCEL_HEADERS.LEVEL]: "ม.1",
      [EXCEL_HEADERS.ROOM]: "1/1",
      [EXCEL_HEADERS.NUMBER]: "1",
      [EXCEL_HEADERS.SCORE_PRE]: 25,
      [EXCEL_HEADERS.SCORE_POST]: 15,
      [EXCEL_HEADERS.SCORE_MID]: 18,
      [EXCEL_HEADERS.SCORE_FINAL]: 22
    }
  ];

  const ws = XLSX.utils.json_to_sheet(headers);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "Student_Score_Template.xlsx");
};

export const parseExcelFile = async (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<RawStudentData>(sheet);

        const parsedStudents: Student[] = jsonData.map((row) => {
          // Map Excel columns to Student interface with loose matching
          const scorePre = Number(row[EXCEL_HEADERS.SCORE_PRE] || 0);
          const scorePost = Number(row[EXCEL_HEADERS.SCORE_POST] || 0);
          const scoreMid = Number(row[EXCEL_HEADERS.SCORE_MID] || 0);
          const scoreFinal = Number(row[EXCEL_HEADERS.SCORE_FINAL] || 0);

          const partialStudent = {
            scorePreMid: scorePre,
            scorePostMid: scorePost,
            scoreMidterm: scoreMid,
            scoreFinal: scoreFinal
          };

          const { total, grade, remarks } = calculateStudentStats(partialStudent);

          return {
            id: String(row[EXCEL_HEADERS.ID] || ""),
            name: String(row[EXCEL_HEADERS.NAME] || ""),
            level: String(row[EXCEL_HEADERS.LEVEL] || ""),
            room: String(row[EXCEL_HEADERS.ROOM] || ""),
            number: row[EXCEL_HEADERS.NUMBER] || "",
            scorePreMid: scorePre,
            scorePostMid: scorePost,
            scoreMidterm: scoreMid,
            scoreFinal: scoreFinal,
            totalScore: total,
            grade: grade,
            remarks: remarks
          };
        });

        resolve(parsedStudents);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const exportResults = (students: Student[]) => {
  const exportData = students.map(s => ({
    [EXCEL_HEADERS.ID]: s.id,
    [EXCEL_HEADERS.NAME]: s.name,
    [EXCEL_HEADERS.LEVEL]: s.level,
    [EXCEL_HEADERS.ROOM]: s.room,
    [EXCEL_HEADERS.NUMBER]: s.number,
    [EXCEL_HEADERS.TOTAL]: s.totalScore,
    [EXCEL_HEADERS.GRADE]: s.grade,
    [EXCEL_HEADERS.REMARKS]: s.remarks
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Grade_Result");
  XLSX.writeFile(wb, "Student_Grade_Results.xlsx");
};