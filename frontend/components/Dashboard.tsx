import React, { useState } from 'react';
import {
  Activity,
  Database,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ExternalLink,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { KPICardProps, LogEntry, AlertEntry } from '../types';

// --- Mock Data ---
const TREND_DATA_DAILY = [
  { date: '10/01', calls: 4000, tokens: 240000 },
  { date: '10/02', calls: 3000, tokens: 139800 },
  { date: '10/03', calls: 2000, tokens: 980000 },
  { date: '10/04', calls: 2780, tokens: 390800 },
  { date: '10/05', calls: 1890, tokens: 480000 },
  { date: '10/06', calls: 2390, tokens: 380000 },
  { date: '10/07', calls: 3490, tokens: 430000 },
];

const TREND_DATA_MONTHLY = [
  { date: 'May', calls: 80000, tokens: 5400000 },
  { date: 'Jun', calls: 95000, tokens: 6200000 },
  { date: 'Jul', calls: 110000, tokens: 7800000 },
  { date: 'Aug', calls: 105000, tokens: 7100000 },
  { date: 'Sep', calls: 130000, tokens: 8900000 },
  { date: 'Oct', calls: 142000, tokens: 9500000 },
];

const SOURCE_DATA = [
  { name: '后端服务 A', value: 400 },
  { name: '移动端应用 B', value: 300 },
  { name: '外部客户 X', value: 300 },
  { name: '内部工具', value: 200 },
];

const ERROR_DATA = [
  { name: '5xx 错误', value: 10 },
  { name: '超时', value: 25 },
  { name: '安全策略拦截', value: 65 },
];

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#64748b'];
const ERROR_COLORS = ['#ef4444', '#f97316', '#8b5cf6'];

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '2023-10-07 10:23:45', caller: 'Backend Service A', model: 'med-insight-v4', tokensPrompt: 120, tokensCompletion: 450, latency: 320, status: 'success' },
  { id: '2', timestamp: '2023-10-07 10:23:42', caller: 'Ext Client X', model: 'fin-quant-ultra', tokensPrompt: 800, tokensCompletion: 0, latency: 45, status: 'blocked' },
  { id: '3', timestamp: '2023-10-07 10:23:10', caller: 'Mobile App B', model: 'med-insight-v4', tokensPrompt: 50, tokensCompletion: 120, latency: 150, status: 'success' },
  { id: '4', timestamp: '2023-10-07 10:22:55', caller: 'Backend Service A', model: 'structural-native-xl', tokensPrompt: 300, tokensCompletion: 600, latency: 1200, status: 'failed', errorMessage: 'Timeout' },
  { id: '5', timestamp: '2023-10-07 10:21:30', caller: 'Internal Tool C', model: 'veo-construction-viz-3', tokensPrompt: 100, tokensCompletion: 200, latency: 5000, status: 'success' },
];

const MOCK_ALERTS: AlertEntry[] = [
  { id: 'a1', timestamp: '10:15:00', type: '敏感内容', severity: 'high', rule: 'PII 隐私检测', status: 'pending' },
  { id: 'a2', timestamp: '09:45:22', type: '越权数据', severity: 'high', rule: 'Prompt 注入防护', status: 'confirmed' },
  { id: 'a3', timestamp: '08:30:11', type: '输出幻觉偏高', severity: 'medium', rule: '事实性核查', status: 'ignored' },
];

const SERVICE_USAGE_DATA = [
  { id: 's1', type: 'model', name: 'MedInsight V4 (Medical)', calls: 86420, tokens: 4200000000, color: 'bg-teal-500' },
  { id: 's2', type: 'model', name: 'FinQuant Ultra (Finance)', calls: 42100, tokens: 1800000000, color: 'bg-indigo-500' },
  { id: 's3', type: 'model', name: 'Structural Native', calls: 12500, tokens: 650000000, color: 'bg-indigo-400' },
  { id: 's4', type: 'agent', name: 'Safety Compliance Officer', calls: 2400, tokens: 84000000, color: 'bg-emerald-500' },
  { id: 's5', type: 'agent', name: 'Structural Audit Agent', calls: 1200, tokens: 120000000, color: 'bg-teal-500' },
];

