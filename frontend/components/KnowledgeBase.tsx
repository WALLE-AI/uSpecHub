import React, { useState, useRef } from 'react';
import { 
  Search, 
  Book, 
  Bookmark, 
  ChevronRight, 
  Download, 
  Filter, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  X, 
  File as FileIcon,
  Cpu,
  Scissors,
  Layers,
  Trash2,
  Plus,
  Folder,
  ArrowLeft,
  MoreVertical,
  HardDrive,
  Calendar,
  Clock,
  Hash
} from 'lucide-react';

// --- Types ---

interface KnowledgeBaseItem {
  id: string;
  name: string;
  description: string;
  docCount: number;
  sliceCount: number;
  size: string;
  color: string;
  updatedAt: string;
}

interface DocumentItem {
  id: string;
  kbId: string;
  code: string;
  title: string;
  type: string;
  date: string;
  category: string;
}

interface UploadItem {
  id: string;
  kbId: string;
  name: string;
  size: string;
  type: string;
  progress: number;
  stage: 'queued' | 'parsing' | 'slicing' | 'vectorizing' | 'completed';
}

// --- Mock Data ---

const INITIAL_KBS: KnowledgeBaseItem[] = [
  { id: 'kb1-7f8a-9c2d', name: '建筑通用规范', description: '包含国家标准、行业标准及通用技术规范', docCount: 8, sliceCount: 1245, size: '45.2 MB', color: 'bg-blue-600', updatedAt: '2023-10-24' },
  { id: 'kb2-3e4r-5t6y', name: '项目A 施工文档', description: '项目专属施工方案、图纸及变更记录', docCount: 3, sliceCount: 856, size: '128.5 MB', color: 'bg-emerald-600', updatedAt: '2023-11-02' },
  { id: 'kb3-9u8i-7o6p', name: '安全检查标准', description: '各类安全检查表单及评分细则', docCount: 5, sliceCount: 420, size: '12.8 MB', color: 'bg-orange-600', updatedAt: '2023-09-15' },
];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: '1', kbId: 'kb1-7f8a-9c2d', code: 'GB 50870-2013', title: '建筑施工安全技术统一规范', type: '国家标准', date: '2013-05-13', category: 'General' },
  { id: '2', kbId: 'kb1-7f8a-9c2d', code: 'JGJ 59-2011', title: '建筑施工安全检查标准', type: '行业标准', date: '2011-12-07', category: 'Inspection' },
  { id: '3', kbId: 'kb1-7f8a-9c2d', code: 'JGJ 80-2016', title: '建筑施工高处作业安全技术规范', type: '行业标准', date: '2016-07-09', category: 'HighAltitude' },
  { id: '4', kbId: 'kb1-7f8a-9c2d', code: 'GB/T 50319-2013', title: '建设工程监理规范', type: '国家标准', date: '2013-05-13', category: 'Management' },
  { id: '5', kbId: 'kb1-7f8a-9c2d', code: 'JGJ 46-2005', title: '施工现场临时用电安全技术规范', type: '行业标准', date: '2005-04-15', category: 'Electrical' },
  { id: '6', kbId: 'kb3-9u8i-7o6p', code: 'GB 50300-2013', title: '建筑工程施工质量验收统一标准', type: '国家标准', date: '2013-11-01', category: 'Quality' },
  { id: '7', kbId: 'kb1-7f8a-9c2d', code: 'JGJ 130-2011', title: '建筑施工扣件式钢管脚手架安全技术规范', type: '行业标准', date: '2011-01-28', category: 'Scaffold' },
  { id: '8', kbId: 'kb3-9u8i-7o6p', code: 'AQ/T 3034-2022', title: '化工企业安全生产管理规范', type: '行业标准', date: '2022-03-01', category: 'Chemical' },
];

const CATEGORIES = [
  { id: 'All', label: '全部' },
  { id: 'General', label: '通用规范' },
  { id: 'Inspection', label: '检查标准' },
  { id: 'HighAltitude', label: '高处作业' },
  { id: 'Electrical', label: '临时用电' },
  { id: 'Scaffold', label: '脚手架' }
];

