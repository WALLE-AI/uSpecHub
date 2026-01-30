import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Plus,
    Search,
    Play,
    Save,
    ChevronLeft,
    Maximize,
    Minus,
    Settings2,
    Database,
    Cpu,
    Zap,
    Layers,
    Sparkles,
    Trash2,
    MousePointer2,
    Move,
    Box,
    X,
    MessageSquare,
    Link2,
    ArrowRight,
    RefreshCw,
    FileText,
    Download,
    RotateCw,
    Loader2,
    ZoomIn,
    User,
    AlertCircle as AlertIcon,
    Bot,
    ChevronDown
} from 'lucide-react';

// --- Types ---

interface Position {
    x: number;
    y: number;
}

interface Node {
    id: string;
    type: 'llm' | 'knowledge' | 'tool' | 'logic' | 'input' | 'output';
    label: string;
    position: Position;
    data: any;
}

interface Connection {
    id: string;
    source: string;
    target: string;
}

interface LogEntry {
    id: string;
    level: 'info' | 'warn' | 'error' | 'thought' | 'tool';
    message: string;
    detail?: string;
    status?: 'success' | 'executing' | 'error';
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    logs?: LogEntry[];
    error?: string;
}

// --- Mock Data ---

const INITIAL_NODES: Node[] = [
    {
        id: 'node-1',
        type: 'input',
        label: '用户请求',
        position: { x: 100, y: 250 },
        data: {}
    },
    {
        id: 'node-2',
        type: 'knowledge',
        label: '建筑规范知识库',
        position: { x: 400, y: 150 },
        data: { kbId: 'kb1' }
    },
    {
        id: 'node-3',
        type: 'llm',
        label: '合规审查引擎',
        position: { x: 700, y: 250 },
        data: { model: 'Gemini 3 Pro' }
    },
    {
        id: 'node-4',
        type: 'output',
        label: '审查报告',
        position: { x: 1000, y: 250 },
        data: {}
    }
];

const INITIAL_CONNECTIONS: Connection[] = [
    { id: 'e1-2', source: 'node-1', target: 'node-2' },
    { id: 'e2-3', source: 'node-2', target: 'node-3' },
    { id: 'e3-4', source: 'node-3', target: 'node-4' }
];

const NODE_TYPES = [
    { type: 'llm', icon: Sparkles, color: 'blue', label: '大语言模型', desc: '核心推理引擎' },
    { type: 'knowledge', icon: Database, color: 'indigo', label: '知识库', desc: 'RAG 上下文数据源' },
    { type: 'tool', icon: Cpu, color: 'amber', label: '执行工具', desc: '外部 API 或脚本' },
    { type: 'logic', icon: Zap, color: 'rose', label: '逻辑流程', desc: '条件分支与循环' },
];

