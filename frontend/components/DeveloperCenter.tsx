import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search,
    Copy,
    Check,
    ChevronRight,
    Server,
    BarChart3,
    Layout,
    ChevronDown,
    Zap,
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
    Plus,
    Trash2,
    Key,
    Database as DatabaseIcon,
    Bot,
    Layers,
    UploadCloud,
    Scissors,
    Download,
    Book,
    MoreVertical,
    Sparkles,
    X,
    ArrowRight,
    ChevronLeft,
    Send,
    History,
    Settings2,
    RefreshCw,
    Search as SearchIcon
} from 'lucide-react';

import Dashboard from './Dashboard';

// --- Types ---
type Tab = 'dashboard' | 'keys' | 'knowledge' | 'agents' | 'playground' | 'docs';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    created: string;
    status: 'Active' | 'Revoked';
}

interface KnowledgeBaseItem {
    id: string;
    name: string;
    description: string;
    docCount: number;
    size: string;
    updatedAt: string;
    status: 'Ready' | 'Indexing' | 'Failed';
    type: 'General' | 'Construction' | 'Legal' | 'Enterprise';
}

interface AgentWorkflow {
    id: string;
    name: string;
    description: string;
    models: string[];
    steps: number;
    status: 'Deployed' | 'Draft';
}

// --- Components ---

const CreateKBModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (kb: KnowledgeBaseItem) => void }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'General' as KnowledgeBaseItem['type'],
        chunkSize: 500,
        overlap: 50
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newKb: KnowledgeBaseItem = {
            id: `kb-${Date.now()}`,
            name: formData.name,
            description: formData.description,
            docCount: 0,
            size: '0 KB',
            updatedAt: new Date().toISOString().split('T')[0],
            status: 'Ready',
            type: formData.type
        };
        onAdd(newKb);
        onClose();
        setStep(1);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">创建新知识库</h2>
                        <p className="text-slate-400 text-sm mt-1">步骤 {step} / 3: {step === 1 ? '基础配置' : step === 2 ? '内容上传' : '索引设置'}</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">知识库名称</label>
                                <input
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="例如: 2026年建筑防火设计规范"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属分类</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'General', label: '通用/百科', icon: <Globe size={14} /> },
                                        { id: 'Construction', label: '建筑与基建', icon: <DatabaseIcon size={14} /> },
                                        { id: 'Legal', label: '法律法规', icon: <Book size={14} /> },
                                        { id: 'Enterprise', label: '企业内部文档', icon: <FileText size={14} /> }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t.id as any })}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-sm
                                                ${formData.type === t.id ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                                        >
                                            {t.icon} {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">详细描述</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="简述该知识库的内容范围和目标用途..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-all">
                                    <UploadCloud size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">点击或拖拽文件到此处</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">支持 PDF, DOCX, TXT, MD 格式。单个文件不超过 50MB。</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700">尚未上传文件</div>
                                        <div className="text-xs text-slate-400">目前知识库将为空</div>
                                    </div>
                                </div>
                                <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">浏览文件</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">切片大小 (Chunk Size)</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="100" max="2000" step="100" className="flex-1" value={formData.chunkSize} onChange={e => setFormData({ ...formData, chunkSize: parseInt(e.target.value) })} />
                                    <span className="w-20 text-center font-mono text-sm font-bold bg-slate-100 py-1 rounded-lg">{formData.chunkSize} tokens</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">重叠比例 (Overlap Percentage)</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="0" max="25" step="5" className="flex-1" value={formData.overlap} onChange={e => setFormData({ ...formData, overlap: parseInt(e.target.value) })} />
                                    <span className="w-20 text-center font-mono text-sm font-bold bg-slate-100 py-1 rounded-lg">{formData.overlap}%</span>
                                </div>
                            </div>
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                                <h4 className="text-xs font-bold text-blue-800 flex items-center gap-2"><Sparkles size={14} /> 索引预览</h4>
                                <p className="text-[11px] text-blue-600 leading-relaxed italic">
                                    我们将使用 <b>Building-Embed-Text-v2</b> 模型对您的文档进行矢量化。开启语义分块后，系统将自动识别文档的逻辑结构以提高检索准确率。
                                </p>
                            </div>
                        </div>
                    )}
                </form>

                <div className="px-10 py-8 border-t border-slate-100 flex justify-between bg-slate-50/30">
                    <button
                        type="button"
                        onClick={() => step === 1 ? onClose() : setStep(step - 1)}
                        className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:shadow-sm transition-all"
                    >
                        {step === 1 ? '取消' : '上一步'}
                    </button>
                    <button
                        type="button"
                        onClick={() => step === 3 ? null : setStep(step + 1)}
                        className="px-10 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2"
                        onClickCapture={(e) => {
                            if (step === 3) {
                                // Handled by form onSubmit but we can trigger it
                            }
                        }}
                    >
                        {step === 3 ? (
                            <button type="submit" form="kb-form" className="flex items-center gap-2" onClick={(e) => handleSubmit(e as any)}>
                                开始构建 <ArrowRight size={16} />
                            </button>
                        ) : (
                            <>继续下一步 <ArrowRight size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const KBManagementView = ({ kb, onBack }: { kb: KnowledgeBaseItem, onBack: () => void }) => {
    const [subTab, setSubTab] = useState<'docs' | 'test' | 'settings'>('docs');
    const [testQuery, setTestQuery] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    // Mock documents
    const documents = [
        { name: 'GB-50016-2024建筑设计防火规范.pdf', size: '12.4 MB', status: 'Ready', date: '2025-10-20' },
        { name: '施工现场消防安全技术规范.docx', size: '4.2 MB', status: 'Ready', date: '2025-10-22' },
        { name: '高层建筑混凝土结构技术规程.pdf', size: '28.1 MB', status: 'Ready', date: '2025-10-24' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-2xl shadow-sm transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{kb.name}</h1>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                                {kb.status}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{kb.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                        <RefreshCw size={16} /> 全部重新索引
                    </button>
                    <button className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Plus size={18} /> 添加文档
                    </button>
                </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex gap-1 p-1.5 bg-slate-100/80 backdrop-blur rounded-2xl w-fit mb-8">
                {[
                    { id: 'docs', label: '文档管理', icon: <FileText size={16} /> },
                    { id: 'test', label: '检索测试', icon: <DatabaseIcon size={16} /> },
                    { id: 'settings', label: '基础设置', icon: <Settings2 size={16} /> }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSubTab(t.id as any)}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                            ${subTab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-6">
                {subTab === 'docs' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <div className="relative w-full max-w-md">
                                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    placeholder="搜索文档库..."
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                共 {documents.length} 个文档 | {kb.size}
                            </div>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-6 py-4">文档名称</th>
                                        <th className="px-6 py-4">大小</th>
                                        <th className="px-6 py-4">状态</th>
                                        <th className="px-6 py-4">上传时间</th>
                                        <th className="px-6 py-4 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {documents.map((doc, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                                        <FileText size={20} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 tracking-tight">{doc.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-slate-500">{doc.size}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">{doc.status}</span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-slate-400">{doc.date}</td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {subTab === 'test' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Zap size={20} className="text-amber-500" /> 检索模拟器
                            </h3>
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">测试查询语句</label>
                                    <textarea
                                        rows={4}
                                        value={testQuery}
                                        onChange={e => setTestQuery(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300 resize-none"
                                        placeholder="输入一个专业问题来测试检索效果..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">检索 Top K</span>
                                        <span className="text-xs font-mono font-bold text-blue-600">3</span>
                                    </div>
                                    <input type="range" className="w-full" min="1" max="10" defaultValue="3" />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsTesting(true);
                                    setTimeout(() => setIsTesting(false), 800);
                                }}
                                disabled={!testQuery || isTesting}
                                className="w-full py-4 bg-blue-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isTesting ? <RotateCw className="animate-spin" size={18} /> : <Send size={18} />}
                                {isTesting ? '正在检索...' : '执行检索测试'}
                            </button>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                            <h3 className="text-lg font-black text-white/90 mb-6 flex items-center gap-2 z-10">
                                <History size={20} className="text-blue-400" /> 检索结果 (Context)
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-4 z-10 pr-2 custom-scrollbar">
                                {testQuery ? (
                                    <>
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Chunk #1 - Rerank Score: 0.982</span>
                                                <span className="text-[10px] text-white/30 font-mono">GB-50016-2024</span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-blue-500/50 pl-4">
                                                “第五点二条：民用建筑的耐火等级、层数、长度和面积应符合下列规定... 底部设置商业服务网点的住宅建筑... 其防火分区最大允许建筑面积不应大于2500平方米。”
                                            </p>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Chunk #2 - Rerank Score: 0.854</span>
                                                <span className="text-[10px] text-white/30 font-mono">GB-50016-2024</span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-blue-500/20 pl-4">
                                                “第六点四条：疏散楼梯间的宽度应根据疏散人数计算确定，其最小净宽度不应小于1.1m...”
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <DatabaseIcon size={48} className="text-white mb-4" />
                                        <p className="text-sm text-white/60">等待查询指令中...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {subTab === 'settings' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 max-w-3xl">
                        <h3 className="text-xl font-black text-slate-900 mb-10">知识库基础设置</h3>
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">知识库公开 ID</label>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600">{kb.id}</code>
                                        <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"><Copy size={16} /></button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">向量化模型</label>
                                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-xs font-bold text-blue-800 flex items-center gap-2">
                                        <Sparkles size={14} /> Building-Embed-Text-v2
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">关联模型权限</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Gemini 3 Pro', 'Structural Native', 'Zhi-An Large Model'].map(m => (
                                        <span key={m} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-100">{m}</span>
                                    ))}
                                    <button className="px-3 py-1.5 bg-white text-blue-600 text-[11px] font-bold rounded-lg border border-blue-200 border-dashed hover:bg-blue-50 transition-all">+ 分配</button>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                <button className="px-8 py-3.5 bg-slate-50 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-100 transition-all">取消更改</button>
                                <button className="px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">保存设置</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DeveloperCenter: React.FC<{ initialTab?: Tab }> = ({ initialTab = 'dashboard' }) => {
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);

    // -- API Keys State --
    const [keys, setKeys] = useState<ApiKey[]>([
        { id: '1', name: 'Production Key', key: 'sk-building-•••••••••••••7f8a', created: '2025-10-12', status: 'Active' },
        { id: '2', name: 'Dev Testing', key: 'sk-building-•••••••••••••3e4r', created: '2025-10-24', status: 'Active' },
    ]);
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');

    // -- Knowledge Base State (Simplified from KnowledgeBase.tsx) --
    const [kbItems, setKbItems] = useState<KnowledgeBaseItem[]>([
        { id: 'kb1', name: '建筑设计通用规范', description: '包含国家标准、行业标准及通用技术规范', docCount: 12, size: '45.2 MB', updatedAt: '2025-10-24', status: 'Ready', type: 'Construction' },
        { id: 'kb2', name: '项目A 施工文档', description: '项目专属施工方案、图纸及变更记录', docCount: 8, size: '128.5 MB', updatedAt: '2025-11-02', status: 'Ready', type: 'Enterprise' },
    ]);
    const [isKBModalOpen, setIsKBModalOpen] = useState(false);
    const [selectedKB, setSelectedKB] = useState<KnowledgeBaseItem | null>(null);

    // -- Agents State --
    const [agents, setAgents] = useState<AgentWorkflow[]>([
        { id: 'ag1', name: 'Safety Compliance Officer', description: '自动审查施工现场图像并对照安全规范。', models: ['Gemini 3 Pro'], steps: 4, status: 'Deployed' },
        { id: 'ag2', name: 'Structural Audit Agent', description: '核查结构计算书与图纸一致性。', models: ['Gemini 3 Pro', 'Structural Native'], steps: 6, status: 'Deployed' },
    ]);

    const handleCreateKey = () => {
        const newKey: ApiKey = {
            id: Math.random().toString(36).substr(2, 9),
            name: newKeyName || 'Unnamed Key',
            key: `sk-building-${Math.random().toString(36).substr(2, 20)}`,
            created: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        setKeys([newKey, ...keys]);
        setIsKeyModalOpen(false);
        setNewKeyName('');
    };

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden font-sans">

            {/* Sidebar Navigation */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col pt-6 p-4 space-y-2">
                <h2 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">运行监控</h2>

                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <BarChart3 size={18} /> 调用看板
                </button>

                <div className="h-4"></div>
                <h2 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">资源管理</h2>

                <button
                    onClick={() => setActiveTab('keys')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'keys' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <Key size={18} /> API 密钥
                </button>

                <button
                    onClick={() => { setActiveTab('knowledge'); setSelectedKB(null); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'knowledge' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <DatabaseIcon size={18} /> 知识库
                </button>

                <button
                    onClick={() => setActiveTab('agents')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'agents' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <Bot size={18} /> 智能体编排
                </button>

                <div className="h-4"></div>
                <h2 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">测试集成</h2>

                <button
                    onClick={() => setActiveTab('playground')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'playground' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <Terminal size={18} /> Playground
                </button>

                <div className="h-4"></div>
                <h2 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">帮助与支持</h2>

                <button
                    onClick={() => setActiveTab('docs')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'docs' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <Book size={18} /> 文档指南
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 pb-24">

                {/* DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 -m-8 md:-m-12">
                        <Dashboard />
                    </div>
                )}

                {/* API KEYS TAB */}
                {activeTab === 'keys' && (
                    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">API 密钥管理</h1>
                                <p className="text-slate-500 text-sm">这些密钥允许您的应用程序安全地访问 Building MaaS 服务。</p>
                            </div>
                            <button
                                onClick={() => setIsKeyModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                            >
                                <Plus size={18} /> 创建新密钥
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100 italic text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">名称</th>
                                        <th className="px-6 py-4">密钥值</th>
                                        <th className="px-6 py-4">创建日期</th>
                                        <th className="px-6 py-4">状态</th>
                                        <th className="px-6 py-4 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {keys.map(key => (
                                        <tr key={key.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-slate-800">{key.name}</span>
                                            </td>
                                            <td className="px-6 py-5 font-mono text-xs text-slate-500">
                                                {key.key}
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-500">{key.created}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                                                    {key.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Copy size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setKeys(keys.filter(k => k.id !== key.id))}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 border-dashed">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="text-amber-600 mt-1" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-800 mb-1">安全提示</h4>
                                    <p className="text-xs text-amber-900 leading-relaxed">
                                        切勿在前端代码中硬编码或公开您的 API 密钥。我们建议通过后端代理请求，或使用环境变量进行管理。
                                        如果您认为密钥已泄露，请立即撤销并生成新密钥。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* KNOWLEDGE BASE TAB */}
                {activeTab === 'knowledge' && (
                    selectedKB ? (
                        <KBManagementView kb={selectedKB} onBack={() => setSelectedKB(null)} />
                    ) : (
                        <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Layers size={12} /> Knowledge Management
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">知识库</h1>
                                    <p className="text-slate-500 text-base leading-relaxed">
                                        在 <span className="text-slate-900 font-bold">Building MaaS</span> 平台上，您可以轻松构建针对建筑行业的私有 RAG。
                                        上传行业规范、项目图纸或技术文档，我们的向量集成服务将赋予 AI 实时、精准、可靠的专业理解能力。
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-6 py-3.5 bg-white border-2 border-slate-100 text-slate-600 text-sm font-bold rounded-2xl shadow-sm hover:border-blue-200 hover:text-blue-600 transition-all">
                                        批量同步
                                    </button>
                                    <button
                                        onClick={() => setIsKBModalOpen(true)}
                                        className="px-8 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        <Plus size={20} /> 新建知识库
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {kbItems.map(item => (
                                    <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] hover:-translate-y-2 transition-all duration-500 group relative flex flex-col min-h-[380px]">
                                        {/* KB Background Watermark */}
                                        <div className="absolute -top-4 -right-2 text-[120px] font-black text-slate-50 uppercase pointer-events-none select-none group-hover:text-blue-50/50 transition-colors">
                                            KB
                                        </div>

                                        <div className="relative">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 rounded-3xl flex items-center justify-center shadow-inner group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-500">
                                                    <DatabaseIcon size={32} />
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border
                                                    ${item.status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        item.status === 'Indexing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                    {item.status === 'Indexing' && <RotateCw size={10} className="inline mr-1 animate-spin" />}
                                                    {item.status}
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                                                    {item.type === 'Construction' ? '建筑/基建' : item.type === 'Legal' ? '法律法规' : item.type === 'Enterprise' ? '企业文档' : '通用'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                            <p className="text-sm text-slate-400 mb-10 line-clamp-3 leading-relaxed flex-1">{item.description}</p>
                                        </div>

                                        <div className="mt-auto space-y-6 relative">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-50/50 p-4 rounded-2xl">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-slate-300 text-[9px] font-black tracking-widest">文件数量</span>
                                                    <span className="flex items-center gap-1.5 text-slate-800"><FileText size={14} className="text-slate-400" /> {item.docCount} Docs</span>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200 mx-2"></div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-slate-300 text-[9px] font-black tracking-widest">总容量</span>
                                                    <span className="flex items-center gap-1.5 text-slate-800"><Layers size={14} className="text-slate-400" /> {item.size}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSelectedKB(item)}
                                                    className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 duration-300"
                                                >
                                                    进入管理
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('确定要彻底删除该知识库及所有关联向量吗？')) {
                                                            setKbItems(kbItems.filter(i => i.id !== item.id));
                                                        }
                                                    }}
                                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty/Add Placeholder */}
                                <div
                                    onClick={() => setIsKBModalOpen(true)}
                                    className="border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:border-blue-300 hover:bg-blue-50/50 group transition-all cursor-pointer min-h-[380px]"
                                >
                                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 bg-white flex items-center justify-center mb-8 group-hover:border-blue-400 group-hover:text-blue-500 transition-all shadow-sm">
                                        <Plus size={44} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-400 group-hover:text-blue-600 transition-colors tracking-tight">新建知识库</h3>
                                    <p className="text-slate-300 text-sm mt-3 max-w-[200px] mx-auto text-center font-medium leading-relaxed group-hover:text-slate-400">开始构建您的行业垂直知识中枢</p>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* AGENTS TAB */}
                {activeTab === 'agents' && (
                    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-10 text-center max-w-2xl mx-auto">
                            <h1 className="text-4xl font-black text-slate-900 mb-4">智能体编排</h1>
                            <p className="text-slate-500 text-lg">构建、管理并发布面向建筑场景的智能工作流。无需代码，拖拽即可完成。 </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {agents.map(agent => (
                                <div key={agent.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all relative group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl flex items-center justify-center">
                                            <Bot size={32} />
                                        </div>
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${agent.status === 'Deployed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400'}`}>
                                            {agent.status}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{agent.name}</h2>
                                    <p className="text-slate-500 mb-8 leading-relaxed italic border-l-4 border-slate-100 pl-4">"{agent.description}"</p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400 font-bold uppercase tracking-wider">依赖模型</span>
                                            <span className="text-slate-700 font-medium">{agent.models.join(', ')}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400 font-bold uppercase tracking-wider">步骤节点</span>
                                            <span className="text-slate-700 font-medium">{agent.steps} Nodes</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                            <Scissors size={14} /> 编辑流
                                        </button>
                                        <button className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                                            <Play size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="border-3 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-blue-500 transition-all shadow-inner">
                                    <Plus size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 group-hover:text-blue-600 transition-colors">构建新 Agent</h3>
                                <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">从空白看板开始，或使用行业最佳实践模版快速启动。</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* PLAYGROUND TAB */}
                {activeTab === 'playground' && (
                    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">交互沙箱 (Playground)</h1>
                                <p className="text-slate-500 text-sm">选择一个模型或 Agent，实时测试其在建筑场景下的性能表现。</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
                            <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">选择服务单元</label>
                                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                                        <optgroup label="Models">
                                            <option>MedInsight V4 (Clinical)</option>
                                            <option>FinQuant Ultra (Finance)</option>
                                        </optgroup>
                                        <optgroup label="Agents">
                                            <option>Safety Compliance Officer</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">运行时参数</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>Temperature</span>
                                            <span>0.7</span>
                                        </div>
                                        <input type="range" className="w-full" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>Top P</span>
                                            <span>0.95</span>
                                        </div>
                                        <input type="range" className="w-full" />
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2">
                                    <RotateCw size={14} /> 重置参数
                                </button>
                            </div>

                            <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative">
                                <div className="p-4 border-b border-white/5 flex items-center justify-between text-white/50 bg-white/5">
                                    <div className="text-xs font-mono">DEBUG_OUTPUT.LOG</div>
                                    <Zap size={14} />
                                </div>
                                <div className="flex-1 p-8 font-mono text-sm text-blue-200/80 leading-relaxed overflow-y-auto">
                                    <div className="text-emerald-400 mb-2">&gt; System initialized. All building nodes active.</div>
                                    <div className="text-slate-500 mb-4">// Waiting for prompt input...</div>
                                </div>
                                <div className="p-6 bg-white/5 border-t border-white/5">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="输入测试指令..."
                                            className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-all"
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DOCS TAB */}
                {activeTab === 'docs' && (
                    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 mb-2">文档指南</h1>
                                <p className="text-slate-500 text-lg">学习如何高效接入 uSpecHub 服务并构建您的建筑 AI 应用。</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Side Index */}
                            <div className="lg:col-span-1 space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">入门教程</h3>
                                    <div className="space-y-1">
                                        {['快速开始', '鉴权机制', '错误代码'].map(item => (
                                            <button key={item} className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${item === '快速开始' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}>
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">核心接口</h3>
                                    <div className="space-y-1">
                                        {['模型推理', '知识库检索', 'Agent 编排 API'].map(item => (
                                            <button key={item} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Doc Content */}
                            <div className="lg:col-span-3 prose prose-slate max-w-none bg-white p-10 rounded-3xl border border-slate-200">
                                <section className="mb-12">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">快速开始 (Quick Start)</h2>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        本文档旨在帮助开发者快速了解如何通过 API 访问我们部署好的建筑大模型。所有的请求都需要在 Header 中携带有效的 API Key。
                                    </p>

                                    <div className="bg-slate-950 rounded-2xl p-6 mb-8 relative group">
                                        <div className="absolute top-4 right-4 text-[10px] text-slate-500 font-mono">BASE URL</div>
                                        <code className="text-blue-400 font-mono text-sm leading-relaxed">
                                            https://api.uspechub.com/v1
                                        </code>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-4">第一步：获取 API Key</h3>
                                    <p className="text-slate-600 mb-8">
                                        前往资源管理中的 <button onClick={() => setActiveTab('keys')} className="text-blue-600 hover:underline font-bold">API 密钥</button> 页面创建一个专用于您的应用的密钥。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-900 mb-4">第二步：调用第一个接口</h3>
                                    <p className="text-slate-600 mb-4">使用您最喜欢的语言尝试调用 Chat Completions 接口：</p>

                                    <div className="bg-slate-950 rounded-2xl overflow-hidden mb-8">
                                        <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/5">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">cURL</span>
                                            <button className="text-slate-400 hover:text-white p-1 transition-colors"><Copy size={14} /></button>
                                        </div>
                                        <div className="p-6">
                                            <pre className="text-blue-100 font-mono text-xs leading-relaxed overflow-x-auto">
                                                {`curl https://api.uspechub.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "med-insight-v4",
    "messages": [{"role": "user", "content": "帮我校对一下这个结构计算数据"}]
  }'`}
                                            </pre>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE KB MODAL */}
            <CreateKBModal
                isOpen={isKBModalOpen}
                onClose={() => setIsKBModalOpen(false)}
                onAdd={(newKb) => setKbItems([newKb, ...kbItems])}
            />

            {/* API KEY MODAL */}
            {isKeyModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsKeyModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">创建新 API 密钥</h3>
                            <button onClick={() => setIsKeyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">密钥描述名称</label>
                                <input
                                    type="text"
                                    value={newKeyName}
                                    onChange={e => setNewKeyName(e.target.value)}
                                    placeholder="例如：Test Environment App"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 leading-relaxed border border-blue-100">
                                密钥生成后将仅显示一次完整内容。请务必妥善保管。
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setIsKeyModalOpen(false)}
                                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleCreateKey}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    确认生成
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeveloperCenter;
