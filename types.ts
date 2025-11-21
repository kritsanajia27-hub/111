export interface RawStudentData {
  [key: string]: string | number;
}

export interface Student {
  id: string; // รหัสนักเรียน
  name: string; // ชื่อ-สกุล
  level: string; // ระดับชั้น
  room: string; // ห้อง
  number: string | number; // เลขที่
  
  // Scores
  scorePreMid: number; // คะแนนเก็บก่อนกลางภาค (30)
  scorePostMid: number; // คะแนนเก็บหลังกลางภาค (20)
  scoreMidterm: number; // สอบกลางภาค (20)
  scoreFinal: number; // สอบปลายภาค (30)
  
  // Computed
  totalScore: number;
  grade: number;
  remarks?: string;
}

export enum Grade {
  A = 4,
  B_PLUS = 3.5,
  B = 3,
  C_PLUS = 2.5,
  C = 2,
  D_PLUS = 1.5,
  D = 1,
  F = 0
}

export interface Statistics {
  totalStudents: number;
  averageScore: number;
  passCount: number;
  failCount: number;
  maxScore: number;
  minScore: number;
}