const AgentFlowEditor: React.FC<{ onBack: () => void, onDeploy?: () => void }> = ({ onBack, onDeploy }) => {
    // Canvas State
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [showPlayground, setShowPlayground] = useState(false);
    const [playgroundMessages, setPlaygroundMessages] = useState<Message[]>([]);
    const [currentInput, setCurrentInput] = useState('');

    // Workflow State
    const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
    const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // Refs
    const canvasRef = useRef<HTMLDivElement>(null);
    const dragNodeId = useRef<string | null>(null);
    const lastMousePos = useRef<Position>({ x: 0, y: 0 });

    // --- Interaction Handlers ---

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            setIsPanning(true);
        }
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        if (isPanning) {
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        } else if (dragNodeId.current) {
            setNodes(prev => prev.map(node =>
                node.id === dragNodeId.current
                    ? { ...node, position: { x: node.position.x + dx / zoom, y: node.position.y + dy / zoom } }
                    : node
            ));
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        dragNodeId.current = null;
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            const zoomDelta = -e.deltaY * 0.001;
            setZoom(prev => Math.min(Math.max(prev + zoomDelta, 0.2), 2));
        } else {
            setOffset(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    };

    const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        dragNodeId.current = nodeId;
        setSelectedNodeId(nodeId);
    };

    const handleDeploy = () => {
        if (isDeploying) return;
        setIsDeploying(true);
        // Simulate a short deployment delay for better UX
        setTimeout(() => {
            setIsDeploying(false);
            setShowPlayground(true);
            // Initial Bot Message
            if (playgroundMessages.length === 0) {
                setPlaygroundMessages([
                    {
                        id: 'm1',
                        role: 'assistant',
                        content: 'Hi there! How can I help?'
                    }
                ]);
            }
        }, 1200);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!currentInput.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: currentInput
        };

        setPlaygroundMessages(prev => [...prev, userMsg]);
        setCurrentInput('');

        // Simulate Agent Response with Logs
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '',
                logs: [
                    { id: 'l1', level: 'info', message: 'Process Flow', status: 'error' }
                ],
                error: "Error in Condition Agent node: The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' })."
            };
            setPlaygroundMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    // --- Render Helpers ---

    const renderGrid = () => (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `radial-gradient(circle, #CBD5E1 1px, transparent 1px)`,
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                backgroundPosition: `${offset.x}px ${offset.y}px`,
                opacity: 0.3
            }}
        />
    );

    const renderConnections = () => {
        return connections.map(conn => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            const targetNode = nodes.find(n => n.id === conn.target);
            if (!sourceNode || !targetNode) return null;

            // Simple Bezier Curve calculation
            const sx = (sourceNode.position.x + 240) * zoom + offset.x;
            const sy = (sourceNode.position.y + 40) * zoom + offset.y;
            const tx = targetNode.position.x * zoom + offset.x;
            const ty = (targetNode.position.y + 40) * zoom + offset.y;

            const dx = Math.abs(tx - sx) * 0.5;
            const path = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;

            return (
                <g key={conn.id}>
                    <path
                        d={path}
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth={2 * zoom}
                        strokeDasharray={4}
                        className="transition-all duration-300"
                    />
                    <circle r={3 * zoom} fill="#3B82F6">
                        <animateMotion dur="3s" repeatCount="indefinite" path={path} />
                    </circle>
                </g>
            );
        });
    };

    const PlaygroundSidebar = () => {
        const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

        const toggleLog = (id: string) => {
            setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
        };

        return (
            <div className="w-[450px] bg-[#F9FAFB] border-l border-slate-200 flex flex-col z-[60] shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Sidebar Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-2">
                        <Play size={16} className="text-blue-600" />
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Preview Playground</h3>
                    </div>
                    <button onClick={() => setShowPlayground(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {playgroundMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-4 group">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                                ${msg.role === 'assistant' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}`}>
                                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className="flex-1 space-y-4">
                                {msg.content && (
                                    <div className="text-sm font-medium text-slate-700 leading-relaxed max-w-[90%]">
                                        {msg.content}
                                    </div>
                                )}

                                {msg.logs && msg.logs.map(log => (
                                    <div key={log.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm group/log">
                                        <button
                                            onClick={() => toggleLog(log.id)}
                                            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                {log.status === 'error' && <AlertIcon size={18} className="text-rose-500" />}
                                                <span className="text-xs font-black text-slate-600 tracking-tight uppercase">{log.message}</span>
                                            </div>
                                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedLogs[log.id] ? 'rotate-180' : ''}`} />
                                        </button>
                                        {expandedLogs[log.id] && (
                                            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-50 text-[11px] font-mono text-slate-500 leading-relaxed">
                                                Executing process flow logic...
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {msg.error && (
                                    <div className="text-[13px] font-medium text-slate-600 leading-relaxed bg-white border border-slate-100 p-6 rounded-3xl shadow-sm italic">
                                        {msg.error}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <form onSubmit={handleSendMessage} className="relative group/input">
                        <input
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            placeholder="Type your question..."
                            className="w-full bg-[#f3f4f6] border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-sm border border-slate-100 text-blue-600 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-in fade-in duration-500 overflow-hidden select-none">
            {/* Top Toolbar */}
            <div className="px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between z-50 shadow-sm">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="p-3 bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Agent 工作流设计器</h2>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-100">
                                内测版编辑器
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
                        <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.2))} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400"><Minus size={16} /></button>
                        <span className="px-4 py-2 text-[10px] font-black text-slate-900 min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400"><Plus size={16} /></button>
                    </div>
                    <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 text-xs font-black rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Save size={16} /> 保存草稿
                    </button>
                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className={`px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${isDeploying ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isDeploying ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> 正在部署...
                            </>
                        ) : (
                            <>
                                <Play size={16} className="fill-white" /> 部署并运行
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Node Library (Left Sidebar) */}
                <div className="w-72 bg-white border-r border-slate-200 flex flex-col z-40">
                    <div className="p-6 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">工作流节点库</h3>
                            <div className="space-y-3">
                                {NODE_TYPES.map(node => (
                                    <div
                                        key={node.type}
                                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-grab active:cursor-grabbing group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl bg-${node.color}-100 text-${node.color}-600 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                <node.icon size={20} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-slate-800">{node.label}</div>
                                                <div className="text-[9px] text-slate-400 font-medium">{node.desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">最近使用的 Agent</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 opacity-50">
                                    <Zap size={16} className="text-slate-300" />
                                    <span className="text-xs font-bold text-slate-400">正在加载模板...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div
                    ref={canvasRef}
                    className="flex-1 relative bg-[#F8FAFC] overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {renderGrid()}

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {renderConnections()}
                    </svg>

                    <div className="absolute inset-0 pointer-events-none">
                        {nodes.map(node => (
                            <div
                                key={node.id}
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                className={`absolute pointer-events-auto cursor-pointer transition-shadow
                                    ${selectedNodeId === node.id ? 'ring-4 ring-blue-500/20' : ''}`}
                                style={{
                                    left: node.position.x * zoom + offset.x,
                                    top: node.position.y * zoom + offset.y,
                                    width: 240 * zoom,
                                    zIndex: selectedNodeId === node.id ? 50 : 10
                                }}
                            >
                                <div className={`bg-white border rounded-[1.5rem] shadow-xl overflow-hidden transition-all
                                    ${selectedNodeId === node.id ? 'border-blue-500' : 'border-slate-200'}`}>
                                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg bg-slate-50 text-slate-400`}>
                                                {node.type === 'llm' ? <Sparkles size={12} /> :
                                                    node.type === 'knowledge' ? <Database size={12} /> :
                                                        node.type === 'tool' ? <Cpu size={12} /> : <Layers size={12} />}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 tracking-tight truncate max-w-[120px]">
                                                {node.label}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col gap-2">
                                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                                            <span className="text-[8px] font-black text-slate-400 uppercase">输入</span>
                                            <div className="w-2 h-2 rounded-full bg-slate-200 border border-white"></div>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl translate-x-2">
                                            <span className="text-[8px] font-black text-slate-400 uppercase">输出</span>
                                            <div className="w-2 h-2 rounded-full bg-blue-500 border border-white"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Configuration Sidebar */}
                <div className={`w-[400px] bg-white border-l border-slate-200 flex flex-col z-40 transition-all duration-300
                    ${selectedNodeId ? 'translate-x-0' : 'translate-x-full absolute right-0'}`}>
                    {selectedNode ? (
                        <div className="flex flex-col h-full">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 tracking-tight">节点配置</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{selectedNode.type} :: {selectedNode.id}</p>
                                </div>
                                <button onClick={() => setSelectedNodeId(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                <section className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">节点标签</label>
                                    <input
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                                        value={selectedNode.label}
                                        onChange={(e) => setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n))}
                                    />
                                </section>

                                {selectedNode.type === 'llm' && (
                                    <section className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">选择模型</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {['Gemini 3 Pro', 'Structural-V2', 'GPT-4o'].map(m => (
                                                    <button
                                                        key={m}
                                                        className={`p-4 rounded-2xl border-2 text-left transition-all
                                                            ${selectedNode.data.model === m ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                                    >
                                                        <div className="text-xs font-bold text-slate-800">{m}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">采样温度</label>
                                                <span className="text-[10px] font-black text-blue-600">0.7</span>
                                            </div>
                                            <input type="range" className="w-full accent-blue-600" defaultValue="70" />
                                        </div>
                                    </section>
                                )}

                                {selectedNode.type === 'knowledge' && (
                                    <section className="space-y-6">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">关联知识库</label>
                                        <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-3xl flex items-center gap-4">
                                            <Database className="text-indigo-600" />
                                            <div>
                                                <div className="text-xs font-black text-indigo-900">GB-50016-2024_Spec</div>
                                                <div className="text-[10px] text-indigo-500 font-bold uppercase mt-0.5">向量索引库</div>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                            <RefreshCw size={14} /> 切换知识库
                                        </button>
                                    </section>
                                )}
                            </div>

                            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                                <button className="w-full py-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2">
                                    <Trash2 size={16} /> 删除此节点
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                <Settings2 size={40} />
                            </div>
                            <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest">未选择节点</h4>
                            <p className="text-xs text-slate-400 mt-2">在画布上选择一个节点以配置其参数和逻辑。</p>
                        </div>
                    )}
                </div>

                {/* Playground Sidebar Overlay */}
                {showPlayground && <PlaygroundSidebar />}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default AgentFlowEditor;