// --- Components ---

const MiniSparkline: React.FC<{ data: any[], color: string }> = ({ data, color }) => (
  <div className="h-12 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="val"
          stroke={color}
          strokeWidth={2}
          dot={false}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const KPICard: React.FC<KPICardProps & { sparkData?: any[], color?: string }> = ({ title, value, trend, trendLabel, icon, sparkData, color = "#3b82f6" }) => (
  <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
    {/* Background Watermark Icon */}
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500">
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 120 })}
    </div>

    <div className="flex justify-between items-start relative z-10">
      <div className="space-y-2">
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{title}</div>
        <div className="text-4xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>
      <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 rounded-2xl transition-all duration-300 shadow-sm border border-slate-100/50">
        {icon}
      </div>
    </div>

    {/* Bottom Section - Fills the void */}
    <div className="mt-auto pt-6 border-t border-slate-50 flex items-end justify-between relative z-10">
      <div>
        <div className={`flex items-center text-xs font-bold mb-1 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend >= 0 ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          <span>{Math.abs(trend)}%</span>
        </div>
        <div className="text-[10px] text-slate-400 font-medium">{trendLabel}</div>
      </div>
      {sparkData && (
        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
          <MiniSparkline data={sparkData} color={color} />
        </div>
      )}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'alerts'>('recent');
  const [timeDimension, setTimeDimension] = useState<'day' | 'month'>('day');
  const [metricDimension, setMetricDimension] = useState<'all' | 'calls' | 'tokens'>('all');

  // Sparkline data mocks
  const sparkCalls = [
    { val: 10 }, { val: 25 }, { val: 15 }, { val: 30 }, { val: 22 }, { val: 35 }, { val: 30 }
  ];
  const sparkTotal = [
    { val: 50 }, { val: 55 }, { val: 62 }, { val: 58 }, { val: 70 }, { val: 75 }, { val: 82 }
  ];

  const chartData = timeDimension === 'day' ? TREND_DATA_DAILY : TREND_DATA_MONTHLY;

  return (
    <div className="px-8 py-8 space-y-8 h-full overflow-y-auto bg-slate-50/50">
      {/* Header - Subtle integrated title */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">看板总览</h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">实时监控接口调用规模、安全状态与成本趋势</p>
        </div>
        <div className="flex bg-white/80 backdrop-blur shadow-sm p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setTimeDimension('day')}
            className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${timeDimension === 'day' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            最近 7 天
          </button>
          <button
            onClick={() => setTimeDimension('month')}
            className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${timeDimension === 'month' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            最近 12 个月
          </button>
        </div>
      </div>

      {/* KPI Cards [D-2] - Redesigned Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KPICard
          title="今日接口调用次数"
          value="142,394"
          trend={12.5}
          trendLabel="较昨日"
          icon={<Activity size={18} />}
          sparkData={sparkCalls}
          color="#3b82f6"
        />
        <KPICard
          title="累计总调用次数"
          value="45.8M"
          trend={15.2}
          trendLabel="总增长率"
          icon={<Database size={18} />}
          sparkData={sparkTotal}
          color="#8b5cf6"
        />

        {/* Token Metric Card - Simplified & Harmonized */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tokens 消耗明细</h3>
            <Zap size={18} className="text-amber-500" />
          </div>
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-[11px] font-bold text-slate-500">今日消耗</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-slate-900">84.5M</span>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">-2.4%</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-[11px] font-bold text-slate-500">本月消耗</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-slate-900">1.2B</span>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">+8.1%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500">累计总消耗</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-blue-600">12.4B</span>
                <span className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section [D-3] */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              趋势分析
            </h3>
            <div className="flex space-x-2">
              <select
                value={metricDimension}
                onChange={(e) => setMetricDimension(e.target.value as any)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-slate-50 text-slate-700 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">综合视图 (All)</option>
                <option value="calls">仅看调用次数 (Calls)</option>
                <option value="tokens">仅看 Tokens 用量</option>
              </select>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />

                {/* Conditional YAxes */}
                {(metricDimension === 'all' || metricDimension === 'calls') && (
                  <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 12 }} />
                )}
                {(metricDimension === 'all' || metricDimension === 'tokens') && (
                  <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" tick={{ fontSize: 12 }} />
                )}

                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} />

                {/* Conditional Lines */}
                {(metricDimension === 'all' || metricDimension === 'calls') && (
                  <Line yAxisId="left" name="调用次数" type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                )}
                {(metricDimension === 'all' || metricDimension === 'tokens') && (
                  <Line yAxisId="right" name="Tokens" type="monotone" dataKey="tokens" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">调用来源占比</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SOURCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {SOURCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">错误率 & 拦截统计</h3>
            <div className="space-y-3">
              {ERROR_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: ERROR_COLORS[idx] }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Usage Allocation [D-3.5] */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Database size={18} className="text-indigo-500" /> 服务资源分配明细
          </h3>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Total Allocation across 5 Units
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {SERVICE_USAGE_DATA.map(service => (
            <div key={service.id} className="group">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${service.color}`}></span>
                  <span className="text-sm font-bold text-slate-700">{service.name}</span>
                  <span className="text-[9px] font-black text-slate-300 uppercase px-1.5 py-0.5 border border-slate-100 rounded">{service.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">{(service.tokens / 1000000000).toFixed(1)}B Tokens</div>
                  <div className="text-[10px] font-bold text-slate-400">{(service.calls / 1000).toFixed(1)}K Calls</div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div
                  className={`h-full ${service.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(service.tokens / 12400000000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Model Units</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Agent Units</span>
          </div>
          <span>Based on cumulative consumption data</span>
        </div>
      </div>

      {/* Bottom Lists [D-4] */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 px-8 py-2 flex space-x-10">
          <button
            onClick={() => setActiveTab('recent')}
            className={`font-bold text-[11px] uppercase tracking-widest pb-4 pt-4 -mb-px border-b-2 transition-all ${activeTab === 'recent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            最近调用日志
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`font-bold text-[11px] uppercase tracking-widest pb-4 pt-4 -mb-px border-b-2 transition-all ${activeTab === 'alerts' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            安全 & 质量告警
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'recent' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">时间序列</th>
                  <th className="px-8 py-4">调用来源</th>
                  <th className="px-8 py-4">模型单元</th>
                  <th className="px-8 py-4 text-center">TOKENS (P/C/T)</th>
                  <th className="px-8 py-4">执行状态</th>
                  <th className="px-8 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_LOGS.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-700 text-sm">{log.caller}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tabular-nums">{log.model}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-1 font-mono text-[11px] font-bold">
                        <span className="text-slate-400">{log.tokensPrompt}</span>
                        <span className="text-slate-200">/</span>
                        <span className="text-slate-400">{log.tokensCompletion}</span>
                        <span className="text-slate-200">/</span>
                        <span className="text-blue-600">{log.tokensPrompt + log.tokensCompletion}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        {log.status === 'success' && <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">Success</span>}
                        {log.status === 'failed' && <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-tighter">Failed</span>}
                        {log.status === 'blocked' && <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-tighter">Blocked</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-slate-300 group-hover:text-blue-600 transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">标记时间</th>
                  <th className="px-8 py-4">告警分类</th>
                  <th className="px-8 py-4">严重等级</th>
                  <th className="px-8 py-4">触发策略</th>
                  <th className="px-8 py-4">当前状态</th>
                  <th className="px-8 py-4 text-right">响应</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_ALERTS.map(alert => (
                  <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                    <td className="px-8 py-5 text-slate-400 font-mono text-[11px]">{alert.timestamp}</td>
                    <td className="px-8 py-5 font-bold text-slate-700">{alert.type}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${alert.severity === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        alert.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500">{alert.rule}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest">
                        <div className={`w-1.5 h-1.5 rounded-full ${alert.status === 'pending' ? 'bg-amber-500 animate-pulse' : alert.status === 'confirmed' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                        <span className={alert.status === 'pending' ? 'text-amber-600' : alert.status === 'confirmed' ? 'text-blue-600' : 'text-slate-400'}>
                          {alert.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2">处理</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;