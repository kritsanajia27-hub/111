import React from 'react';
import { Student } from '../types';
import { MAX_SCORES } from '../constants';

interface StudentTableProps {
  students: Student[];
  onUpdateStudent: (index: number, field: keyof Student, value: string | number) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onUpdateStudent }) => {
  
  const getGradeColor = (grade: number) => {
    if (grade >= 3.5) return 'text-emerald-600 font-bold';
    if (grade >= 2) return 'text-blue-600';
    if (grade >= 1) return 'text-orange-500';
    return 'text-red-600 font-bold';
  };

  const ScoreInput = ({ 
    value, 
    max, 
    onChange 
  }: { 
    value: number, 
    max: number, 
    onChange: (val: number) => void 
  }) => (
    <input
      type="number"
      min="0"
      max={max}
      className={`w-16 p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        value > max ? 'border-red-500 bg-red-50' : 'border-slate-200'
      }`}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-semibold text-slate-700">รายชื่อนักเรียนและคะแนน</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-4 py-3 w-16">#</th>
              <th className="px-4 py-3">รหัส</th>
              <th className="px-4 py-3">ชื่อ-สกุล</th>
              <th className="px-4 py-3">ห้อง</th>
              <th className="px-4 py-3 text-center">เก็บ (30)</th>
              <th className="px-4 py-3 text-center">หลัง (20)</th>
              <th className="px-4 py-3 text-center">กลาง (20)</th>
              <th className="px-4 py-3 text-center">ปลาย (30)</th>
              <th className="px-4 py-3 text-center font-bold">รวม</th>
              <th className="px-4 py-3 text-center font-bold">เกรด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                  ไม่มีข้อมูล กรุณา Upload ไฟล์ Excel
                </td>
              </tr>
            ) : (
              students.map((student, idx) => (
                <tr key={`${student.id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{student.id}</td>
                  <td className="px-4 py-3 text-slate-600">{student.name}</td>
                  <td className="px-4 py-3 text-slate-500">{student.level} {student.room} ({student.number})</td>
                  
                  {/* Editable Score Cells */}
                  <td className="px-4 py-3 text-center">
                    <ScoreInput 
                      value={student.scorePreMid} 
                      max={MAX_SCORES.PRE_MID} 
                      onChange={(v) => onUpdateStudent(idx, 'scorePreMid', v)} 
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreInput 
                      value={student.scorePostMid} 
                      max={MAX_SCORES.POST_MID} 
                      onChange={(v) => onUpdateStudent(idx, 'scorePostMid', v)} 
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreInput 
                      value={student.scoreMidterm} 
                      max={MAX_SCORES.MIDTERM} 
                      onChange={(v) => onUpdateStudent(idx, 'scoreMidterm', v)} 
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreInput 
                      value={student.scoreFinal} 
                      max={MAX_SCORES.FINAL} 
                      onChange={(v) => onUpdateStudent(idx, 'scoreFinal', v)} 
                    />
                  </td>
                  
                  <td className="px-4 py-3 text-center font-bold text-slate-700">
                    {student.totalScore}
                  </td>
                  <td className={`px-4 py-3 text-center text-lg ${getGradeColor(student.grade)}`}>
                    {student.grade}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;