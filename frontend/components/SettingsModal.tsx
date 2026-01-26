import React, { useState } from 'react';
import { X, Key, Shield, Globe, Plus, Trash2, Eye, EyeOff, Check, Copy, Settings as SettingsIcon } from 'lucide-react';

type Tab = 'general' | 'api-keys' | 'security';

interface ApiKey {
  id: string;
  provider: string;
  key: string;
  masked: string;
  isActive: boolean;
  createdAt: string;
}

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<Tab>('api-keys');
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: '1', provider: 'uBuilding Native', key: 'env_var', masked: '••••••••••••••••', isActive: true, createdAt: '2023-10-01' },
    { id: '2', provider: 'OpenAI', key: 'sk-1234567890abcdef1234567890abcdef', masked: 'sk-••••••••cdef', isActive: false, createdAt: '2023-10-05' }
  ]);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [newProvider, setNewProvider] = useState('Anthropic');
  const [newKey, setNewKey] = useState('');

  const maskKey = (k: string) => {
    if (k === 'env_var') return '••••••••••••••••';
    if (k.length <= 8) return '••••••••';
    return k.substring(0, 3) + '••••••••' + k.substring(k.length - 4);
  };

  const handleAddKey = () => {
    if (!newKey) return;
    const newItem: ApiKey = {
      id: Date.now().toString(),
      provider: newProvider,
      key: newKey,
      masked: maskKey(newKey),
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setKeys([...keys, newItem]);
    setNewKey('');
  };

  const toggleActive = (id: string) => {
    setKeys(keys.map(k => ({ ...k, isActive: k.id === id })));
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <SettingsIcon size={20} className="text-slate-400" /> 系统设置
            </h2>
          </div>
          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'general' ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Globe size={18} /> 通用设置
            </button>
            <button onClick={() => setActiveTab('api-keys')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'api-keys' ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Key size={18} /> API 密钥管理
            </button>
            <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Shield size={18} /> 安全策略
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {activeTab === 'api-keys' ? 'API 密钥管理' : activeTab === 'general' ? '通用设置' : '安全策略'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {activeTab === 'api-keys' && '配置和管理不同 LLM 提供商的访问凭证'}
                {activeTab === 'general' && '系统外观与语言偏好设置'}
                {activeTab === 'security' && '账户安全与访问控制策略'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'api-keys' && (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                  <Shield className="flex-shrink-0 mt-0.5" size={18} />
                  <p>为了保障安全，您的 API 密钥已加密存储。系统默认使用环境变量中的核心服务密钥，您可以在此添加其他服务商的备用密钥。</p>
                </div>

                {/* Key List */}
                <div className="space-y-4">
                  {keys.map(key => (
                    <div
                      key={key.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 
                         ${key.isActive ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm
                            ${key.provider.includes('uBuilding') ? 'bg-blue-100 text-blue-600' :
                            key.provider.includes('OpenAI') ? 'bg-green-100 text-green-600' :
                              key.provider.includes('Anthropic') ? 'bg-orange-100 text-orange-600' :
                                'bg-purple-100 text-purple-600'}`}>
                          {key.provider.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{key.provider}</span>
                            {key.isActive && (
                              <span className="px-2 py-0.5 bg-primary text-white text-[10px] rounded-full font-bold flex items-center gap-1">
                                <Check size={10} strokeWidth={3} /> ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 font-mono mt-1 flex items-center gap-2">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              {showKeyId === key.id ? key.key : key.masked}
                            </span>
                            <div className="flex items-center">
                              <button
                                onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                title={showKeyId === key.id ? "Hide" : "Show"}
                              >
                                {showKeyId === key.id ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              {showKeyId === key.id && (
                                <button
                                  onClick={() => copyToClipboard(key.key)}
                                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors ml-1"
                                  title="Copy"
                                >
                                  <Copy size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        {!key.isActive && (
                          <button
                            onClick={() => toggleActive(key.id)}
                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-primary hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-200 transition-all bg-slate-100/50"
                          >
                            设为默认
                          </button>
                        )}

                        {/* uBuilding Native cannot be deleted */}
                        {key.provider !== 'uBuilding Native' ? (
                          <button
                            onClick={() => deleteKey(key.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="删除密钥"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <div className="w-9"></div> /* Spacer for alignment */
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New */}
                <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus size={16} className="text-primary" /> 添加新密钥
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">服务商</label>
                      <select
                        value={newProvider}
                        onChange={e => setNewProvider(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                      >
                        <option>Anthropic</option>
                        <option>OpenAI</option>
                        <option>Azure OpenAI</option>
                        <option>DeepSeek</option>
                        <option>Vertex AI</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">API Key (sk-...)</label>
                      <div className="flex gap-3">
                        <input
                          type="password"
                          value={newKey}
                          onChange={e => setNewKey(e.target.value)}
                          placeholder="输入 API Key..."
                          className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                          onClick={handleAddKey}
                          disabled={!newKey}
                          className="px-6 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-slate-200"
                        >
                          <Plus size={16} /> 添加
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab !== 'api-keys' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <SettingsIcon size={64} className="mb-4 opacity-10" />
                <p className="font-medium text-slate-500">该模块配置暂未开放</p>
                <p className="text-sm text-slate-400 mt-1">请切换至 API 密钥管理标签页</p>
              </div>
            )}
          </div>

          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};