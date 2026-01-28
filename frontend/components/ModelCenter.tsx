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
  Info,
  Plus,
  Trash2,
  X
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
    id: 'zhian-qa-expert',
    name: '质安大模型 (ZhiAn QA Expert)',
    version: '2026-v1.0',
    domain: 'Architecture',
    provider: 'uSpecHub Architecture',
    description: '专注建筑质量与安全管理的垂直领域大模型。支持施工现场质量分析、安全隐患识别及行业标准合规性检查。',
    fullDescription: '质安大模型 (ZhiAn QA Expert) 是专为建筑施工安全与质量管理打造的行业大模型。它学习了过往十年的施工事故案例、国家现行质量验收标准以及安全管理规范。该模型通过集成现场视频监控和图像识别技术，能够实时识别未佩戴安全帽、违规动火作业等安全隐患，并自动生成质检报告。其内置的专家推理模板可协助项目总工快速进行质量风险评估，确保工程交付质量。',
    useCases: ['施工安全监控', '质量验收合规检查', '安全隐患自动预警', '质量管理文档生成'],
    capabilities: ['Text', 'Vision'],
    contextWindow: '512K',
    pricing: { input: '¥4.50 / 1M', output: '¥13.50 / 1M' },
    tags: ['安全管理', '质量合规', '现场风控'],
    status: 'Stable',
    icon: <Sparkles size={24} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
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
  { id: 'Architecture', label: '建筑与基建', color: 'bg-blue-600' },
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
            <X size={20} />
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
                          ${model.domain === 'Architecture' ? 'bg-blue-500' : 'bg-slate-500'}`}>
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

// --- Create Model Modal Component ---
const CreateModelModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (model: ModelSpec) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    version: '2026-v1.0',
    provider: 'uSpecHub Architecture',
    description: '',
    fullDescription: '',
    contextWindow: '128K',
    inputPricing: '¥1.00 / 1M',
    outputPricing: '¥3.00 / 1M',
    tags: '',
    useCases: '',
    domain: 'Architecture' as 'Architecture' | 'Medical' | 'Finance' | 'General',
    status: 'Stable' as 'Stable' | 'Preview' | 'Deprecated',
    capabilities: [] as string[]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newModel: ModelSpec = {
      id: `model-${Date.now()}`,
      name: formData.name,
      version: formData.version,
      domain: formData.domain,
      provider: formData.provider,
      description: formData.description,
      fullDescription: formData.fullDescription,
      useCases: formData.useCases.split(',').map(s => s.trim()).filter(s => s),
      capabilities: formData.capabilities as any,
      contextWindow: formData.contextWindow,
      pricing: {
        input: formData.inputPricing,
        output: formData.outputPricing
      },
      tags: formData.tags.split(',').map(s => s.trim()).filter(s => s),
      status: formData.status,
      icon: <Cpu size={24} />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    };
    onAdd(newModel);
    onClose();
  };

  const handleCapabilityToggle = (cap: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(cap)
        ? prev.capabilities.filter(c => c !== cap)
        : [...prev.capabilities, cap]
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" /> 新建模型卡片
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">模型名称</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="如: 结构大师 V2" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">版本号</label>
              <input required value={formData.version} onChange={e => setFormData({ ...formData, version: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="2026-v1.0" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">简短描述 (Card Display)</label>
            <input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="一句话描述模型核心功能" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">详细概述 (Modal View)</label>
            <textarea required rows={3} value={formData.fullDescription} onChange={e => setFormData({ ...formData, fullDescription: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" placeholder="详细介绍模型的训练背景、核心能力和行业优势" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">上下文窗口</label>
              <input value={formData.contextWindow} onChange={e => setFormData({ ...formData, contextWindow: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="128K" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">状态</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                <option value="Stable">Stable</option>
                <option value="Preview">Preview</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">所属领域</label>
              <select value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value as any })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                <option value="Architecture">建筑与基建</option>
                <option value="Medical">医疗与健康</option>
                <option value="Finance">金融与经管</option>
                <option value="General">通用模型</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">模型提供商</label>
              <input value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" placeholder="uSpecHub Architecture" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">输入价格 (per 1M)</label>
              <input value={formData.inputPricing} onChange={e => setFormData({ ...formData, inputPricing: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" placeholder="¥1.00 / 1M" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">输出价格 (per 1M)</label>
              <input value={formData.outputPricing} onChange={e => setFormData({ ...formData, outputPricing: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" placeholder="¥3.00 / 1M" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">模型能力</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Text', 'Vision', 'Video', 'Audio', 'Code'].map(cap => (
                <button
                  type="button"
                  key={cap}
                  onClick={() => handleCapabilityToggle(cap)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${formData.capabilities.includes(cap) ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200'}`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">核心用途 (逗号分隔)</label>
              <input value={formData.useCases} onChange={e => setFormData({ ...formData, useCases: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" placeholder="结构审查, 进度模拟" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">标签 (逗号分隔)</label>
              <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" placeholder="BIM, 结构计算" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">取消</button>
            <button type="submit" className="px-10 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors">提交到模型中心</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ModelCenter: React.FC<{ onNavigateToDevCenter: () => void, isAdmin?: boolean }> = ({ onNavigateToDevCenter, isAdmin }) => {
  const [models, setModels] = useState<ModelSpec[]>(MODELS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDomain, setActiveDomain] = useState('Architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelSpec | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent, modelId: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个模型卡片吗？此操作不可撤销。')) {
      setModels(models.filter(m => m.id !== modelId));
    }
  };

  const filteredModels = models.filter(model => {

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
      <CreateModelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={(newModel) => setModels([newModel, ...models])}
      />

      {/* --- Hero Banner --- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">

        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Cpu size={300} strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} /> Model Garden
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">建筑行业大模型中心</h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            探索 uSpecHub 专为建筑行业打造的高性能大模型。从深度赋能建筑的结构模型，到极致精准的质安助手，
            以及专为建筑数字化转型设计的智能推理引擎。
          </p>

          {/* Featured Card */}
          <div
            onClick={() => setSelectedModel(models[2])} // Changed to models[2] for Structural Check Native
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

            <div className="flex items-center gap-2 p-1">
              {isAdmin && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all whitespace-nowrap"
                >
                  <Plus size={16} /> 新建模型
                </button>
              )}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="搜索模型..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
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
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDelete(e, model.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="删除模型"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border
                       ${model.status === 'Preview' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        model.status === 'Stable' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {model.status}
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-sm ${model.domain === 'Architecture' ? 'bg-blue-500' : 'bg-slate-500'
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

        {
          filteredModels.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">未找到相关模型</h3>
              <p className="text-slate-500 text-sm">请尝试调整筛选条件或搜索关键词</p>
            </div>
          )
        }

      </div >
    </div >
  );
};

export default ModelCenter;
