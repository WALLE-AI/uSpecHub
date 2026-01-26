import React, { useState } from 'react';
import {
  Search,
  Cpu,
  Zap,
  Image as ImageIcon,
  Video,
  Mic,
  Box,
  Star,
  ArrowRight,
  BarChart3,
  Layout,
  ChevronDown,
  MessageSquare,
  FileImage,
  Database,
  Terminal,
  AlertCircle,
  FileText,
  Play,
  Code,
  Globe,
  RotateCw,
  CheckCircle2,
  Loader2,
  Activity,
  Sparkles,
  MoreHorizontal,
  Info
} from 'lucide-react';

// --- Types ---
// --- Types ---
interface ModelSpec {
  id: string;
  name: string;
  version: string;
  domain: 'Architecture' | 'Medical' | 'Finance' | 'General';
  description: string;
  fullDescription: string;
  provider: string;
  useCases: string[];
  capabilities: ('Text' | 'Vision' | 'Video' | 'Audio' | 'Code')[];
  contextWindow: string;
  pricing: {
    input: string;
    output: string;
  };
  tags: string[];
  status: 'Stable' | 'Preview' | 'Deprecated';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// --- Mock Data ---
const MODELS: ModelSpec[] = [
  {
    id: 'med-insight-v4',
    name: 'MedInsight V4 (Clinical)',
    version: '2026-v4.1',
    domain: 'Medical',
    provider: 'uSpecHub Research',
    description: '临床辅助诊断模型。基于数亿级医学影像及病历数据训练，支持多模态临床决策支持、医学报告生成及罕见病辅助检测。',
    fullDescription: 'MedInsight V4 是 uSpecHub 专为医疗健康领域打造的旗舰级多模态模型。它在数亿级脱敏医学影像（CT、MRI、X光片）和专业临床文献上进行了深度预训练。该模型不仅能够辅助医生进行快速影像筛查，还能根据患者主诉生成结构化的初步诊断报告，极大提升诊疗效率。其内置的医学知识图谱涵盖了超过 50,000 种疾病和药品信息，特别在罕见病辅助诊断方面表现卓越。',
    useCases: ['CT/MRI 影像辅助阅片', '电子病历自动生成', '罕见病症状匹配', '药物相互作用检查'],
    capabilities: ['Text', 'Vision'],
    contextWindow: '1M Tokens',
    pricing: { input: '¥5.00 / 1M', output: '¥15.00 / 1M' },
    tags: ['临床决策', '影像分析', '病例整理'],
    status: 'Stable',
    icon: <Activity size={24} />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    id: 'fin-quant-ultra',
    name: 'FinQuant Ultra (Finance)',
    version: '2026-v2.5',
    domain: 'Finance',
    provider: 'uSpecHub Financial',
    description: '金融量化分析模型。集成实时行情接口，支持量化策略回测、风险评估及宏观经济预测，遵循全球主要金融监管要求。',
    fullDescription: 'FinQuant Ultra 是一款专为金融机构设计的量化分析引擎。它实时接入全球主要证券交易所的行情数据，毫秒级响应市场变化。模型内置了复杂的数学金融工具库，能够执行高频交易策略回测、资产组合风险价值(VaR)计算以及基于宏观经济指标的市场趋势预测。特别针对金融监管合规进行了优化，确保所有输出符合 Basel III 等国际监管标准。',
    useCases: ['量化策略回测', '投资组合风险评估', '宏观经济趋势预测', '财报智能解读'],
    capabilities: ['Text', 'Code'],
    contextWindow: '512K',
    pricing: { input: '¥4.20 / 1M', output: '¥12.00 / 1M' },
    tags: ['风控模型', '财报分析', '量化回测'],
    status: 'Stable',
    icon: <BarChart3 size={24} />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'veo-construction-viz-3',
    name: 'Veo Construction Viz 3',
    version: 'Preview',
    domain: 'Architecture',
    provider: 'uSpecHub Visuals',
    description: '建筑施工可视化模型。能够根据施工进度表和图纸生成高质量的施工模拟视频，支持 4K 极清输出。',
    fullDescription: 'Veo Construction Viz 3 是新一代建筑可视化生成模型。它突破性地结合了视频生成技术与建筑信息模型（BIM），能够仅凭二维图纸和施工进度计划表（Gantt Chart），自动生成全周期的施工模拟视频。支持从地基开挖到主体封顶的全过程推演，帮助项目组直观预判施工冲突和进度瓶颈。支持最高 4K 分辨率的写实级渲染输出，适用于项目汇报和投标展示。',
    useCases: ['施工进度视频模拟', '项目投标可视化展示', '施工工艺流程演示', '场地布置方案推演'],
    capabilities: ['Video'],
    contextWindow: 'N/A',
    pricing: { input: '¥0.50 / 图像', output: '¥2.00 / 分钟视频' },
    tags: ['进度模拟', '施工演示', '数字孪生'],
    status: 'Preview',
    icon: <Video size={24} />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'structural-check-native-2',
    name: 'Structural Check Native',
    version: 'Advanced',
    domain: 'Architecture',
    provider: 'uSpecHub Engineering',
    description: '原生结构复核模型。深度集成力学计算引擎，支持直接读取 CAD/BIM 数据并进行安全性、经济性指标复核。',
    fullDescription: 'Structural Check Native 是 uSpecHub 在工程领域的杀手级应用。与传统大模型不同，它底层深度集成了有限元分析（FEA）数值计算引擎，保证了结构计算的物理准确性。它可以直接读取 IFC、DWG 等工程文件，自动进行梁柱截面复核、配筋率检查以及抗震性能评估。模型经过了数百万份真实工程图纸的微调，能够精准识别不符合国家规范的结构设计隐患。',
    useCases: ['结构施工图审查', '抗震性能评估', '构件配筋率复核', '用钢量经济性优化'],
    capabilities: ['Code', 'Vision'],
    contextWindow: '512K',
    pricing: { input: '¥5.00 / 1M', output: '¥15.00 / 1M' },
    tags: ['力学核查', '结构计算', '超精细推理'],
    status: 'Stable',
    icon: <Box size={24} />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50'
  }
];

const CATEGORIES = [
  { id: 'all', label: '全部类型', icon: <Box size={16} /> },
  { id: 'text', label: '文本', icon: <Terminal size={16} /> },
  { id: 'vision', label: '视觉 & 图像', icon: <ImageIcon size={16} /> },
  { id: 'video', label: '视频生成', icon: <Video size={16} /> },
];

const DOMAIN_CATEGORIES = [
  { id: 'all', label: '跨领域模型' },
  { id: 'Architecture', label: '建筑与基建', color: 'bg-blue-600' },
  { id: 'Medical', label: '医疗与健康', color: 'bg-teal-600' },
  { id: 'Finance', label: '金融与经管', color: 'bg-amber-600' },
];

// --- Detail Modal Component ---
const ModelDetailModal = ({ model, onClose, onNavigateToDevCenter }: { model: ModelSpec | null, onClose: () => void, onNavigateToDevCenter: () => void }) => {
  if (!model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${model.bgColor} ${model.color} shadow-sm`}>
              {model.icon}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{model.name}</h2>
                <span className={`px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider border
                  ${model.status === 'Preview' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    model.status === 'Stable' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-mono flex items-center gap-2">
                <span>{model.version}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-slate-600 font-medium">{model.provider}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Search size={20} className="rotate-45" /> {/* Close Icon using rotated Search or import X if available */}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {/* Section 1: Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Info size={16} className="text-primary" /> 模型概览
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {model.fullDescription}
            </p>
          </div>

          {/* Section 2: Use Cases & Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> 核心用途
              </h3>
              <ul className="space-y-2">
                {model.useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Cpu size={16} className="text-blue-500" /> 技术规格
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">上下文窗口</span>
                  <span className="font-bold text-slate-700">{model.contextWindow}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">输入价格</span>
                  <span className="font-bold text-slate-700">{model.pricing.input}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">输出价格</span>
                  <span className="font-bold text-slate-700">{model.pricing.output}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">所属领域</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white
                          ${model.domain === 'Architecture' ? 'bg-blue-500' :
                      model.domain === 'Medical' ? 'bg-teal-500' :
                        model.domain === 'Finance' ? 'bg-amber-500' : 'bg-slate-500'}`}>
                    {model.domain}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white hover:border-slate-300 transition-colors">
            关闭
          </button>
          <button
            onClick={onNavigateToDevCenter}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 shadow-lg shadow-slate-200 transition-colors flex items-center gap-2"
          >
            <Terminal size={16} /> API 使用
          </button>
        </div>
      </div>
    </div>
  );
};

const ModelCenter: React.FC<{ onNavigateToDevCenter: () => void }> = ({ onNavigateToDevCenter }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDomain, setActiveDomain] = useState('Architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelSpec | null>(null);

  const filteredModels = MODELS.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Filter
    const matchesCategory = activeCategory === 'all' ? true :
      activeCategory === 'text' ? (model.capabilities.includes('Text') || model.capabilities.includes('Code')) :
        activeCategory === 'vision' ? model.capabilities.includes('Vision') :
          activeCategory === 'video' ? model.capabilities.includes('Video') : true;

    // Domain Filter
    const matchesDomain = activeDomain === 'all' ? true : model.domain === activeDomain;

    return matchesSearch && matchesCategory && matchesDomain;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] font-sans relative">
      <ModelDetailModal model={selectedModel} onClose={() => setSelectedModel(null)} onNavigateToDevCenter={onNavigateToDevCenter} />

      {/* --- Hero Banner --- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Cpu size={300} strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} /> Model Garden
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">模型中心</h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            探索 uSpecHub 的高性能垂直行业大模型。从深度赋能建筑的结构模型，到极致精准的医疗助手，
            以及专为金融和跨行业设计的智能推理引擎。
          </p>

          {/* Featured Card */}
          <div
            onClick={() => setSelectedModel(MODELS[3])}
            className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center hover:bg-white/15 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/50 group-hover:scale-110 transition-transform duration-500">
              <Box size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">Structural Check Native</h2>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-400 text-rose-950 border border-rose-300">IND-LEADER</span>
              </div>
              <p className="text-slate-200 text-sm md:text-base">
                行业首创原生结构复核模型。深度集成力学计算引擎，支持直接读取 CAD/BIM 数据并进行安全性、经济性指标复核，误差率低于 0.01%。
              </p>
            </div>
            <div className="flex flex-col gap-3 min-w-[140px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToDevCenter();
                }}
                className="px-5 py-2.5 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                API 使用 <ArrowRight size={16} />
              </button>
              <span className="text-xs text-slate-400 text-center">API 价格: ¥5.00 / 1M input</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-20 pb-20">

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 mb-8 space-y-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center p-1 gap-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap
                    ${activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            <div className="relative md:w-80 border-t md:border-t-0 md:border-l border-slate-100 p-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="搜索模型名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Domain Chips */}
          <div className="px-2 py-3 border-t border-slate-50 flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">按行业筛选:</span>
            <div className="flex flex-wrap gap-2">
              {DOMAIN_CATEGORIES.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all flex items-center gap-2
                     ${activeDomain === domain.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  {activeDomain === domain.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                  {domain.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map(model => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
            >

              {/* Card Header */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${model.bgColor} ${model.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  {model.icon}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border
                     ${model.status === 'Preview' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      model.status === 'Stable' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {model.status}
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-sm ${model.domain === 'Architecture' ? 'bg-blue-500' :
                    model.domain === 'Medical' ? 'bg-teal-500' :
                      model.domain === 'Finance' ? 'bg-amber-500' : 'bg-slate-500'
                    }`}>
                    {model.domain}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{model.name}</h3>
                <p className="text-xs text-slate-400 font-mono mb-3">{model.version}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2 h-10">
                  {model.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {model.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Context</span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-green-500" /> {model.contextWindow}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Pricing (Input)</span>
                    <span className="text-xs font-bold text-slate-700">{model.pricing.input}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:text-primary hover:border-blue-200 transition-colors shadow-sm">
                  查看文档
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToDevCenter();
                  }}
                  className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-700 transition-colors shadow-md flex items-center justify-center gap-1"
                >
                  <Terminal size={12} /> API 使用
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">未找到相关模型</h3>
            <p className="text-slate-500 text-sm">请尝试调整筛选条件或搜索关键词</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ModelCenter;
