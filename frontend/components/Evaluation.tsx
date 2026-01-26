import React, { useState } from 'react';
import {
  ClipboardList,
  ChevronDown,
  Play,
  Filter,
  Check,
  Star,
  Zap,
  BookOpen,
  AlertTriangle,
  Scale,
  Clock,
  CheckCircle,
  Loader2,
  BarChart,
  Target,
  FileText,
  BrainCircuit,
  ShieldCheck,
  Trophy,
  Calendar,
  X,
  Plus
} from 'lucide-react';
// FIX: Added CartesianGrid to recharts import.
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
  CartesianGrid
} from 'recharts';

// --- Mock Data ---

const MODELS = [
  { id: 'med-insight-pro', name: 'MedInsight Pro', color: '#3b82f6' },
  { id: 'fin-quant-ultra', name: 'FinQuant Ultra', color: '#22c55e' },
  { id: 'fine-tuned-v1.2', name: '行业微调模型 v1.2', color: '#a855f7' },
];

const BENCHMARKS = [
  { id: 'safety-qa-v1.2', name: '国家安全标准问答 V1.2' },
  { id: 'risk-img-v3.0', name: '施工现场风险图片集 V3.0' },
  { id: 'compliance-docs-v1.0', name: '合规性文档审查 V1.0' },
];

const RADAR_DATA = [
  { subject: '事实准确性', 'med-insight-pro': 92, 'fin-quant-ultra': 85, 'fine-tuned-v1.2': 95, fullMark: 100 },
  { subject: '知识覆盖度', 'med-insight-pro': 95, 'fin-quant-ultra': 80, 'fine-tuned-v1.2': 75, fullMark: 100 },
  { subject: '推理能力', 'med-insight-pro': 88, 'fin-quant-ultra': 82, 'fine-tuned-v1.2': 82, fullMark: 100 },
  { subject: '风险识别', 'med-insight-pro': 94, 'fin-quant-ultra': 88, 'fine-tuned-v1.2': 90, fullMark: 100 },
  { subject: '合规判断', 'med-insight-pro': 85, 'fin-quant-ultra': 78, 'fine-tuned-v1.2': 93, fullMark: 100 },
  { subject: '响应速度', 'med-insight-pro': 70, 'fin-quant-ultra': 95, 'fine-tuned-v1.2': 80, fullMark: 100 },
];

const CATEGORY_PERFORMANCE_DATA = [
  { name: '高空作业', 'med-insight-pro': 95, 'fin-quant-ultra': 89, 'fine-tuned-v1.2': 92 },
  { name: '临时用电', 'med-insight-pro': 91, 'fin-quant-ultra': 82, 'fine-tuned-v1.2': 94 },
  { name: '脚手架', 'med-insight-pro': 89, 'fin-quant-ultra': 85, 'fine-tuned-v1.2': 91 },
  { name: '消防安全', 'med-insight-pro': 96, 'fin-quant-ultra': 90, 'fine-tuned-v1.2': 93 },
  { name: '基坑工程', 'med-insight-pro': 88, 'fin-quant-ultra': 81, 'fine-tuned-v1.2': 85 },
];

const INITIAL_EVALUATIONS = [
  { id: 'EVAL-20240523-001', date: '2024-05-23', benchmark: '国家安全标准问答 V1.2', models: ['MedInsight Pro', 'fine-tuned-v1.2'], score: 93.5, status: 'completed' },
  { id: 'EVAL-20240522-003', date: '2024-05-22', benchmark: '施工现场风险图片集 V3.0', models: ['All Models'], score: 88.2, status: 'completed' },
  { id: 'EVAL-20240520-005', date: '2024-05-20', benchmark: '国家安全标准问答 V1.2', models: ['FinQuant Ultra'], score: 84.1, status: 'completed' },
];

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</div>
      <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
    </div>
  </div>
);

const Evaluation: React.FC = () => {
  // Main view state
  const [selectedModels, setSelectedModels] = useState<string[]>(MODELS.map(m => m.id));
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>(BENCHMARKS[0].id);
  const [recentEvals, setRecentEvals] = useState(INITIAL_EVALUATIONS);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvalName, setNewEvalName] = useState('');
  const [newEvalModels, setNewEvalModels] = useState<string[]>([]);
  const [newEvalBenchmark, setNewEvalBenchmark] = useState(BENCHMARKS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModel = (id: string) => {
    setSelectedModels(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const toggleNewEvalModel = (id: string) => {
    setNewEvalModels(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleRunEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvalModels.length === 0) {
      alert('请至少选择一个模型进行评测。');
      return;
    }
    setIsSubmitting(true);

    const newEvalId = `EVAL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 5)}`;
    const selectedModelNames = MODELS.filter(m => newEvalModels.includes(m.id)).map(m => m.name);

    const newEvalEntry = {
      id: newEvalId,
      date: new Date().toISOString().split('T')[0],
      benchmark: BENCHMARKS.find(b => b.id === newEvalBenchmark)?.name || 'Unknown',
      models: selectedModelNames,
      score: 0,
      status: 'running' as 'running' | 'completed',
    };

    setRecentEvals(prev => [newEvalEntry, ...prev]);
    setIsModalOpen(false);

    setTimeout(() => {
      setRecentEvals(prev => prev.map(ev =>
        ev.id === newEvalId
          ? { ...ev, status: 'completed', score: parseFloat((Math.random() * (95 - 80) + 80).toFixed(1)) }
          : ev
      ));
      setIsSubmitting(false);
      // Reset form state after submission
      setNewEvalName('');
      setNewEvalModels([]);
      setNewEvalBenchmark(BENCHMARKS[0].id);
    }, 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto font-sans">
      {/* --- New Evaluation Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">发起新评测</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRunEvaluation} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">评测名称 (可选)</label>
                <input
                  type="text"
                  value={newEvalName}
                  onChange={e => setNewEvalName(e.target.value)}
                  placeholder="例如：每日基准回归测试"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">选择模型</label>
                <div className="grid grid-cols-2 gap-3">
                  {MODELS.map(model => (
                    <div key={model.id} className="flex items-center gap-2 cursor-pointer group bg-slate-50 p-2 rounded-lg border border-slate-200" onClick={() => toggleNewEvalModel(model.id)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${newEvalModels.includes(model.id) ? 'bg-primary border-primary' : 'bg-white border-slate-300 group-hover:border-primary'}`}>
                        {newEvalModels.includes(model.id) && <Check size={10} className="text-white" />}
                      </div>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }}></div>
                      <span className="text-sm text-slate-700">{model.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">选择基准</label>
                <div className="relative">
                  <select
                    value={newEvalBenchmark}
                    onChange={e => setNewEvalBenchmark(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
                  >
                    {BENCHMARKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">取消</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 w-28 text-sm font-bold text-white bg-primary hover:bg-blue-600 rounded-lg shadow-md transition-colors flex items-center justify-center disabled:bg-blue-300">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : '开始运行'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <ClipboardList className="text-primary" size={32} />
            大模型能力评测中心
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            综合评估不同模型在安全生产领域的知识问答、风险识别与合规判断能力。
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Play size={16} /> 发起新评测
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="最佳表现模型" value="MedInsight Pro" icon={<Trophy size={24} />} color="bg-amber-500" />
        <KPICard title="评测总次数" value="128" icon={<BarChart size={24} />} color="bg-blue-500" />
        <KPICard title="平均准确率" value="89.7%" icon={<Target size={24} />} color="bg-emerald-500" />
        <KPICard title="最难知识领域" value="基坑工程" icon={<AlertTriangle size={24} />} color="bg-red-500" />
      </div>

      {/* Main Comparison Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Scale size={18} className="text-primary" /> 综合能力对比
            </h3>
            <div className="relative">
              <select value={selectedBenchmark} onChange={e => setSelectedBenchmark(e.target.value)} className="text-sm border border-slate-200 rounded-md pl-3 pr-8 py-1.5 bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none">
                {BENCHMARKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {MODELS.map(model => (
              <div key={model.id} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleModel(model.id)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedModels.includes(model.id) ? 'bg-primary border-primary' : 'bg-white border-slate-300 group-hover:border-primary'}`}>
                  {selectedModels.includes(model.id) && <Check size={10} className="text-white" />}
                </div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }}></div>
                <span className={`text-sm ${selectedModels.includes(model.id) ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{model.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                {MODELS.filter(m => selectedModels.includes(m.id)).map(model => (
                  <Radar key={model.id} name={model.name} dataKey={model.id} stroke={model.color} fill={model.color} fillOpacity={0.2} strokeWidth={2} />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-96">
            <h4 className="font-medium text-slate-700 text-center mb-4 text-sm">各场景风险识别准确率</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={CATEGORY_PERFORMANCE_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} cursor={{ fill: '#f1f5f9' }} />
                <Legend />
                {MODELS.filter(m => selectedModels.includes(m.id)).map(model => (
                  <Bar key={model.id} name={model.name} dataKey={model.id} fill={model.color} />
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-primary" /> 最近评测记录
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">评测 ID</th>
                <th className="px-6 py-3 whitespace-nowrap">日期</th>
                <th className="px-6 py-3 whitespace-nowrap">评测基准</th>
                <th className="px-6 py-3 whitespace-nowrap">测试模型</th>
                <th className="px-6 py-3 whitespace-nowrap text-center">综合得分</th>
                <th className="px-6 py-3 whitespace-nowrap">状态</th>
                <th className="px-6 py-3 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEvals.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-600 font-mono text-xs whitespace-nowrap">{log.id}</td>
                  <td className="px-6 py-3 font-medium text-slate-800 whitespace-nowrap">{log.date}</td>
                  <td className="px-6 py-3 text-slate-600">{log.benchmark}</td>
                  <td className="px-6 py-3 text-slate-600">{log.models.join(', ')}</td>
                  <td className="px-6 py-3 text-center">
                    <span className="font-bold text-lg text-primary">{log.status === 'running' ? '-' : log.score}</span>
                  </td>
                  <td className="px-6 py-3">
                    {log.status === 'completed' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100"><CheckCircle size={12} className="mr-1" /> 完成</span>}
                    {log.status === 'running' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"><Loader2 size={12} className="mr-1 animate-spin" /> 运行中</span>}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-primary hover:underline text-xs font-medium">查看报告</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;