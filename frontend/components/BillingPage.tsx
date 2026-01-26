import React, { useState } from 'react';
import {
    Wallet,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Download,
    Filter,
    CreditCard,
    Zap,
    LayoutDashboard,
    ExternalLink,
    ChevronRight,
    AlertCircle,
    Activity,
    Cpu
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Legend
} from 'recharts';

// --- Mock Data ---
const COST_TOKEN_CORRELATION = [
    { date: '01/20', tokens: 12.5, cost: 62.5 },
    { date: '01/21', tokens: 18.2, cost: 91.0 },
    { date: '01/22', tokens: 15.1, cost: 75.5 },
    { date: '01/23', tokens: 22.4, cost: 132.0 },
    { date: '01/24', tokens: 45.8, cost: 240.5 },
    { date: '01/25', tokens: 38.6, cost: 193.0 },
    { date: '01/26', tokens: 84.5, cost: 422.5 },
];

const TRANSACTIONS = [
    { id: 'TX-8921', date: '2026-01-26 14:22', type: '消耗', description: 'Model: Structural Check Native (5.2M Tokens)', amount: -26.00, status: 'Success' },
    { id: 'TX-8920', date: '2026-01-25 10:15', type: '充值', description: '支付宝充值', amount: 2000.00, status: 'Success' },
    { id: 'TX-8919', date: '2026-01-24 23:55', type: '消耗', description: 'Model: MedInsight V4 (12.8M Tokens)', amount: -64.00, status: 'Success' },
    { id: 'TX-8918', date: '2026-01-24 16:40', type: '消耗', description: 'Agent: Safety Compliance Unit', amount: -15.50, status: 'Success' },
    { id: 'TX-8917', date: '2026-01-23 09:12', type: '消耗', description: 'Model: FinQuant Ultra', amount: -42.80, status: 'Success' },
];

const MODEL_COSTS = [
    { name: 'Structural Check Native', cost: 1240.50, share: 65 },
    { name: 'MedInsight V4', cost: 480.20, share: 20 },
    { name: 'FinQuant Ultra', cost: 320.30, share: 10 },
    { name: 'Others', cost: 110.50, share: 5 },
];

// --- Components ---

const PricingMetric: React.FC<{ label: string; value: string; trend?: number; icon: React.ReactNode; colorClass: string }> = ({ label, value, trend, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className={`absolute -right-4 -bottom-4 opacity-[0.03] ${colorClass} group-hover:scale-110 transition-transform`}>
            {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 100 })}
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <div className={`p-2 rounded-xl bg-slate-50 ${colorClass} shadow-sm border border-slate-100/50`}>
                {icon}
            </div>
        </div>
        <div className="relative z-10">
            <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
            {trend !== undefined && (
                <div className={`flex items-center text-xs font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend >= 0 ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                    {Math.abs(trend)}% <span className="text-slate-400 font-normal ml-1">vs 上期</span>
                </div>
            )}
        </div>
    </div>
);

const BillingPage: React.FC = () => {
    return (
        <div className="px-8 py-8 space-y-8 h-full overflow-y-auto bg-slate-50/50">
            {/* Header */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">财务账单</h1>
                    <p className="text-slate-400 text-xs mt-1 font-medium">管理您的账户余额、消耗明细及结算详情</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                        <Download size={16} /> 下载月度对账单
                    </button>
                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200">
                        <CreditCard size={16} /> 立即充值
                    </button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PricingMetric
                    label="账户余额"
                    value="¥12,450.80"
                    icon={<Wallet size={20} />}
                    colorClass="text-blue-600"
                />
                <PricingMetric
                    label="本月累计支出"
                    value="¥2,410.50"
                    trend={12.4}
                    icon={<TrendingUp size={20} />}
                    colorClass="text-rose-500"
                />
                <PricingMetric
                    label="今日预估费用"
                    value="¥422.50"
                    trend={-2.1}
                    icon={<Clock size={20} />}
                    colorClass="text-amber-500"
                />
                <PricingMetric
                    label="月度结余预测"
                    value="¥10,040.30"
                    icon={<Zap size={20} />}
                    colorClass="text-emerald-500"
                />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cost vs Tokens Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={18} className="text-blue-500" /> 消耗与费用关联趋势
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1 font-bold">单位: Tokens(百万) / 费用(元)</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex gap-1">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
                                <span className="text-[10px] font-bold text-slate-600">费用 (元)</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1">
                                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-bold text-slate-400">Tokens (M)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={COST_TOKEN_CORRELATION}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} border={false} />
                                <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line yAxisId="right" type="monotone" dataKey="tokens" stroke="#cbd5e1" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Model Cost Decomposition */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-8">
                        <Cpu size={18} className="text-rose-500" /> 模型费用分布
                    </h3>
                    <div className="space-y-6">
                        {MODEL_COSTS.map(model => (
                            <div key={model.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs font-bold text-slate-700">{model.name}</div>
                                        <div className="text-[10px] font-bold text-slate-400">¥{model.cost.toFixed(2)}</div>
                                    </div>
                                    <span className="text-xs font-black text-slate-900">{model.share}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <div
                                        className={`h-full ${model.name === 'Structural Check Native' ? 'bg-rose-500' : 'bg-slate-400'} transition-all duration-1000 ease-out`}
                                        style={{ width: `${model.share}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-slate-50">
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <AlertCircle size={16} className="text-blue-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 leading-tight">
                                建议：<span className="text-slate-700">Structural Check Native</span> 消耗较高，可联系架构师优化调用频率。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History Section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={18} className="text-slate-400" /> 交易流水记录
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="搜索流水号/描述..."
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all w-48 shadow-sm"
                            />
                        </div>
                        <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-600 transition-colors shadow-sm">
                            <Filter size={14} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">流水号</th>
                                <th className="px-8 py-5">日期时间</th>
                                <th className="px-8 py-5">类型</th>
                                <th className="px-8 py-5">交易描述</th>
                                <th className="px-8 py-5">金额 (CNY)</th>
                                <th className="px-8 py-5">状态</th>
                                <th className="px-8 py-5 text-right">详情</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {TRANSACTIONS.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-mono text-[11px] text-slate-500">{tx.id}</td>
                                    <td className="px-8 py-5 text-[11px] font-bold text-slate-600">{tx.date}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border
                                            ${tx.type === '充值' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-xs font-bold text-slate-700">{tx.description}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900'}`}>
                                            {tx.amount > 0 ? `+¥${tx.amount.toFixed(2)}` : `-¥${Math.abs(tx.amount).toFixed(2)}`}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tabular-nums">{tx.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-slate-300 group-hover:text-blue-600 transition-colors">
                                            <ExternalLink size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1">
                        最近 7 天内共 <span className="text-slate-900">42 条</span> 记录
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                        查看完整流水历史 <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
