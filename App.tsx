import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Upload, Download, FileSpreadsheet, Calculator, Save } from 'lucide-react';
import { generateTemplate, parseExcelFile, exportResults } from './services/excelService';
import { calculateStudentStats, getStatistics } from './utils/calculation';
import { Student } from './types';
import StatsDashboard from './components/StatsDashboard';
import GradeChart from './components/GradeChart';
import StudentTable from './components/StudentTable';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    generateTemplate();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);
    
    try {
      const data = await parseExcelFile(file);
      setStudents(data);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("เกิดข้อผิดพลาดในการอ่านไฟล์ โปรดตรวจสอบ format");
    } finally {
      setLoading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdateStudent = useCallback((index: number, field: keyof Student, value: string | number) => {
    setStudents(prevStudents => {
      const newStudents = [...prevStudents];
      const student = { ...newStudents[index], [field]: value };
      
      // Re-calculate logic
      const { total, grade, remarks } = calculateStudentStats(student);
      student.totalScore = total;
      student.grade = grade;
      student.remarks = remarks;

      newStudents[index] = student;
      return newStudents;
    });
  }, []);

  const handleExport = () => {
    if (students.length === 0) return;
    exportResults(students);
  };

  const stats = useMemo(() => getStatistics(students), [students]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">GradeWizard Pro</h1>
              <p className="text-xs text-slate-500">ระบบจัดการและตัดเกรดอัตโนมัติ</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">โหลด Template</span>
            </button>

            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls"
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                {loading ? (
                   <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>Import Excel</span>
              </button>
            </div>

            <button 
              onClick={handleExport}
              disabled={students.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition-colors ${
                students.length === 0 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Export ผลลัพธ์</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats Overview */}
        <StatsDashboard stats={stats} />

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chart */}
          <div className="lg:col-span-1">
            <GradeChart students={students} />
            
            {fileName && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                กำลังทำงานกับไฟล์: <span className="font-semibold ml-1">{fileName}</span>
              </div>
            )}
          </div>

          {/* Right: Table */}
          <div className="lg:col-span-2">
            <StudentTable students={students} onUpdateStudent={handleUpdateStudent} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;