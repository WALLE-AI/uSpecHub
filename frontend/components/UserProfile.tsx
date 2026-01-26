import React from 'react';
import {
    User,
    Mail,
    Building2,
    BadgeCheck,
    Clock,
    CreditCard,
    Shield,
    Settings,
    Bell,
    ChevronRight,
    Activity,
    Zap,
    BarChart3
} from 'lucide-react';

interface UserProfileProps {
    user: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50/30">

            {/* Header Profile Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <User size={240} strokeWidth={0.5} />
                </div>

                <div className={`h-32 w-32 rounded-3xl bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-white text-4xl font-bold shadow-xl relative z-10`}>
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 text-center md:text-left relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider flex items-center gap-1 w-fit mx-auto md:mx-0">
                            <BadgeCheck size={14} /> Professional Plan
                        </span>
                    </div>
                    <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mb-6 text-lg">
                        <Building2 size={18} /> {user.organization || 'Independent Developer'}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-100">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{user.email}</span>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-100">
                            <Clock size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">Joined Oct 2025</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors">
                        编辑资料
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: General Info & Usage */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Subscription & Billing */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CreditCard size={18} className="text-blue-500" /> 订阅及费用
                            </h3>
                            <button className="text-blue-600 text-sm font-bold hover:underline">管理订阅</button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">当前套餐</div>
                                    <div className="text-2xl font-bold text-slate-900">Professional (按量付费)</div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Clock size={14} /> 下次账单日: 2025-11-01
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">本月预估费用</div>
                                    <div className="text-3xl font-bold text-slate-900">¥2,410.50</div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[65%]"></div>
                                    </div>
                                    <div className="text-xs text-slate-400 text-right">已消耗限额的 65%</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Detailed Stats */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <BarChart3 size={18} className="text-blue-500" /> 消耗明细
                            </h3>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-50">
                                    <div className="text-blue-600 mb-2 flex justify-center"><Zap size={24} /></div>
                                    <div className="text-2xl font-bold text-slate-900">84.5M</div>
                                    <div className="text-xs text-slate-400 mt-1 uppercase font-bold">Total Tokens</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-50">
                                    <div className="text-amber-600 mb-2 flex justify-center"><Activity size={24} /></div>
                                    <div className="text-2xl font-bold text-slate-900">324.5K</div>
                                    <div className="text-xs text-slate-400 mt-1 uppercase font-bold">Total Calls</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-50">
                                    <div className="text-purple-600 mb-2 flex justify-center"><BadgeCheck size={24} /></div>
                                    <div className="text-2xl font-bold text-slate-900">99.8%</div>
                                    <div className="text-xs text-slate-400 mt-1 uppercase font-bold">SLA Path</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Security & Settings */}
                <div className="space-y-8">

                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Shield size={18} className="text-blue-500" /> 安全设置
                            </h3>
                        </div>
                        <div className="p-2">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        <Settings size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">修改密码</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        <Shield size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">两步验证 (2FA)</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">未开启</span>
                            </button>
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Bell size={18} className="text-blue-500" /> 通知偏好
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-700">超出调用额度提醒</div>
                                <div className="w-10 h-6 bg-blue-500 rounded-full relative">
                                    <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-700">新模型上架通知</div>
                                <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;
