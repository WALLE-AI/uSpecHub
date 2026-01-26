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
    X,
    ArrowRight
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
        { id: 'kb1', name: '建筑设计通用规范', description: '包含国家标准、行业标准及通用技术规范', docCount: 12, size: '45.2 MB', updatedAt: '2025-10-24' },
        { id: 'kb2', name: '项目A 施工文档', description: '项目专属施工方案、图纸及变更记录', docCount: 8, size: '128.5 MB', updatedAt: '2025-11-02' },
    ]);

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
                    onClick={() => setActiveTab('knowledge')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'knowledge' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <DatabaseIcon size={18} /> 知识库 (RAG)
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
                    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">知识库 (RAG)</h1>
                                <p className="text-slate-500 text-sm">上传建筑规范、工程方案或企业文档，赋予大模型专业知识背景。</p>
                            </div>
                            <button className="px-4 py-2 bg-slate-900 text-sm font-bold text-white rounded-xl shadow-lg flex items-center gap-2">
                                <UploadCloud size={18} /> 上传新文档
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kbItems.map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 text-slate-50 transition-colors group-hover:text-blue-50 uppercase font-black text-4xl">
                                        KB
                                    </div>

                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <DatabaseIcon size={24} />
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{item.description}</p>

                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><FileText size={12} /> {item.docCount} Docs</span>
                                        <span className="flex items-center gap-1"><Layers size={12} /> {item.size}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-300 hover:bg-blue-50 group transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center mb-4 group-hover:border-blue-400 group-hover:text-blue-500 transition-all">
                                    <Plus size={24} />
                                </div>
                                <span className="text-sm font-bold">新建知识库</span>
                            </div>
                        </div>
                    </div>
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
