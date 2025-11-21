import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Student } from '../types';

interface GradeChartProps {
  students: Student[];
}

const GradeChart: React.FC<GradeChartProps> = ({ students }) => {
  const gradeCounts = students.reduce((acc, student) => {
    const grade = student.grade.toString();
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: '4.0', value: gradeCounts['4'] || 0, color: '#10b981' },
    { name: '3.5', value: gradeCounts['3.5'] || 0, color: '#34d399' },
    { name: '3.0', value: gradeCounts['3'] || 0, color: '#60a5fa' },
    { name: '2.5', value: gradeCounts['2.5'] || 0, color: '#93c5fd' },
    { name: '2.0', value: gradeCounts['2'] || 0, color: '#facc15' },
    { name: '1.5', value: gradeCounts['1.5'] || 0, color: '#fdba74' },
    { name: '1.0', value: gradeCounts['1'] || 0, color: '#fb923c' },
    { name: '0', value: gradeCounts['0'] || 0, color: '#ef4444' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 h-80">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">การกระจายของเกรด (Grade Distribution)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradeChart;