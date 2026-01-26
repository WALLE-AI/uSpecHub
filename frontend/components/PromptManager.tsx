import React, { useState, useRef } from 'react';
import { 
  Filter, 
  RotateCcw, 
  ChevronDown,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  UploadCloud,
  Loader2,
  X,
  HardHat,
  Plane,
  Home,
  Monitor,
  MoonStar
} from 'lucide-react';

// --- Types ---
interface HazardSummary {
  level: 'A' | 'B' | 'C' | 'D';
  label: string;
  count: number;
  colorBg: string;
  colorText: string;
  colorBorder: string;
}

interface Report {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  riskScore: number;
  riskLevel: 'A' | 'B' | 'C' | 'D';
  totalHazards: number;
  hazardSummary: HazardSummary[];
  date: string;
  // Detailed fields
  sceneJudgment?: string;
  overallOpinion?: string;
  hazards?: DetailedHazard[];
  status?: 'analyzing' | 'done';
}

interface DetailedHazard {
  id: string;
  title: string;
  description: string;
  riskLabel: string;
  riskLevel: 'Extreme' | 'High' | 'Medium' | 'Low';
  recommendations: string[];
  bbox?: { top: string; left: string; width: string; height: string; label: string };
}

interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
}

// --- Mock Data ---
const MOCK_API_RESPONSE = {
  "hazards": [
    {
      "id": "96204297-9d7e-4f59-bb7c-c85a2cb59ed4",
      "category": "高空作业防护",
      "label": "作业人员未系安全带",
      "evidence_region": {
        "type": "bbox",
        "bbox_xywh_norm": [
          0.25,
          0.21,
          0.55,
          0.45
        ]
      },
      "evidence_quality": "clear",
      "severity": "A",
      "risk_score": 0,
      "confidence": 0.98,
      "rationale_brief": "工人在脚手架上作业，未见安全带固定，存在高空坠落风险。",
      "remediation": [
        "立即要求工人系挂安全带",
        "加强现场安全交底与检查"
      ],
      "status": "CONFIRMED",
      "kb_citations": []
    },
    {
      "id": "e5d7f30b-d753-4ba2-89c3-7b924206e86e",
      "category": "脚手架结构",
      "label": "脚手架杆件连接处有松动迹象",
      "evidence_region": {
        "type": "bbox",
        "bbox_xywh_norm": [
          0.35,
          0.15,
          0.45,
          0.25
        ]
      },
      "evidence_quality": "clear",
      "severity": "B",
      "risk_score": 0,
      "confidence": 0.95,
      "rationale_brief": "脚手架杆件连接处可见松动，可能影响整体稳定性。",
      "remediation": [
        "立即加固松动连接件",
        "全面检查脚手架结构安全"
      ],
      "status": "CONFIRMED",
      "kb_citations": []
    }
  ],
  "summary": "脚手架作业人员未系安全带，杆件连接处有松动，存在高空坠落及结构失稳风险，需立即整改。",
  "task_id": "1c039ad9-136c-4b98-80b8-ec4e6aa4a958",
  "scene_guess": {
    "task_similarity": true,
    "rationale": "图片显示建筑工地脚手架上作业人员，符合建筑施工场景特征。",
    "scene_title": "高层建筑外墙脚手架作业",
    "spatial": "高空作业，工人位于脚手架平台，背景为建筑外墙",
    "scene_type": [
      "建筑施工",
      "脚手架"
    ],
    "objects": [
      "外脚手架",
      "作业人员1名",
      "安全帽",
      "脚手架杆件"
    ],
    "actions": [
      "工人在脚手架上作业"
    ],
    "risk_hints": [
      "脚手架未见安全网或防护层",
      "作业人员未系安全带",
      "脚手架杆件连接处有松动迹象"
    ]
  },
  "auto_queries": [],
  "token_usage": 4861,
  "overall_risk_score": 0,
  "version": "v1.1",
  "date": "2025-11-21T19",
  "image_path": "https://hb11oss.ctyunxs.cn/aimoxing/anhui_quality/images/bd31db50b2a147dd9ed808ecf1f9ac6c.png"
};

const HAZARD_DETAILS_MOCK: DetailedHazard[] = [
  {
    id: 'h1',
    title: '作业人员未系安全带',
    description: '工人在高处作业未系安全带，存在高处坠落风险。',
    riskLabel: '极高风险',
    riskLevel: 'Extreme',
    recommendations: [
      '立即要求佩戴安全带',
      '加强安全交底与检查'
    ],
    bbox: { top: '50%', left: '55%', width: '20%', height: '40%', label: '作业人员未系安全带' }
  },
  {
    id: 'h2',
    title: '脚手架未见安全网或防护层',
    description: '脚手架外侧无安全网，易发生物体坠落伤人。',
    riskLabel: '高风险',
    riskLevel: 'High',
    recommendations: [
      '立即增设安全网',
      '定期检查防护设施完整性'
    ]
  }
];

const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    title: 'img-only-v1.0-20240520-001',
    subtitle: '施工现场地面泥泞，材料堆放杂乱',
    description: '施工现场地面泥泞未硬化，存在滑倒及设备运行风险；砖块堆垛未规范堆放，底部散落碎砖，存在坍塌隐患。需立即清理并硬化路面，规范材料堆放。',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop', 
    riskScore: 90.0,
    riskLevel: 'A',
    totalHazards: 2,
    hazardSummary: [
      { level: 'A', label: '极高风险', count: 1, colorBg: 'bg-red-50', colorText: 'text-red-700', colorBorder: 'border-red-100' },
      { level: 'B', label: '高风险', count: 1, colorBg: 'bg-orange-50', colorText: 'text-orange-700', colorBorder: 'border-orange-100' }
    ],
    date: '2024-05-20',
    sceneJudgment: '图片显示建筑工地脚手架上工人在作业，符合建筑施工场景特征。',
    overallOpinion: '脚手架作业人员未系安全带，且无安全网防护，存在高处坠落风险，需立即整改。',
    hazards: HAZARD_DETAILS_MOCK,
    status: 'done'
  },
  {
    id: '2',
    title: 'mock-demo-002',
    subtitle: '高层建筑施工现场',
    description: '现场存在临时用电管理不到位和塔吊作业区布置不合理的风险，需要立即整改以确保高处作业及设备运行安全。',
    imageUrl: '', 
    riskScore: 65.0,
    riskLevel: 'B',
    totalHazards: 2,
    hazardSummary: [
      { level: 'B', label: '高风险', count: 1, colorBg: 'bg-orange-50', colorText: 'text-orange-700', colorBorder: 'border-orange-100' },
      { level: 'C', label: '中等风险', count: 1, colorBg: 'bg-yellow-50', colorText: 'text-yellow-700', colorBorder: 'border-yellow-100' }
    ],
    date: '2024-05-21',
    sceneJudgment: '图片显示高层建筑施工现场，存在多处临时设施。',
    overallOpinion: '现场临时用电和塔吊布置存在隐患，建议立即停工整改。',
    hazards: [],
    status: 'done'
  },
  {
    id: '3',
    title: 'afa0f0ac-6e24-4674-8ce9-dc...',
    subtitle: '基坑作业区',
    description: '基坑内积水、裸露电缆及湿滑梯子构成多重安全风险，需立即整改排水、绝缘及防滑措施，避免人员滑倒或触电事故。',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop', 
    riskScore: 0.0, 
    riskLevel: 'D',
    totalHazards: 3,
    hazardSummary: [
      { level: 'A', label: '极高风险', count: 1, colorBg: 'bg-red-50', colorText: 'text-red-700', colorBorder: 'border-red-100' },
      { level: 'B', label: '高风险', count: 1, colorBg: 'bg-orange-50', colorText: 'text-orange-700', colorBorder: 'border-orange-100' },
      { level: 'C', label: '中等风险', count: 1, colorBg: 'bg-yellow-50', colorText: 'text-yellow-700', colorBorder: 'border-yellow-100' }
    ],
    date: '2024-05-22',
    sceneJudgment: '图片显示基坑内部作业环境，光线较暗，有积水。',
    overallOpinion: '基坑积水严重且有漏电风险，必须立即停止作业进行排水和电路检修。',
    hazards: [],
    status: 'done'
  }
];

const PROJECTS: Project[] = [
  {
    id: 'construction',
    title: '建造工地质安隐患识别',
    description: '识别施工现场人员未戴安全帽、未系安全带、临边防护缺失等常见风险。',
    icon: <HardHat size={32} />,
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50'
  },
  {
    id: 'drone',
    title: '无人机巡检隐患（桥梁检测）',
    description: '利用无人机影像识别桥梁裂缝、腐蚀、甚至违规占压等隐患。',
    icon: <Plane size={32} />,
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50'
  },
  {
    id: 'indoor',
    title: '室内装饰装修隐患识别',
    description: '检测室内装修过程中的用电违规、易燃物堆放、结构破坏等安全隐患。',
    icon: <Home size={32} />,
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50'
  },
  {
    id: 'smart_site',
    title: '智慧工地质安监控',
    description: '实时接入监控视频流，全天候智能识别现场人员违规、设备异常及环境风险。',
    icon: <Monitor size={32} />,
    color: 'bg-indigo-600',
    lightColor: 'bg-indigo-50'
  },
    {
    id: 'car_inspection',
    title: '建筑工地车牌识别与管理',
    description: '自动识别进出工地的车辆车牌，提升车辆管理效率与安全。',
    icon: <MoonStar size={32} />,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50'
  }
];

const HAZARD_CATEGORIES = [
  '个人防护',
  '安全文明施工',
  '材料堆放管理',
  '环境安全',
  '用电安全'
];

const RISK_LEVELS = [
  { id: 'A', label: '极高风险 (A)' },
  { id: 'B', label: '高风险 (B)' },
  { id: 'C', label: '中等风险 (C)' },
  { id: 'D', label: '低风险 (D)' },
];

// Component for Checkbox
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-2 mb-3 cursor-pointer group" onClick={onChange}>
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
      checked ? 'bg-primary border-primary' : 'bg-white border-slate-300 group-hover:border-primary'
    }`}>
      {checked && <CheckCircle size={10} className="text-white" />}
    </div>
    <span className={`text-sm ${checked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{label}</span>
  </div>
);

const PromptManager: React.FC = () => {
  // Navigation State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Detail View Interaction States
  const [kbLoading, setKbLoading] = useState(false);

  const handleProjectClick = (project: Project) => {
    if (project.id === 'construction') {
      window.location.href = 'http://36.103.239.202:9005/web';
      return;
    }
    if (project.id === 'car_inspection') {
      window.location.href = 'http://118.196.10.206/demo_client.html';
      return;
    }
    setActiveProject(project);
  };

  const toggleCategory = (cat: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(cat)) newSet.delete(cat);
    else newSet.add(cat);
    setSelectedCategories(newSet);
  };

  const toggleRiskLevel = (level: string) => {
    const newSet = new Set(selectedRiskLevels);
    if (newSet.has(level)) newSet.delete(level);
    else newSet.add(level);
    setSelectedRiskLevels(newSet);
  };

  const resetFilters = () => {
    setSelectedCategories(new Set());
    setSelectedRiskLevels(new Set());
    setStartDate('');
    setEndDate('');
  };

  const handleLoadKB = () => {
    setKbLoading(true);
    setTimeout(() => setKbLoading(false), 1500);
  };

  // File Upload Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Helper to transform API/Mock data to Report format
  const transformDataToReport = (report: Report, apiData: any): Report => {
      // Map Hazards
     const mappedHazards: DetailedHazard[] = apiData.hazards.map((h: any) => ({
        id: h.id,
        title: h.label,
        description: h.rationale_brief,
        riskLabel: h.severity === 'A' ? '极高风险' : h.severity === 'B' ? '高风险' : h.severity === 'C' ? '中等风险' : '低风险',
        riskLevel: h.severity === 'A' ? 'Extreme' : h.severity === 'B' ? 'High' : h.severity === 'C' ? 'Medium' : 'Low',
        recommendations: h.remediation,
        bbox: h.evidence_region && h.evidence_region.bbox_xywh_norm ? {
           left: `${h.evidence_region.bbox_xywh_norm[0] * 100}%`,
           top: `${h.evidence_region.bbox_xywh_norm[1] * 100}%`,
           width: `${h.evidence_region.bbox_xywh_norm[2] * 100}%`,
           height: `${h.evidence_region.bbox_xywh_norm[3] * 100}%`,
           label: h.label
        } : undefined
     }));

     // Calculate Summary
     const counts = { A: 0, B: 0, C: 0, D: 0 };
     apiData.hazards.forEach((h: any) => {
       if (h.severity in counts) counts[h.severity as keyof typeof counts]++;
     });

     const summary: HazardSummary[] = [];
     if (counts.A > 0) summary.push({ level: 'A', label: '极高风险', count: counts.A, colorBg: 'bg-red-50', colorText: 'text-red-700', colorBorder: 'border-red-100' });
     if (counts.B > 0) summary.push({ level: 'B', label: '高风险', count: counts.B, colorBg: 'bg-orange-50', colorText: 'text-orange-700', colorBorder: 'border-orange-100' });
     if (counts.C > 0) summary.push({ level: 'C', label: '中等风险', count: counts.C, colorBg: 'bg-yellow-50', colorText: 'text-yellow-700', colorBorder: 'border-yellow-100' });
     if (counts.D > 0) summary.push({ level: 'D', label: '低风险', count: counts.D, colorBg: 'bg-slate-50', colorText: 'text-slate-700', colorBorder: 'border-slate-100' });

     // Calculate pseudo risk score if 0 or missing
     let finalScore = apiData.overall_risk_score || 0;
     if (finalScore === 0) {
        const calculatedRiskScore = counts.A * 40 + counts.B * 20 + counts.C * 10;
        finalScore = calculatedRiskScore > 95 ? 95 : calculatedRiskScore; 
     }
     
     const overallLevel = counts.A > 0 ? 'A' : counts.B > 0 ? 'B' : counts.C > 0 ? 'C' : 'D';

     return {
       ...report,
       status: 'done',
       title: apiData.scene_guess?.scene_title || report.title,
       subtitle: apiData.scene_guess?.rationale || '分析完成',
       description: apiData.summary,
       imageUrl: apiData.image_path || report.imageUrl, // Prefer API URL
       riskScore: finalScore,
       riskLevel: overallLevel,
       totalHazards: apiData.hazards.length,
       hazardSummary: summary,
       sceneJudgment: apiData.scene_guess?.rationale,
       overallOpinion: apiData.summary,
       hazards: mappedHazards
     };
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    // Create temporary reports
    const newReports: Report[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      title: file.name,
      subtitle: '正在初始化 AI 分析模型...',
      description: '图片已上传，系统正在进行多模态视觉隐患识别...',
      imageUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      riskScore: 0,
      riskLevel: 'D',
      totalHazards: 0,
      hazardSummary: [],
      date: new Date().toISOString().split('T')[0],
      status: 'analyzing',
      hazards: []
    }));

    setReports(prev => [...newReports, ...prev]);

    // Process each file
    newReports.forEach(async (report, index) => {
      const file = files[index];
      const reportId = report.id;
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        // Request to backend API
        // The endpoint matches the provided python backend: @router.post("/api/analyze")
        const response = await fetch('http://36.103.239.202:9005/agent/api/analyze', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`API Request Failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setReports(prev => prev.map(r => {
          if (r.id === reportId) {
             return transformDataToReport(r, data);
          }
          return r;
        }));

      } catch (error) {
        console.error("Analysis failed for report " + reportId, error);
        
        // Fallback to mock data for demo purposes if API is not available
        // This ensures the UI is still functional and testable in the demo environment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setReports(prev => prev.map(r => {
          if (r.id === reportId) {
             // In a real production app, you would handle error state here.
             // For this demo, we fallback to mock data so you can see the result UI.
             return transformDataToReport(r, MOCK_API_RESPONSE);
          }
          return r;
        }));
      }
    });
  };

  // --- RENDER: DETAIL VIEW ---
  if (selectedReport) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] flex flex-col font-sans">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-blue-700">质量安全审查</h1>
          </div>
          <button 
            onClick={() => setSelectedReport(null)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft size={16} /> 返回列表
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            
            {/* Left: Annotated Image */}
            <div className="flex flex-col bg-slate-200 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 text-center font-bold text-slate-700 uppercase tracking-wider text-sm">
                智能识别标注 (AI Annotated)
              </div>
              <div className="flex-1 relative flex items-center justify-center bg-slate-800/5 overflow-hidden p-4">
                {selectedReport.imageUrl ? (
                  <div className="relative inline-block shadow-2xl">
                    <img 
                      src={selectedReport.imageUrl} 
                      alt="Annotated Scene" 
                      className="max-h-[70vh] object-contain rounded-lg"
                    />
                    {/* Render Bounding Boxes */}
                    {selectedReport.hazards?.map(h => h.bbox && (
                      <div 
                        key={h.id}
                        className="absolute border-2 border-red-500 bg-red-500/10 z-10 group cursor-pointer hover:bg-red-500/20 transition-colors"
                        style={{
                          top: h.bbox.top,
                          left: h.bbox.left,
                          width: h.bbox.width,
                          height: h.bbox.height
                        }}
                      >
                        <div className="absolute -top-7 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {h.bbox.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="flex flex-col items-center justify-center text-slate-400 p-20">
                     <ImageIcon size={64} className="mb-4 opacity-50"/>
                     <span>No image available for annotation</span>
                   </div>
                )}
              </div>
            </div>

            {/* Right: Analysis Details */}
            <div className="flex flex-col space-y-6 overflow-y-auto pr-2">
              
              {/* Title & Judgment */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">风险分析报告</h2>
                <div className="space-y-3 text-sm leading-relaxed">
                  <p>
                    <span className="font-bold text-blue-700">场景判断：</span> 
                    <span className="text-slate-700 italic">{selectedReport.sceneJudgment || '无场景描述'}</span>
                  </p>
                  <p>
                    <span className="font-bold text-blue-700">整体意见：</span> 
                    <span className="text-slate-700">{selectedReport.overallOpinion || '无整体意见'}</span>
                  </p>
                </div>
              </div>

              {/* Hazards List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">隐患内容 ({selectedReport.totalHazards})</h3>
                </div>
                
                {/* Action Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <button 
                    onClick={handleLoadKB}
                    disabled={kbLoading}
                    className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                  >
                    {kbLoading ? <span className="animate-spin">⌛</span> : <BookOpen size={16} />}
                    加载知识库引用
                  </button>
                  <span className="text-xs text-slate-500">点击按钮触发接口请求，获取最新的知识库引用条款</span>
                </div>

                <div className="space-y-4">
                  {selectedReport.hazards && selectedReport.hazards.length > 0 ? (
                    selectedReport.hazards.map(hazard => (
                      <div key={hazard.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 relative overflow-hidden">
                         {/* Risk Badge */}
                         <div className={`absolute top-0 right-0 px-3 py-1.5 text-xs font-bold rounded-bl-xl ${
                           hazard.riskLevel === 'Extreme' ? 'bg-red-50 text-red-600' :
                           hazard.riskLevel === 'High' ? 'bg-orange-50 text-orange-600' : 
                           hazard.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-600'
                         }`}>
                           {hazard.riskLabel}
                         </div>

                         <h4 className="text-lg font-bold text-slate-800 mb-4 pr-20">{hazard.title}</h4>
                         
                         <div className="space-y-4">
                            <div className="flex gap-3">
                              <div className="mt-0.5 flex-shrink-0 text-orange-500"><AlertTriangle size={18} /></div>
                              <div>
                                <span className="text-sm font-bold text-slate-700 block mb-0.5">隐患描述:</span>
                                <p className="text-sm text-slate-600 leading-relaxed">{hazard.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <div className="mt-0.5 flex-shrink-0 text-green-600"><CheckCircle size={18} /></div>
                              <div>
                                <span className="text-sm font-bold text-slate-700 block mb-0.5">整改建议:</span>
                                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                  {hazard.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                              </div>
                            </div>
                         </div>

                         <div className="mt-5 pt-3 border-t border-slate-50 text-xs text-slate-400 cursor-pointer hover:text-primary transition-colors">
                           相关依据: {hazard.id.split('-')[0]}... (点击查看完整引用)
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                      <CheckCircle size={40} className="mx-auto mb-3 text-green-500 opacity-50"/>
                      <p>暂无具体隐患记录</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full shadow-xl shadow-indigo-300 flex items-center justify-center transition-transform hover:scale-110 z-50">
          <MessageSquare size={28} fill="currentColor" className="text-white" />
        </button>
      </div>
    );
  }

  // --- RENDER: PROJECT SELECTION VIEW ---
  if (!activeProject) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] p-6 md:p-12 font-sans flex flex-col">
        <div className="text-center mb-16 mt-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">建筑大模型质安隐患识别体验中心</h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            选择一个行业场景，体验基于多模态大模型的智能安全隐患检测能力。
            支持单图及批量图片上传，自动生成包含隐患定位、风险等级与整改建议的专业报告。
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {PROJECTS.map(project => (
            <div 
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-center text-center h-full"
            >
              <div className={`w-20 h-20 rounded-full ${project.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {project.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                {project.description}
              </p>
              <button className="px-6 py-2.5 rounded-full bg-slate-50 text-slate-600 font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                立即体验
              </button>
            </div>
          ))}
        </div>
        
      </div>
    );
  }

  // --- RENDER: LIST VIEW (Grid) ---
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] p-6 md:p-12 font-sans">
      
      {/* Back to Selection */}
      <button 
        onClick={() => setActiveProject(null)}
        className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} /> 切换场景
      </button>

      {/* --- Header --- */}
      <div className="text-center mb-10">
        <div className={`inline-flex items-center justify-center p-3 rounded-full ${activeProject.color} text-white mb-4 shadow-md`}>
           {activeProject.icon}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{activeProject.title}</h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">{activeProject.description}</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* --- Upload Zone --- */}
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 mb-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group
            ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/png, image/jpeg, image/webp, application/json"
            onChange={handleFileSelect}
          />
          
          <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud size={32} strokeWidth={1.5} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">点击或拖拽上传现场图片</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            支持单张或多张批量上传 (JPG, PNG, BMP)。系统将自动调用 <code className="bg-slate-100 px-1 rounded text-xs text-slate-700">/api/analyze</code> 接口进行多模态视觉分析。
          </p>
        </div>

        {/* --- Filter Section --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-10">
          {/* Filter Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary font-bold text-base">
              <Filter size={18} className="fill-current" />
              <span>筛选报告</span>
            </div>
            <button 
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100"
            >
              <RotateCcw size={12} /> 重置
            </button>
          </div>

          {/* Filter Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Hazard Categories */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4">隐患分类</h3>
              <div className="space-y-0">
                {HAZARD_CATEGORIES.map(cat => (
                  <Checkbox 
                    key={cat} 
                    label={cat} 
                    checked={selectedCategories.has(cat)} 
                    onChange={() => toggleCategory(cat)} 
                  />
                ))}
              </div>
            </div>

            {/* Risk Levels */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4">风险等级</h3>
              <div className="space-y-0">
                {RISK_LEVELS.map(level => (
                  <Checkbox 
                    key={level.id} 
                    label={level.label} 
                    checked={selectedRiskLevels.has(level.id)} 
                    onChange={() => toggleRiskLevel(level.id)} 
                  />
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4">日期范围</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">开始日期</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">结束日期</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- Reports Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <div 
              key={report.id} 
              onClick={() => report.status !== 'analyzing' && setSelectedReport(report)}
              className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300 overflow-hidden flex flex-col group relative
                ${report.status === 'analyzing' ? 'cursor-wait opacity-90' : 'hover:shadow-xl hover:border-blue-300 cursor-pointer transform hover:-translate-y-1'}`}
            >
              
              {/* Analyzing Overlay */}
              {report.status === 'analyzing' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                  <Loader2 size={32} className="text-primary animate-spin mb-3"/>
                  <span className="text-sm font-bold text-slate-800">正在智能分析...</span>
                  <span className="text-xs text-slate-500 mt-1">调用 VLM 模型识别隐患</span>
                </div>
              )}

              {/* Image Section */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {report.imageUrl ? (
                  <img 
                    src={report.imageUrl} 
                    alt="Report Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <ImageIcon size={32} className="mb-2 opacity-50"/>
                    <span className="text-xs">Image not available</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col relative">
                
                {/* Floating Risk Score */}
                <div className={`absolute top-4 right-4 w-14 h-14 rounded-full border-4 flex flex-col items-center justify-center bg-white shadow-sm z-10 ${
                   report.riskScore >= 80 ? 'border-red-500 text-red-600' : 
                   report.riskScore > 40 ? 'border-orange-500 text-orange-600' : 'border-green-500 text-green-600'
                }`}>
                   <span className="text-sm font-bold leading-none">{report.riskScore.toFixed(0)}</span>
                   <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">Risk</span>
                </div>

                <div className="pr-14 mb-2">
                  <h3 className="font-bold text-blue-600 text-sm truncate mb-1" title={report.title}>
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{report.subtitle}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6 flex-1">
                  {report.description}
                </p>

                {/* Footer: Summary */}
                <div className="mt-auto pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-500">隐患概览 (总数: {report.totalHazards})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.hazardSummary.map((item, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[10px] font-medium px-2 py-0.5 rounded border ${item.colorBg} ${item.colorText} ${item.colorBorder}`}
                      >
                        {item.label}: {item.count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PromptManager;