const KnowledgeBase: React.FC = () => {
  // View State
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [activeKb, setActiveKb] = useState<KnowledgeBaseItem | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  
  // Data State
  const [kbs, setKbs] = useState<KnowledgeBaseItem[]>(INITIAL_KBS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKbName, setNewKbName] = useState('');
  const [newKbDesc, setNewKbDesc] = useState('');
  const [isCreatingKb, setIsCreatingKb] = useState(false);

  // Upload State
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverKbId, setDragOverKbId] = useState<string | null>(null);
  
  // Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Refs
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const cardFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // --- Helpers ---

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilteredDocs = () => {
    if (!activeKb) return [];
    return documents.filter(doc => 
      doc.kbId === activeKb.id &&
      (activeCategory === 'All' || doc.category === activeCategory) &&
      (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getKbUploads = (kbId: string) => uploadQueue.filter(u => u.kbId === kbId && u.stage !== 'completed');

  // --- Actions ---

  const handleSelectKb = async (kb: KnowledgeBaseItem) => {
    setActiveKb(kb);
    setView('detail');
    setIsLoadingDocs(true);
    setSearchTerm('');
    setActiveCategory('All');
    try {
      // Real backend API call to fetch documents for the selected knowledge base
      const response = await fetch(`http://36.103.239.202:9005/agent/api/knowledge-bases/${kb.id}/documents`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const fetchedDocs: DocumentItem[] = await response.json();
      
      // Add kbId to fetched docs to ensure association
      const docsWithKbId = fetchedDocs.map(doc => ({ ...doc, kbId: kb.id }));

      // Update documents state: remove old docs for this KB and add the new ones
      setDocuments(prevDocs => [
        ...prevDocs.filter(doc => doc.kbId !== kb.id),
        ...docsWithKbId,
      ]);

    } catch (error) {
      console.error("Failed to fetch documents from API, falling back to initial mock data.", error);
      // The fallback is implicit: if the API fails, we don't update the `documents` state,
      // so it will continue to use the `INITIAL_DOCUMENTS` data for this component's lifecycle.
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleCreateKb = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingKb(true);
    try {
      const response = await fetch('http://36.103.239.202:9005/agent/api/knowledge-bases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKbName, description: newKbDesc })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const newKb: KnowledgeBaseItem = await response.json();
      setKbs([newKb, ...kbs]);
      setIsCreateModalOpen(false);
      setNewKbName('');
      setNewKbDesc('');

    } catch (error) {
      console.error("Failed to create knowledge base via API, falling back to mock creation:", error);
      
      const mockNewKb: KnowledgeBaseItem = {
        id: `kb-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name: newKbName || '未命名知识库 (Mock)',
        description: newKbDesc || '暂无描述',
        docCount: 0,
        sliceCount: 0,
        size: '0 KB',
        color: 'bg-indigo-600',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setKbs([mockNewKb, ...kbs]);
      setIsCreateModalOpen(false);
      setNewKbName('');
      setNewKbDesc('');
      
    } finally {
      setIsCreatingKb(false);
    }
  };

  const handleDeleteKb = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const kb = kbs.find(k => k.id === id);
    if (window.confirm(`确定要删除知识库 "${kb?.name}" 吗？\n删除后该知识库内的所有文档将被清空，且无法恢复。`)) {
      setKbs(prev => prev.filter(k => k.id !== id));
      setDocuments(prev => prev.filter(d => d.kbId !== id));
      setUploadQueue(prev => prev.filter(u => u.kbId !== id));
    }
    setActiveMenuId(null);
  };

  const processFile = (file: File, targetKbId: string) => {
    const id = Math.random().toString(36).substring(7);
    const newItem: UploadItem = {
      id,
      kbId: targetKbId,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      progress: 0,
      stage: 'queued'
    };

    setUploadQueue(prev => [newItem, ...prev]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 2; 
      
      setUploadQueue(prev => {
        const updated = prev.map(item => {
          if (item.id !== id) return item;
          
          let currentProgress = progress;
          let stage: UploadItem['stage'] = item.stage;

          if (currentProgress >= 100) {
            currentProgress = 100;
            stage = 'completed';
          } else if (currentProgress > 70) {
            stage = 'vectorizing';
          } else if (currentProgress > 30) {
            stage = 'slicing';
          } else {
            stage = 'parsing';
          }
          
          return { ...item, progress: currentProgress, stage };
        });
        return updated;
      });

      if (progress >= 100) {
        clearInterval(interval);
        setDocuments(prevDocs => [
          {
            id: id,
            kbId: targetKbId,
            code: 'LOCAL',
            title: file.name,
            type: '本地文件',
            date: new Date().toISOString().split('T')[0],
            category: 'General'
          },
          ...prevDocs
        ]);
        setKbs(prevKbs => prevKbs.map(kb => {
           if (kb.id === targetKbId) {
             return { 
               ...kb, 
               docCount: kb.docCount + 1,
               sliceCount: kb.sliceCount + Math.floor(Math.random() * 50 + 10),
               updatedAt: new Date().toISOString().split('T')[0] 
             };
           }
           return kb;
        }));

        setTimeout(() => {
          setUploadQueue(prev => prev.filter(u => u.id !== id));
        }, 2000);
      }
    }, 200);
  };

  // --- Handlers for List View ---

  const handleCardFileSelect = (e: React.ChangeEvent<HTMLInputElement>, kbId: string) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => processFile(file as File, kbId));
    }
    if (cardFileInputRefs.current[kbId]) {
       cardFileInputRefs.current[kbId]!.value = '';
    }
  };

  const handleCardDrop = (e: React.DragEvent, kbId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverKbId(null);
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(file => processFile(file as File, kbId));
    }
  };

  // --- Handlers for Detail View ---

  const handleDetailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeKb && e.target.files) {
      Array.from(e.target.files).forEach(file => processFile(file as File, activeKb.id));
    }
    if (mainFileInputRef.current) mainFileInputRef.current.value = '';
  };

  const handleDetailDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (activeKb && e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(file => processFile(file as File, activeKb.id));
    }
  };

  // --- RENDER ---

  // --- LIST VIEW ---
  if (view === 'list') {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto font-sans relative">
        
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">新建知识库</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateKb} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">名称</label>
                  <input 
                    type="text" 
                    required
                    value={newKbName}
                    onChange={e => setNewKbName(e.target.value)}
                    placeholder="例如：产品技术文档"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                  <textarea 
                    value={newKbDesc}
                    onChange={e => setNewKbDesc(e.target.value)}
                    placeholder="简要描述知识库的用途..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreatingKb}
                    className="px-4 py-2 w-20 text-sm font-bold text-white bg-primary hover:bg-blue-600 rounded-lg shadow-md transition-colors flex items-center justify-center disabled:bg-blue-300"
                  >
                    {isCreatingKb ? <Loader2 size={16} className="animate-spin" /> : '创建'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Book className="text-primary" size={32} />
              知识库管理
            </h1>
            <p className="text-slate-500 text-sm">管理和组织您的企业私有知识数据，支持多格式文档解析。</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={2.5} /> 新建知识库
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kbs.map(kb => {
            const activeUploads = getKbUploads(kb.id);
            const isUploading = activeUploads.length > 0;
            const avgProgress = isUploading 
              ? activeUploads.reduce((acc, curr) => acc + curr.progress, 0) / activeUploads.length 
              : 0;

            return (
              <div 
                key={kb.id}
                onClick={() => handleSelectKb(kb)}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverKbId(kb.id); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverKbId(null); }}
                onDrop={(e) => handleCardDrop(e, kb.id)}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-auto min-h-[17rem]
                  ${dragOverKbId === kb.id ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-slate-200 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1'}
                `}
              >
                {dragOverKbId === kb.id && (
                  <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] z-20 flex items-center justify-center border-2 border-primary rounded-2xl border-dashed">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg text-primary font-bold flex items-center gap-2">
                       <UploadCloud size={20}/> 释放以上传
                    </div>
                  </div>
                )}

                <div className={`h-2 w-full ${kb.color}`}></div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${kb.color}`}>
                      <Folder size={24} />
                    </div>
                    <div className="flex gap-2 relative">
                       <button 
                         onClick={(e) => { e.stopPropagation(); cardFileInputRefs.current[kb.id]?.click(); }}
                         className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                         title="上传文件"
                       >
                         <UploadCloud size={18} />
                       </button>
                       <input 
                         type="file" 
                         ref={(el) => { cardFileInputRefs.current[kb.id] = el; return; }}
                         className="hidden" 
                         multiple 
                         onChange={(e) => handleCardFileSelect(e, kb.id)}
                       />
                       
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveMenuId(activeMenuId === kb.id ? null : kb.id);
                         }}
                         className={`p-2 rounded-lg transition-colors ${activeMenuId === kb.id ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                       >
                         <MoreVertical size={18} />
                       </button>

                       {activeMenuId === kb.id && (
                         <>
                           <div 
                             className="fixed inset-0 z-30 cursor-default"
                             onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }}
                           ></div>
                           <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-40 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                             <button 
                               onClick={(e) => handleDeleteKb(kb.id, e)}
                               className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                             >
                               <Trash2 size={14} /> 删除
                             </button>
                           </div>
                         </>
                       )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{kb.name}</h3>
                  <div className="text-[10px] font-mono text-slate-400 mb-3 bg-slate-50 px-2 py-0.5 rounded w-fit flex items-center gap-1" title={kb.id}>
                    <Hash size={10} /> {kb.id}
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {kb.description}
                  </p>

                  {isUploading ? (
                     <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="font-bold text-blue-600 flex items-center gap-1">
                             <Loader2 size={12} className="animate-spin"/> 处理中 ({activeUploads.length})
                          </span>
                          <span className="font-mono text-slate-500">{Math.round(avgProgress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${avgProgress}%`}}></div>
                        </div>
                        <div className="mt-1.5 text-[10px] text-slate-400 text-center">
                           解析 • 切片 • 向量化
                        </div>
                     </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5" title="文档数量">
                        <FileIcon size={14} className="text-slate-400"/>
                        <span className="font-medium">{kb.docCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="切片数量">
                        <Layers size={14} className="text-slate-400"/>
                        <span>{kb.sliceCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="存储占用">
                        <HardDrive size={14} className="text-slate-400"/>
                        <span>{kb.size}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400" title="更新时间">
                         {kb.updatedAt}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto font-sans">
      {/* Detail Header */}
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => { setView('list'); setActiveKb(null); }}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <span className={`w-3 h-3 rounded-full ${activeKb?.color}`}></span>
             {activeKb?.name}
           </h1>
           <div className="flex items-center gap-3 mt-1">
             <div className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                <Hash size={10} /> {activeKb?.id}
             </div>
             <p className="text-sm text-slate-500">{activeKb?.description}</p>
           </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 mb-8 transition-all duration-300 group
          ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDetailDrop}
      >
         <div className="flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => mainFileInputRef.current?.click()}>
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">点击或拖拽上传文档</h3>
            <p className="text-slate-500 text-sm mb-4">
              支持 PDF, PPT, Word, Markdown, TXT
            </p>
         </div>
         <input 
            type="file" 
            ref={mainFileInputRef} 
            className="hidden" 
            multiple 
            accept=".pdf,.ppt,.pptx,.doc,.docx,.md,.txt"
            onChange={handleDetailFileSelect}
         />

         {uploadQueue.filter(u => u.kbId === activeKb?.id).length > 0 && (
           <div className="mt-8 space-y-3 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-bold text-slate-700 mb-3">上传队列</h4>
              <div className="grid gap-3">
                {uploadQueue.filter(u => u.kbId === activeKb?.id).map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4 animate-in slide-in-from-top-2">
                     <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {item.type}
                     </div>
                     
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                           <span className="text-sm font-medium text-slate-800 truncate">{item.name}</span>
                           <span className="text-xs text-slate-500">{item.size}</span>
                        </div>
                        
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                           <div 
                             className="h-full bg-primary transition-all duration-300 ease-out"
                             style={{ width: `${item.progress}%` }}
                           ></div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-4">
                              <span className={`flex items-center gap-1 ${item.stage === 'parsing' ? 'text-blue-600 font-bold' : item.progress > 30 ? 'text-slate-400' : 'text-slate-300'}`}>
                                 <FileText size={12} /> 解析
                              </span>
                              <span className={`flex items-center gap-1 ${item.stage === 'slicing' ? 'text-blue-600 font-bold' : item.progress > 70 ? 'text-slate-400' : 'text-slate-300'}`}>
                                 <Scissors size={12} /> 切片
                              </span>
                              <span className={`flex items-center gap-1 ${item.stage === 'vectorizing' ? 'text-blue-600 font-bold' : item.progress === 100 ? 'text-slate-400' : 'text-slate-300'}`}>
                                 <Layers size={12} /> 向量化
                              </span>
                           </div>
                           
                           {item.stage === 'completed' ? (
                             <span className="text-green-600 font-bold flex items-center gap-1">
                               <CheckCircle2 size={12} /> 完成
                             </span>
                           ) : (
                             <span className="text-primary font-medium">
                               {Math.round(item.progress)}%
                             </span>
                           )}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
         )}
      </div>

      {/* Docs List */}
      <div className="space-y-4">
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">已收录标准</h2>
            <div className="text-sm text-slate-500">共 {getFilteredDocs().length} 条数据</div>
         </div>
         
         <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索标准..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat.id 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        
        {isLoadingDocs ? (
           <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
             <Loader2 size={32} className="mx-auto animate-spin text-primary mb-3"/>
             <p className="text-slate-500">正在加载文档列表...</p>
           </div>
        ) : (
          <div className="grid gap-3">
            {getFilteredDocs().length > 0 ? (
              getFilteredDocs().map(doc => (
                <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Book size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">{doc.code}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                        doc.type === '国家标准' ? 'bg-red-50 text-red-700 border-red-100' : 
                        doc.type === '行业标准' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        doc.type === '本地文件' ? 'bg-green-50 text-green-700 border-green-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {doc.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{doc.title}</h3>
                  </div>

                  <div className="flex gap-2">
                     <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                       <Download size={16} />
                     </button>
                     <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                       <ChevronRight size={16} />
                     </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <p className="text-slate-500 text-sm">未找到匹配的文档</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
