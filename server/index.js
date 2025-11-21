import express from 'express';
import multer from 'multer';
import cors from 'cors';
import * as XLSX from 'xlsx';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const HEADERS = {
  id: 'รหัสนักเรียน',
  name: 'ชื่อ–สกุล',
  pre: 'คะแนนเก็บก่อนกลางภาค (30)',
  post: 'คะแนนเก็บหลังกลางภาค (20)',
  mid: 'คะแนนสอบกลางภาค (20)',
  fin: 'คะแนนสอบปลายภาค (30)',
  total: 'คะแนนรวม (100)',
  grade: 'เกรด',
  remarks: 'หมายเหตุ',
};

const MAX_SCORES = {
  pre: 30,
  post: 20,
  mid: 20,
  fin: 30,
};

const calculateGrade = (totalScore) => {
  if (totalScore >= 80) return 4;
  if (totalScore >= 75) return 3.5;
  if (totalScore >= 70) return 3;
  if (totalScore >= 65) return 2.5;
  if (totalScore >= 60) return 2;
  if (totalScore >= 55) return 1.5;
  if (totalScore >= 50) return 1;
  return 0;
};

const calculateStudent = (row) => {
  const getScore = (key, max) => {
    const value = Number(row[key]) || 0;
    return Math.min(Math.max(value, 0), max);
  };

  const scorePre = getScore(HEADERS.pre, MAX_SCORES.pre);
  const scorePost = getScore(HEADERS.post, MAX_SCORES.post);
  const scoreMid = getScore(HEADERS.mid, MAX_SCORES.mid);
  const scoreFin = getScore(HEADERS.fin, MAX_SCORES.fin);

  const total = scorePre + scorePost + scoreMid + scoreFin;
  const grade = calculateGrade(total);
  const remarks = grade === 0 ? 'ตก (คะแนนต่ำกว่า 50)' : '';

  return {
    id: row[HEADERS.id] || '',
    name: row[HEADERS.name] || '',
    scorePreMid: scorePre,
    scorePostMid: scorePost,
    scoreMidterm: scoreMid,
    scoreFinal: scoreFin,
    totalScore: total,
    grade,
    remarks,
  };
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/template', (_req, res) => {
  const sampleRow = {
    [HEADERS.id]: '66001',
    [HEADERS.name]: 'ตัวอย่าง สมชาย ใจดี',
    [HEADERS.pre]: 25,
    [HEADERS.post]: 15,
    [HEADERS.mid]: 18,
    [HEADERS.fin]: 22,
  };

  const ws = XLSX.utils.json_to_sheet([sampleRow]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="Student_Score_Template.xlsx"');
  res.send(buffer);
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'ไม่พบไฟล์ที่อัปโหลด' });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const students = rows.map((row) => calculateStudent(row));
    res.json({ students });
  } catch (error) {
    console.error('Error parsing Excel:', error);
    res.status(500).json({ message: 'ไม่สามารถอ่านไฟล์ได้ โปรดลองอีกครั้ง' });
  }
});

app.post('/api/export', (req, res) => {
  const { students = [] } = req.body;

  const rows = students.map((s) => {
    const recalculated = calculateStudent({
      [HEADERS.id]: s.id,
      [HEADERS.name]: s.name,
      [HEADERS.pre]: s.scorePreMid,
      [HEADERS.post]: s.scorePostMid,
      [HEADERS.mid]: s.scoreMidterm,
      [HEADERS.fin]: s.scoreFinal,
    });

    return {
      [HEADERS.id]: recalculated.id,
      [HEADERS.name]: recalculated.name,
      [HEADERS.total]: recalculated.totalScore,
      [HEADERS.grade]: recalculated.grade,
      [HEADERS.remarks]: recalculated.remarks,
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Grade_Result');
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="Student_Grade_Results.xlsx"');
  res.send(buffer);
});

app.listen(PORT, () => {
  console.log(`Grade API server running on http://localhost:${PORT}`);
});
