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
    Search as SearchIcon,
    Cpu,
    Lock,
    Minus,
    Maximize,
    Play as PlayIcon,
    Box,
    Info
} from 'lucide-react';

import Dashboard from './Dashboard';
import AgentFlowEditor from './AgentFlowEditor';

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
    parser: string;
    model: string;
    chunkSize: number;
    overlap: number;
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [parsingProgress, setParsingProgress] = useState(0);
    const [parsingLogs, setParsingLogs] = useState<string[]>([]);
    const [parseEngine, setParseEngine] = useState('uSpec-Parser-Pro');
    const [vectorModel, setVectorModel] = useState('Building-Embed-Text-v3');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'General' as KnowledgeBaseItem['type'],
        chunkSize: 500,
        overlap: 50
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newFiles = [...selectedFiles, ...filesArray];
            setSelectedFiles(newFiles);

            // Simulate upload progress for new files
            filesArray.forEach(file => {
                const fileId = `${file.name}-${file.size}-${Date.now()}`;
                setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 30;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                    }
                    setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
                }, 300);
            });
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (step === 4) {
            setParsingProgress(0);
            setParsingLogs([]);
            const logs = [
                `正在使用 ${parseEngine} 初始化智能解析引擎...`,
                "正在读取文档结构与元数据...",
                "正在平衡多模态文本提取...",
                "正在识别表格与复杂列表...",
                `正在调用 ${vectorModel} 进行语义切片与向量对齐...`,
                "正在优化上下文关联性...",
                "智能解析已完成。",
                "正在构建 RAG 向量索引...",
                "知识库已就绪。"
            ];

            let logIdx = 0;
            const logInterval = setInterval(() => {
                if (logIdx < logs.length) {
                    setParsingLogs(prev => [...prev, logs[logIdx]]);
                    logIdx++;
                } else {
                    clearInterval(logInterval);
                }
            }, 1200);

            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                }
                setParsingProgress(progress);
            }, 800);

            return () => {
                clearInterval(logInterval);
                clearInterval(progressInterval);
            };
        }
    }, [step]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newKb: KnowledgeBaseItem = {
            id: `kb-${Date.now()}`,
            name: formData.name,
            description: formData.description,
            docCount: selectedFiles.length,
            size: `${(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB`,
            updatedAt: new Date().toISOString().split('T')[0],
            status: 'Ready',
            type: formData.type,
            parser: parseEngine,
            model: vectorModel,
            chunkSize: formData.chunkSize,
            overlap: formData.overlap
        };
        onAdd(newKb);
        onClose();
        setStep(1);
        setSelectedFiles([]);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">创建新知识库</h2>
                        <p className="text-slate-400 text-sm mt-1">步骤 {step} / 4: {
                            step === 1 ? '基础配置' :
                                step === 2 ? '内容上传' :
                                    step === 3 ? '解析与索引配置' : '构建预览'
                        }</p>
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
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept=".pdf,.docx,.txt,.md"
                                onChange={handleFileChange}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-all">
                                    <UploadCloud size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">点击或拖拽文件到此处</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">支持 PDF, DOCX, TXT, MD 格式。单个文件不超过 50MB。</p>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedFiles.length > 0 ? (
                                    selectedFiles.map((file, idx) => {
                                        const fileId = Object.keys(uploadProgress).find(id => id.startsWith(`${file.name}-${file.size}`)) || '';
                                        const progress = uploadProgress[fileId] || 100;

                                        return (
                                            <div key={idx} className="bg-slate-50 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${progress === 100 ? 'bg-blue-50 text-blue-500' : 'bg-white text-slate-400'}`}>
                                                            {progress === 100 ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.name}</div>
                                                            <div className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {progress < 100 && (
                                                            <span className="text-[10px] font-black text-blue-600 animate-pulse">正在上传 {Math.round(progress)}%</span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(idx)}
                                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {progress < 100 && (
                                                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
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
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                        >
                                            浏览文件
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            {/* Engine Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">智能解析引擎 (PARSING ENGINE)</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'uSpec-Parser-Pro', name: 'uSpec-Parser-Pro', desc: '全功能多模态解析，支持图表提取（推荐）', icon: <Sparkles size={16} /> },
                                        { id: 'Building-Native', name: 'Building-Native-v2', desc: '针对建筑规范条文优化，具备极高结构还原度', icon: <Layers size={16} /> },
                                        { id: 'Simple-Fast', name: 'Simple-Fast', desc: '纯文本提取，适用于简单 MD/TXT 格式', icon: <FileText size={16} /> }
                                    ].map(engine => (
                                        <button
                                            key={engine.id}
                                            type="button"
                                            onClick={() => setParseEngine(engine.id)}
                                            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left
                                                ${parseEngine === engine.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${parseEngine === engine.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                {engine.icon}
                                            </div>
                                            <div>
                                                <div className={`text-sm font-black ${parseEngine === engine.id ? 'text-blue-900' : 'text-slate-700'}`}>{engine.name}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{engine.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Vector Model Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">向量嵌入模型 (VECTOR EMBEDDING)</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'Building-Embed-Text-v3', name: 'Building-Embed-v3', desc: '针对建筑领域优化的 1536 维语义向量（推荐）', icon: <Bot size={16} /> },
                                        { id: 'OpenAI-Ada-002', name: 'text-embedding-3-small', desc: 'OpenAI 通用高效向量模型', icon: <Zap size={16} /> },
                                        { id: 'bge-large-zh-v1.5', name: 'BGE-Large-ZH', desc: '开源中文性能领跑者，适用于大规模知识库', icon: <Globe size={16} /> }
                                    ].map(model => (
                                        <button
                                            key={model.id}
                                            type="button"
                                            onClick={() => setVectorModel(model.id)}
                                            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left
                                                ${vectorModel === model.id ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${vectorModel === model.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                {model.icon}
                                            </div>
                                            <div>
                                                <div className={`text-sm font-black ${vectorModel === model.id ? 'text-indigo-900' : 'text-slate-700'}`}>{model.name}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{model.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 bg-slate-50 rounded-[2.5rem] p-2">
                                <div className="p-6 space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">分块设置 (CHUNKING)</label>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-bold text-slate-600">切片大小</span>
                                                <span className="text-[11px] font-black text-blue-600">{formData.chunkSize} tokens</span>
                                            </div>
                                            <input type="range" min="100" max="2000" step="100" className="w-full accent-blue-600" value={formData.chunkSize} onChange={e => setFormData({ ...formData, chunkSize: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-bold text-slate-600">重叠比例</span>
                                                <span className="text-[11px] font-black text-blue-600">{formData.overlap}%</span>
                                            </div>
                                            <input type="range" min="0" max="25" step="5" className="w-full accent-blue-600" value={formData.overlap} onChange={e => setFormData({ ...formData, overlap: parseInt(e.target.value) })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-10 animate-in slide-in-from-right-4 duration-300 flex flex-col items-center">
                            <div className="relative w-56 h-56 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90 scale-110">
                                    <circle
                                        cx="112"
                                        cy="112"
                                        r="94"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="112"
                                        cy="112"
                                        r="94"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        strokeDasharray={590.62}
                                        strokeDashoffset={590.62 * (1 - parsingProgress / 100)}
                                        strokeLinecap="round"
                                        className="text-blue-600 transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{Math.round(parsingProgress)}%</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Building Index</span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-blue-900/10 font-mono text-[11px] h-56 overflow-y-auto custom-scrollbar border border-slate-800">
                                <div className="space-y-2">
                                    {parsingLogs.map((log, i) => (
                                        <div key={i} className="flex gap-3 text-emerald-400/90 items-start">
                                            <span className="text-slate-600 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                            <span className="animate-in fade-in slide-in-from-left-2 duration-300 flex-1 leading-relaxed">{log}</span>
                                        </div>
                                    ))}
                                    {parsingProgress < 100 && (
                                        <div className="flex gap-2 items-center text-blue-400 mt-2">
                                            <Loader2 size={12} className="animate-spin" />
                                            <span className="font-bold tracking-widest uppercase text-[9px]">Awaiting Core Completion...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                <div className="px-10 py-8 border-t border-slate-100 flex justify-between bg-white">
                    <button
                        type="button"
                        onClick={() => step === 1 ? onClose() : setStep(step - 1)}
                        className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                    >
                        {step === 1 ? '取消' : '上一步'}
                    </button>
                    <button
                        type="button"
                        disabled={step === 4 && parsingProgress < 100}
                        onClick={() => step === 4 ? null : setStep(step + 1)}
                        className={`px-10 py-3 rounded-2xl text-white text-sm font-bold shadow-xl transition-all flex items-center gap-2 
                            ${step === 4 && parsingProgress < 100 ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-slate-900 shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95'}`}
                    >
                        {step === 4 ? (
                            <div className="flex items-center gap-2" onClick={(e) => handleSubmit(e as any)}>
                                完成并关闭 <ArrowRight size={16} />
                            </div>
                        ) : (
                            <span className="flex items-center gap-2">
                                {step === 3 ? '开始构建' : '继续下一步'} <ArrowRight size={16} />
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddDocumentModal = ({ isOpen, onClose, onAdd, parser = 'uSpec-Parser-Pro', model = 'Building-Embed-Text-v3' }: {
    isOpen: boolean,
    onClose: () => void,
    onAdd: (doc: any) => void,
    parser?: string,
    model?: string
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingState, setProcessingState] = useState<'uploading' | 'parsing' | 'vectorizing' | 'completed' | 'idle'>('idle');
    const [logs, setLogs] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            startProcess(file);
        }
    };

    const startProcess = (file: File) => {
        setProcessingState('uploading');
        setUploadProgress(0);
        setLogs([`开始上传文件: ${file.name}`]);

        // Upload Phase
        let progress = 0;
        const uploadInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(uploadInterval);
                setProcessingState('parsing');
                startParsing(file);
            }
            setUploadProgress(progress);
        }, 300);
    };

    const startParsing = (file: File) => {
        setLogs(prev => [...prev, `文件上传成功。正在调用 [${parser}] 智能解析引擎...`]);
        let progress = 0;
        const parseInterval = setInterval(() => {
            progress += 10;
            if (progress === 30) setLogs(prev => [...prev, "正在提取多模态内容与表格数据..."]);
            if (progress === 60) setLogs(prev => [...prev, "正在分析文档语义层级结构..."]);
            if (progress >= 100) {
                clearInterval(parseInterval);
                setProcessingState('vectorizing');
                startVectorizing();
            }
            setUploadProgress(progress);
        }, 400);
    };

    const startVectorizing = () => {
        setLogs(prev => [...prev, `解析完成。正在调用 [${model}] 模型进行向量化...`]);
        let progress = 0;
        const vectorInterval = setInterval(() => {
            progress += 5;
            if (progress === 40) setLogs(prev => [...prev, "正在执行动态语义切片 (Auto-Chunking)..."]);
            if (progress === 80) setLogs(prev => [...prev, "正在将向量数据写入高性能索引库..."]);
            if (progress >= 100) {
                clearInterval(vectorInterval);
                setProcessingState('completed');
                setLogs(prev => [...prev, "知识索引构建成功，文档已就绪。"]);
            }
            setUploadProgress(progress);
        }, 200);
    };

    const handleComplete = () => {
        if (selectedFile) {
            onAdd({
                name: selectedFile.name,
                size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
                status: 'Ready',
                date: new Date().toISOString().split('T')[0]
            });
        }
        onClose();
        reset();
    };

    const reset = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setProcessingState('idle');
        setLogs([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">添加文档</h2>
                        <p className="text-slate-400 text-sm mt-1">本地上传与索引构建</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    {processingState === 'idle' ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.docx,.txt,.md"
                            />
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-all">
                                <UploadCloud size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">选择本地文件</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">支持 PDF, DOCX, TXT, MD 格式</p>
                        </div>
                    ) : (
                        <div className="space-y-10 flex flex-col items-center">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
                                    <circle
                                        cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="8"
                                        strokeDasharray={502.6}
                                        strokeDashoffset={502.6 * (1 - uploadProgress / 100)}
                                        strokeLinecap="round"
                                        className={`${processingState === 'uploading' ? 'text-blue-500' : processingState === 'parsing' ? 'text-amber-500' : 'text-emerald-500'} transition-all duration-300`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-slate-900">{Math.round(uploadProgress)}%</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        {processingState === 'uploading' ? 'Uploading' : processingState === 'parsing' ? 'Parsing' : processingState === 'vectorizing' ? 'Vectorizing' : 'Completed'}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-900 rounded-3xl p-6 font-mono text-[10px] h-40 overflow-y-auto custom-scrollbar border border-slate-800">
                                <div className="space-y-2">
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-2 text-emerald-400/90 items-start">
                                            <span className="text-slate-600 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                            <span className="animate-in fade-in slide-in-from-left-2">{log}</span>
                                        </div>
                                    ))}
                                    {processingState !== 'completed' && (
                                        <div className="flex gap-2 items-center text-blue-400 mt-2">
                                            <Loader2 size={10} className="animate-spin" />
                                            <span className="font-bold tracking-widest uppercase text-[8px]">Processing... Item Awaiting [${processingState === 'uploading' ? 'Network' : processingState === 'parsing' ? parser : model}]...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-10 py-8 border-t border-slate-100 flex justify-end bg-white">
                    <button
                        onClick={handleComplete}
                        disabled={processingState !== 'completed' && processingState !== 'idle'}
                        className={`px-10 py-3 rounded-2xl text-white text-sm font-bold shadow-xl transition-all
                            ${processingState === 'completed' ? 'bg-slate-900 shadow-slate-900/10 hover:scale-105 active:scale-95' : 'bg-slate-200 cursor-not-allowed text-slate-400 shadow-none'}`}
                    >
                        {processingState === 'completed' ? '完成' : '等待处理...'}
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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Settings local state
    const [parser, setParser] = useState(kb.parser);
    const [model, setModel] = useState(kb.model);
    const [chunkSize, setChunkSize] = useState(kb.chunkSize);
    const [overlap, setOverlap] = useState(kb.overlap);

    // Dynamic documents state
    const [documents, setDocuments] = useState([
        { name: 'GB-50016-2024建筑设计防火规范.pdf', size: '12.4 MB', status: 'Ready', date: '2025-10-20' },
        { name: '施工现场消防安全技术规范.docx', size: '4.2 MB', status: 'Ready', date: '2025-10-22' },
        { name: '高层建筑混凝土结构技术规程.pdf', size: '28.1 MB', status: 'Ready', date: '2025-10-24' },
    ]);

    const handleAddDocument = (newDoc: any) => {
        setDocuments(prev => [newDoc, ...prev]);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Add Document Modal */}
            <AddDocumentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddDocument}
                parser="uSpec-Parser-Pro"
                model="Building-Embed-Text-v3"
            />

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
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
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
                                                <button
                                                    onClick={() => setDocuments(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
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
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 max-w-4xl animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">知识库基础设置</h3>
                                <p className="text-slate-400 text-sm mt-1">配置知识索引、解析引擎与切片策略</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">唯一标识:</span>
                                <code className="text-xs font-mono font-bold text-blue-600 px-2">{kb.id}</code>
                                <button className="p-1.5 text-slate-300 hover:text-blue-600 transition-all"><Copy size={14} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column: Model & Engine */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                                            <Cpu size={14} />
                                        </div>
                                        智能文本解析引擎
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'uSpec-Parser-Pro', name: 'uSpec-Parser-Pro', desc: '支持多模态内容与复杂表格提取' },
                                            { id: 'Standard-OCR-v2', name: 'Standard-OCR-v2', desc: '优化扫描件文稿识别能力' }
                                        ].map(engine => (
                                            <button
                                                key={engine.id}
                                                onClick={() => setParser(engine.id)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                                                    ${parser === engine.id ? 'border-amber-500 bg-amber-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${parser === engine.id ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Zap size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{engine.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{engine.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                            <Sparkles size={14} />
                                        </div>
                                        向量化/嵌入模型
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'Building-Embed-Text-v3', name: 'Building-Embed-Text-v3', desc: '针对建筑行业语义深度优化的 Top 1' },
                                            { id: 'General-Embed-Multi', name: 'General-Embed-Multi', desc: '华为/阿里通用大模型多语言版本' }
                                        ].map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setModel(m.id)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                                                    ${model === m.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${model === m.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Layers size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{m.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{m.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Chunking Strategy */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                                            <Scissors size={14} />
                                        </div>
                                        语义切片策略 (Auto-Chunking)
                                    </label>
                                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-10">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-600">切片大小 (Chunk Size)</span>
                                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-indigo-600 shadow-sm">{chunkSize} Tokens</span>
                                            </div>
                                            <div className="relative pt-6">
                                                <input
                                                    type="range"
                                                    min="100"
                                                    max="2000"
                                                    step="100"
                                                    value={chunkSize}
                                                    onChange={e => setChunkSize(parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                />
                                                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300 tracking-widest px-1">
                                                    <span>MIN</span>
                                                    <span>MAX (2K)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-600">重叠比例 (Overlap)</span>
                                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-indigo-600 shadow-sm">{overlap}%</span>
                                            </div>
                                            <div className="relative pt-6">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="30"
                                                    step="5"
                                                    value={overlap}
                                                    onChange={e => setOverlap(parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                />
                                                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300 tracking-widest px-1">
                                                    <span>0%</span>
                                                    <span>30%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white/50 border border-white rounded-2xl">
                                            <div className="flex gap-3 items-start">
                                                <AlertCircle size={16} className="text-slate-400 mt-0.5" />
                                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                                    适当的重叠比例有助于保留跨块语义上下文。对于规范类文档，建议设置 <span className="text-indigo-600 font-bold">10%-20%</span> 的重叠度。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setParser(kb.parser);
                                    setModel(kb.model);
                                    setChunkSize(kb.chunkSize);
                                    setOverlap(kb.overlap);
                                }}
                                className="px-8 py-3.5 bg-white text-slate-500 text-sm font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                            >
                                重置更改
                            </button>
                            <button className="px-10 py-3.5 bg-slate-900 text-white text-sm font-black rounded-2xl shadow-2xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
                                保存配置更新
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Create Agent Modal ---
const CreateAgentModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (agent: AgentWorkflow) => void }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedModels, setSelectedModels] = useState<string[]>(['Gemini 3 Pro']);
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        // Simulate a short creation delay
        setTimeout(() => {
            const newAgent: AgentWorkflow = {
                id: `ag-${Date.now()}`,
                name: name || 'Unnamed Workflow',
                description: description || 'No description provided.',
                models: selectedModels,
                steps: Math.floor(Math.random() * 5) + 3,
                status: 'Draft'
            };
            onAdd(newAgent);
            setIsCreating(false);
            onClose();
            setName('');
            setDescription('');
        }, 1000);
    };

    if (!isOpen) return null;

    const toggleModel = (model: string) => {
        if (selectedModels.includes(model)) {
            setSelectedModels(selectedModels.filter(m => m !== model));
        } else {
            setSelectedModels([...selectedModels, model]);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">新建工作流</h2>
                        <p className="text-slate-400 text-sm mt-1">配置您的智能化 Agent 业务流程</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 text-left">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">工作流名称</label>
                            <input
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="例如: 智能合同审查助手"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">业务描述 (Prompt Context)</label>
                            <textarea
                                className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                                placeholder="描述智能体的工作职责与目标场景..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">选择基础模型</label>
                            <div className="flex flex-wrap gap-2">
                                {['Gemini 3 Pro', 'Structural Native', 'Qwen-Max', 'GPT-4o'].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => toggleModel(m)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2
                                            ${selectedModels.includes(m) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-50 text-slate-500 text-sm font-bold rounded-2xl hover:bg-slate-100 transition-all text-center"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="flex-[2] py-4 bg-slate-900 text-white text-sm font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isCreating ? (
                                <>
                                    <RotateCw size={18} className="animate-spin" />
                                    正在初始化...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    立即创建
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// AgentSkillExecutive component removed

// No content here, just removing the duplicate block

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
        { id: 'kb1', name: '建筑设计通用规范', description: '包含国家标准、行业标准及通用技术规范', docCount: 12, size: '45.2 MB', updatedAt: '2025-10-24', status: 'Ready', type: 'Construction', parser: 'uSpec-Parser-Pro', model: 'Building-Embed-Text-v3', chunkSize: 500, overlap: 50 },
        { id: 'kb2', name: '项目A 施工文档', description: '项目专属施工方案、图纸及变更记录', docCount: 8, size: '128.5 MB', updatedAt: '2025-11-02', status: 'Ready', type: 'Enterprise', parser: 'uSpec-Parser-Pro', model: 'Building-Embed-Text-v3', chunkSize: 500, overlap: 50 },
    ]);
    const [isKBModalOpen, setIsKBModalOpen] = useState(false);
    const [selectedKB, setSelectedKB] = useState<KnowledgeBaseItem | null>(null);

    // -- Agents State --
    const [agents, setAgents] = useState<AgentWorkflow[]>([
        { id: 'ag1', name: 'Safety Compliance Officer', description: '自动审查施工现场图像并对照安全规范。', models: ['Gemini 3 Pro'], steps: 4, status: 'Deployed' },
        { id: 'ag2', name: 'Structural Audit Agent', description: '核查结构计算书与图纸一致性。', models: ['Gemini 3 Pro', 'Structural Native'], steps: 6, status: 'Deployed' },
    ]);
    const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<AgentWorkflow | null>(null);
    const [isEditingFlow, setIsEditingFlow] = useState(false);

    // -- Playground / Experience Center Parameters --
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(0.9);
    const [penalty, setPenalty] = useState(0.0);
    const [maxTokens, setMaxTokens] = useState(1024);

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
            <div className={`${isEditingFlow ? 'hidden' : 'w-64'} bg-white border-r border-slate-200 flex flex-col pt-6 p-4 space-y-2`}>
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
                    <Terminal size={18} /> 体验中心
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
            <div className={`flex-1 h-full ${isEditingFlow ? 'overflow-hidden p-0' : 'overflow-y-auto p-8 md:p-12 pb-24'}`}>

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
                                <p className="text-slate-500 text-sm">这些密钥允许您的应用程序安全地访问 uSpecHub 服务。</p>
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
                                        在 <span className="text-slate-900 font-bold">uSpecHub</span> 平台上，您可以轻松构建针对建筑行业的私有 RAG。
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

                {/* AGENTS / SKILLS TAB */}
                {activeTab === 'agents' && (
                    selectedAgent && isEditingFlow ? (
                        <AgentFlowEditor onBack={() => { setSelectedAgent(null); setIsEditingFlow(false); }} onDeploy={() => setIsEditingFlow(false)} />
                    ) : (
                        <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="max-w-xl text-left">
                                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">智能工作流编排</h1>
                                    <p className="text-slate-500 text-lg">构建、部署并管理您的 AI Agent 业务逻辑。支持可视化节点编辑、多模型路由与 RAG 集成。</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsAgentModalOpen(true)}
                                        className="px-8 py-4 bg-slate-900 text-white text-sm font-black rounded-2xl shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        <Plus size={20} /> 创建新工作流
                                    </button>
                                </div>
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
                                            <button
                                                onClick={() => { setSelectedAgent(agent); setIsEditingFlow(true); }}
                                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group/btn"
                                            >
                                                <Layers size={16} className="group-hover/btn:scale-110 transition-transform" /> 进入流程设计
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    onClick={() => setIsAgentModalOpen(true)}
                                    className="border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:border-blue-300 hover:bg-blue-50/50 group transition-all cursor-pointer min-h-[350px]"
                                >
                                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 bg-white flex items-center justify-center mb-8 group-hover:border-blue-400 group-hover:text-blue-500 transition-all shadow-sm">
                                        <Download size={44} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-400 group-hover:text-blue-600 transition-colors tracking-tight">导入新 Agent</h3>
                                    <p className="text-slate-300 text-sm mt-3 max-w-[200px] mx-auto text-center font-medium leading-relaxed group-hover:text-slate-400">直接导入标准 AGENT.json 或定义文件开启自动化流程</p>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* 体验中心 (EXPERIENCE CENTER) TAB */}
                {activeTab === 'playground' && (
                    <div className="h-full flex flex-col animate-in fade-in duration-500 -m-8 md:-m-12">
                        {/* Top Control Bar */}
                        <div className="px-10 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">当前测试模型:</span>
                                    <div className="relative">
                                        <select className="appearance-none bg-slate-50 border border-slate-100 rounded-full px-5 py-2 pr-10 text-sm font-black text-slate-700 outline-none hover:border-blue-200 transition-all cursor-pointer shadow-sm">
                                            <option>QWEN-7B-CHAT-AWQ</option>
                                            <option>GEMINI-1.5-PRO</option>
                                            <option>BUILDING-MODEL-V2</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-[11px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest transition-all px-4 py-2 hover:bg-rose-50 rounded-xl">
                                <Trash2 size={16} /> 清空会话
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden bg-[#F8F9FD]">
                            {/* Left Sidebar - Config */}
                            <div className="w-[340px] border-r border-slate-100 p-8 space-y-8 overflow-y-auto hidden lg:block">
                                {/* System Prompt Card */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <Bot size={14} />
                                        </div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">系统提示词 / SYSTEM</h3>
                                    </div>
                                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                        <textarea
                                            className="w-full h-40 bg-transparent text-sm text-slate-500 leading-relaxed outline-none resize-none placeholder:text-slate-300"
                                            placeholder="输入系统引导语..."
                                            defaultValue="You are a helpful and professional AI assistant. Provide concise and accurate answers."
                                        />
                                    </div>
                                </div>

                                {/* Inference Config Card */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <BarChart3 size={14} />
                                        </div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">参数配置</h3>
                                    </div>
                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-8">
                                        {/* Temperature */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">温度 (TEMPERATURE)</label>
                                                <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{temperature.toFixed(1)}</span>
                                            </div>
                                            <div className="relative h-2 bg-slate-100 rounded-full group/slider">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-200"
                                                    style={{ width: `${temperature * 100}%` }}
                                                ></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={temperature}
                                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div
                                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-lg pointer-events-none transition-all duration-200"
                                                    style={{ left: `${temperature * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Top P */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOP-P</label>
                                                <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{topP.toFixed(1)}</span>
                                            </div>
                                            <div className="relative h-2 bg-slate-100 rounded-full group/slider">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-200"
                                                    style={{ width: `${topP * 100}%` }}
                                                ></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.05"
                                                    value={topP}
                                                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div
                                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-lg pointer-events-none transition-all duration-200"
                                                    style={{ left: `${topP * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Penalty */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">重复惩罚 (PENALTY)</label>
                                                <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{penalty.toFixed(1)}</span>
                                            </div>
                                            <div className="relative h-2 bg-slate-100 rounded-full group/slider">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-200"
                                                    style={{ width: `${(penalty / 2) * 100}%` }}
                                                ></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2"
                                                    step="0.1"
                                                    value={penalty}
                                                    onChange={(e) => setPenalty(parseFloat(e.target.value))}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div
                                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-lg pointer-events-none transition-all duration-200"
                                                    style={{ left: `${(penalty / 2) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Max Tokens */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最大生成词数 (MAX TOKENS)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-black text-slate-700 outline-none focus:border-blue-500 transition-all font-mono"
                                                value={maxTokens}
                                                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Chat Area */}
                            <div className="flex-1 flex flex-col p-10 relative">
                                <div className="flex-1 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden relative group/chat">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none"></div>

                                    {/* Chat Header */}
                                    <div className="p-8 pb-0 flex items-center justify-between z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-200">
                                                Q
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-black text-slate-800 tracking-tight">QWEN-7B-CHAT-AWQ</h2>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Empty State */}
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 z-10">
                                    </div>

                                    {/* Bottom Input Area */}
                                    <div className="p-10 z-10">
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                placeholder="向模型发送消息..."
                                                className="w-full bg-white border border-slate-100 rounded-[2.5rem] py-6 pl-10 pr-32 shadow-2xl shadow-slate-200/50 outline-none focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-medium"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest hidden md:block">ENTER</span>
                                                <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
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
                                        前往资源管理中的 <button onClick={() => setActiveTab('keys')} className="text-blue-600 hover:underline font-bold">API 密钥</button> 页面创建一个专用于您的应用的密钥，亦可在 <button onClick={() => setActiveTab('playground')} className="text-blue-600 hover:underline font-bold">体验中心</button> 进行即时测试。
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

            {/* Create Agent Modal */}
            <CreateAgentModal
                isOpen={isAgentModalOpen}
                onClose={() => setIsAgentModalOpen(false)}
                onAdd={(newAgent) => {
                    setAgents([newAgent, ...agents]);
                    setSelectedAgent(newAgent);
                    setIsEditingFlow(true);
                }}
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
