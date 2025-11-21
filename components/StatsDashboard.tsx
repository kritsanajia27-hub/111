import React from 'react';
import { Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Statistics } from '../types';

interface StatsDashboardProps {
  stats: Statistics;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const cards = [
    {
      title: "นักเรียนทั้งหมด",
      value: stats.totalStudents,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-50",
      textColor: "text-blue-900"
    },
    {
      title: "คะแนนเฉลี่ย",
      value: stats.averageScore,
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      bg: "bg-purple-50",
      textColor: "text-purple-900"
    },
    {
      title: "ผ่านเกณฑ์",
      value: stats.passCount,
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      bg: "bg-emerald-50",
      textColor: "text-emerald-900"
    },
    {
      title: "ไม่ผ่านเกณฑ์",
      value: stats.failCount,
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      bg: "bg-red-50",
      textColor: "text-red-900"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-slate-100 flex items-center space-x-4">
          <div className={`p-3 rounded-full ${card.bg}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDashboard;