import { Student } from '../types';

export const calculateGrade = (totalScore: number): number => {
  if (totalScore >= 80) return 4;
  if (totalScore >= 75) return 3.5;
  if (totalScore >= 70) return 3;
  if (totalScore >= 65) return 2.5;
  if (totalScore >= 60) return 2;
  if (totalScore >= 55) return 1.5;
  if (totalScore >= 50) return 1;
  return 0;
};

export const calculateStudentStats = (s: Partial<Student>): { total: number, grade: number, remarks: string } => {
  // Ensure values are numbers, default to 0 if missing/NaN
  const pre = Number(s.scorePreMid) || 0;
  const post = Number(s.scorePostMid) || 0;
  const mid = Number(s.scoreMidterm) || 0;
  const fin = Number(s.scoreFinal) || 0;

  const total = pre + post + mid + fin;
  const grade = calculateGrade(total);
  
  let remarks = "";
  if (grade === 0) remarks = "ตก (คะแนนต่ำกว่า 50)";
  
  return { total, grade, remarks };
};

export const getStatistics = (students: Student[]) => {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      passCount: 0,
      failCount: 0,
      maxScore: 0,
      minScore: 0
    };
  }

  const scores = students.map(s => s.totalScore);
  const totalScoreSum = scores.reduce((a, b) => a + b, 0);
  const passCount = students.filter(s => s.grade > 0).length;

  return {
    totalStudents: students.length,
    averageScore: parseFloat((totalScoreSum / students.length).toFixed(2)),
    passCount: passCount,
    failCount: students.length - passCount,
    maxScore: Math.max(...scores),
    minScore: Math.min(...scores)
  };
};