import React, { useState, useMemo, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';

// --- Types & Mock Data ---

type DocType = 'guide' | 'api';
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiField {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  desc: string;
}

interface ApiDoc {
  id: string;
  type: DocType;
  categoryId: string;
  title: string;
  method?: Method;
  path?: string;
  description: string;
  content?: React.ReactNode; // For guides
  request?: {
    headers?: ApiField[];
    pathParams?: ApiField[];
    queryParams?: ApiField[];
    body?: ApiField[];
    contentType?: string; // e.g., 'multipart/form-data'
  };
  response?: {
    success: object | string;
    error?: object | string;
  };
  notes?: string[];
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const CATEGORIES: Category[] = [
  { id: 'info', title: '接入指南', icon: <Zap size={18} /> },
  { id: 'analysis', title: '核心分析', icon: <FileImage size={18} /> },
  { id: 'chat', title: 'Agent 交互', icon: <MessageSquare size={18} /> },
  { id: 'meta', title: '数据与监控', icon: <BarChart3 size={18} /> },
];

const DOCS_DATA: ApiDoc[] = [
  // --- Info / Guides ---
  {
    id: 'quick-start',
    type: 'guide',
    categoryId: 'info',
    title: '快速开始 (Quick Start)',
    description: 'Construction Hazard Analyzer API 接入概览。',
    content: (
      <div className="space-y-6 text-slate-600 text-base leading-relaxed">
        <p>本平台提供基于 VLM (Visual Language Model) 和 RAG (Retrieval-Augmented Generation) 的施工隐患识别与分析服务。</p>
        <h3 className="text-slate-900 font-bold mt-8 mb-3 text-xl">核心流程</h3>
        <ol className="list-decimal list-inside space-y-3 ml-2">
          <li>调用 <code className="text-primary font-medium bg-blue-50 px-1 py-0.5 rounded">/agent/api/analyze</code> 上传现场图片，获取隐患识别结果 (HazardData)。</li>
          <li>使用识别结果调用 <code className="text-primary font-medium bg-blue-50 px-1 py-0.5 rounded">/agent/api/chat/start</code> 初始化对话会话。</li>
          <li>通过 <code className="text-primary font-medium bg-blue-50 px-1 py-0.5 rounded">/agent/api/chat/message</code> 与 Agent 进行多轮交互，深入分析隐患细节或获取整改建议。</li>
        </ol>
        <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-900 font-semibold text-lg mb-2">注意：API Base URL</p>
          <code className="block bg-white p-3 rounded-lg border border-blue-200 text-sm font-mono text-slate-700">
            http://localhost:8000
          </code>
        </div>
      </div>
    )
  },

  // --- Analysis APIs ---
  {
    id: 'analyze-single',
    type: 'api',
    categoryId: 'analysis',
    title: '单图/数据分析',
    method: 'POST',
    path: '/agent/api/analyze',
    description: '上传单张图片进行隐患识别，或上传已有的 JSON/JSONL 数据进行解析校验。',
    request: {
      contentType: 'multipart/form-data',
      body: [
        { name: 'file', type: 'File', required: true, desc: '图片文件 (png/jpg/etc) 或数据文件 (json/jsonl)。' }
      ]
    },
    response: {
      success: {
        scene: "基坑作业区",
        main_hazard: {
          category: "临边防护",
          label: "基坑边未设置防护栏杆",
          risk_score: 0.85,
          severity: "high",
          kb_citations: []
        },
        image_path: "uploads/uuid.png"
      },
      error: {
        detail: "Unsupported file type."
      }
    },
    notes: [
      '支持图片格式: .png, .jpg, .jpeg, .bmp, .webp',
      '如果是 JSON 文件，必须符合 HazardData 数据结构。'
    ]
  },
  {
    id: 'analyze-batch',
    type: 'api',
    categoryId: 'analysis',
    title: '批量图片分析',
    method: 'POST',
    path: '/agent/api/analyze_batch',
    description: '批量上传图片进行分析，一次最多支持 10 张图片。',
    request: {
      contentType: 'multipart/form-data',
      body: [
        { name: 'files', type: 'List<File>', required: true, desc: '多个图片文件。' }
      ]
    },
    response: {
      success: {
        items: [
          {
            filename: "site_01.jpg",
            result: {
              scene: "脚手架工程",
              main_hazard: {}
            }
          },
          {
            filename: "site_02.jpg",
            result: {
              scene: "塔吊作业",
              main_hazard: {}
            }
          }
        ]
      }
    },
    notes: [
      '单次请求最多上传 10 张图片。',
      '处理时间随图片数量线性增加，请注意超时设置。'
    ]
  },

  // --- Chat APIs ---
  {
    id: 'chat-start',
    type: 'api',
    categoryId: 'chat',
    title: '开启会话 (Start Chat)',
    method: 'POST',
    path: '/agent/api/chat/start',
    description: '基于隐患分析结果建立一个新的对话 Session。返回流式 Markdown 响应。',
    request: {
      contentType: 'application/json',
      headers: [
        { name: 'Content-Type', type: 'string', required: true, default: 'application/json', desc: '' }
      ],
      body: [
        { name: 'hazard', type: 'Object', required: true, desc: '完整的 HazardData 对象（通常来自 /analyze 接口的响应）。' },
        { name: 'image', type: 'Object', required: false, desc: '可选。首图 Base64 数据。结构: { data: "base64...", mimeType: "image/png" }' }
      ]
    },
    response: {
      success: "Stream of Markdown text...",
    },
    notes: [
      '响应是流式文本 (text/plain; charset=utf-8)。',
      '关键：响应头 `x-session-id` 包含了新创建的 Session ID，后续对话必须携带此 ID。'
    ]
  },
  {
    id: 'chat-message',
    type: 'api',
    categoryId: 'chat',
    title: '发送消息 (Message)',
    method: 'POST',
    path: '/agent/api/chat/message',
    description: '在现有会话中发送用户文本或补充图片。',
    request: {
      contentType: 'application/json',
      body: [
        { name: 'sessionId', type: 'string', required: true, desc: '从 /chat/start 响应头获取的 UUID。' },
        { name: 'parts', type: 'Array', required: true, desc: '消息内容列表。支持文本或 Base64 图片。' }
      ]
    },
    response: {
      success: "Stream of Markdown text...",
    },
    notes: [
      'parts 示例: [{ "text": "这个隐患严重吗？" }, { "inlineData": { "data": "base64...", "mimeType": "image/jpeg" } }]'
    ]
  },

  // --- Meta APIs ---
  {
    id: 'kb-citations',
    type: 'api',
    categoryId: 'meta',
    title: '获取知识库引用',
    method: 'GET',
    path: '/agent/api/hazards_kb_citations',
    description: '根据 Report ID 获取该报告关联的所有知识库引用条款。',
    request: {
      queryParams: [
        { name: 'report_id', type: 'string', required: true, desc: '报告 ID / 任务 ID' }
      ]
    },
    response: {
      success: {
        task_id: "report-123",
        hazards: [
          {
            id: "H001",
            kb_citations: [
              { doc_id: "GB50026", clause_text: "..." }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'meta-stats',
    type: 'api',
    categoryId: 'meta',
    title: '调用统计',
    method: 'GET',
    path: '/agent/_meta/calls',
    description: '获取各接口的累计调用次数。',
    request: {},
    response: {
      success: {
        "POST /agent/api/analyze": 142,
        "POST /agent/api/chat/message": 560
      }
    }
  },
  {
    id: 'meta-daily',
    type: 'api',
    categoryId: 'meta',
    title: '每日统计',
    method: 'GET',
    path: '/agent/_meta/calls/daily',
    description: '获取按日期分组的接口调用统计。',
    request: {},
    response: {
      success: {
        "2023-10-25": {
          "POST /agent/api/analyze": 12
        }
      }
    }
  },
  {
    id: 'meta-tokens',
    type: 'api',
    categoryId: 'meta',
    title: 'Token 使用量',
    method: 'GET',
    path: '/agent/api/all_tokens',
    description: '获取系统 Token 消耗总览。',
    request: {},
    response: {
      success: {
        "total_tokens": 1500000,
        "completion_tokens": 400000,
        "prompt_tokens": 1100000
      }
    }
  }
];

// --- Components ---

const CodeBlock = ({ code, language }: { code: string, language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#0f172a] rounded-xl overflow-hidden shadow-lg group border border-slate-800 mt-4">
      <div className="absolute top-3 right-3 flex items-center space-x-2">
         <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-800 px-2 py-1 rounded">{language}</span>
         <button 
           onClick={handleCopy}
           className="text-slate-400 hover:text-white transition-colors p-1.5 rounded hover:bg-slate-700"
           title="Copy code"
         >
           {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
         </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="font-mono text-sm text-blue-100 leading-relaxed whitespace-pre-wrap font-light">
          {code}
        </pre>
      </div>
    </div>
  );
};

const ApiDocs: React.FC = () => {
  const [activeDocId, setActiveDocId] = useState<string>(DOCS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [activeTab, setActiveTab] = useState<'doc' | 'debug'>('doc');
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'js'>('curl');
  
  // Debug State
  const [debugParams, setDebugParams] = useState<Record<string, string>>({});
  const [debugBody, setDebugBody] = useState<string>('{\n  \n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [debugResponse, setDebugResponse] = useState<string | null>(null);

  const activeDoc = DOCS_DATA.find(d => d.id === activeDocId) || DOCS_DATA[0];

  // Reset debug state when doc changes
  useEffect(() => {
    setDebugParams({});
    setDebugResponse(null);
    setDebugBody(activeDoc.request?.contentType === 'application/json' ? '{\n  \n}' : '');
    setActiveTab('doc');
  }, [activeDocId]);

  const toggleCategory = (id: string) => {
    if (expandedCategories.includes(id)) {
      setExpandedCategories(expandedCategories.filter(c => c !== id));
    } else {
      setExpandedCategories([...expandedCategories, id]);
    }
  };

  // Generate Code Snippets
  const generatedCode = useMemo(() => {
    const baseUrl = "http://localhost:8000";
    const fullUrl = `${baseUrl}${activeDoc.path}`;
    const method = activeDoc.method || 'GET';

    if (codeLang === 'curl') {
      let cmd = `curl -X ${method} "${fullUrl}"`;
      // Add Headers
      if (activeDoc.request?.contentType === 'application/json') {
         cmd += ` \\\n  -H "Content-Type: application/json"`;
      }
      // Add Body
      if (activeDoc.request?.contentType === 'application/json') {
        cmd += ` \\\n  -d '${debugBody.replace(/\n/g, '')}'`;
      } else if (activeDoc.request?.contentType === 'multipart/form-data') {
        cmd += ` \\\n  -F "file=@/path/to/image.jpg"`;
      }
      // Add Query Params
      if (activeDoc.request?.queryParams) {
        const qp = activeDoc.request.queryParams.map(p => `${p.name}=${debugParams[p.name] || 'VALUE'}`).join('&');
        cmd = cmd.replace(fullUrl, `${fullUrl}?${qp}`);
      }
      return cmd;
    }

    if (codeLang === 'python') {
      let code = `import requests\nimport json\n\nurl = "${fullUrl}"\n`;
      
      if (activeDoc.request?.queryParams) {
        code += `params = {\n${activeDoc.request.queryParams.map(p => `    "${p.name}": "${debugParams[p.name] || 'VALUE'}"`).join(',\n')}\n}\n`;
      }

      if (activeDoc.request?.contentType === 'application/json') {
        code += `payload = ${debugBody}\nheaders = {\n  'Content-Type': 'application/json'\n}\n`;
        code += `\nresponse = requests.${method.toLowerCase()}(url, headers=headers, json=payload`;
      } else if (activeDoc.request?.contentType === 'multipart/form-data') {
        code += `files = [\n  ('file', ('image.jpg', open('/path/to/image.jpg', 'rb'), 'image/jpeg'))\n]\nheaders = {}\n`;
        code += `\nresponse = requests.${method.toLowerCase()}(url, headers=headers, files=files`;
      } else {
        code += `\nresponse = requests.${method.toLowerCase()}(url`;
      }

      if (activeDoc.request?.queryParams) code += `, params=params`;
      code += `)\n\nprint(response.text)`;
      return code;
    }

    if (codeLang === 'js') {
      let code = `const url = "${fullUrl}";\nconst options = {\n  method: "${method}",\n  headers: {`;
      
      if (activeDoc.request?.contentType === 'application/json') {
        code += `\n    "Content-Type": "application/json"`;
      }
      code += `\n  }`;
      
      if (activeDoc.request?.contentType === 'application/json') {
        code += `,\n  body: JSON.stringify(${debugBody})`;
      } else if (activeDoc.request?.contentType === 'multipart/form-data') {
        code = `const formData = new FormData();\nformData.append("file", fileInput.files[0]);\n\nconst response = await fetch("${fullUrl}", {\n  method: "${method}",\n  body: formData\n});`;
        return code;
      }

      code += `\n};\n\ntry {\n  const response = await fetch(url, options);\n  const data = await response.json();\n  console.log(data);\n} catch (error) {\n  console.error(error);\n}`;
      return code;
    }

    return '';
  }, [activeDoc, codeLang, debugBody, debugParams]);

  const handleExecute = () => {
    setIsExecuting(true);
    setDebugResponse(null);
    // Simulate network delay
    setTimeout(() => {
      setIsExecuting(false);
      // Return mock response based on Doc definition
      const mock = activeDoc.response?.success 
        ? (typeof activeDoc.response.success === 'string' ? activeDoc.response.success : JSON.stringify(activeDoc.response.success, null, 2))
        : '{"status": "ok"}';
      setDebugResponse(mock);
    }, 1500);
  };

  // Filter docs based on search
  const filteredDocs = useMemo(() => {
    if (!searchQuery) return DOCS_DATA;
    const lowerQ = searchQuery.toLowerCase();
    return DOCS_DATA.filter(doc => 
      doc.title.toLowerCase().includes(lowerQ) || 
      doc.path?.toLowerCase().includes(lowerQ) ||
      doc.description.toLowerCase().includes(lowerQ)
    );
  }, [searchQuery]);

  // Group docs by category
  const docsByCategory = useMemo(() => {
    const grouped: Record<string, ApiDoc[]> = {};
    CATEGORIES.forEach(cat => {
      grouped[cat.id] = filteredDocs.filter(d => d.categoryId === cat.id);
    });
    return grouped;
  }, [filteredDocs]);

  const MethodBadge = ({ method }: { method?: Method }) => {
    const colors = {
      GET: 'bg-blue-100 text-blue-700 border-blue-200',
      POST: 'bg-green-100 text-green-700 border-green-200',
      PUT: 'bg-orange-100 text-orange-700 border-orange-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200'
    };
    if (!method) return null;
    return (
      <span className={`px-2.5 py-1 rounded text-xs font-bold border ${colors[method]}`}>
        {method}
      </span>
    );
  };

  const ParamsTable = ({ fields, title }: { fields?: ApiField[], title: string }) => {
    if (!fields || fields.length === 0) return null;
    return (
      <div className="mb-8">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{title}</h4>
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-base">
              <tr>
                <th className="px-5 py-3 w-1/4">字段名</th>
                <th className="px-5 py-3 w-1/6">类型</th>
                <th className="px-5 py-3 w-1/6">必填</th>
                <th className="px-5 py-3">说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-base">
              {fields.map((field, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-slate-800 font-medium">{field.name}</td>
                  <td className="px-5 py-3 text-slate-500 text-sm">{field.type}</td>
                  <td className="px-5 py-3">
                    {field.required ? (
                      <span className="text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded font-medium border border-red-100">Required</span>
                    ) : (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Optional</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {field.desc}
                    {field.default && <div className="text-sm text-slate-400 mt-1.5">Default: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{field.default}</code></div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20">
        <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索接口 / 描述..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {CATEGORIES.map(cat => {
            const docs = docsByCategory[cat.id] || [];
            if (docs.length === 0) return null;
            const isExpanded = expandedCategories.includes(cat.id);

            return (
              <div key={cat.id} className="mb-3">
                <button 
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wide transition-colors rounded-md hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    {cat.icon} {cat.title}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                </button>
                
                {isExpanded && (
                  <div className="mt-1.5 space-y-1">
                    {docs.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => setActiveDocId(doc.id)}
                        className={`group cursor-pointer px-4 py-3 rounded-lg text-base flex items-center transition-all ${activeDocId === doc.id ? 'bg-blue-50 text-primary font-medium shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        {doc.type === 'api' ? (
                          <span className={`text-xs font-bold w-12 flex-shrink-0 mr-2 ${
                            doc.method === 'GET' ? 'text-blue-600' : 
                            doc.method === 'POST' ? 'text-green-600' : 
                            doc.method === 'DELETE' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {doc.method}
                          </span>
                        ) : (
                          <FileText size={16} className="mr-3 text-slate-400 group-hover:text-slate-500 w-5"/>
                        )}
                        <span className="truncate">{doc.title.split('(')[0]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 overflow-y-auto bg-white scroll-smooth">
        <div className="max-w-6xl mx-auto p-10 md:p-14 pb-24">
          
          {/* Header */}
          <div className="mb-10 border-b border-slate-100 pb-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                 <span>文档中心</span>
                 <ChevronRight size={14}/>
                 <span>{CATEGORIES.find(c => c.id === activeDoc.categoryId)?.title}</span>
               </div>
               {activeDoc.type === 'api' && (
                 <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button 
                      onClick={() => setActiveTab('doc')}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'doc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <FileText size={14} /> 定义文档
                    </button>
                    <button 
                      onClick={() => setActiveTab('debug')}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'debug' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Play size={14} /> 在线调试 (Run)
                    </button>
                 </div>
               )}
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-4">
              {activeDoc.title}
            </h1>

            {activeDoc.type === 'api' && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-base text-slate-700 w-fit shadow-sm">
                  <MethodBadge method={activeDoc.method} />
                  <span className="font-semibold px-2">{activeDoc.path}</span>
                  <button className="ml-2 text-slate-400 hover:text-primary p-1 hover:bg-white rounded transition-all" onClick={() => navigator.clipboard.writeText(activeDoc.path || '')}>
                    <Copy size={16}/>
                  </button>
                </div>
                {activeDoc.request?.contentType && (
                   <div className="text-sm text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      {activeDoc.request.contentType}
                   </div>
                )}
              </div>
            )}
            
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-4xl">
              {activeDoc.description}
            </p>
          </div>

          {/* Content Area */}
          {activeDoc.type === 'guide' ? (
             <div className="prose prose-lg prose-slate max-w-none">
               {activeDoc.content}
             </div>
          ) : (
            <div className="animate-fade-in">
              {activeTab === 'doc' ? (
                /* --- DOCUMENTATION VIEW --- */
                <div className="space-y-12">
                   {/* Request Specs */}
                   <section>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <Server size={22} className="mr-3 text-slate-400"/> 请求参数 (Request)
                      </h3>
                      
                      <ParamsTable title="Header 参数" fields={activeDoc.request?.headers} />
                      <ParamsTable title="Path 参数" fields={activeDoc.request?.pathParams} />
                      <ParamsTable title="Query 参数" fields={activeDoc.request?.queryParams} />
                      <ParamsTable title="Body 字段" fields={activeDoc.request?.body} />
                   </section>

                   {/* Examples */}
                   <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700 flex items-center">
                          <Terminal size={18} className="mr-2.5"/> 代码样例 (Code Samples)
                        </h3>
                        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                           {(['curl', 'python', 'js'] as const).map(lang => (
                             <button
                               key={lang}
                               onClick={() => setCodeLang(lang)}
                               className={`px-3 py-1 text-xs font-medium rounded-md uppercase transition-all ${codeLang === lang ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                             >
                               {lang}
                             </button>
                           ))}
                        </div>
                      </div>
                      <CodeBlock language={codeLang} code={generatedCode} />
                   </section>

                   {/* Response Example */}
                   <section>
                      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
                         <Check size={18} className="mr-2.5 text-green-600"/> 示例响应 (200 OK)
                      </h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-x-auto shadow-sm">
                         <pre className="font-mono text-sm text-slate-700 leading-relaxed">
                           {typeof activeDoc.response?.success === 'string' 
                             ? activeDoc.response.success 
                             : JSON.stringify(activeDoc.response?.success, null, 2)}
                         </pre>
                      </div>
                   </section>

                   {/* Notes */}
                   {activeDoc.notes && activeDoc.notes.length > 0 && (
                     <section className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                        <h4 className="text-base font-bold text-amber-800 mb-3 flex items-center">
                           <AlertCircle size={18} className="mr-2.5"/> 注意事项
                        </h4>
                        <ul className="list-disc list-inside text-sm text-amber-900 space-y-2 ml-1">
                           {activeDoc.notes.map((note, i) => (
                             <li key={i}>{note}</li>
                           ))}
                        </ul>
                     </section>
                   )}
                </div>
              ) : (
                /* --- DEBUG / PLAYGROUND VIEW --- */
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left: Input Form */}
                  <div className="xl:col-span-2 space-y-8">
                     {/* Query Params Input */}
                     {activeDoc.request?.queryParams && activeDoc.request.queryParams.length > 0 && (
                       <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">Query Parameters</h4>
                          <div className="grid gap-4">
                             {activeDoc.request.queryParams.map(p => (
                               <div key={p.name}>
                                  <label className="block text-xs font-medium text-slate-500 mb-1.5">{p.name} {p.required && <span className="text-red-500">*</span>}</label>
                                  <input 
                                    type="text"
                                    placeholder={p.desc}
                                    value={debugParams[p.name] || ''}
                                    onChange={e => setDebugParams({...debugParams, [p.name]: e.target.value})}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                  />
                               </div>
                             ))}
                          </div>
                       </div>
                     )}

                     {/* Body Input */}
                     <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">Request Body</h4>
                        
                        {activeDoc.request?.contentType === 'multipart/form-data' ? (
                          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                             <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                               <FileImage size={20} />
                             </div>
                             <p className="text-sm text-slate-600 font-medium">Click to upload files</p>
                             <p className="text-xs text-slate-400 mt-1">Supports .png, .jpg, .jsonl</p>
                             <input type="file" className="hidden" />
                          </div>
                        ) : (
                          <div className="relative">
                            <textarea 
                              value={debugBody}
                              onChange={e => setDebugBody(e.target.value)}
                              className="w-full h-64 px-4 py-3 bg-slate-900 text-blue-100 font-mono text-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary/40 outline-none leading-relaxed"
                              placeholder="{ ... }"
                            />
                            <div className="absolute top-3 right-3 text-xs text-slate-500">JSON</div>
                          </div>
                        )}
                     </div>

                     <button 
                       onClick={handleExecute}
                       disabled={isExecuting}
                       className="w-full py-3 bg-primary hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
                     >
                       {isExecuting ? <Loader2 size={20} className="animate-spin"/> : <Play size={20} fill="currentColor"/>}
                       {isExecuting ? 'Sending Request...' : 'Send Request'}
                     </button>
                  </div>

                  {/* Right: Response Viewer */}
                  <div className="xl:col-span-1">
                     <div className="sticky top-24 space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                          <Globe size={16}/> Response
                        </h4>
                        <div className={`min-h-[400px] rounded-xl border ${debugResponse ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50 border-dashed'} p-4 overflow-hidden flex flex-col`}>
                           {debugResponse ? (
                             <>
                               <div className="flex items-center gap-2 mb-3 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded border border-green-100">
                                  <CheckCircle2 size={12}/> Status: 200 OK
                               </div>
                               <pre className="text-xs font-mono text-slate-700 overflow-auto flex-1">
                                 {debugResponse}
                               </pre>
                             </>
                           ) : (
                             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
                                <RotateCw size={32} className="mb-2 opacity-20"/>
                                <p>Ready to execute</p>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;